/**
 * Store Marketing tools for Sensor Tower MCP
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat } from '../utils';

export function registerStoreMarketingTools(client: SensorTowerClient) {
  return {
    get_featured_today_stories: {
      description: 'Retrieve featured Today stories from the App Store.',
      inputSchema: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'ISO country code', default: 'US' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: [],
      },
      handler: async (args: any) => {
        const params: any = { country: args.country || 'US' };
        if (args.start_date) params.start_date = validateDateFormat(args.start_date);
        if (args.end_date) params.end_date = validateDateFormat(args.end_date);
        return client.makeRequest('/v1/ios/featured/today/stories', params);
      },
    },

    get_featured_apps: {
      description: 'Retrieve featured apps on the App Store Apps & Games pages.',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'Category identifier' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['category'],
      },
      handler: async (args: any) => {
        const params: any = {
          category: args.category,
          country: args.country || 'US',
        };
        if (args.start_date) params.start_date = validateDateFormat(args.start_date);
        if (args.end_date) params.end_date = validateDateFormat(args.end_date);
        return client.makeRequest('/v1/ios/featured/apps', params);
      },
    },
  };
}
