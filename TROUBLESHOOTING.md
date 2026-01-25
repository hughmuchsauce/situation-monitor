# 🔧 Troubleshooting Guide

## Problem: "0 weather/climate markets" + "No target markets found"

### Diagnosis
You're running **old code** from before I added the fallback logic.

### Solution

**In your Mac terminal, run:**

```bash
cd ~/Downloads/situation-monitor
./update.sh
```

This will:
1. ✅ Stop old processes
2. ✅ Pull latest code (with fallback)
3. ✅ Restart bot + dashboard
4. ✅ Auto-open browser

---

## Problem: "localhost refused to connect"

### Diagnosis
The Vite dev server (web dashboard) isn't running.

### Solution

The dev server needs to start WITH the bot. Use:

```bash
npm run bot:dev
```

NOT just `npm run bot` (that only runs bot, no dashboard)

---

## Quick Fix (Copy/Paste This)

**Stop everything and start fresh:**

```bash
# Kill old processes
pkill -f "tsx" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "concurrently" 2>/dev/null

# Go to project
cd ~/Downloads/situation-monitor

# Pull latest code
git pull origin claude/kalshi-follower-bot-MoXkd

# Start everything
npm run bot:dev
```

Then open: **http://localhost:5173/bot**

---

## What Should Happen

### Terminal Output (NEW, with fallback):
```
[2026-01-25] 🔍 Scanning markets...
   Found 1000 total markets
   → 0 weather/climate markets
   ⚠️  No weather/climate markets - using top volume markets  ← NEW!
   → Analyzing 20 high-volume markets                         ← NEW!

   🎯 Found 2 trading signal(s):
   📊 SIGNAL: ...
```

### Terminal Output (OLD, no fallback):
```
[2026-01-25] 🔍 Scanning markets...
   Found 1000 total markets
   → 0 weather/climate markets
   ⚠️  No target markets found    ← OLD! You're seeing this
```

---

## Verification Steps

### 1. Check you have latest code:
```bash
cd ~/Downloads/situation-monitor
git log --oneline -1
```

Should show: `ffdaf05 Add quick launcher script...`

### 2. Check bot is using new code:
```bash
grep "using top volume markets" ~/Downloads/situation-monitor/bot/index.ts
```

Should return a match.

### 3. Check both processes are running:
```bash
ps aux | grep -E "(tsx|vite)" | grep -v grep
```

Should show TWO processes:
- `tsx bot/index.ts`
- `vite dev`

---

## Common Issues

### Issue: "command not found: npm"
**Solution**: Install Node.js
```bash
brew install node
```

### Issue: "port 3001 already in use"
**Solution**: Kill process on that port
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Issue: Dashboard loads but shows "Bot Offline"
**Solution**: Bot crashed or not started. Check terminal for errors.

### Issue: Git says "Already up to date" but still seeing old behavior
**Solution**: You have cached node_modules or running old process
```bash
# Kill processes
pkill -f tsx
pkill -f vite

# Clean and reinstall
rm -rf node_modules
npm install

# Start fresh
npm run bot:dev
```

---

## Still Not Working?

### Debug Checklist:

1. **Are you in the right directory?**
   ```bash
   pwd
   # Should show: /Users/YourName/Downloads/situation-monitor
   ```

2. **Do you have the latest code?**
   ```bash
   git log --oneline -3
   # Should show commits from today
   ```

3. **Are credentials set?**
   ```bash
   cat .env | grep KALSHI_API_KEY
   # Should show your API key
   ```

4. **Can you connect to Kalshi?**
   ```bash
   npm run bot:test
   ```

5. **Are ports available?**
   ```bash
   lsof -i:3001  # API server
   lsof -i:5173  # Web dashboard
   # Should be empty or show your processes
   ```

---

## Emergency Reset

If nothing works, start completely fresh:

```bash
# Remove old directory
cd ~/Downloads
rm -rf situation-monitor

# Clone fresh
git clone https://github.com/hughmuchsauce/situation-monitor.git
cd situation-monitor
git checkout claude/kalshi-follower-bot-MoXkd

# Install
npm install

# Run
npm run bot:dev
```

---

## Get Help

If you're still stuck, run this diagnostic:

```bash
cd ~/Downloads/situation-monitor

echo "=== System Info ==="
node --version
npm --version

echo "=== Git Status ==="
git status
git log --oneline -1

echo "=== Running Processes ==="
ps aux | grep -E "(tsx|vite|node)" | grep -v grep

echo "=== Ports ==="
lsof -i:3001
lsof -i:5173

echo "=== Dependencies ==="
npm list --depth=0 | head -20

echo "=== Credentials ==="
cat .env | grep -v "PRIVATE_KEY"
```

Send me that output and I'll diagnose it!
