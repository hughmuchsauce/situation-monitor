# Kalshi Whale Tracker

Real-time bot that tracks ALL high-volume Kalshi markets and detects whale trades ($2M+). Features automated market scanning, whale signal detection via volume spikes and large trades, and a live web dashboard with D3.js visualizations. **Must run locally on Mac** - Kalshi API blocks remote/cloud environments.

## Quick Start

```bash
cd ~/situation-monitor && ./START_SIMPLE.sh
```

Dashboard auto-opens at http://localhost:5173/bot

## Key Files

**Bot Core** (all in `bot/`):
- `index.ts` - Main scanner loop, analyzes top 50 volume markets every 60s
- `market-analyzer.ts` - Whale detection ($2M threshold, volume spikes, directional flow)
- `whale-tracker.ts` - In-memory signal storage (last 1000)
- `api-server.ts` - HTTP API on port 3001
- `config.ts` - Bot config (whale threshold, scan interval, volume filters)

**Dashboard** (in `src/routes/bot/`):
- `+page.svelte` - Main UI, auto-refreshes every 5s
- `SignalChart.svelte` - D3.js time series (24h window)
- `MarketStats.svelte` - Market rankings by whale activity

## Tech Stack

- **SvelteKit 2.0** + Svelte 5 (`$state`, `$derived`, `$effect`)
- **TypeScript** (strict)
- **Tailwind CSS** (dark theme)
- **D3.js** (visualizations)
- **Kalshi API** (TypeScript SDK v3.5.0)
- **Concurrently** (runs bot + web server)

## Commands

```bash
npm install              # Install deps
npm run bot:dev          # Run bot + dashboard (recommended)
npm run bot              # Bot only
npm run dev              # Dashboard only
./START_SIMPLE.sh        # Auto-setup launcher (creates .env, installs deps, starts bot)
```

## Config

**Whale Definition**: Any trade ≥ $2M in actual dollars spent (contracts × price ÷ 100)

**Current Settings** (`bot/config.ts`):
- Whale threshold: $2,000,000
- Scan interval: 60s
- Analyzes: Top 50 volume markets (min $10k volume)
- Volume spike threshold: 50%

**Environment** (`.env` - auto-created by START_SIMPLE.sh):
```bash
KALSHI_API_KEY=your-key
KALSHI_PRIVATE_KEY=your-private-key
```

## API Endpoints (port 3001)

- `GET /api/signals` - Recent whale signals (last 100)
- `GET /api/stats` - Bot statistics
- `GET /api/markets` - Market rankings by whale activity
- `GET /api/timeseries` - 24h signal data for charts

## How It Works

1. **Scan**: Fetches all Kalshi markets, filters top 50 by volume
2. **Detect**: Checks each market for whale trades ($2M+), volume spikes (50%+), directional flow (70%+ one-sided)
3. **Track**: Stores signals in memory with confidence scores
4. **Display**: Dashboard shows real-time whale activity with charts

## Troubleshooting

**"Missing API credentials"** → `.env` file missing, run `./START_SIMPLE.sh` to auto-create

**"Host not allowed" error** → Running in remote environment, must run on local Mac

**Dashboard shows "Bot Offline"** → Bot not running on port 3001, check terminal for errors

**No whale signals** → Normal if no $2M+ trades occurring, dashboard updates every 5s

## Project Status

- ✅ Tracks ALL markets (removed weather/climate filtering)
- ✅ Whale threshold set to $2M (calculates actual dollar value)
- ✅ Auto-credential setup via START_SIMPLE.sh
- ✅ Local Mac only (Kalshi API restriction)
- 📍 Location: `~/situation-monitor/` (moved from ~/Downloads)

## Known Issues

- Kalshi API blocks cloud/remote environments (403 errors) - this is by design
- Browser auto-open uses `open` command (Mac only), manually navigate if fails
