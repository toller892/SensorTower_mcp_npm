# Sensor Tower MCP Server Pro

A pure Node.js implementation of the Model Context Protocol server for Sensor Tower APIs. Access mobile app intelligence data directly in MCP-compatible tools like Cursor, Claude Desktop, and Cline.

## Features

- **23 API Tools** - Production-tested and verified working tools only
- **App Intelligence** - Metadata, rankings, downloads, revenue estimates
- **Search & Discovery** - Find apps and publishers by name or description
- **Market Analysis** - Category rankings, featured apps, competitor insights
- **Store Marketing** - Keywords, reviews, featured apps data
- **Multi-Token Failover** - Automatic switch to backup tokens when quota exhausted
- **No Python Required** - Pure Node.js implementation

## Quick Start

```bash
# Run directly with npx (recommended)
npx @feedmob/sensor-tower-mcp-pro

# Or install globally
npm install -g @feedmob/sensor-tower-mcp-pro
sensor-tower-mcp-pro
```

## Requirements

- **Node.js 18+**
- Sensor Tower API token

## MCP Configuration

### Cursor / Claude Desktop / Cline

Add to your MCP settings:

```json
{
  "mcpServers": {
    "sensortower": {
      "command": "npx",
      "args": ["-y", "@feedmob/sensor-tower-mcp-pro"],
      "env": {
        "SENSOR_TOWER_API_TOKEN": "primary_token",
        "SENSOR_TOWER_API_TOKEN_BACKUP": "backup_token"
      }
    }
  }
}
```

## Multi-Token Failover

When a token's API quota is exhausted (429/403 error), the server automatically switches to the next available backup token. This ensures uninterrupted API access.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SENSOR_TOWER_API_TOKEN` | Primary API token (required) |
| `SENSOR_TOWER_API_TOKEN_BACKUP` | First backup token |
| `SENSOR_TOWER_API_TOKEN_2` | Second backup token |
| `SENSOR_TOWER_API_TOKEN_3` | Third backup token (up to 10) |

### Example with Multiple Tokens

```bash
SENSOR_TOWER_API_TOKEN=token1 \
SENSOR_TOWER_API_TOKEN_BACKUP=token2 \
SENSOR_TOWER_API_TOKEN_2=token3 \
npx @feedmob/sensor-tower-mcp-pro
```

## API Token

