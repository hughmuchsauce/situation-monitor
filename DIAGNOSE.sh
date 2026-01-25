#!/bin/bash
#
# DIAGNOSTIC - Check what's actually running
#

echo "🔍 DIAGNOSTIC REPORT"
echo "===================="
echo ""

echo "1️⃣ Current Directory:"
pwd
echo ""

echo "2️⃣ Git Branch:"
git branch --show-current 2>/dev/null || echo "Not in git repo"
echo ""

echo "3️⃣ Latest Commit:"
git log --oneline -1 2>/dev/null || echo "No git history"
echo ""

echo "4️⃣ Fallback Code Check:"
if [ -f "bot/index.ts" ]; then
    if grep -q "using top volume markets" bot/index.ts; then
        echo "✅ Fallback code FOUND"
    else
        echo "❌ Fallback code MISSING"
    fi
else
    echo "❌ bot/index.ts not found"
fi
echo ""

echo "5️⃣ Running Processes:"
ps aux | grep -E "(tsx|vite|node.*bot)" | grep -v grep || echo "No bot/vite processes running"
echo ""

echo "6️⃣ Ports in Use:"
echo "Port 3001 (API):"
lsof -i:3001 2>/dev/null || echo "Not in use"
echo "Port 5173 (Dashboard):"
lsof -i:5173 2>/dev/null || echo "Not in use"
echo ""

echo "7️⃣ Node/NPM:"
echo "Node: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "NPM: $(npm --version 2>/dev/null || echo 'NOT INSTALLED')"
echo ""

echo "8️⃣ Package.json bot:dev script:"
if [ -f "package.json" ]; then
    grep "bot:dev" package.json || echo "bot:dev script not found"
else
    echo "package.json not found"
fi
echo ""

echo "9️⃣ Credentials:"
if [ -f ".env" ]; then
    head -3 .env | grep -v "PRIVATE_KEY"
else
    echo ".env file not found"
fi
echo ""

echo "🔟 Recent bot output (if running):"
echo "(Check your terminal for [bot] and [web] prefixes)"
