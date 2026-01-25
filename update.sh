#!/bin/bash
#
# Update and restart script
# Run this to get the latest code and restart everything
#

echo "🔄 Updating Kalshi Whale Tracker..."
echo ""

# Stop any running processes
echo "⏹️  Stopping old processes..."
pkill -f "tsx bot/index.ts" 2>/dev/null || true
pkill -f "vite dev" 2>/dev/null || true
pkill -f "concurrently" 2>/dev/null || true
sleep 2

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin claude/kalshi-follower-bot-MoXkd

# Install any new dependencies
echo "📦 Checking dependencies..."
npm install --silent

echo ""
echo "✅ Update complete!"
echo ""
echo "🚀 Starting bot + dashboard..."
echo "   Bot: Will analyze markets and detect whale signals"
echo "   Dashboard: http://localhost:5173/bot"
echo ""
echo "   (Press Ctrl+C to stop)"
echo ""

# Open dashboard after 5 seconds
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 5 && open http://localhost:5173/bot) &
fi

# Start everything
npm run bot:dev
