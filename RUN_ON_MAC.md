# Run Kalshi Bot on Your Mac

The bot is ready to go! Your Kalshi API credentials are already configured. Follow these steps to run it on your Mac:

## Quick Start (3 Steps)

### 1. Clone the Repository

Open Terminal on your Mac and run:

```bash
cd ~/Downloads
git clone https://github.com/hughmuchsauce/situation-monitor.git
cd situation-monitor
git checkout claude/kalshi-follower-bot-MoXkd
```

### 2. Run the Setup Script

```bash
chmod +x SETUP_LOCAL.sh
./SETUP_LOCAL.sh
```

This will:
- Install all dependencies
- Copy your API credentials
- Test the connection to Kalshi

### 3. Launch the Bot

```bash
npm run bot
```

The bot will start in **DEMO MODE** - it scans markets and detects signals but doesn't place real trades.

## What You'll See

```
🤖 Kalshi Follower Bot initialized
📊 Mode: DEMO (no real trades)
⏱️  Poll interval: 30s
📈 Target categories: weather, climate

🚀 Starting bot...

[2026-01-25T10:30:15Z] 🔍 Scanning markets...
   Found 23 weather/climate markets

   🎯 Found 2 trading signal(s):

   📊 SIGNAL: Will NYC hit 70°F tomorrow?
      Ticker: KXHIGHNY-26JAN25-B70
      Side: YES
      Confidence: 82%
      Suggested: 18 contracts @ 67¢
      Reason: Volume spike: +52.3% with 82% YES flow
      💡 DEMO: Would buy 18 yes @ 67¢
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run bot` | Run in demo mode (safe, no real trades) |
| `npm run bot:test` | Test API connection |
| `npm run bot:positions` | Check your current positions |

## Enable Live Trading (⚠️ Use with Caution)

To enable **real trades**:

1. Edit `.env` and change:
   ```
   BOT_DEMO_MODE=false
   ```

2. Run the bot:
   ```bash
   npm run bot
   ```

**⚠️ WARNING**: This will place real trades with real money!

## Your API Credentials

Your credentials are already configured in the `.env` file:

- **API Key**: `625dd679-7481-4c6b-9e47-0749fd2ff723`
- **Private Key**: (RSA key configured)

You can regenerate them anytime at: https://kalshi.com/settings/api

## Configuration

Edit `bot/config.ts` to adjust:

- Position limits (default: 100 contracts max)
- Daily trade limits (default: 20 trades/day)
- Signal thresholds (volume spikes, directional flow, etc.)
- Poll interval (default: 30 seconds)

## Documentation

- **KALSHI_BOT.md** - Complete guide with strategies
- **bot/README.md** - Technical documentation
- **bot/QUICK_START.md** - Quick reference

## Need Help?

Check the troubleshooting section in `KALSHI_BOT.md` or review the code in `bot/` directory.

---

**Ready?** Run `./SETUP_LOCAL.sh` to get started! 🚀
