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

    get_keywords: {
      description: 'Get current keyword rankings for an app.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'App identifier' },
          country: { type: 'string', description: 'ISO country code', default: 'US' },
        },
        required: ['os', 'app_id'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        return client.makeRequest(`/v1/${os}/keywords/get_current_keywords`, {
          app_id: args.app_id,
          country: args.country || 'US',
        });
      },
    },

    get_reviews: {
      description: 'Get app reviews and ratings data.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          app_id: { type: 'string', description: 'App identifier' },
          country: { type: 'string', description: 'ISO country code' },
          start_date: { type: 'string', description: 'Filter reviews from this date' },
          end_date: { type: 'string', description: 'Filter reviews up to this date' },
          rating_filter: { type: 'string', description: 'Filter by rating or sentiment' },
          search_term: { type: 'string', description: 'Filter by review content' },
          username: { type: 'string', description: 'Filter by reviewer username' },
          limit: { type: 'number', description: 'Max reviews (1-200)', default: 50 },
          page: { type: 'number', description: 'Page number', default: 1 },
        },
        required: ['os', 'app_id', 'country'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const params: any = {
          app_id: args.app_id,
          country: args.country,
        };
        if (args.start_date) params.start_date = validateDateFormat(args.start_date);
        if (args.end_date) params.end_date = validateDateFormat(args.end_date);
        if (args.rating_filter) params.rating_filter = args.rating_filter;
        if (args.search_term) params.search_term = args.search_term;
        if (args.username) params.username = args.username;
        if (args.limit) params.limit = args.limit;
        if (args.page) params.page = args.page;
        return client.makeRequest(`/v1/${os}/review/get_reviews`, params);
      },
    },

    research_keyword: {
      description: 'Retrieve keyword research metadata including related terms and difficulty.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
          term: { type: 'string', description: 'Keyword term to research' },
          country: { type: 'string', description: 'ISO country code' },
          app_id: { type: 'number', description: 'App ID for ranking prediction (iOS only)' },
          page: { type: 'number', description: 'Page number' },
        },
        required: ['os', 'term', 'country'],
      },
      handler: async (args: any) => {
        const os = validateOsParameter(args.os, ['ios', 'android']);
        const params: any = {
          term: args.term,
          country: args.country,
        };
        if (args.app_id) params.app_id = args.app_id;
        if (args.page) params.page = args.page;
        return client.makeRequest(`/v1/${os}/keywords/research_keyword`, params);
      },
    },
  };
}
