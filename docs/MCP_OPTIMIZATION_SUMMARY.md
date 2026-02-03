# MCP Tool Optimization Summary (NPM Version)

**Date:** 2026-02-03
**Project:** sensortower-mcp-npm (TypeScript/Node.js)
**Based on:** Sensor Tower MCP Compatibility Test Report (Updated Version)

## Overview

This document summarizes the optimization work performed on the Sensor Tower MCP NPM tool collection to align with official API documentation and remove deprecated endpoints.

## Changes Made

### Removed Tools (11 total)

The following tools were removed because their API endpoints return 404 and are not documented in the official Sensor Tower API:

#### Search Tools (2 tools)
- `search_entities` - `/v1/ios/search`
- `get_category_rankings` - `/v1/ios/rankings`

#### Market Analysis Tools (4 tools)
- `get_top_and_trending` - `/v1/unified/top_and_trending`
- `get_top_publishers` - `/v1/unified/top_publishers`
- `usage_top_apps` - `/v1/unified/usage/top_apps`
- `top_creatives` - `/v1/ios/ad_intel/top_creatives`

#### Your Metrics Tools (2 tools)
- `analytics_metrics` - `/v1/ios/analytics/metrics`
- `sources_metrics` - `/v1/ios/analytics/sources`

#### Store Marketing Tools (3 tools)
- `get_keywords` - `/v1/ios/keywords`
- `get_reviews` - `/v1/ios/reviews`
- `research_keyword` - `/v1/ios/keywords/research`

### Fixed Tools (2 total)

#### Parameter Fixes
- `get_featured_creatives` - Clarified that `app_id` is required (was already enforced)
- `unified_sales_reports` - Made `unified_app_ids` a required parameter

### Documented Tools (4 total)

#### Permission Requirements
- `sales_reports` - Added warning about special API authorization requirement (returns 401)

#### Server Issues
- `get_store_summary` - Added warning about server-side 500 errors

#### Unofficial APIs (Shadow APIs)
- `top_apps` - Marked as unofficial but working
- `top_apps_search` - Marked as unofficial but working
- `games_breakdown` - Marked as unofficial but working

## Code Changes Summary

- **343 lines of code removed**
- **11 deprecated tools removed**
- **6 tools documented with warnings**
- **1 parameter made required**

## Git Commits

5 commits were created:
1. `8e83364` - Remove deprecated tools from search.ts
2. `96db038` - Remove deprecated tools from market-analysis.ts
3. `1cfff7d` - Remove deprecated tools from store-marketing.ts
4. `e412331` - Remove deprecated tools from your-metrics.ts
5. `c52e1b0` - Add API warnings and fix parameter documentation

## Recommendations

### For Users

1. **Avoid removed tools** - They will no longer be available
2. **Check permissions** - If `sales_reports` returns 401, contact Sensor Tower support
3. **Monitor unofficial tools** - The 3 "shadow API" tools may stop working without notice
4. **Report issues** - If `get_store_summary` continues to fail, contact Sensor Tower

### For Maintainers

1. **Monitor shadow APIs** - Track if unofficial endpoints become documented or deprecated
2. **Update tests** - Remove tests for deprecated tools, add tests for fixed tools
3. **Version bump** - Consider bumping version to reflect breaking changes

## References

- Original Report: `Sensor Tower MCP 工具兼容性测试与优化报告 (更新版).md`
- Python Version: `../sensortower-mcp/docs/MCP_OPTIMIZATION_SUMMARY.md`
