# 🤖 Kalshi Weather Bot - START HERE

## One-Command Setup

Copy and paste this into your Mac Terminal:

```bash
cd ~/Downloads && git clone https://github.com/hughmuchsauce/situation-monitor.git && cd situation-monitor && git checkout claude/kalshi-follower-bot-MoXkd && chmod +x install.sh && ./install.sh
```

That's it! The bot will:
1. ✅ Install all dependencies automatically
2. ✅ Connect to Kalshi with your credentials (already configured)
3. ✅ Start monitoring weather/climate markets
4. ✅ Show you profitable trading signals in real-time

## What You'll See

```
🤖 Kalshi Follower Bot initialized
📊 Mode: DEMO (no real trades)
📈 Target categories: weather, climate

[2026-01-25] 🔍 Scanning markets...
   🎯 Found 2 trading signal(s):

   📊 SIGNAL: Will NYC hit 70°F tomorrow?
      Side: YES @ 67¢
      Confidence: 82%
      💡 DEMO: Would buy 18 contracts
```

## Your Credentials (Pre-Configured)

✅ API Key: `625dd679-7481-4c6b-9e47-0749fd2ff723`
✅ Demo Mode: Enabled (safe - no real trades)

## Commands

- **Run bot + dashboard**: `npm run bot:dev` (Recommended!)
- **Dashboard URL**: http://localhost:5173/bot
- **Stop the bot**: Press `Ctrl+C`
- **Check positions**: `npm run bot:positions`
- **Test connection**: `npm run bot:test`

## 🐋 Whale Tracker Dashboard

View whale activity in a beautiful web interface!

```bash
npm run bot:dev
```

Then open: **http://localhost:5173/bot**

Features:
- 📊 Real-time signal tracking
- 📈 24-hour activity charts
- 🏆 Top markets by whale activity
- 🔴 Live status indicator

See `DASHBOARD.md` for full details.

## Enable Real Trading

**⚠️ WARNING: This uses real money!**

1. Edit `.env`: Change `BOT_DEMO_MODE=true` to `BOT_DEMO_MODE=false`
2. Run: `npm run bot`

## Need Help?

- **Full guide**: `KALSHI_BOT.md`
- **Quick start**: `bot/QUICK_START.md`
- **Technical docs**: `bot/README.md`

---

**Ready?** Just run that one command above! 🚀
