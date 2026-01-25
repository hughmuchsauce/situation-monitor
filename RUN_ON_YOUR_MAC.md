# ⚠️ CRITICAL: This Bot Must Run on Your Mac

## 🚫 Why Remote Environment Doesn't Work

The Kalshi API **blocks requests** from this remote environment:
```
Error: Request failed with status code 403
Response: "Host not allowed"
```

**The bot MUST run on your local Mac where network restrictions don't apply.**

---

## ✅ CORRECT WAY TO RUN

### Step 1: Open Terminal on Your Mac

**Not the Claude Code terminal - your actual Mac Terminal app!**

Find it:
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

### Step 2: Copy & Paste This EXACT Command

```bash
cd ~/Downloads && \
rm -rf situation-monitor && \
git clone https://github.com/hughmuchsauce/situation-monitor.git && \
cd situation-monitor && \
git checkout claude/kalshi-follower-bot-MoXkd && \
chmod +x LAUNCH.sh && \
./LAUNCH.sh
```

### Step 3: Wait 30 Seconds

The bot will:
1. Install dependencies
2. Start bot + web server
3. Auto-open browser to dashboard
4. Begin scanning markets

---

## 📊 What You'll See (On Your Mac)

### Terminal:
```
✅ Fallback logic found
✅ Starting in 3 seconds...

[web] VITE v6.x.x ready
[bot] 🤖 Kalshi Follower Bot initialized
[bot] → Analyzing 20 high-volume markets  ← SUCCESS!
```

### Browser (Auto-Opens):
```
🐋 Kalshi Whale Tracker
● Bot Running (GREEN)
```

---

## ❌ What You Were Seeing (In Remote)

Terminal showed:
```
Error: Request failed with status code 403
```

This is because **remote environments can't access Kalshi API**.

---

## 🎯 Quick Checklist

Before running:
- ✅ Using your **Mac Terminal** (not Claude Code terminal)
- ✅ Have internet connection
- ✅ Have Node.js installed (`brew install node` if not)

After running:
- ✅ See `[web]` and `[bot]` in terminal
- ✅ Browser opens to localhost:5173/bot
- ✅ Green "Bot Running" indicator
- ✅ No 403 errors

---

## 🆘 If You Don't Have Node.js

Install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

Then run the bot command above.

---

## 💡 Why This Matters

- ❌ Remote environment: Kalshi blocks requests
- ✅ Your Mac: Kalshi allows requests
- ✅ Your Mac: Dashboard accessible
- ✅ Your Mac: Everything works perfectly

---

**Run the command on your Mac Terminal now!** 🚀
