/**
 * Utility functions for Sensor Tower MCP tools
 */

export function validateOsParameter(os: string, allowed: string[] = ['ios', 'android', 'unified']): string {
  const normalized = os.toLowerCase();
  if (!allowed.includes(normalized)) {
    throw new Error(`Invalid OS parameter: ${os}. Must be one of: ${allowed.join(', ')}`);
  }
  return normalized;
}

export function validateDateFormat(dateStr: string): string {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Must be YYYY-MM-DD`);
  }
  return dateStr;
}

export function normalizeNetworks(networks: string): string {
  const validNetworks = new Set([
    'Adcolony', 'Admob', 'Applovin', 'Chartboost', 'Instagram',
    'Mopub', 'Pinterest', 'Snapchat', 'Supersonic', 'Tapjoy',
    'TikTok', 'Unity', 'Vungle', 'Youtube'
  ]);

  const networkMapping: Record<string, string> = {
    'unity': 'Unity',
    'google': 'Youtube',
    'youtube': 'Youtube',
    'admob': 'Admob',
    'applovin': 'Applovin',
    'chartboost': 'Chartboost',
    'instagram': 'Instagram',
    'snapchat': 'Snapchat',
    'tiktok': 'TikTok',
    'mopub': 'Mopub',
    'tapjoy': 'Tapjoy',
    'vungle': 'Vungle',
    'pinterest': 'Pinterest',
    'adcolony': 'Adcolony',
    'supersonic': 'Supersonic',
  };

  const normalizedNetworks: string[] = [];
  for (const network of networks.split(',').map(n => n.trim()).filter(Boolean)) {
    let normalized: string | undefined;
    if (validNetworks.has(network)) {
      normalized = network;
    } else if (networkMapping[network.toLowerCase()]) {
      normalized = networkMapping[network.toLowerCase()];
    }

    if (normalized && validNetworks.has(normalized)) {
      normalizedNetworks.push(normalized);
    } else if (network.toLowerCase() !== 'facebook') {
      normalizedNetworks.push(network);
    }
  }

  return normalizedNetworks.join(',');
}
