# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kalshi Whale Tracker** - A real-time bot that follows profitable Kalshi weather/climate bettors, featuring:
- Automated market scanning for weather/climate markets
- Whale detection via volume spikes, large trades, and directional flow
- Real-time web dashboard with D3.js visualizations
- Signal tracking and analytics
- HTTP API for accessing whale activity data

**Important**: This bot MUST run on a local Mac due to Kalshi API network restrictions. It will not work in remote environments.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Run bot + dashboard (recommended)
npm run bot:dev          # Runs both bot and web dashboard

# Run components separately
npm run bot              # Bot only (background scanner)
npm run dev              # Dashboard only (localhost:5173/bot)

# Build and preview
npm run build            # Build to /build directory
npm run preview          # Preview production build

# Quick launchers (Mac only)
./START_SIMPLE.sh        # Simple launcher with verification
./LAUNCH.sh              # Comprehensive launcher with checks
./DIAGNOSE.sh            # Diagnostic tool for troubleshooting
```

## Technology Stack

- **SvelteKit 2.0** with Svelte 5 reactivity (`$state`, `$derived`, `$effect` runes)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** with custom dark theme
- **D3.js** for interactive visualizations (time series charts, market rankings)
- **Kalshi API** (TypeScript SDK v3.5.0) for market data
- **Node.js** HTTP server for API endpoints
- **Concurrently** for running bot + web server simultaneously

## Key Files

### Bot Core
- `bot/index.ts` - Main bot loop with market scanning and signal detection
- `bot/market-analyzer.ts` - Market filtering and whale signal detection logic
- `bot/whale-tracker.ts` - In-memory signal storage (last 1000 signals)
- `bot/api-server.ts` - HTTP API exposing whale data to dashboard
- `bot/kalshi-client.ts` - Kalshi API wrapper
- `bot/config.ts` - Bot configuration (scan intervals, thresholds)

### Dashboard UI
- `src/routes/bot/+page.svelte` - Main dashboard page (auto-refreshes every 5s)
- `src/routes/bot/SignalChart.svelte` - D3.js time series chart (24h window)
- `src/routes/bot/MarketStats.svelte` - Market rankings by whale activity

### Configuration
- `.env` - Kalshi API credentials (KALSHI_API_KEY, KALSHI_PRIVATE_KEY)
- `bot/config.ts` - Bot parameters (scan interval, volume thresholds, signal criteria)

## How It Works

### 1. Market Scanning
- Bot scans all Kalshi markets every 60 seconds
- Filters for weather/climate markets via keywords
- Fallback: Uses top 20 volume markets if no weather/climate markets found

### 2. Whale Detection
The bot detects "whale activity" (large trader signals) via:
- **Volume spikes**: Current volume >> 24h average
- **Large trades**: Individual trades > $10,000
- **Directional flow**: Imbalanced buy/sell pressure

### 3. Signal Tracking
- Stores last 1000 whale signals in memory
- Each signal includes: market, timestamp, confidence, signal type
- Aggregates signals by market for ranking

### 4. Dashboard
- Real-time view of whale activity at http://localhost:5173/bot
- Time series chart showing signal frequency and confidence
- Market rankings sorted by whale activity score
- Auto-refreshes every 5 seconds

## API Endpoints

The bot exposes an HTTP API on port 3001:

- `GET /api/signals` - Recent whale signals (last 100)
- `GET /api/stats` - Bot statistics (total signals, active markets)
- `GET /api/markets` - Market rankings by whale activity
- `GET /api/timeseries` - 24h signal activity for charts

## Kalshi API

The bot uses the official Kalshi TypeScript SDK:
- **Markets API**: Fetch all active markets
- **Series API**: Get market series data
- **Trades API**: Track recent trade activity

**Network Restrictions**: Kalshi API blocks requests from cloud/remote environments. The bot must run locally on your Mac.

## Path Aliases

```typescript
$lib -> src/lib  (currently minimal, mostly bot-specific code)
```

## Environment Variables

Required in `.env` file:

```bash
KALSHI_API_KEY=your-api-key-here
KALSHI_PRIVATE_KEY=your-private-key-here
```

Get credentials from: https://kalshi.com/account/api-keys

## Deployment

**This bot is designed for local use only** due to Kalshi API restrictions. It cannot be deployed to cloud platforms (Vercel, Heroku, etc.) as the API will reject requests.

## Troubleshooting

### Bot can't connect to Kalshi API
- Ensure you're running on your local Mac (not remote environment)
- Verify `.env` file exists with valid API credentials
- Check Kalshi API status at https://kalshi.com

### No markets found
- This is expected if there are no active weather/climate markets
- Bot will automatically fall back to top 20 volume markets
- Look for message: "⚠️  No weather/climate markets - using top volume markets"

### Dashboard shows "Bot Offline"
- Ensure bot is running: `npm run bot` or `npm run bot:dev`
- Check bot API server is running on port 3001
- Look for "🤖 API server listening on port 3001" in bot output

### Browser won't open
- Manually navigate to http://localhost:5173/bot
- Ensure web server is running: `npm run dev` or `npm run bot:dev`
- Check for port conflicts (kill any processes using 5173 or 3001)

## Next Steps

1. Add more sophisticated whale detection algorithms
2. Implement trade execution (copy whale trades automatically)
3. Add email/SMS alerts for high-confidence signals
4. Historical backtesting of whale-following strategy
5. Support for other market categories beyond weather/climate
