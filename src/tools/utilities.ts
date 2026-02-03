/**
 * Utility tools for Sensor Tower MCP
 */

export function registerUtilityTools() {
  // Country codes data
  const countryCodes = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' },
    { code: 'MX', name: 'Mexico' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'RU', name: 'Russia' },
    { code: 'WW', name: 'Worldwide' },
  ];

  // iOS categories
  const iosCategories = [
    { id: '6000', name: 'Business' },
    { id: '6001', name: 'Weather' },
    { id: '6002', name: 'Utilities' },
    { id: '6003', name: 'Travel' },
    { id: '6004', name: 'Sports' },
    { id: '6005', name: 'Social Networking' },
    { id: '6006', name: 'Reference' },
    { id: '6007', name: 'Productivity' },
    { id: '6008', name: 'Photo & Video' },
    { id: '6009', name: 'News' },
    { id: '6010', name: 'Navigation' },
    { id: '6011', name: 'Music' },
    { id: '6012', name: 'Lifestyle' },
    { id: '6013', name: 'Health & Fitness' },
    { id: '6014', name: 'Games' },
    { id: '6015', name: 'Finance' },
    { id: '6016', name: 'Entertainment' },
    { id: '6017', name: 'Education' },
    { id: '6018', name: 'Books' },
    { id: '6020', name: 'Medical' },
    { id: '6021', name: 'Magazines & Newspapers' },
    { id: '6022', name: 'Catalogs' },
    { id: '6023', name: 'Food & Drink' },
    { id: '6024', name: 'Shopping' },
  ];

  // Android categories
  const androidCategories = [
    { id: 'GAME', name: 'Games' },
    { id: 'BUSINESS', name: 'Business' },
    { id: 'COMMUNICATION', name: 'Communication' },
    { id: 'EDUCATION', name: 'Education' },
    { id: 'ENTERTAINMENT', name: 'Entertainment' },
    { id: 'FINANCE', name: 'Finance' },
    { id: 'HEALTH_AND_FITNESS', name: 'Health & Fitness' },
    { id: 'LIFESTYLE', name: 'Lifestyle' },
    { id: 'MUSIC_AND_AUDIO', name: 'Music & Audio' },
    { id: 'NEWS_AND_MAGAZINES', name: 'News & Magazines' },
    { id: 'PHOTOGRAPHY', name: 'Photography' },
    { id: 'PRODUCTIVITY', name: 'Productivity' },
    { id: 'SHOPPING', name: 'Shopping' },
    { id: 'SOCIAL', name: 'Social' },
    { id: 'SPORTS', name: 'Sports' },
    { id: 'TOOLS', name: 'Tools' },
    { id: 'TRAVEL_AND_LOCAL', name: 'Travel & Local' },
    { id: 'VIDEO_PLAYERS', name: 'Video Players & Editors' },
    { id: 'WEATHER', name: 'Weather' },
  ];

  return {
    get_country_codes: {
      description: 'Get list of available country codes for Sensor Tower API.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: async () => {
        return { countries: countryCodes, total_count: countryCodes.length };
      },
    },

    get_category_ids: {
      description: 'Get list of category IDs for iOS or Android.',
      inputSchema: {
        type: 'object',
        properties: {
          os: { type: 'string', enum: ['ios', 'android'], description: 'Operating system' },
        },
        required: ['os'],
      },
      handler: async (args: any) => {
        const categories = args.os === 'ios' ? iosCategories : androidCategories;
        return { categories, os: args.os, total_count: categories.length };
      },
    },

    get_chart_types: {
      description: 'List available ranking chart identifiers used by Sensor Tower.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: async () => {
        const chartTypes = {
          topfreeapplications: 'Top Free Apps',
          toppaidapplications: 'Top Paid Apps',
          topgrossingapplications: 'Top Grossing Apps',
          topfreeipadapplications: 'Top Free iPad Apps (iOS only)',
          toppaidipadadapplications: 'Top Paid iPad Apps (iOS only)',
          topgrossingipadadapplications: 'Top Grossing iPad Apps (iOS only)',
        };
        return { chart_types: chartTypes };
      },
    },

    health_check: {
      description: 'Lightweight status endpoint for monitoring and orchestration.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: async () => {
        return {
          status: 'healthy',
          service: 'Sensor Tower MCP Server (npm)',
          transport: 'stdio',
          api_base_url: 'https://api.sensortower.com',
          tools_available: 32,
        };
      },
    },
  };
}
