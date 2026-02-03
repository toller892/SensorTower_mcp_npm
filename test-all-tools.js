/**
 * Test script for all Sensor Tower MCP tools
 * Run with: node test-all-tools.js
 */

const https = require('https');
const fs = require('fs');

const API_BASE = 'https://api.sensortower.com';
const TOKEN = process.env.SENSOR_TOWER_API_TOKEN;

if (!TOKEN) {
  console.error('❌ SENSOR_TOWER_API_TOKEN environment variable is required');
  process.exit(1);
}

// Test results storage
const results = [];

// Helper function to make API requests
function makeRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    params.auth_token = TOKEN;
    const queryString = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    
    const url = `${API_BASE}${endpoint}?${queryString}`;
    
    const req = https.get(url, { timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, error: null });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, error: data.substring(0, 500) });
        }
      });
    });
    req.on('error', (e) => resolve({ status: 0, data: null, error: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, data: null, error: 'Request timeout' });
    });
  });
}

// Test definitions - all 43 tools
const tests = [
  // ===== App Analysis Tools (16) =====
  { name: 'get_app_metadata', category: 'App Analysis', endpoint: '/v1/ios/apps', params: { app_ids: '284882215', country: 'US' } },
  { name: 'get_download_estimates', category: 'App Analysis', endpoint: '/v1/ios/sales_report_estimates', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'daily' } },
  { name: 'get_revenue_estimates', category: 'App Analysis', endpoint: '/v1/ios/sales_report_estimates', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'daily' } },
  { name: 'top_in_app_purchases', category: 'App Analysis', endpoint: '/v1/ios/apps/top_in_app_purchases', params: { app_ids: '284882215', country: 'US' } },
  { name: 'version_history', category: 'App Analysis', endpoint: '/v1/ios/apps/version_history', params: { app_id: '284882215', country: 'US' } },
  { name: 'app_update_timeline', category: 'App Analysis', endpoint: '/v1/ios/app_update/get_app_update_history', params: { app_id: '284882215', country: 'US', date_limit: '10' } },
  { name: 'category_ranking_summary', category: 'App Analysis', endpoint: '/v1/ios/category/category_ranking_summary', params: { app_id: '284882215', country: 'US' } },
  { name: 'get_category_history', category: 'App Analysis', endpoint: '/v1/ios/category/category_history', params: { app_ids: '284882215', category: '6018', chart_type_ids: '1', start_date: '2025-01-01', end_date: '2025-01-07', countries: 'US' } },
  { name: 'compact_sales_report_estimates', category: 'App Analysis', endpoint: '/v1/ios/compact_sales_report_estimates', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', countries: 'US', date_granularity: 'daily' } },
  { name: 'get_creatives', category: 'App Analysis', endpoint: '/v1/ios/ad_intel/creatives', params: { app_ids: '284882215', start_date: '2025-01-01', countries: 'US', networks: 'Instagram', ad_types: 'video' } },
  { name: 'get_impressions', category: 'App Analysis', endpoint: '/v1/ios/ad_intel/network_analysis', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', countries: 'US', networks: 'Instagram', period: 'day' } },
  { name: 'impressions_rank', category: 'App Analysis', endpoint: '/v1/ios/ad_intel/network_analysis/rank', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', countries: 'US', period: 'day' } },
  { name: 'get_usage_active_users', category: 'App Analysis', endpoint: '/v1/ios/usage/active_users', params: { app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', countries: 'US', time_period: 'month' } },
  { name: 'app_analysis_retention', category: 'App Analysis', endpoint: '/v1/ios/usage/retention', params: { app_ids: '284882215', date_granularity: 'monthly', start_date: '2025-01-01', end_date: '2025-01-31' } },
  { name: 'downloads_by_sources', category: 'App Analysis', endpoint: '/v1/ios/downloads_by_sources', params: { app_ids: '284882215', countries: 'US', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'monthly' } },
  { name: 'app_analysis_demographics', category: 'App Analysis', endpoint: '/v1/ios/usage/demographics', params: { app_ids: '284882215', date_granularity: 'monthly', start_date: '2025-01-01', end_date: '2025-01-31' } },

  // ===== Market Analysis Tools (8) =====
  { name: 'get_top_and_trending', category: 'Market Analysis', endpoint: '/v1/ios/apps/top_and_trending', params: { comparison_attribute: 'absolute', time_range: 'week', measure: 'units', category: '6018', date: '2025-01-01', regions: 'US', limit: '10' } },
  { name: 'get_top_publishers', category: 'Market Analysis', endpoint: '/v1/ios/publishers/top', params: { comparison_attribute: 'absolute', time_range: 'week', measure: 'units', category: '6018', date: '2025-01-01', limit: '10' } },
  { name: 'get_store_summary', category: 'Market Analysis', endpoint: '/v1/ios/store_summary', params: { categories: '6018', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'daily', countries: 'US' } },
  { name: 'usage_top_apps', category: 'Market Analysis', endpoint: '/v1/ios/usage/top_apps', params: { comparison_attribute: 'absolute', time_range: 'week', measure: 'DAU', date: '2025-01-01', regions: 'US', category: '0', limit: '10' } },
  { name: 'top_apps', category: 'Market Analysis', endpoint: '/v1/ios/ad_intel/top_advertisers', params: { role: 'advertisers', date: '2025-01-01', period: 'week', category: '6018', country: 'US', network: 'Instagram', limit: '10' } },
  { name: 'top_apps_search', category: 'Market Analysis', endpoint: '/v1/ios/ad_intel/network_analysis/rank', params: { app_id: '284882215', role: 'advertisers', date: '2025-01-01', period: 'week', category: '6018', country: 'US', network: 'Instagram' } },
  { name: 'top_creatives', category: 'Market Analysis', endpoint: '/v1/ios/ad_intel/top_creatives', params: { date: '2025-01-01', period: 'week', category: '6018', country: 'US', network: 'Instagram', ad_types: 'video', limit: '10' } },
  { name: 'games_breakdown', category: 'Market Analysis', endpoint: '/v1/ios/games/breakdown', params: { categories: '7001', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'daily' } },

  // ===== Store Marketing Tools (6) =====
  { name: 'get_featured_today_stories', category: 'Store Marketing', endpoint: '/v1/ios/featured/today_stories', params: { country: 'US', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'get_featured_apps', category: 'Store Marketing', endpoint: '/v1/ios/featured/apps', params: { category: '6018', country: 'US', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'get_featured_creatives', category: 'Store Marketing', endpoint: '/v1/ios/featured/creatives', params: { app_ids: '284882215', country: 'US', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'get_keywords', category: 'Store Marketing', endpoint: '/v1/ios/keywords/get_keywords', params: { app_ids: '284882215', country: 'US' } },
  { name: 'get_reviews', category: 'Store Marketing', endpoint: '/v1/ios/reviews', params: { app_id: '284882215', country: 'US' } },
  { name: 'research_keyword', category: 'Store Marketing', endpoint: '/v1/ios/keywords/research', params: { term: 'social', country: 'US' } },

  // ===== Search & Discovery Tools (5) =====
  { name: 'search_entities', category: 'Search & Discovery', endpoint: '/v1/ios/search/app', params: { term: 'facebook', limit: '10', country: 'US' } },
  { name: 'get_category_rankings', category: 'Search & Discovery', endpoint: '/v1/ios/category/rankings', params: { category: '6018', chart_type: 'topfreeapplications', country: 'US', date: '2025-01-15', limit: '10' } },
  { name: 'get_publisher_apps', category: 'Search & Discovery', endpoint: '/v1/ios/publisher/publisher_apps', params: { publisher_id: '284882218', limit: '10' } },
  { name: 'get_unified_publisher_apps', category: 'Search & Discovery', endpoint: '/v1/unified/publishers/apps', params: { unified_id: '284882218' } },
  { name: 'get_app_ids_by_category', category: 'Search & Discovery', endpoint: '/v1/ios/apps/app_ids', params: { category: '6018', limit: '100' } },

  // ===== Your Metrics Tools (4) =====
  { name: 'analytics_metrics', category: 'Your Metrics', endpoint: '/v1/sales/reports/analytics', params: { app_ids: '284882215', countries: 'US', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'sources_metrics', category: 'Your Metrics', endpoint: '/v1/sales/reports/sources', params: { app_ids: '284882215', countries: 'US', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'sales_reports', category: 'Your Metrics', endpoint: '/v1/sales/reports', params: { os: 'ios', app_ids: '284882215', countries: 'US', date_granularity: 'daily', start_date: '2025-01-01', end_date: '2025-01-07' } },
  { name: 'unified_sales_reports', category: 'Your Metrics', endpoint: '/v1/ios/compact_sales_report_estimates', params: { itunes_app_ids: '284882215', start_date: '2025-01-01', end_date: '2025-01-07', date_granularity: 'daily' } },

  // ===== Utilities Tools (4) =====
  { name: 'get_country_codes', category: 'Utilities', endpoint: '/v1/countries', params: {} },
  { name: 'get_category_ids', category: 'Utilities', endpoint: '/v1/ios/categories', params: {} },
  { name: 'get_chart_types', category: 'Utilities', endpoint: '/v1/ios/chart_types', params: {} },
  { name: 'health_check', category: 'Utilities', endpoint: '/v1/health', params: {} },
];

// Run all tests
async function runTests() {
  console.log('🧪 Starting Sensor Tower MCP Tools Test\n');
  console.log(`📊 Total tools to test: ${tests.length}\n`);
  console.log('='.repeat(60) + '\n');

  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    const startTime = Date.now();
    const result = await makeRequest(test.endpoint, test.params);
    const duration = Date.now() - startTime;

    const testResult = {
      name: test.name,
      category: test.category,
      endpoint: test.endpoint,
      status: result.status,
      success: result.status >= 200 && result.status < 300,
      duration: duration,
      error: result.error,
      dataPreview: result.data ? JSON.stringify(result.data).substring(0, 100) : null
    };
    results.push(testResult);

    if (testResult.success) {
      console.log(`✅ ${result.status} (${duration}ms)`);
    } else {
      console.log(`❌ ${result.status} - ${result.error || 'Failed'} (${duration}ms)`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  // Generate HTML report
  generateHTMLReport();
}


function generateHTMLReport() {
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const passRate = ((passed / results.length) * 100).toFixed(1);

  // Group by category
  const categories = {};
  results.forEach(r => {
    if (!categories[r.category]) categories[r.category] = [];
    categories[r.category].push(r);
  });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sensor Tower MCP 工具测试报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { text-align: center; color: #333; margin-bottom: 20px; }
    .summary { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
    .summary-card { background: white; padding: 20px 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
    .summary-card.passed { border-left: 4px solid #4CAF50; }
    .summary-card.failed { border-left: 4px solid #f44336; }
    .summary-card.total { border-left: 4px solid #2196F3; }
    .summary-card .number { font-size: 36px; font-weight: bold; }
    .summary-card .label { color: #666; margin-top: 5px; }
    .summary-card.passed .number { color: #4CAF50; }
    .summary-card.failed .number { color: #f44336; }
    .summary-card.total .number { color: #2196F3; }
    .category { background: white; margin-bottom: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .category-header { background: #333; color: white; padding: 15px 20px; font-size: 18px; display: flex; justify-content: space-between; align-items: center; }
    .category-stats { font-size: 14px; opacity: 0.8; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: 600; color: #555; }
    tr:hover { background: #f5f5f5; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status.success { background: #e8f5e9; color: #2e7d32; }
    .status.error { background: #ffebee; color: #c62828; }
    .endpoint { font-family: monospace; font-size: 12px; color: #666; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .error-msg { color: #c62828; font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .duration { color: #666; font-size: 12px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    .progress-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin-top: 10px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); transition: width 0.3s; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔧 Sensor Tower MCP 工具测试报告</h1>
    
    <div class="summary">
      <div class="summary-card total">
        <div class="number">${results.length}</div>
        <div class="label">总工具数</div>
      </div>
      <div class="summary-card passed">
        <div class="number">${passed}</div>
        <div class="label">通过</div>
      </div>
      <div class="summary-card failed">
        <div class="number">${failed}</div>
        <div class="label">失败</div>
      </div>
      <div class="summary-card total">
        <div class="number">${passRate}%</div>
        <div class="label">通过率</div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${passRate}%"></div></div>
      </div>
    </div>

    ${Object.entries(categories).map(([cat, tools]) => {
      const catPassed = tools.filter(t => t.success).length;
      return `
    <div class="category">
      <div class="category-header">
        <span>📁 ${cat}</span>
        <span class="category-stats">${catPassed}/${tools.length} 通过</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>工具名称</th>
            <th>状态</th>
            <th>端点</th>
            <th>耗时</th>
            <th>错误信息</th>
          </tr>
        </thead>
        <tbody>
          ${tools.map(t => `
          <tr>
            <td><strong>${t.name}</strong></td>
            <td><span class="status ${t.success ? 'success' : 'error'}">${t.success ? '✅ ' + t.status : '❌ ' + t.status}</span></td>
            <td class="endpoint" title="${t.endpoint}">${t.endpoint}</td>
            <td class="duration">${t.duration}ms</td>
            <td class="error-msg" title="${t.error || ''}">${t.error || '-'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
    }).join('')}

    <div class="footer">
      <p>测试时间: ${new Date().toLocaleString('zh-CN')}</p>
      <p>Sensor Tower MCP Server Pro v1.2.13</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync('test-report.html', html);
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 测试完成!`);
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   📈 通过率: ${passRate}%`);
  console.log(`\n📄 HTML报告已生成: test-report.html`);
}

runTests().catch(console.error);
