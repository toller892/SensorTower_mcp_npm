/**
 * Market Analysis tools for Sensor Tower MCP
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat, normalizeNetworks } from '../utils';

export function registerMarketAnalysisTools(client: SensorTowerClient) {
  return {
    get_top_and_trending: {
      description: 'Get top apps by download or revenue estimates with growth metrics.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          comparison_attribute: { type: 'string', enum: ['absolute', 'delta', 'transformed_delta'], description: 'Comparison attribute' },
          time_range: { type: 'string', enum: ['day', 'week', 'month', 'quarter', 'year'], description: 'Time range' },
          measure: { type: 'string', enum: ['units', 'revenue'], description: 'Metric type' },
          category: { type: 'string', description: 'Category identifier' },
          date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          regions: { type: 'string', description: 'Comma-separated region codes' },
          device_type: { type: 'string', enum: ['iphone', 'ipad', 'total'], description: 'Device filter' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          limit: { type: 'number', description: 'Max apps (1-2000)', default: 25 },
          offset: { type: 'number', description: 'Pagination offset' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'comparison_attribute', 'time_range', 'measure', 'category', 'date', 'regions'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.date);
        if (args.end_date) validateDateFormat(args.end_date);
        const params: any = {
          comparison_attribute: args.comparison_attribute,
          time_range: args.time_range,
          measure: args.measure,
          category: args.category,
          date: args.date,
          regions: args.regions,
          limit: args.limit || 25,
          data_model: args.data_model || 'DM_2025_Q2',
        };
        if (args.device_type) params.device_type = args.device_type;
        if (args.end_date) params.end_date = args.end_date;
        if (args.offset) params.offset = args.offset;
        return client.makeRequest(`/v1/${os}/sales_report_estimates_comparison_attributes`, params);
      },
    },

    get_top_publishers: {
      description: 'Get top publishers by download or revenue estimates.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          comparison_attribute: { type: 'string', enum: ['absolute', 'delta', 'transformed_delta'] },
          time_range: { type: 'string', enum: ['day', 'week', 'month', 'quarter', 'year'] },
          measure: { type: 'string', enum: ['units', 'revenue'] },
          category: { type: 'string', description: 'Category identifier' },
          date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          country: { type: 'string', description: 'Country code' },
          device_type: { type: 'string', enum: ['iphone', 'ipad', 'total'] },
          end_date: { type: 'string', description: 'End date' },
          limit: { type: 'number', default: 25 },
          offset: { type: 'number' },
        },
        required: ['os', 'comparison_attribute', 'time_range', 'measure', 'category', 'date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.date);
        const params: any = {
          comparison_attribute: args.comparison_attribute,
          time_range: args.time_range,
          measure: args.measure,
          category: args.category,
          date: args.date,
          limit: args.limit || 25,
        };
        if (args.country) params.country = args.country;
        if (args.device_type) params.device_type = args.device_type;
        if (args.end_date) params.end_date = args.end_date;
        if (args.offset) params.offset = args.offset;
        return client.makeRequest(`/v1/${os}/top_and_trending/publishers`, params);
      },
    },

    get_store_summary: {
      description: 'Get app store summary statistics.',
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

    usage_top_apps: {
      description: 'Get top apps by active users with growth metrics.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'] },
          comparison_attribute: { type: 'string', enum: ['absolute', 'delta', 'transformed_delta'] },
          time_range: { type: 'string', enum: ['week', 'month', 'quarter'] },
          measure: { type: 'string', enum: ['DAU', 'WAU', 'MAU'] },
          date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          regions: { type: 'string', description: 'Comma-separated region codes' },
          category: { type: 'string', default: '0' },
          device_type: { type: 'string', enum: ['iphone', 'ipad', 'total'] },
          limit: { type: 'number', default: 25 },
          offset: { type: 'number' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'comparison_attribute', 'time_range', 'measure', 'date', 'regions'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.date);
        const params: any = {
          comparison_attribute: args.comparison_attribute,
          time_range: args.time_range,
          measure: args.measure,
          date: args.date,
          regions: args.regions,
          category: args.category || '0',
          limit: args.limit || 25,
          data_model: args.data_model || 'DM_2025_Q2',
        };
        if (args.device_type) params.device_type = args.device_type;
        if (args.offset) params.offset = args.offset;
        return client.makeRequest(`/v1/${os}/top_and_trending/active_users`, params);
      },
    },

    top_apps: {
      description: 'Fetch Share of Voice for top advertisers or publishers.',
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
        validateDateFormat(args.date);
        return client.makeRequest(`/v1/${os}/ad_intel/top_apps`, {
          role: args.role,
          date: args.date,
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
      description: 'Fetch the rank of a top advertiser or publisher for given filters.',
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
        validateDateFormat(args.date);
        return client.makeRequest(`/v1/${os}/ad_intel/top_apps/search`, {
          app_id: args.app_id,
          role: args.role,
          date: args.date,
          period: args.period,
          category: args.category,
          country: args.country,
          network: normalizeNetworks(args.network),
        });
      },
    },

    top_creatives: {
      description: 'Fetch top creatives over a given time period.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'] },
          date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          period: { type: 'string', enum: ['week', 'month', 'quarter'] },
          category: { type: 'string' },
          country: { type: 'string' },
          network: { type: 'string' },
          ad_types: { type: 'string', description: 'Comma-separated ad types' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
          placements: { type: 'string' },
          video_durations: { type: 'string' },
          aspect_ratios: { type: 'string' },
          new_creative: { type: 'boolean', default: false },
        },
        required: ['os', 'date', 'period', 'category', 'country', 'network', 'ad_types'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.date);
        const params: any = {
          date: args.date,
          period: args.period,
          category: args.category,
          country: args.country,
          network: normalizeNetworks(args.network),
          ad_types: args.ad_types,
          limit: args.limit || 25,
          page: args.page || 1,
          new_creative: args.new_creative || false,
        };
        if (args.placements) params.placements = args.placements;
        if (args.video_durations) params.video_durations = args.video_durations;
        if (args.aspect_ratios) params.aspect_ratios = args.aspect_ratios;
        return client.makeRequest(`/v1/${os}/ad_intel/creatives/top`, params);
      },
    },

    games_breakdown: {
      description: 'Retrieve aggregated download and revenue estimates of game categories.',
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
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const params: any = {
          categories: args.categories,
          start_date: args.start_date,
          end_date: args.end_date,
          date_granularity: args.date_granularity || 'daily',
        };
        if (args.countries) params.countries = args.countries;
        return client.makeRequest(`/v1/${os}/games_breakdown`, params);
      },
    },
  };
}
