/**
 * HTTP client for Sensor Tower API
 */

import { API_BASE_URL } from './config';

export class SensorTowerClient {
  private tokens: string[];
  private currentTokenIndex: number = 0;

  constructor(tokens: string[]) {
    if (tokens.length === 0) {
      throw new Error('At least one API token is required');
    }
    this.tokens = tokens;
  }

  private getAuthToken(): string {
    return this.tokens[this.currentTokenIndex];
  }

  private switchToBackupToken(): boolean {
    if (this.currentTokenIndex < this.tokens.length - 1) {
      this.currentTokenIndex++;
      console.error(`⚠️ Token #${this.currentTokenIndex} quota exceeded, switching to token #${this.currentTokenIndex + 1}`);
      return true;
    }
    console.error(`❌ All ${this.tokens.length} tokens exhausted`);
    return false;
  }

  getTokenStatus(): { current: number; total: number } {
    return {
      current: this.currentTokenIndex + 1,
      total: this.tokens.length,
    };
  }

  async makeRequest<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    params.auth_token = this.getAuthToken();
    let backoffMs = 500;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const url = new URL(endpoint, API_BASE_URL);
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const statusCode = response.status;

          // Check for quota/rate limit errors
          let isQuotaError = statusCode === 429;
          if (statusCode === 403) {
            try {
              const errorBody = await response.text();
              const errorMessage = errorBody.toLowerCase();
              isQuotaError = ['quota', 'limit', 'exceeded', 'rate'].some(
                keyword => errorMessage.includes(keyword)
              );
            } catch {
              // Ignore parse errors
            }
          }

          // Try backup token on quota errors
          if (isQuotaError && this.switchToBackupToken()) {
            params.auth_token = this.getAuthToken();
            console.error('Retrying request with backup token...');
            continue;
          }

          // Retry on server errors
          if ([429, 500, 502, 503, 504].includes(statusCode) && attempt < maxAttempts - 1) {
            await this.sleep(backoffMs);
            backoffMs = Math.min(backoffMs * 2, 8000);
            continue;
          }

          throw new Error(`HTTP ${statusCode}: ${response.statusText}`);
        }

        return await response.json() as T;
      } catch (error) {
        if (attempt < maxAttempts - 1 && error instanceof TypeError) {
          // Network error, retry
          await this.sleep(backoffMs);
          backoffMs = Math.min(backoffMs * 2, 8000);
          continue;
        }
        throw error;
      }
    }

    throw new Error('Max retry attempts exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
