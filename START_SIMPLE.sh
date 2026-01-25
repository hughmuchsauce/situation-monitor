#!/bin/bash
#
# SIMPLE START - Minimal launcher with clear output
#

clear
echo "================================================"
echo " 🚀 KALSHI BOT - STARTING NOW"
echo "================================================"
echo ""
echo "This is the NEW version with fallback code."
echo "If you see this message, you're running the latest code."
echo ""

# Kill old processes
echo "Stopping any old processes..."
pkill -f "tsx bot/index.ts" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2
echo "✅ Done"
echo ""

# Check code
echo "Checking for fallback code..."
if grep -q "using top volume markets" bot/index.ts; then
    echo "✅ Fallback code is present"
else
    echo "❌ ERROR: Fallback code missing!"
    echo "Run: git pull origin claude/kalshi-follower-bot-MoXkd"
    exit 1
fi
echo ""

# Install deps if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first time only)..."
    npm install
    echo "✅ Done"
    echo ""
fi

echo "================================================"
echo " STARTING BOT + DASHBOARD"
echo "================================================"
echo ""
echo "Dashboard will be at: http://localhost:5173/bot"
echo "Opening browser in 10 seconds..."
echo ""
echo "What you should see in bot output:"
echo "  - 'Found 1000 total markets'"
echo "  - '→ 0 weather/climate markets'"
echo "  - '⚠️  No weather/climate markets - using top volume markets' ← KEY!"
echo "  - '→ Analyzing 20 high-volume markets' ← KEY!"
echo ""
echo "If you DON'T see those lines, press Ctrl+C and run DIAGNOSE.sh"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Open browser
(sleep 10 && open http://localhost:5173/bot) &

# Start bot + dashboard
npm run bot:dev
