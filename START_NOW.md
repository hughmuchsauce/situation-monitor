# 🚀 START NOW - Complete Launch Instructions

## ⚡ One-Command Launch (Recommended)

**On your Mac, open Terminal and run:**

```bash
cd ~/Downloads/situation-monitor && ./LAUNCH.sh
```

This script will:
1. ✅ Check you're in the right directory
2. ✅ Kill any old processes
3. ✅ Pull latest code
4. ✅ Verify fallback logic exists
5. ✅ Install/check dependencies
6. ✅ Verify credentials
7. ✅ Clear ports 3001 and 5173
8. ✅ Start bot + dev server
9. ✅ Auto-open browser (Mac only)

---

## 📋 What You'll See

### Terminal Output (Success):
```
🚀 Kalshi Whale Tracker - Ultimate Launcher
===========================================

📁 Step 1: Checking project directory...
✅ In correct directory

🛑 Step 2: Stopping old processes...
✅ Old processes stopped

📥 Step 3: Checking for updates...
✅ Already up to date

🔍 Step 4: Verifying code...
✅ Fallback logic found

📦 Step 5: Checking dependencies...
✅ Dependencies already installed

🔧 Step 6: Verifying configuration...
✅ Configuration verified

🔑 Step 7: Checking credentials...
✅ Credentials configured

🎯 Step 8: Pre-flight checks...
✅ Ports clear

🚀 Step 9: Launching bot + dashboard...
   Bot API: http://localhost:3001
   Dashboard: http://localhost:5173/bot
   (Press Ctrl+C to stop)

[web] VITE v6.x.x ready in X ms
[web] ➜ Local: http://localhost:5173/
[bot] 🤖 Kalshi Follower Bot initialized
[bot] 📊 Mode: DEMO (no real trades)
[bot] 📊 Dashboard available at: http://localhost:5173/bot
[bot] [2026-01-25] 🔍 Scanning markets...
[bot]    Found 1000 total markets
[bot]    → 0 weather/climate markets
[bot]    ⚠️  No weather/climate markets - using top volume markets
[bot]    → Analyzing 20 high-volume markets
```

### Browser (http://localhost:5173/bot):
```
┌──────────────────────────────────────┐
│  🐋 Kalshi Whale Tracker             │
│             ● Bot Running  (GREEN)   │
├──────────────────────────────────────┤
│  [150]  [5]    [42]    [76%]        │
│  Total  1h     24h     Conf          │
├──────────────────────────────────────┤
│  [D3.js Chart]                       │
├──────────────────────────────────────┤
│  🏆 Top Markets                      │
│  #1 Market Name - 🔥 HOT            │
├──────────────────────────────────────┤
│  📊 Recent Whale Signals             │
│  (Updates every 5 seconds)           │
└──────────────────────────────────────┘
```

---

## 🔧 Alternative Methods

### Method 1: Update Script
```bash
cd ~/Downloads/situation-monitor
./update.sh
```

### Method 2: Manual Steps
```bash
cd ~/Downloads/situation-monitor
git pull origin claude/kalshi-follower-bot-MoXkd
npm install
npm run bot:dev
```

Then open: http://localhost:5173/bot

### Method 3: Start Script
```bash
cd ~/Downloads/situation-monitor
./start.sh
```

---

## ✅ Success Criteria

You'll know it's working when you see ALL of these:

1. **Terminal shows TWO processes running:**
   - `[web]` - Vite dev server
   - `[bot]` - Kalshi bot

2. **Bot shows fallback message:**
   - `"using top volume markets"` OR
   - `"X weather/climate markets"` (if any exist)

3. **Browser loads dashboard:**
   - URL: http://localhost:5173/bot
   - Green "Bot Running" indicator
   - Summary cards show numbers

4. **No errors in terminal:**
   - No red error messages
   - No crashes or exits

---

## ❌ Troubleshooting

### Error: "Not in project directory"
```bash
cd ~/Downloads/situation-monitor
./LAUNCH.sh
```

### Error: "Fallback logic missing"
```bash
cd ~/Downloads/situation-monitor
git reset --hard origin/claude/kalshi-follower-bot-MoXkd
./LAUNCH.sh
```

### Error: "Port already in use"
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
./LAUNCH.sh
```

### Error: "npm: command not found"
```bash
brew install node
./LAUNCH.sh
```

### Browser shows "Bot Offline"
- Check terminal for errors
- Make sure you see `[bot]` prefix in terminal
- Wait 30 seconds for first scan

### Still not working?
```bash
cd ~/Downloads/situation-monitor
rm -rf node_modules package-lock.json
npm install
./LAUNCH.sh
```

---

## 🎯 Quick Verification

Run these to verify everything is ready:

```bash
cd ~/Downloads/situation-monitor

# Check code
git log --oneline -1
# Should show: b3f41c1 or later

# Check fallback exists
grep "using top volume markets" bot/index.ts
# Should return a match

# Check npm script
grep "bot:dev" package.json
# Should show concurrently command

# Check credentials
head -3 .env
# Should show real API key (not demo_key_placeholder)
```

---

## 📊 Expected Timeline

- **0:00** - Run `./LAUNCH.sh`
- **0:05** - Dependencies check complete
- **0:10** - Bot + dev server starting
- **0:15** - Browser opens
- **0:30** - First market scan complete
- **1:00** - First signals may appear

---

## 🎉 Success!

When working, you should see:

1. ✅ Terminal shows `[web]` and `[bot]` processes
2. ✅ Bot scans markets every 30 seconds
3. ✅ Dashboard updates every 5 seconds
4. ✅ Signals appear in feed
5. ✅ Charts render when you have 2+ data points

---

## 📝 Notes

- **Demo Mode**: Bot will NOT place real trades (BOT_DEMO_MODE=true)
- **Auto-Refresh**: Dashboard updates every 5 seconds automatically
- **Data Retention**: Keeps last 1000 signals in memory
- **API Server**: Runs on port 3001 (localhost only)
- **Web Dashboard**: Runs on port 5173

---

## 🆘 Emergency Reset

If nothing works, completely start over:

```bash
cd ~/Downloads
rm -rf situation-monitor

git clone https://github.com/hughmuchsauce/situation-monitor.git
cd situation-monitor
git checkout claude/kalshi-follower-bot-MoXkd

./LAUNCH.sh
```

---

**Ready?** Run `./LAUNCH.sh` now! 🚀
