#!/bin/bash
#
# ULTIMATE LAUNCHER - Fixes everything and launches bot + dashboard
# Run this: ./LAUNCH.sh
#

set -e

echo "🚀 Kalshi Whale Tracker - Ultimate Launcher"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 1. Navigate to project directory
echo "📁 Step 1: Checking project directory..."
if [ ! -f "package.json" ]; then
    print_error "Not in project directory!"
    echo "Run: cd ~/Downloads/situation-monitor"
    exit 1
fi
print_success "In correct directory"
echo ""

# 2. Kill old processes
echo "🛑 Step 2: Stopping old processes..."
pkill -f "tsx bot/index.ts" 2>/dev/null && print_info "Killed old bot" || print_info "No old bot running"
pkill -f "vite dev" 2>/dev/null && print_info "Killed old dev server" || print_info "No old dev server"
pkill -f "concurrently" 2>/dev/null && print_info "Killed concurrently" || print_info "No concurrently running"
sleep 2
print_success "Old processes stopped"
echo ""

# 3. Check git status
echo "📥 Step 3: Checking for updates..."
git fetch origin claude/kalshi-follower-bot-MoXkd 2>/dev/null || true
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo $LOCAL)

if [ $LOCAL != $REMOTE ]; then
    print_info "Updates available, pulling..."
    git pull origin claude/kalshi-follower-bot-MoXkd
    print_success "Code updated"
else
    print_success "Already up to date"
fi
echo ""

# 4. Verify fallback code exists
echo "🔍 Step 4: Verifying code..."
if grep -q "using top volume markets" bot/index.ts; then
    print_success "Fallback logic found"
else
    print_error "Fallback logic missing! Code may be corrupted."
    print_info "Try: git reset --hard origin/claude/kalshi-follower-bot-MoXkd"
    exit 1
fi
echo ""

# 5. Check dependencies
echo "📦 Step 5: Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    print_info "Installing dependencies..."
    npm install --silent
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi
echo ""

# 6. Verify npm scripts
echo "🔧 Step 6: Verifying configuration..."
if ! grep -q "bot:dev" package.json; then
    print_error "bot:dev script missing!"
    exit 1
fi
print_success "Configuration verified"
echo ""

# 7. Check environment
echo "🔑 Step 7: Checking credentials..."
if [ ! -f ".env" ]; then
    print_error ".env file missing!"
    print_info "Creating from .env.kalshi..."
    if [ -f ".env.kalshi" ]; then
        cp .env.kalshi .env
        print_success "Credentials configured"
    else
        print_error "No credentials found!"
        exit 1
    fi
else
    if grep -q "demo_key_placeholder" .env; then
        print_error "Using placeholder credentials!"
        print_info "Copying real credentials from .env.kalshi..."
        if [ -f ".env.kalshi" ]; then
            cp .env.kalshi .env
            print_success "Real credentials configured"
        fi
    else
        print_success "Credentials configured"
    fi
fi
echo ""

# 8. Final checks
echo "🎯 Step 8: Pre-flight checks..."
PORT_3001=$(lsof -ti:3001 2>/dev/null || echo "")
PORT_5173=$(lsof -ti:5173 2>/dev/null || echo "")

if [ ! -z "$PORT_3001" ]; then
    print_info "Port 3001 in use, clearing..."
    kill -9 $PORT_3001 2>/dev/null || true
fi

if [ ! -z "$PORT_5173" ]; then
    print_info "Port 5173 in use, clearing..."
    kill -9 $PORT_5173 2>/dev/null || true
fi

print_success "Ports clear"
echo ""

# 9. Launch!
echo "🚀 Step 9: Launching bot + dashboard..."
echo ""
echo "   Bot API: http://localhost:3001"
echo "   Dashboard: http://localhost:5173/bot"
echo ""
echo "   (Press Ctrl+C to stop)"
echo ""
print_success "Starting in 3 seconds..."
sleep 3

# Open browser on Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 5 && open http://localhost:5173/bot) &
    print_info "Will open browser in 5 seconds..."
fi

echo ""
echo "=========================================="
echo ""

# Run bot + dev server
npm run bot:dev
