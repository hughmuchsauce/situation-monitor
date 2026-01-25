#!/bin/bash
#
# Kalshi Bot - Automated One-Command Installer
# This script does EVERYTHING for you
#

set -e

echo "🤖 Kalshi Follower Bot - Automated Setup"
echo "========================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Installing Node.js..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        echo "Installing Node.js via Homebrew..."
        brew install node
    else
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
fi

# Set up credentials
echo "🔑 Configuring Kalshi API credentials..."
if [ -f ".env.kalshi" ]; then
    cp .env.kalshi .env
    echo "   ✅ Credentials configured"
else
    echo "   ⚠️  .env.kalshi not found, using .env.example"
    cp .env.example .env
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting bot + dashboard..."
echo "   Bot: Running in DEMO mode (no real trades)"
echo "   Dashboard: http://localhost:5173/bot"
echo ""
echo "   (Press Ctrl+C to stop)"
echo ""
sleep 2

# Open dashboard in browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening dashboard in browser..."
    sleep 3 && open http://localhost:5173/bot &
fi

# Run bot + dev server
npm run bot:dev
