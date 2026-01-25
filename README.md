# Kalshi Whale Tracker

A real-time bot that follows profitable Kalshi weather/climate bettors by detecting "whale" activity through market microstructure analysis.

## Features

- 🔍 **Automated Market Scanning** - Monitors all Kalshi markets every 60 seconds
- 🐋 **Whale Detection** - Identifies large trader activity via volume spikes, big trades, and directional flow
- 📊 **Real-time Dashboard** - Live D3.js visualizations showing whale signals and market rankings
- 🚀 **HTTP API** - RESTful endpoints for accessing whale activity data
- 💾 **Signal Tracking** - Stores last 1,000 whale signals for analysis

## Quick Start

**Important**: This bot must run on your local Mac due to Kalshi API network restrictions.

### 1. Setup

```bash
# Clone and navigate
git clone https://github.com/hughmuchsauce/situation-monitor.git
cd situation-monitor
git checkout claude/kalshi-follower-bot-MoXkd

# Install dependencies
npm install

# Add API credentials
echo "KALSHI_API_KEY=your-key-here" > .env
echo "KALSHI_PRIVATE_KEY=your-private-key-here" >> .env
```

Get your API keys from: https://kalshi.com/account/api-keys

### 2. Launch

**Simple way** (recommended):
```bash
./START_SIMPLE.sh
```

**Manual way**:
```bash
npm run bot:dev
```

Then open: http://localhost:5173/bot

## What You'll See

**Terminal Output:**
```
🤖 Kalshi Follower Bot initialized
📊 Found 1000 total markets
⚠️  No weather/climate markets - using top volume markets
→ Analyzing 20 high-volume markets
🔍 Scanning markets for whale activity...
```

**Dashboard:**
- Real-time whale signals with timestamps
- 24-hour activity chart showing signal frequency
- Market rankings by whale activity score
- Auto-refreshes every 5 seconds

## How It Works

### 1. Market Scanning
- Fetches all Kalshi markets via API
- Filters for weather/climate keywords
- Falls back to top 20 volume markets if none found

### 2. Whale Detection
Detects large trader activity through:
- **Volume spikes**: Current volume >> 24h average
- **Large trades**: Individual trades over $10,000
- **Directional flow**: Imbalanced buy/sell pressure

### 3. Signal Storage
- Stores up to 1,000 recent signals
- Each signal includes: market, confidence, type, timestamp
- Aggregates by market for ranking

### 4. Dashboard Display
- Time series chart (24h window)
- Market leaderboard (sorted by activity)
- Live status indicator
- Auto-refresh every 5s

## Project Structure

```
├── bot/
│   ├── index.ts              # Main bot loop
│   ├── market-analyzer.ts    # Whale detection logic
│   ├── whale-tracker.ts      # Signal storage
│   ├── api-server.ts         # HTTP API
│   └── config.ts             # Bot configuration
├── src/routes/bot/
│   ├── +page.svelte          # Dashboard UI
│   ├── SignalChart.svelte    # D3.js time series
│   └── MarketStats.svelte    # Market rankings
└── .env                      # API credentials
```

## API Endpoints

The bot exposes an HTTP API on port 3001:

- `GET /api/signals` - Recent whale signals (last 100)
- `GET /api/stats` - Bot statistics
- `GET /api/markets` - Market rankings
- `GET /api/timeseries` - 24h signal activity

## Configuration

Edit `bot/config.ts` to adjust:
- Scan interval (default: 60s)
- Volume thresholds
- Signal detection sensitivity
- Market filters

## Troubleshooting

### "Missing API credentials"
- Ensure `.env` file exists with valid `KALSHI_API_KEY` and `KALSHI_PRIVATE_KEY`

### "Host not allowed" error
- Bot must run on local Mac (not cloud/remote environments)
- Kalshi blocks requests from non-local IPs

### Dashboard shows "Bot Offline"
- Ensure bot is running: `npm run bot` or `npm run bot:dev`
- Check port 3001 is not in use

### No markets found
- This is expected if no weather/climate markets exist
- Bot automatically falls back to top volume markets
- Look for: "⚠️ No weather/climate markets - using top volume markets"

## Next Steps

- [ ] Add more sophisticated whale detection algorithms
- [ ] Implement automatic trade execution (copy whale trades)
- [ ] Add email/SMS alerts for high-confidence signals
- [ ] Historical backtesting of whale-following strategy
- [ ] Support for other market categories

## License

MIT

## Links

- **Repository**: https://github.com/hughmuchsauce/situation-monitor
- **Kalshi API**: https://kalshi.com/docs/api
- **Get API Keys**: https://kalshi.com/account/api-keys
