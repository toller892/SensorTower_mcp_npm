/**
 * Tool Definition Validation Test
 * Validates all 32 tools are properly defined without making API calls
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating All 32 MCP Tool Definitions\n');
console.log('=' .repeat(70));

// Expected tool counts per category
const expectedTools = {
  'app-analysis': 16,
  'market-analysis': 4,
  'store-marketing': 3,
  'search': 3,
  'your-metrics': 2,
  'utilities': 4
};

const results = {
  total: 0,
  valid: 0,
  invalid: 0,
  byFile: {}
};

// Load and validate each tool file
const toolFiles = [
  { file: 'app-analysis', name: 'App Analysis' },
  { file: 'market-analysis', name: 'Market Analysis' },
  { file: 'store-marketing', name: 'Store Marketing' },
  { file: 'search', name: 'Search & Discovery' },
  { file: 'your-metrics', name: 'Your Metrics' },
  { file: 'utilities', name: 'Utilities' }
];

for (const { file, name } of toolFiles) {
  const filePath = path.join(__dirname, 'dist', 'tools', `${file}.js`);

  console.log(`\n📁 ${name} (${file}.ts)`);
  console.log('-'.repeat(70));

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    continue;
  }

  try {
    const module = require(filePath);
    const registerFn = Object.values(module).find(v => typeof v === 'function');

    if (!registerFn) {
      console.log('  ❌ No register function found');
      continue;
    }

    // Create mock client
    const mockClient = {
      makeRequest: async () => ({ mock: true })
    };

    // Get tools
    const tools = registerFn(mockClient);
    const toolNames = Object.keys(tools);
    const expected = expectedTools[file];

    results.byFile[name] = {
      expected,
      found: toolNames.length,
      valid: 0,
      invalid: 0,
      tools: []
    };

    console.log(`  Expected: ${expected} tools`);
    console.log(`  Found: ${toolNames.length} tools`);

    if (toolNames.length !== expected) {
      console.log(`  ⚠️  Tool count mismatch!`);
    }

    console.log(`\n  Tools:`);
    for (const toolName of toolNames) {
      const tool = tools[toolName];
      const hasDescription = !!tool.description;
      const hasInputSchema = !!tool.inputSchema;
      const hasHandler = typeof tool.handler === 'function';
      const hasProperties = tool.inputSchema && typeof tool.inputSchema.properties === 'object';
      const hasRequired = tool.inputSchema && Array.isArray(tool.inputSchema.required);

      const isValid = hasDescription && hasInputSchema && hasHandler && hasProperties;

      if (isValid) {
        console.log(`    ✅ ${toolName}`);
        results.valid++;
        results.byFile[name].valid++;
        results.byFile[name].tools.push(toolName);
      } else {
        console.log(`    ❌ ${toolName} (incomplete)`);
        const missing = [];
        if (!hasDescription) missing.push('description');
        if (!hasInputSchema) missing.push('inputSchema');
        if (!hasHandler) missing.push('handler');
        if (!hasProperties) missing.push('properties');
        console.log(`       Missing: ${missing.join(', ')}`);
        results.invalid++;
        results.byFile[name].invalid++;
      }

      results.total++;
    }
  } catch (error) {
    console.log(`  ❌ Error loading module: ${error.message}`);
  }
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 Validation Summary:\n');

console.log('Overall:');
console.log(`  Total tools: ${results.total}`);
console.log(`  ✅ Valid: ${results.valid}`);
console.log(`  ❌ Invalid: ${results.invalid}`);

console.log('\nBy Category:');
for (const [category, stats] of Object.entries(results.byFile)) {
  const status = stats.found === stats.expected && stats.invalid === 0 ? '✅' : '⚠️';
  console.log(`  ${status} ${category}: ${stats.valid}/${stats.expected} valid`);
}

console.log('\n' + '='.repeat(70));

// Check if we have exactly 32 tools
if (results.total === 32 && results.valid === 32 && results.invalid === 0) {
  console.log('\n🎉 SUCCESS! All 32 tools are properly defined!');
  console.log('\n✅ Tool Structure Validation:');
  console.log('   • All tools have descriptions');
  console.log('   • All tools have input schemas');
  console.log('   • All tools have handler functions');
  console.log('   • All tools have property definitions');
  console.log('\n💡 Note: Actual API testing requires network access and valid tokens.');
  console.log('   The tools are structurally correct and ready to use.');
  process.exit(0);
} else {
  console.log(`\n❌ FAILED: Expected 32 valid tools, found ${results.valid}`);
  if (results.total !== 32) {
    console.log(`   Tool count mismatch: ${results.total} total (expected 32)`);
  }
  if (results.invalid > 0) {
    console.log(`   ${results.invalid} tools have structural issues`);
  }
  process.exit(1);
}
