/**
 * Search and Discovery tools for Sensor Tower MCP
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat } from '../utils';

export function registerSearchTools(client: SensorTowerClient) {
  return {
    get_publisher_apps: {
      description: 'Retrieve apps for the specified publisher.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          publisher_id: { type: 'string', description: 'Publisher identifier' },
          limit: { type: 'number', description: 'Max results (1-250)', default: 20 },
          offset: { type: 'number', description: 'Pagination offset', default: 0 },
          include_count: { type: 'boolean', description: 'Include total count', default: false },
        },
        required: ['os', 'publisher_id'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/publisher/publisher_apps`, {
          publisher_id: args.publisher_id,
          limit: args.limit || 20,
          offset: args.offset || 0,
          include_count: args.include_count || false,
        });
      },
    },

    get_unified_publisher_apps: {
      description: 'Retrieve unified publisher details and associated apps.',
      inputSchema: {
        type: 'object',
        properties: {
          unified_id: { type: 'string', description: 'Unified publisher identifier' },
        },
        required: ['unified_id'],
      },
      handler: async (args: any) => {
        return client.makeRequest('/v1/unified/publishers/apps', {
          unified_id: args.unified_id,
        });
      },
    },

    get_app_ids_by_category: {
      description: 'Retrieve app IDs by category and release/update date filters.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          category: { type: 'string', description: 'Category identifier' },
          start_date: { type: 'string', description: 'Minimum start date (YYYY-MM-DD)' },
          updated_date: { type: 'string', description: 'Updated date (YYYY-MM-DD)' },
          offset: { type: 'number', description: 'Offset for pagination' },
          limit: { type: 'number', description: 'Max app IDs (1-10000)', default: 1000 },
        },
        required: ['os', 'category'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const params: any = {
          category: args.category,
          limit: args.limit || 1000,
        };
        if (args.start_date) params.start_date = validateDateFormat(args.start_date);
        if (args.updated_date) params.updated_date = validateDateFormat(args.updated_date);
        if (args.offset !== undefined) params.offset = args.offset;
        return client.makeRequest(`/v1/${os}/apps/app_ids`, params);
      },
    },
  };
}
