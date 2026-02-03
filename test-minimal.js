/**
 * Minimal test - just verify one working endpoint
 */

const https = require('https');

const TOKEN = 'ST0_Dpkx4Kxd_appC33PNTNs5h6';

function testEndpoint() {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      auth_token: TOKEN,
      app_ids: '284882215'
    });

    const options = {
      hostname: 'api.sensortower.com',
      path: `/v1/ios/app/overview?${params}`,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'SensorTower-MCP-Test/1.0'
      }
    };

    console.log('🔍 Testing: GET /v1/ios/app/overview');
    console.log('📍 Endpoint: https://api.sensortower.com' + options.path.substring(0, 50) + '...\n');

    const req = https.request(options, (res) => {
      let data = '';

      console.log(`📡 Response Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers['content-type']);

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('\n✅ SUCCESS - API returned valid JSON data');
          console.log(`📦 Response keys: ${Object.keys(json).slice(0, 5).join(', ')}...`);

          if (json.name || json.app_id) {
            console.log(`📱 App Name: ${json.name || 'N/A'}`);
            console.log(`🆔 App ID: ${json.app_id || 'N/A'}`);
          }

          console.log('\n🎉 Test PASSED - Tools are working correctly!');
          resolve(true);
        } catch (e) {
          console.log('\n❌ FAILED - Invalid JSON response');
          console.log('Response preview:', data.substring(0, 200));
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`\n❌ FAILED - Network error: ${e.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('\n❌ FAILED - Request timeout');
      resolve(false);
    });

    req.end();
  });
}

testEndpoint().then(success => {
  process.exit(success ? 0 : 1);
});
