# Sensor Tower MCP Server Pro

A pure Node.js implementation of the Model Context Protocol server for Sensor Tower APIs. Access mobile app intelligence data directly in MCP-compatible tools like Cursor, Claude Desktop, and Cline.

## Features

- **43 API Tools** - Complete coverage of Sensor Tower APIs
- **App Intelligence** - Metadata, rankings, downloads, revenue estimates
- **Search & Discovery** - Find apps and publishers by name or description
- **Market Analysis** - Category rankings, featured apps, competitor insights
- **Store Marketing** - Keywords, reviews, featured apps data
- **Multi-Token Failover** - Automatic switch to backup tokens when quota exhausted
- **No Python Required** - Pure Node.js implementation

## Quick Start

```bash
# Run directly with npx (recommended)
npx sensor-tower-mcp-pro

# Or install globally
npm install -g sensor-tower-mcp-pro
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
      "args": ["-y", "sensor-tower-mcp-pro"],
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
npx sensor-tower-mcp-pro
```

## API Token

Get your API token from [Sensor Tower Account Settings](https://app.sensortower.com/users/edit/api-settings).

## Available Tools (43 Total)

### App Analysis (16 tools)
| Tool | Description |
|------|-------------|
| `get_app_metadata` | App details, ratings, categories |
| `get_download_estimates` | Download trends and estimates |
| `get_revenue_estimates` | Revenue data and forecasts |
| `get_creatives` | Advertising creatives |
| `get_impressions` | Advertising impressions data |
| `get_usage_active_users` | Active users data |
| `top_in_app_purchases` | Top in-app purchases |
| `version_history` | App version history |
| `get_category_history` | Category ranking history |
| `compact_sales_report_estimates` | Compact download/revenue estimates |
| `category_ranking_summary` | Today's category ranking summary |
| `impressions_rank` | Advertising impressions rank |
| `app_analysis_retention` | Retention analysis data |
| `downloads_by_sources` | Downloads by source (organic/paid) |
| `app_analysis_demographics` | Demographic analysis |
| `app_update_timeline` | App update history |

### Market Analysis (8 tools)
| Tool | Description |
|------|-------------|
| `get_top_and_trending` | Top apps by downloads/revenue |
| `get_top_publishers` | Top publishers ranking |
| `get_store_summary` | App store summary statistics |
| `usage_top_apps` | Top apps by active users |
| `top_apps` | Share of Voice for advertisers/publishers |
| `top_apps_search` | Rank of advertiser/publisher |
| `top_creatives` | Top creatives over time |
| `games_breakdown` | Game category breakdown |

### Store Marketing (6 tools)
| Tool | Description |
|------|-------------|
| `get_featured_today_stories` | Featured Today stories |
| `get_featured_apps` | Featured apps on App Store |
| `get_featured_creatives` | Featured creatives and positions |
| `get_keywords` | Current keyword rankings |
| `get_reviews` | App reviews and ratings |
| `research_keyword` | Keyword research metadata |

### Search & Discovery (5 tools)
| Tool | Description |
|------|-------------|
| `search_entities` | Search apps and publishers |
| `get_category_rankings` | Top apps by category |
| `get_publisher_apps` | Apps by publisher |
| `get_unified_publisher_apps` | Unified publisher apps |
| `get_app_ids_by_category` | App IDs by category |

### Your Metrics (4 tools)
| Tool | Description |
|------|-------------|
| `analytics_metrics` | App Store analytics report |
| `sources_metrics` | Metrics by traffic source |
| `sales_reports` | Downloads/revenue sales report |
| `unified_sales_reports` | Unified sales report |

### Utilities (4 tools)
| Tool | Description |
|------|-------------|
| `get_country_codes` | Available country codes |
| `get_category_ids` | Platform category IDs |
| `get_chart_types` | Ranking chart identifiers |
| `health_check` | Service health status |

## Command Line Options

```bash
npx sensor-tower-mcp-pro [OPTIONS]

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
SENSOR_TOWER_API_TOKEN=your_token npx sensor-tower-mcp-pro

# Run with HTTP transport
npx sensor-tower-mcp-pro --transport http --port 8666
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
- [npm Package](https://www.npmjs.com/package/sensor-tower-mcp-pro)

## License

MIT License