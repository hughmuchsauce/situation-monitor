#!/bin/bash
#
# Kalshi Bot - Local Setup Script for Mac
# Run this on your Mac to set up and run the bot
#

set -e

echo "🤖 Kalshi Follower Bot - Local Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the situation-monitor directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "${YELLOW}⚠️  No .env file found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "${YELLOW}⚠️  Please edit .env and add your Kalshi API credentials:${NC}"
    echo "   1. Visit: https://kalshi.com/settings/api"
    echo "   2. Generate API key + private key"
    echo "   3. Edit .env and paste them in"
    echo ""
    echo "Then run this script again!"
    exit 0
fi

# Test connection
echo ""
echo "🔌 Testing Kalshi API connection..."
npm run bot:test

if [ $? -eq 0 ]; then
    echo ""
    echo "${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo "To run the bot:"
    echo "  ${GREEN}npm run bot${NC}          # Demo mode (no real trades)"
    echo "  ${GREEN}npm run bot:positions${NC} # Check positions"
    echo ""
    echo "To enable live trading:"
    echo "  1. Edit .env and set: BOT_DEMO_MODE=false"
    echo "  2. Run: npm run bot"
    echo ""
else
    echo ""
    echo "${YELLOW}⚠️  Connection test failed${NC}"
    echo "Please check your API credentials in .env"
fi
