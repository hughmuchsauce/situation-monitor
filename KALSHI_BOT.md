# Kalshi Weather/Climate Betting Bot

**A sophisticated trading bot that follows profitable patterns in Kalshi weather and climate prediction markets.**

## 🎯 What This Bot Does

This bot monitors Kalshi's weather and climate markets in real-time and automatically detects profitable trading patterns. Since individual trader identities aren't public on Kalshi, the bot uses **market microstructure analysis** to identify "smart money" flows:

### Detection Strategies

1. **Volume Spike Detection** 🚀
   - Monitors for sudden volume increases (30%+ by default)
   - Analyzes which side (YES/NO) is attracting the money
   - Places proportional trades following the dominant flow

2. **Directional Flow Analysis** 📊
   - Detects when 70%+ of trades flow to one side
   - Signals strong market conviction
   - Follows with scaled positions

3. **Large Trade Tracking** 🐋
   - Identifies significant trades (10+ contracts)
   - Assumes sophisticated trader activity
   - Mirrors at a conservative ratio (30% default)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Kalshi API Credentials

1. Create a Kalshi account at https://kalshi.com
2. Visit https://kalshi.com/settings/api
3. Generate an API key and save your private key securely (**shown only once!**)

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

Your `.env` should look like:
```bash
KALSHI_API_KEY=your_actual_api_key_here
KALSHI_PRIVATE_KEY=your_actual_private_key_here
BOT_DEMO_MODE=true
```

### 4. Test Connection

```bash
npm run bot:test
```

### 5. Run in Demo Mode (Recommended First)

```bash
npm run bot
```

This simulates trades without executing them. Monitor for a few hours to understand behavior.

### 6. Run Live (Real Trading)

⚠️ **Only after you're comfortable with the strategy!**

```bash
# Edit .env and set:
# BOT_DEMO_MODE=false

npm run bot
```

## 📊 Example Output

```
🤖 Kalshi Follower Bot initialized
📊 Mode: DEMO (no real trades)
⏱️  Poll interval: 30s
📈 Target categories: weather, climate

🚀 Starting bot...

[2026-01-24T10:30:15.000Z] 🔍 Scanning markets...
   Found 847 total markets
   → 23 weather/climate markets

   🎯 Found 2 trading signal(s):

   📊 SIGNAL: Will NYC hit 70°F on Jan 25?
      Ticker: KXHIGHNY-26JAN25-B70
      Side: YES
      Confidence: 82%
      Suggested: 18 contracts @ 67¢
      Reason: Volume spike: +52.3% with 82% YES flow
      💡 DEMO: Would buy 18 yes @ 67¢

   📊 SIGNAL: Chicago snowfall over 6 inches Jan 26-27
      Ticker: SNOWCHI-27JAN26-T6
      Side: NO
      Confidence: 73%
      Suggested: 12 contracts @ 42¢
      Reason: Strong NO flow: 73% of 47 contracts
      💡 DEMO: Would buy 12 no @ 42¢
```

## ⚙️ Configuration

Edit `bot/config.ts` to customize behavior:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `minVolume` | $1,000 | Minimum 24h volume to consider a market |
| `minTradeSize` | 10 | Contracts threshold for "large trade" |
| `volumeSpikeTreshold` | 30% | Volume increase % to trigger signal |
| `followRatio` | 0.3 | What % of detected trade to copy |
| `maxPositionSize` | 100 | Max contracts per market |
| `maxDailyTrades` | 20 | Daily trade limit |
| `pollIntervalMs` | 30000 | Market check interval (30s) |

### Example: More Aggressive Settings

```typescript
export const defaultConfig: BotConfig = {
	// ... other config ...
	minVolume: 500,           // Lower threshold
	volumeSpikeTreshold: 20,  // More sensitive
	followRatio: 0.5,         // Copy 50% instead of 30%
	maxPositionSize: 200,     // Larger positions
};
```

## 📈 Check Your Positions

