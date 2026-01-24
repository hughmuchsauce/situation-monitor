# Kalshi Follower Bot

A smart trading bot that monitors weather and climate prediction markets on Kalshi and follows profitable trading patterns.

## Features

- **Weather/Climate Focus**: Automatically identifies and monitors weather and climate-related markets
- **Smart Money Detection**: Analyzes order flow patterns to identify:
  - Volume spikes indicating informed trading
  - Strong directional buying/selling pressure
  - Large trades from potentially sophisticated traders
- **Risk Management**: Configurable position limits and daily trade caps
- **Demo Mode**: Test strategies without risking real money

## How It Works

Since Kalshi doesn't expose individual trader identities, this bot uses market microstructure analysis to detect "smart money" patterns:

1. **Volume Spike Detection**: Identifies sudden increases in trading volume (30%+ by default)
2. **Directional Flow Analysis**: Detects when 70%+ of trades are on one side (YES or NO)
3. **Large Trade Tracking**: Follows significant trades (10+ contracts by default)

When a pattern is detected, the bot automatically places a proportional order (30% of detected size by default).

## Setup

1. **Get Kalshi API credentials**:
   - Visit https://kalshi.com/settings/api
   - Generate an API key and private key
   - **Important**: Save your private key securely - it's only shown once

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API credentials
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

## Usage

### Run in Demo Mode (Recommended for testing)

```bash
npm run bot
```

This will simulate trades without executing them. Perfect for testing and understanding the bot's behavior.

### Run in Live Mode (Real Trading)

```bash
BOT_DEMO_MODE=false npm run bot
```

**⚠️ WARNING**: This will place real trades with real money. Start with small position limits!

### Check Current Positions

```bash
npm run bot:positions
```

## Configuration

Edit `bot/config.ts` to customize:

- **`minVolume`**: Minimum 24h volume to consider ($1000 default)
- **`minTradeSize`**: Minimum contracts to consider "significant" (10 default)
- **`volumeSpikeTreshold`**: % volume increase to trigger (30% default)
- **`followRatio`**: What % of detected trade to copy (0.3 = 30% default)
- **`maxPositionSize`**: Max contracts per market (100 default)
- **`maxDailyTrades`**: Daily trade limit (20 default)
- **`pollIntervalMs`**: How often to check markets (30s default)

## Strategy Details

### Volume Spike Detection
When 24h volume increases by 30%+ in a short period, the bot:
1. Analyzes which side (YES/NO) has more flow
2. Calculates confidence based on flow ratio
3. Places a proportional order on the dominant side

### Directional Flow
When 70%+ of recent trades are on one side:
1. Signals strong conviction from traders
2. Higher confidence score (70-90%)
3. Follows the flow with a scaled position

### Large Trades
Individual trades of 10+ contracts trigger:
1. Medium confidence signal (65%)
2. Follow at 30% of the trade size
3. Assumes informed trader activity

## Risk Warnings

- **No Guaranteed Profits**: Past patterns don't guarantee future results
- **Slippage**: Your order may fill at worse prices than detected trades
- **Market Impact**: Following trades may move the market against you
- **API Limits**: Kalshi has rate limits - bot includes delays to comply
- **Start Small**: Use demo mode first, then start with minimum position sizes

## Troubleshooting

**Bot won't start:**
- Check that `KALSHI_API_KEY` and `KALSHI_PRIVATE_KEY` are set in `.env`
- Verify your API key is active at https://kalshi.com/settings/api

**No signals detected:**
- Weather/climate markets may have low activity during certain periods
- Try reducing `minVolume` and `volumeSpikeTreshold` in config
- Check that markets are open (Kalshi has trading hours)

**Orders failing:**
- Verify you have sufficient account balance
- Check that prices haven't moved since signal was generated
- Ensure you're not hitting daily trade limits

## Example Output

```
🤖 Kalshi Follower Bot initialized
📊 Mode: DEMO (no real trades)
⏱️  Poll interval: 30s
📈 Target categories: weather, climate

🚀 Starting bot...

[2026-01-24T10:00:00.000Z] 🔍 Scanning markets...
   Found 847 total markets
   → 23 weather/climate markets

   🎯 Found 1 trading signal(s):

   📊 SIGNAL: Will NYC hit 70°F on Jan 25?
      Ticker: KXHIGHNY-26JAN25-B70
      Side: YES
      Confidence: 78%
      Suggested: 15 contracts @ 65¢
      Reason: Volume spike: +45.2% with 78% YES flow
      💡 DEMO: Would buy 15 yes @ 65¢
```

## License

MIT - Use at your own risk
