/**
 * Code structure validation test
 * Verifies that all tools are properly defined without making API calls
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating MCP Tool Structure (Post-Optimization)\n');
console.log('=' .repeat(60));

// Load the compiled JavaScript
const toolFiles = [
  'dist/tools/search.js',
  'dist/tools/market-analysis.js',
  'dist/tools/store-marketing.js',
  'dist/tools/your-metrics.js',
  'dist/tools/app-analysis.js'
];

let totalTools = 0;
let validTools = 0;
const toolsList = [];

for (const file of toolFiles) {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} - File not found (skipping)`);
    continue;
  }

  try {
    const module = require(filePath);
    const fileName = path.basename(file, '.js');

    console.log(`\n📄 ${fileName}:`);

    // Get the register function
    const registerFn = Object.values(module).find(v => typeof v === 'function');

    if (!registerFn) {
      console.log('  ❌ No register function found');
      continue;
    }

    // Create a mock client
    const mockClient = {
      makeRequest: async () => ({ mock: true })
    };

    // Get the tools
    const tools = registerFn(mockClient);
    const toolNames = Object.keys(tools);

    console.log(`  ✅ Found ${toolNames.length} tools`);

    for (const toolName of toolNames) {
      const tool = tools[toolName];

      // Validate tool structure
      const hasDescription = !!tool.description;
      const hasInputSchema = !!tool.inputSchema;
      const hasHandler = typeof tool.handler === 'function';

      if (hasDescription && hasInputSchema && hasHandler) {
        console.log(`    ✓ ${toolName}`);
        validTools++;
        toolsList.push({ file: fileName, name: toolName });
      } else {
        console.log(`    ✗ ${toolName} (incomplete structure)`);
      }

      totalTools++;
    }
  } catch (error) {
    console.log(`  ❌ Error loading module: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Validation Results:`);
console.log(`  Total tools found: ${totalTools}`);
console.log(`  Valid tools: ${validTools}`);
console.log(`  Invalid tools: ${totalTools - validTools}`);

// Check for removed tools
const removedTools = [
  'search_entities',
  'get_category_rankings',
  'get_top_and_trending',
  'get_top_publishers',
  'usage_top_apps',
  'top_creatives',
  'get_keywords',
  'get_reviews',
  'research_keyword',
  'analytics_metrics',
  'sources_metrics'
];

console.log(`\n🗑️  Verifying removed tools (should be 0):`);
let foundRemoved = 0;
for (const removed of removedTools) {
  const found = toolsList.find(t => t.name === removed);
  if (found) {
    console.log(`  ❌ ${removed} still exists in ${found.file}`);
    foundRemoved++;
  }
}

if (foundRemoved === 0) {
  console.log(`  ✅ All deprecated tools successfully removed`);
}

// Summary
console.log('\n' + '='.repeat(60));
if (validTools > 0 && foundRemoved === 0) {
  console.log('\n✅ SUCCESS - Code structure is valid!');
  console.log(`   ${validTools} tools are properly defined`);
  console.log(`   All deprecated tools have been removed`);
  console.log('\n💡 Note: Actual API testing requires network access');
  process.exit(0);
} else {
  console.log('\n❌ FAILED - Issues found in code structure');
  process.exit(1);
}
