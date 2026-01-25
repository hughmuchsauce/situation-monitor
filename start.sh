#!/bin/bash
#
# Quick launcher for bot + dashboard
# Just run: ./start.sh
#

cd "$(dirname "$0")"

echo "🚀 Starting Kalshi Whale Tracker..."
echo ""
echo "   Bot + API: Starting..."
echo "   Dashboard: http://localhost:5173/bot"
echo ""
echo "   Opening dashboard in 5 seconds..."
echo "   (Press Ctrl+C to stop everything)"
echo ""

# Kill any existing processes
pkill -f "tsx bot/index.ts" 2>/dev/null || true
pkill -f "vite dev" 2>/dev/null || true

sleep 1

# Open browser after 5 seconds
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 5 && open http://localhost:5173/bot) &
fi

# Start bot + dashboard
npm run bot:dev
