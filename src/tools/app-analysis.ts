/**
 * App Analysis tools for Sensor Tower MCP
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat, normalizeNetworks } from '../utils';

export function registerAppAnalysisTools(client: SensorTowerClient) {
  return {
    get_app_metadata: {
      description: 'Get comprehensive app metadata including descriptions, ratings, and more.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs (max 100)' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
          include_sdk_data: { type: 'boolean', description: 'Include SDK data', default: false },
        },
        required: ['os', 'app_ids'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/apps`, {
          app_ids: args.app_ids,
          country: args.country || 'US',
          include_sdk_data: args.include_sdk_data || false,
        });
      },
    },

    get_download_estimates: {
      description: 'Fetch download estimates for apps by country and date.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'daily' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'app_ids', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const params: any = {
          app_ids: args.app_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          date_granularity: args.date_granularity || 'daily',
          data_model: args.data_model || 'DM_2025_Q2',
        };
        if (args.countries) params.countries = args.countries;
        return client.makeRequest(`/v1/${os}/sales_report_estimates`, params);
      },
    },

    get_revenue_estimates: {
      description: 'Fetch revenue estimates for apps by country and date.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'daily' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'app_ids', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const params: any = {
          app_ids: args.app_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          date_granularity: args.date_granularity || 'daily',
          data_model: args.data_model || 'DM_2025_Q2',
        };
        if (args.countries) params.countries = args.countries;
        return client.makeRequest(`/v1/${os}/sales_report_estimates`, params);
      },
    },

    get_creatives: {
      description: 'Fetch advertising creatives for apps with Share of Voice and publisher data.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          networks: { type: 'string', description: 'Comma-separated ad networks' },
          ad_types: { type: 'string', description: 'Comma-separated ad types (video,image,playable)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['os', 'app_ids', 'start_date', 'countries', 'networks', 'ad_types'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        if (args.end_date) validateDateFormat(args.end_date);
        const params: any = {
          app_ids: args.app_ids,
          start_date: args.start_date,
          countries: args.countries,
          networks: normalizeNetworks(args.networks),
          ad_types: args.ad_types,
        };
        if (args.end_date) params.end_date = args.end_date;
        return client.makeRequest(`/v1/${os}/ad_intel/creatives`, params);
      },
    },

    top_in_app_purchases: {
      description: 'Retrieve top in-app purchases for the requested app IDs.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs (max 100)' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
        },
        required: ['os', 'app_ids'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/apps/top_in_app_purchases`, {
          app_ids: args.app_ids,
          country: args.country || 'US',
        });
      },
    },

    get_usage_active_users: {
      description: 'Get usage intelligence active users data.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs (max 500)' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Country codes (WW for worldwide)', default: 'US' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'app_ids', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const granularityMap: Record<string, string> = { daily: 'day', weekly: 'week', monthly: 'month' };
        const timePeriod = granularityMap[args.date_granularity || 'monthly'] || 'month';
        return client.makeRequest(`/v1/${os}/usage/active_users`, {
          app_ids: args.app_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          countries: args.countries || 'US',
          time_period: timePeriod,
          data_model: args.data_model || 'DM_2025_Q2',
        });
      },
    },

    version_history: {
      description: 'Get version history for a particular app.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'Single app identifier' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
        },
        required: ['os', 'app_id'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/apps/version_history`, {
          app_id: args.app_id,
          country: args.country || 'US',
        });
      },
    },

    get_impressions: {
      description: 'Get advertising impressions data for apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs (max 5)' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          networks: { type: 'string', description: 'Comma-separated ad networks' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
        },
        required: ['os', 'app_ids', 'start_date', 'end_date', 'countries', 'networks'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const periodMap: Record<string, string> = { daily: 'day', weekly: 'week', monthly: 'month' };
        return client.makeRequest(`/v1/${os}/ad_intel/network_analysis`, {
          app_ids: args.app_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          period: periodMap[args.date_granularity || 'daily'] || 'day',
          countries: args.countries,
          networks: normalizeNetworks(args.networks),
        });
      },
    },

    get_category_history: {
      description: 'Get category ranking history for apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          category: { type: 'string', description: 'Category identifier' },
          chart_type_ids: { type: 'string', description: 'Comma-separated chart type identifiers' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes', default: 'US' },
        },
        required: ['os', 'app_ids', 'category', 'chart_type_ids', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        return client.makeRequest(`/v1/${os}/category/category_history`, {
          app_ids: args.app_ids,
          category: args.category,
          chart_type_ids: args.chart_type_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          countries: args.countries || 'US',
        });
      },
    },

    compact_sales_report_estimates: {
      description: 'Get download and revenue estimates in compact format.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          publisher_ids: { type: 'string', description: 'Comma-separated publisher IDs' },
          unified_app_ids: { type: 'string', description: 'Comma-separated unified app IDs' },
          unified_publisher_ids: { type: 'string', description: 'Comma-separated unified publisher IDs' },
          categories: { type: 'string', description: 'Comma-separated category IDs' },
          countries: { type: 'string', description: 'Comma-separated country codes', default: 'US' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'daily' },
          data_model: { type: 'string', enum: ['DM_2025_Q2', 'DM_2025_Q1'], default: 'DM_2025_Q2' },
        },
        required: ['os', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const params: any = {
          start_date: args.start_date,
          end_date: args.end_date,
          countries: args.countries || 'US',
          date_granularity: args.date_granularity || 'daily',
          data_model: args.data_model || 'DM_2025_Q2',
        };
        if (args.app_ids) params.app_ids = args.app_ids;
        if (args.publisher_ids) params.publisher_ids = args.publisher_ids;
        if (args.unified_app_ids) params.unified_app_ids = args.unified_app_ids;
        if (args.unified_publisher_ids) params.unified_publisher_ids = args.unified_publisher_ids;
        if (args.categories) params.categories = args.categories;
        return client.makeRequest(`/v1/${os}/compact_sales_report_estimates`, params);
      },
    },

    category_ranking_summary: {
      description: "Get today's category ranking summary for a particular app.",
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'Single app identifier' },
          country: { type: 'string', description: 'ISO country code' },
        },
        required: ['os', 'app_id', 'country'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/category/category_ranking_summary`, {
          app_id: args.app_id,
          country: args.country,
        });
      },
    },

    impressions_rank: {
      description: 'Get advertising impressions rank data for apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          networks: { type: 'string', description: 'Comma-separated ad networks' },
        },
        required: ['os', 'app_ids', 'start_date', 'end_date', 'countries'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        const params: any = {
          app_ids: args.app_ids,
          start_date: args.start_date,
          end_date: args.end_date,
          countries: args.countries,
          period: 'day',
        };
        if (args.networks) params.networks = normalizeNetworks(args.networks);
        return client.makeRequest(`/v1/${os}/ad_intel/network_analysis/rank`, params);
      },
    },

    app_analysis_retention: {
      description: 'Get retention analysis data for apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly'], description: 'Time granularity' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          country: { type: 'string', description: 'ISO country code' },
        },
        required: ['os', 'app_ids', 'date_granularity', 'start_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        const params: any = {
          app_ids: args.app_ids,
          date_granularity: args.date_granularity,
          start_date: args.start_date,
          end_date: args.end_date || '2024-01-31',
        };
        if (args.country) params.country = args.country;
        return client.makeRequest(`/v1/${os}/usage/retention`, params);
      },
    },

    downloads_by_sources: {
      description: 'Get app downloads by sources (organic, paid, browser).',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated unified app IDs' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'monthly' },
        },
        required: ['os', 'app_ids', 'countries', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        validateDateFormat(args.end_date);
        return client.makeRequest(`/v1/${os}/downloads_by_sources`, {
          app_ids: args.app_ids,
          countries: args.countries,
          start_date: args.start_date,
          end_date: args.end_date,
          date_granularity: args.date_granularity || 'monthly',
        });
      },
    },

    app_analysis_demographics: {
      description: 'Get demographic analysis data for apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android', 'unified'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly'], description: 'Granularity' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          country: { type: 'string', description: 'ISO country code' },
        },
        required: ['os', 'app_ids', 'date_granularity', 'start_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os);
        validateDateFormat(args.start_date);
        const params: any = {
          app_ids: args.app_ids,
          date_granularity: args.date_granularity,
          start_date: args.start_date,
          end_date: args.end_date || '2024-01-31',
        };
        if (args.country) params.country = args.country;
        return client.makeRequest(`/v1/${os}/usage/demographics`, params);
      },
    },

    app_update_timeline: {
      description: 'Get app update history timeline.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'Single app identifier' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
          date_limit: { type: 'number', description: 'Number of updates to retrieve (1-100)', default: 10 },
        },
        required: ['os', 'app_id'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/app_update/get_app_update_history`, {
          app_id: args.app_id,
          country: args.country || 'US',
          date_limit: args.date_limit || 10,
        });
      },
    },
  };
}
