/**
 * Your Metrics tools for Sensor Tower MCP (Connected Apps)
 */

import { SensorTowerClient } from '../client';
import { validateOsParameter, validateDateFormat } from '../utils';

export function registerYourMetricsTools(client: SensorTowerClient) {
  return {
    sales_reports: {
      description: 'Get sales reports for connected apps.\n\n⚠️ PERMISSION REQUIRED: This endpoint requires special API authorization. If you receive a 401 Unauthorized error, your API key does not have access to this feature. Contact Sensor Tower support to request access.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_ids: { type: 'string', description: 'Comma-separated app IDs you manage' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'] },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['os', 'app_ids', 'countries', 'date_granularity', 'start_date', 'end_date'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const startDateValue = validateDateFormat(args.start_date);
        const endDateValue = validateDateFormat(args.end_date);
        return client.makeRequest(`/v1/sales/reports`, {
          os: os,
          app_ids: args.app_ids,
          countries: args.countries,
          date_granularity: args.date_granularity,
          start_date: startDateValue,
          end_date: endDateValue,
        });
      },
    },

    unified_sales_reports: {
      description: 'Get unified downloads and revenue sales report for connected apps.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          date_granularity: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'] },
          unified_app_ids: { type: 'string', description: 'Comma-separated unified app IDs' },
          itunes_app_ids: { type: 'string', description: 'Comma-separated iTunes app IDs' },
          android_app_ids: { type: 'string', description: 'Comma-separated Android app IDs' },
          countries: { type: 'string', description: 'Comma-separated country codes' },
        },
        required: ['os', 'start_date', 'end_date', 'date_granularity', 'unified_app_ids'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const startDateValue = validateDateFormat(args.start_date);
        const endDateValue = validateDateFormat(args.end_date);
        const params: any = {
          date_granularity: args.date_granularity,
          start_date: startDateValue,
          end_date: endDateValue,
        };
        if (!args.unified_app_ids && !args.itunes_app_ids && !args.android_app_ids) {
          throw new Error('Provide at least one of unified_app_ids, itunes_app_ids, or android_app_ids');
        }
        if (args.unified_app_ids) params.unified_app_ids = args.unified_app_ids;
        if (args.itunes_app_ids) params.itunes_app_ids = args.itunes_app_ids;
        if (args.android_app_ids) params.android_app_ids = args.android_app_ids;
        if (args.countries) params.countries = args.countries;
        return client.makeRequest(`/v1/${os}/compact_sales_report_estimates`, params);
      },
    },
  };
}