Get your API token from [Sensor Tower Account Settings](https://app.sensortower.com/users/edit/api-settings).

## Available Tools (23 Total)

### App Analysis (13 tools)
| Tool | Description |
|------|-------------|
| `get_app_metadata` | App details, ratings, categories |
| `get_download_estimates` | Download trends and estimates |
| `get_revenue_estimates` | Revenue data and forecasts |
| `get_usage_active_users` | Active users data |
| `top_in_app_purchases` | Top in-app purchases |
| `version_history` | App version history |
| `get_category_history` | Category ranking history |
| `compact_sales_report_estimates` | Compact download/revenue estimates |
| `category_ranking_summary` | Today's category ranking summary |
| `app_analysis_retention` | Retention analysis data ⭐ |
| `downloads_by_sources` | Downloads by source (organic/paid) |
| `app_analysis_demographics` | Demographic analysis |
| `app_update_timeline` | App update history |

> ⭐ **Fixed**: `app_analysis_retention` now only supports `all_time` or `quarterly` for date_granularity.

### Market Analysis (1 tool)
| Tool | Description |
|------|-------------|
| `get_store_summary` | App store summary statistics |

### Store Marketing (2 tools)
| Tool | Description |
|------|-------------|
| `get_featured_today_stories` | Featured Today stories |
| `get_featured_apps` | Featured apps on App Store |

### Search & Discovery (3 tools)
| Tool | Description |
|------|-------------|
| `get_publisher_apps` | Apps by publisher |
| `get_unified_publisher_apps` | Unified publisher apps |
| `get_app_ids_by_category` | App IDs by category |

### Utilities (4 tools)
| Tool | Description |
|------|-------------|
| `get_country_codes` | Available country codes |
| `get_category_ids` | Platform category IDs |
| `get_chart_types` | Ranking chart identifiers |
| `health_check` | Service health status |

## Command Line Options

```bash
npx @feedmob/sensor-tower-mcp-pro [OPTIONS]

Options:
  --transport <type>    Transport type: stdio (default) or http
  --port <port>         HTTP port (default: 8666, only for http transport)
  --token <token>       API token (or set SENSOR_TOWER_API_TOKEN env var)
  --backup-token <tok>  Backup API token for failover
  --help, -h            Show help message
```

## Examples

```bash
# Run with stdio transport (for MCP clients)
SENSOR_TOWER_API_TOKEN=your_token npx @feedmob/sensor-tower-mcp-pro

# Run with HTTP transport
npx @feedmob/sensor-tower-mcp-pro --transport http --port 8666
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

## Links

- [GitHub Repository](https://github.com/toller892/SensorTower_mcp_npm)
- [Sensor Tower API Docs](https://docs.sensortower.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [npm Package](https://www.npmjs.com/package/@feedmob/sensor-tower-mcp-pro)

## License

MIT License

---

## Version History

### v1.4.0 (2026-02-03)

**Production-Ready Release - Tested and Verified Tools Only**

This release removes all failing tools based on comprehensive testing, keeping only the 23 tools that are verified to work in production.

**Changes:**
- ✅ **Removed 9 failing tools** based on actual API testing:
  - `get_creatives`, `get_impressions`, `impressions_rank` (App Analysis - HTTP 422 or empty data)
  - `get_featured_creatives` (Store Marketing - Server bug)
  - `games_breakdown`, `top_apps`, `top_apps_search` (Market Analysis - Unofficial API failures)
  - `sales_reports`, `unified_sales_reports` (Your Metrics - Account connection required or server bugs)
- ⭐ **Fixed `app_analysis_retention` parameters**:
  - Changed `date_granularity` to only support `all_time` or `quarterly` (was incorrectly allowing daily/weekly/monthly)
  - Added proper validation for `end_date` requirement when using quarterly mode
  - Updated documentation with usage examples
- ✅ **Quality improvements**:
  - All 23 remaining tools are production-tested and verified
  - Removed 200+ lines of non-working code
  - Updated health_check to report correct tool count (23)
  - Comprehensive documentation updates

**Tool Count:** 32 → 23 tools (production-tested only)

**What's Working:**
- ✅ All app metadata and information tools
- ✅ Download and revenue estimation tools
- ✅ Ranking and category analysis tools
- ✅ User behavior analysis tools (with corrected parameters)
- ✅ Publisher and discovery tools
- ✅ Featured content tools
- ✅ All utility tools

**Migration Guide:**
- If using `app_analysis_retention`: Update `date_granularity` to `all_time` or `quarterly` only
- If using removed tools: These tools failed in testing and should not be used
- All remaining 23 tools are stable and production-ready

**Testing:** Based on comprehensive API testing documented in "SensorTower MCP 工具更新文档 2026-02-03"

### v1.3.0 (2026-02-03)

**Major Optimization Release - API Alignment**

This release aligns the tool collection with official Sensor Tower API documentation, removing deprecated endpoints and improving reliability.

**Changes:**
- ✅ **Removed 11 deprecated tools** that return 404 errors:
  - `search_entities`, `get_category_rankings` (Search)
  - `get_top_and_trending`, `get_top_publishers`, `usage_top_apps`, `top_creatives` (Market Analysis)
  - `get_keywords`, `get_reviews`, `research_keyword` (Store Marketing)
  - `analytics_metrics`, `sources_metrics` (Your Metrics)
- ✅ **Fixed parameter issues**:
  - Made `unified_app_ids` required in `unified_sales_reports`
  - Clarified `app_id` requirement in `get_featured_creatives`
- ✅ **Added documentation warnings**:
  - Permission requirements for `sales_reports`
  - Server error warnings for `get_store_summary`
  - Unofficial API warnings for shadow endpoints (`top_apps`, `top_apps_search`, `games_breakdown`)
- ✅ **Code quality improvements**:
  - 343 lines of deprecated code removed
  - TypeScript compilation optimized
  - Better error messages and documentation

**Tool Count:** 43 → 23 tools (production-tested only)

**Migration Guide:**
- If you were using removed tools, check the [official Sensor Tower API docs](https://docs.sensortower.com/) for alternative endpoints
- Shadow API tools (marked with ⚠️) still work but may change without notice

### v1.2.13 (2026-01-30)
- Fixed API endpoint paths and date parameter handling
- Improved error handling

### v1.2.12 (2026-01-30)
- Initial npm release
- 43 API tools with multi-token failover support