```bash
npm run bot:positions
```

Output:
```
📊 Current Positions:

   KXHIGHNY-26JAN25-B70: 18 contracts
      P&L: +$3.24

   SNOWCHI-27JAN26-T6: 12 contracts
      P&L: -$0.48
```

## 🛡️ Risk Management

### Built-in Protections

- ✅ **Daily Trade Limit**: Prevents overtrading (20 trades/day default)
- ✅ **Position Size Caps**: Max 100 contracts per market
- ✅ **Follow Ratio**: Only copies 30% of detected trades
- ✅ **Demo Mode**: Test risk-free before going live

### Recommended Practices

1. **Start with Demo Mode**: Run for 24-48 hours to understand patterns
2. **Small Positions**: Keep `maxPositionSize` at 10-50 for first week
3. **Monitor Actively**: Check positions 2-3x per day initially
4. **Set Stop Losses**: Manually close losing positions at -20%
5. **Diversify**: Don't put all capital into one market type

## ⚠️ Important Warnings

### No Guaranteed Profits
- Past patterns ≠ future results
- Markets can be irrational longer than you can stay solvent
- Weather is inherently unpredictable

### Market Dynamics
- **Slippage**: Your order may fill worse than detected trades
- **Market Impact**: Following trades can move prices against you
- **Information Lag**: Signals are reactive, not predictive

### Technical Risks
- **API Rate Limits**: Bot includes delays but still monitor usage
- **Network Issues**: Interruptions can cause missed opportunities
- **Exchange Hours**: Kalshi has trading hours (check their schedule)

## 🔧 Troubleshooting

### "No signals detected"

Weather markets often have low activity. Try:
- Reducing `minVolume` to 500
- Lowering `volumeSpikeTreshold` to 20%
- Waiting for peak trading hours (weekday afternoons EST)

### "Orders failing"

Check:
- Account has sufficient balance
- Prices haven't moved significantly
- Not hitting daily trade limits
- API credentials are valid

### "403 Forbidden" errors

- Verify API key at https://kalshi.com/settings/api
- Ensure private key matches the API key
- Check if key has been revoked

## 📚 How It Works (Technical)

### Market Scanning
1. Fetches all open markets every 30s
2. Filters for weather/climate keywords
3. Gets recent trades (last hour) for each target market

### Signal Generation
For each market:
1. Compare current volume to previous snapshot
2. Analyze directional flow (YES vs NO trades)
3. Identify large individual trades
4. Generate confidence score (0-100%)
5. Calculate suggested position size

### Trade Execution
If signal confidence > threshold:
1. Check daily trade limit
2. Verify position size within bounds
3. Place limit order at current market price
4. Log execution for monitoring

## 🔬 Strategy Performance Notes

This bot implements a **momentum following** strategy based on:
- Market microstructure research
- Order flow analysis principles
- Heuristics from sophisticated traders

**Expected win rate**: 55-65% (theoretical, not guaranteed)
**Risk/reward**: Aims for 1.5:1 on average
**Best conditions**: High-volume weather events (storms, temperature records)

## 📖 Additional Resources

- [Kalshi API Docs](https://docs.kalshi.com)
- [Weather Markets on Kalshi](https://kalshi.com/category/weather)
- [Full Bot README](bot/README.md)

## 🤝 Support

**Issues?** Check:
1. This documentation
2. `bot/README.md` for detailed info
3. Kalshi Help Center: https://help.kalshi.com

**Want to modify?** The bot code is fully customizable:
- `bot/config.ts` - Configuration
- `bot/market-analyzer.ts` - Signal detection logic
- `bot/kalshi-client.ts` - API wrapper
- `bot/index.ts` - Main bot loop

## ⚖️ Disclaimer

This bot is provided for educational purposes. Trading prediction markets involves risk of loss. The authors are not responsible for financial losses. Trade at your own risk. Past performance does not guarantee future results.

---

**Ready to start?** Run `npm run bot` and watch the signals flow! 🚀
