/**
 * Configuration for Sensor Tower MCP Server
 */

export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.sensortower.com';

export interface Config {
  tokens: string[];
  transport: 'stdio' | 'http';
  port: number;
}

export function getConfig(): Config {
  const tokens = collectTokensFromEnv();

  if (tokens.length === 0) {
    console.error('Error: SENSOR_TOWER_API_TOKEN environment variable is required');
    console.error('Get your API token from: https://app.sensortower.com/users/edit/api-settings');
    process.exit(1);
  }

  return {
    tokens,
    transport: (process.env.TRANSPORT as 'stdio' | 'http') || 'stdio',
    port: parseInt(process.env.PORT || '8666', 10),
  };
}

/**
 * Collect all tokens from environment variables
 * Supports: SENSOR_TOWER_API_TOKEN, SENSOR_TOWER_API_TOKEN_BACKUP,
 *           SENSOR_TOWER_API_TOKEN_2, SENSOR_TOWER_API_TOKEN_3, etc.
 */
function collectTokensFromEnv(): string[] {
  const tokens: string[] = [];

  // Primary token
  const primary = process.env.SENSOR_TOWER_API_TOKEN;
  if (primary) tokens.push(primary);

  // Backup token (legacy support)
  const backup = process.env.SENSOR_TOWER_API_TOKEN_BACKUP;
  if (backup) tokens.push(backup);

  // Additional numbered tokens (2, 3, 4, ...)
  for (let i = 2; i <= 10; i++) {
    const token = process.env[`SENSOR_TOWER_API_TOKEN_${i}`];
    if (token) tokens.push(token);
  }

  return tokens;
}

export function parseArgs(): Config {
  const args = process.argv.slice(2);
  const tokens: string[] = [];
  let transport: 'stdio' | 'http' = 'stdio';
  let port = 8666;

  // First collect from environment
  tokens.push(...collectTokensFromEnv());

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--token':
        // Primary token from CLI overrides env
        const cliToken = args[++i];
        if (cliToken && !tokens.includes(cliToken)) {
          tokens.unshift(cliToken); // Add to front as primary
        }
        break;
      case '--backup-token':
        // Add backup token
        const backupToken = args[++i];
        if (backupToken && !tokens.includes(backupToken)) {
          tokens.push(backupToken);
        }
        break;
      case '--transport':
        transport = args[++i] as 'stdio' | 'http';
        break;
      case '--port':
        port = parseInt(args[++i] || '8666', 10);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  if (tokens.length === 0) {
    console.error('Error: SENSOR_TOWER_API_TOKEN environment variable or --token argument is required');
    console.error('Get your API token from: https://app.sensortower.com/users/edit/api-settings');
    process.exit(1);
  }

  return { tokens, transport, port };
}

function printHelp(): void {
  console.log(`
Sensor Tower MCP Server

A Model Context Protocol server for accessing Sensor Tower's mobile app intelligence APIs.

USAGE:
  npx sensortower-mcp [OPTIONS]

OPTIONS:
  --transport <type>    Transport type: stdio (default) or http
  --port <port>         HTTP port (default: 8666, only for http transport)
  --token <token>       Primary API token (or set SENSOR_TOWER_API_TOKEN env var)
  --backup-token <tok>  Backup API token for failover (can use multiple times)
  --help, -h            Show this help message

ENVIRONMENT VARIABLES:
  SENSOR_TOWER_API_TOKEN          Primary API token
  SENSOR_TOWER_API_TOKEN_BACKUP   First backup token
  SENSOR_TOWER_API_TOKEN_2        Second backup token
  SENSOR_TOWER_API_TOKEN_3        Third backup token (up to 10)

TOKEN FAILOVER:
  When a token's quota is exhausted (429/403 error), the server automatically
  switches to the next available backup token. This ensures uninterrupted
  API access across multiple tokens.

EXAMPLES:
  # Run with single token
  SENSOR_TOWER_API_TOKEN=token1 npx sensortower-mcp

  # Run with multiple backup tokens
  SENSOR_TOWER_API_TOKEN=token1 \\
  SENSOR_TOWER_API_TOKEN_BACKUP=token2 \\
  SENSOR_TOWER_API_TOKEN_2=token3 \\
  npx sensortower-mcp

MCP CONFIGURATION (Cursor/Claude Desktop):
  {
    "mcpServers": {
      "sensortower": {
        "command": "npx",
        "args": ["-y", "sensortower-mcp"],
        "env": {
          "SENSOR_TOWER_API_TOKEN": "primary_token",
          "SENSOR_TOWER_API_TOKEN_BACKUP": "backup_token"
        }
      }
    }
  }

For more information: https://github.com/sensortower/sensortower-mcp
`);
}
