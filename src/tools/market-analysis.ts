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

    top_apps: {
      description: 'Fetch Share of Voice for top advertisers or publishers.\n\n⚠️ UNOFFICIAL API: This endpoint is not documented in the official Sensor Tower API documentation. While it currently works, it may be deprecated or changed without notice. Use with caution and consider migrating to official alternatives.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'] },
          role: { type: 'string', enum: ['advertisers', 'publishers'] },
          date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          period: { type: 'string', enum: ['week', 'month', 'quarter'] },
          category: { type: 'string', description: 'Category identifier' },
          country: { type: 'string', description: 'ISO country code' },
          network: { type: 'string', description: 'Ad network name' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
        required: ['os', 'role', 'date', 'period', 'category', 'country', 'network'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        const dateValue = validateDateFormat(args.date);
        return client.makeRequest(`/v1/${os}/ad_intel/top_advertisers`, {
          role: args.role,
          date: dateValue,
          period: args.period,
          category: args.category,
          country: args.country,
          network: normalizeNetworks(args.network),
          limit: args.limit || 25,
          page: args.page || 1,
        });
      },
    },

    top_apps_search: {
      description: 'Fetch the rank of a top advertiser or publisher for given filters.\n\n⚠️ UNOFFICIAL API: This endpoint is not documented in the official Sensor Tower API documentation. While it currently works, it may be deprecated or changed without notice. Use with caution and consider migrating to official alternatives.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'] },
          app_id: { type: 'string', description: 'App identifier' },
          role: { type: 'string', enum: ['advertisers', 'publishers'] },
          date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
          period: { type: 'string', enum: ['week', 'month', 'quarter'] },
          category: { type: 'string' },
          country: { type: 'string' },
          network: { type: 'string' },
        },
        required: ['os', 'app_id', 'role', 'date', 'period', 'category', 'country', 'network'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        const dateValue = validateDateFormat(args.date);
        return client.makeRequest(`/v1/${os}/ad_intel/network_analysis/rank`, {
          app_id: args.app_id,
          role: args.role,
          date: dateValue,
          period: args.period,
          category: args.category,
          country: args.country,
          network: normalizeNetworks(args.network),
        });
      },
    },

    games_breakdown: {
      description: 'Retrieve aggregated download and revenue estimates of game categories.\n\n⚠️ UNOFFICIAL API: This endpoint is not documented in the official Sensor Tower API documentation. While it currently works, it may be deprecated or changed without notice. Use with caution and consider migrating to official alternatives.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'] },
          categories: { type: 'string', description: 'Comma-separated game categories' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'daily' },
          countries: { type: 'string' },
        },
        required: ['os', 'categories', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const startDateValue = validateDateFormat(args.start_date);
        const endDateValue = validateDateFormat(args.end_date);
        const params: any = {
          categories: args.categories,
          start_date: startDateValue,
          end_date: endDateValue,
          date_granularity: args.date_granularity || 'daily',
        };
        if (args.countries) params.countries = args.countries;
        return client.makeRequest(`/v1/${os}/games/breakdown`, params);
      },
    },
  };
}
