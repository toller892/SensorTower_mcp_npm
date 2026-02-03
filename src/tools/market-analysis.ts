/**
 * Market Analysis tools for Sensor Tower MCP
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat, normalizeNetworks } from '../utils';

export function registerMarketAnalysisTools(client: SensorTowerClient) {
  return {
    get_store_summary: {
      description: 'Get app store summary statistics.\n\n⚠️ TEMPORARILY DISABLED: This endpoint is currently returning 500 Internal Server Error from Sensor Tower\'s API. This is a server-side issue. Please contact Sensor Tower support or try again later.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          categories: { type: 'string', description: 'Comma-separated category IDs' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'daily' },
          countries: { type: 'string', default: 'US' },
        },
        required: ['os', 'categories', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        return client.makeRequest(`/v1/${os}/store_summary`, {
          categories: args.categories,
          start_date: args.start_date,
          end_date: args.end_date,
          date_granularity: args.date_granularity || 'daily',
          countries: args.countries || 'US',
        });
      },
    },
  };
}
