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

    get_featured_creatives: {
      description: 'Retrieve featured creatives and their positions over time.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'App identifier' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          types: { type: 'string', description: 'Comma-separated creative types' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['os', 'app_id'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const params: any = { app_id: args.app_id };
        if (args.countries) params.countries = args.countries;
        if (args.types) params.types = args.types;
        if (args.start_date) params.start_date = validateDateFormat(args.start_date);
        if (args.end_date) params.end_date = validateDateFormat(args.end_date);
        return client.makeRequest(`/v1/${os}/featured/creatives`, params);
      },
    },
  };
}
