# 🎯 LAUNCH PLAN - DO NOT STOP UNTIL WORKING

## Current Issues
1. ❌ Bot shows "0 weather/climate markets" with no fallback (old code)
2. ❌ Dashboard shows "localhost refused to connect" (dev server not running)
3. ❌ Running old code from before fallback was added

## Resolution Steps

### Step 1: Verify Code is Correct ✅
- Check fallback logic exists in bot/index.ts
- Check expanded filters in bot/market-analyzer.ts
- Check npm run bot:dev command exists

### Step 2: Create Foolproof Launcher
- Kill all old processes
- Pull latest code
- Install dependencies
- Start both bot AND dev server
- Auto-open browser

### Step 3: Test Locally
- Verify bot starts
- Verify dev server starts
- Verify browser opens
- Verify data flows

### Step 4: Document Success Criteria
- Bot shows "using top volume markets" OR finds weather markets
- Dashboard loads at localhost:5173/bot
- Green "Bot Running" indicator
- Signals appear within 60 seconds

## Commands to Run (In Order)

```bash
# 1. Navigate to project
cd ~/Downloads/situation-monitor

# 2. Pull latest code
git pull origin claude/kalshi-follower-bot-MoXkd

# 3. Clean install
rm -rf node_modules package-lock.json
npm install

# 4. Launch everything
npm run bot:dev
```

## Success Indicators

Terminal should show:
```
[web] VITE v6.x.x ready in X ms
[web] ➜ Local: http://localhost:5173/
[bot] 🤖 Kalshi Follower Bot initialized
[bot] 📊 Dashboard available at: http://localhost:5173/bot
[bot] → Analyzing 20 high-volume markets
```

Browser should show:
- URL: http://localhost:5173/bot
- Green "Bot Running" indicator
- Summary cards with numbers
- Empty or populated signal feed

## Troubleshooting

If still broken:
1. Check git log shows commit b3f41c1 or later
2. Check grep "using top volume markets" bot/index.ts returns match
3. Check npm run bot:dev runs TWO processes (web + bot)
4. Check no errors in terminal output
