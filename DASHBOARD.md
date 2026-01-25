# 🐋 Kalshi Whale Tracker Dashboard

A real-time web dashboard that visualizes whale activity (large trades) in Kalshi's weather and climate prediction markets.

## Features

- **Real-time Signal Tracking** - See every whale signal as it's detected
- **24-Hour Activity Chart** - Visual time series of signal volume and confidence
- **Top Markets Ranking** - Markets with the highest whale activity
- **Live Updates** - Auto-refreshes every 5 seconds
- **Beautiful Dark UI** - Modern, responsive design

## Quick Start

### Option 1: Run Dashboard + Bot Together (Recommended)

```bash
npm run bot:dev
```

This starts:
- **Web Dashboard** at http://localhost:5173/bot
- **Bot** running in the background
- **API Server** at http://localhost:3001

### Option 2: Run Separately

```bash
# Terminal 1: Start the bot (includes API server)
npm run bot

# Terminal 2: Start the web server
npm run dev
```

Then open: **http://localhost:5173/bot**

## Dashboard Sections

### 📊 Summary Cards
- Total signals detected
- Signals in last hour
- Signals in last 24 hours
- Average confidence score

### 📈 Activity Chart
Dual-axis chart showing:
- **Blue area**: Number of signals per hour
- **Green line**: Average confidence over time

### 🏆 Top Markets
Markets ranked by "whale activity" score:
- **Volume** - 24-hour trading volume
- **Signals** - Number of whale signals detected
- **Activity** - Composite score (0-100) of whale interest

### 🐋 Recent Signals
Live feed of whale activity with:
- Signal type (volume spike, large trade, directional flow)
- Market details and explanation
- Confidence score
- Trade parameters (side, size, price)

## How It Works

### Architecture

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Kalshi  │ ────▶   │   Bot    │ ────▶   │Dashboard │
│   API    │         │+ Tracker │         │(Browser) │
└──────────┘         └──────────┘         └──────────┘
                           │
                           │ HTTP API
                           ▼
                     ┌──────────┐
                     │   Data   │
                     │  Storage │
                     └──────────┘
```

1. **Bot** monitors Kalshi markets every 30 seconds
2. **Whale Tracker** stores detected signals in memory
3. **API Server** exposes data via HTTP endpoints
4. **Dashboard** fetches and displays data (auto-refresh 5s)

### API Endpoints

The bot exposes these endpoints at `http://localhost:3001`:

| Endpoint | Description |
|----------|-------------|
| `GET /api/summary` | Overall stats (total signals, averages) |
| `GET /api/signals?limit=50` | Recent whale signals |
| `GET /api/signals/market?ticker=TICKER` | Signals for specific market |
| `GET /api/stats` | Market rankings by whale activity |
| `GET /api/timeseries?hours=24` | Time series data for charts |
| `GET /health` | API health check |

## Signal Types

### 🐋 Large Trade
Individual trade of 10+ contracts (configurable).
- **Confidence**: 65%
- **Reasoning**: Sophisticated traders use size

### 📈 Volume Spike
24h volume increases by 30%+ (configurable).
- **Confidence**: 70-85%
- **Reasoning**: Informed money entering position

### ➡️ Directional Flow
70%+ of recent trades on one side.
- **Confidence**: 75-90%
- **Reasoning**: Strong market conviction

## Configuration

Edit `bot/config.ts` to adjust:

```typescript
export const config = {
  // Signal detection thresholds
  minTradeSize: 10,           // Min contracts for "large trade"
  volumeSpikeTreshold: 0.30,  // 30% volume increase
  directionalFlowRatio: 0.70, // 70% flow to one side

  // Data retention
  maxSignals: 1000,           // Keep last 1000 signals

  // API server
  apiPort: 3001,
};
```

## Troubleshooting

### Dashboard shows "Bot Offline"

**Cause**: Bot is not running or API server failed to start

**Fix**:
```bash
# Check if bot is running
npm run bot

# Or run both together
npm run bot:dev
```

### No signals appearing

**Possible causes**:
1. No whale activity in markets (normal during low-volume periods)
2. Thresholds too strict
3. Markets are closed

**Fix**:
- Wait for market activity (weather markets are most active during weather events)
- Lower thresholds in `bot/config.ts`
- Check that you have valid API credentials in `.env`

### Chart not rendering

**Cause**: Not enough data points

**Fix**: Wait for signals to accumulate (need at least 2 data points)

## Keyboard Shortcuts

- **Cmd/Ctrl + R** - Refresh page manually
- **Cmd/Ctrl + Shift + R** - Hard refresh (clear cache)

## Mobile Support

The dashboard is responsive and works on mobile devices, though desktop is recommended for the best experience.

## Data Privacy

All data stays local:
- ✅ Signals stored in bot's memory only
- ✅ No data sent to external servers
- ✅ API only accessible on localhost
- ✅ Data cleared when bot restarts

## Performance

- **Memory**: ~50-100MB for 1000 signals
- **Network**: Minimal (5s polling to localhost)
- **CPU**: Negligible (D3 charts render once per update)

## Tips for Best Results

1. **Run during peak hours** - More market activity = more signals
2. **Watch weather events** - Temperature extremes drive volume
3. **Lower thresholds initially** - See more signals, adjust up later
4. **Keep bot running** - Signals accumulate over time
5. **Check multiple markets** - Whale activity varies by market

## Advanced Usage

### Custom Time Range

```javascript
// Fetch last 12 hours instead of 24
fetch('http://localhost:3001/api/timeseries?hours=12')
```

### Filter by Signal Type

```javascript
// Get only volume spikes
const signals = await fetch('http://localhost:3001/api/signals?limit=100')
  .then(r => r.json())
  .then(data => data.filter(s => s.signalType === 'volume_spike'));
```

### Export Data

```javascript
// Download signals as JSON
const signals = await fetch('http://localhost:3001/api/signals?limit=1000')
  .then(r => r.json());

const blob = new Blob([JSON.stringify(signals, null, 2)], {
  type: 'application/json'
});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'kalshi-whales.json';
a.click();
```

## Credits

Built with:
- **SvelteKit** - Web framework
- **D3.js** - Data visualization
- **Tailwind CSS** - Styling
- **Kalshi API** - Market data

---

**Ready to track whales?** Run `npm run bot:dev` and open http://localhost:5173/bot! 🐋
