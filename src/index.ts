#!/usr/bin/env node
/**
 * Sensor Tower MCP Server - Main entry point
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { parseArgs } from './config';
import { SensorTowerClient } from './client';
import {
  registerAppAnalysisTools,
  registerSearchTools,
  registerUtilityTools,
  registerMarketAnalysisTools,
  registerStoreMarketingTools,
  registerYourMetricsTools,
} from './tools';

interface ToolDefinition {
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

async function main() {
  const config = parseArgs();

  console.error('🚀 Starting Sensor Tower MCP Server...');
  console.error(`📡 Transport: ${config.transport}`);
  console.error(`🔑 API Tokens configured: ${config.tokens.length} (auto-failover enabled)`);

  // Create API client with all tokens
  const client = new SensorTowerClient(config.tokens);

  // Register all tools
  const allTools: Record<string, ToolDefinition> = {
    ...registerAppAnalysisTools(client),
    ...registerSearchTools(client),
    ...registerUtilityTools(),
    ...registerMarketAnalysisTools(client),
    ...registerStoreMarketingTools(client),
    ...registerYourMetricsTools(client),
  };

  // Create MCP server
  const server = new Server(
    {
      name: 'sensortower-mcp',
      version: '1.2.10',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.entries(allTools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Handle call tool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = allTools[name];
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await tool.handler(args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Sensor Tower MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
