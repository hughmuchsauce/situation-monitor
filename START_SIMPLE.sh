#!/bin/bash
#
# SIMPLE START - Minimal launcher with clear output
#

clear
echo "================================================"
echo " 🐋 KALSHI WHALE TRACKER - STARTING NOW"
echo "================================================"
echo ""
echo "Tracks ALL high-volume markets for whale trades ($2M+)"
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
echo "Checking for whale tracking code..."
if grep -q "whale activity" bot/index.ts; then
    echo "✅ Whale tracker code is present"
else
    echo "❌ ERROR: Whale tracking code missing!"
    echo "Run: git pull origin claude/kalshi-follower-bot-MoXkd"
    exit 1
fi
echo ""

# Setup credentials
if [ ! -f ".env" ]; then
    echo "Setting up Kalshi API credentials..."
    cat > .env << 'EOF'
KALSHI_API_KEY=625dd679-7481-4c6b-9e47-0749fd2ff723
KALSHI_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA2AKpzv35BYBBJfLaOEaIeJdUsiAFQkKLzL3WkTJ6D281AklJ
v+3OWWoRXfmCuJsr7XK1eQapseQeevWhmBSYcYqwcZMJfMs9tdxXKEtIK3ag6ZzI
vAwZXi6zjYrjShP6TZo32HGtGylSZYC7MWCghagvQtbGpAgcZu6zpUTlYq1Kyat4
38oqHaMeHcJKGsIyL2Rvb3OS7WKFJwBiskUbxffwobRM+Dn0Ni3+oaHY36Zt3zrt
5YksGdBVpELof+hddft0GMghFwceOgbDmKObthC1nF586QV0bMRMfUzYjkceNVD/
t7/26FERTpe57UAdY5aDPLejX/IEFYbKznoadwIDAQABAoIBACzgdMXntsYhTKel
Khf5811WV0bAZ0dKSwAIypyUx44QVQt6DWPd9HpYEm6bKUDQIBKvO6t+ql+mXHzA
LkfJs5gXL6wQ165BDTuMoODirwY0mZ6fL4b93oFWI4B7A9h+iQh5SzPg/g1ACvnC
gmFySTcrZ1I0C8XFV5085z6lLyDOLQ3HMkSabjeIg8cMB6xXEu618RujL0PLfZii
4JhXRn5qJQpU4AMH9rxhUDVJScOrvC60wLK+FFsC1DdHOYYOE23ZMVpTuzSA87Pt
KUlp7RmXeEAXf/LR28JCLkRC9DsXrFjLXCnYvyPBxnu5AV2W88FU6gAksTsvfh+H
9eB5Ba0CgYEA9BEuF8XepUNrMJyNB22Meg6IAqHueUkVQu7agMxekd5PHh6Ph/re
gLZmOIVaZLSYVQ08L05cNXw/Vu+FLBTjE32Xv0hl6pJ9AA+8N1FMtVTIUCqKvvHl
nmLI/fls01PH5jyEZgjy9uyPajaILrW2cXU/uWaxIG1V0K+A2X0v4AsCgYEA4pJR
GXgRWidNf1BYUn3aI3Rt6OBaqACWTCdi60kcvSV/OTgdjWv9P2RdsNWCEYFDQNUP
oW22N4JdnSsJItslJj9pgMKQAT84/gZ5yyuXy4yQXUFSiIOsdwU3aqJ/4qtbvX7f
hBqAOzDwlm9z/gyKcgZMkpgps7aW8v3SBbp9VsUCgYEAoSg+8T+cdi+ANccJcGAr
o+S4dlSKbNePDHU/HlDUGSlbwJ2ZVMaX6RGHica0G08MTwzAMtRhGogCItthaewY
zKPfcVTSxwMXOtUpCLXMGufypMySdOaxIdZEtT7fVuM5WZOYMO+zzswBHrcHUSB3
aY9sFnXye2D2iyd3wyRgWmUCgYBVE74yQxy47qMyGFhh+XIM+C5BUOWZykalp/CE
CzsoZ0kjkke+j/tTb3ui6DlkG1bGpHqvEkRnCaPfXYabuRB1EUCroeNzJGthL8tS
GDdyroCTE/FK467CLopFl2lQEypquJZzw4O9Nj5RLt6uWcUu1eCw90RJgFmkOt0/
W2yvRQKBgBpw9D/Ohx9Uk8ns+8Ba6mycMj+lNRpl9Xcvv/dku6YxVwlpZJxQAGiJ
wLW7oU2nusxnhWFHoIywj12Njm+LXGbf2qI/SoT/DuIGpFEQO/b/BzRXFUjV3ITl
LVgCxMwz/Bq84CQdK718Dv6xSSSSKfenzHpt1aJ5zhU6YG9z4LuI
-----END RSA PRIVATE KEY-----
EOF
    echo "✅ Credentials configured"
    echo ""
fi

# Install deps if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first time only)..."
    npm install
    echo "✅ Done"
    echo ""
fi

echo "================================================"
echo " STARTING WHALE TRACKER + DASHBOARD"
echo "================================================"
echo ""
echo "Dashboard will be at: http://localhost:5173/bot"
echo "Opening browser in 10 seconds..."
echo ""
echo "What you should see in bot output:"
echo "  - '🤖 Kalshi Follower Bot initialized'"
echo "  - '🐋 Whale threshold: \$2.0M'"
echo "  - '📊 Found 1000 total markets'"
echo "  - '🎯 Analyzing top 50 high-volume markets' ← KEY!"
echo "  - '🐋 WHALE DETECTED' (when whales found)"
echo ""
echo "Whale = Any trade ≥ \$2M in actual dollars"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Open browser
(sleep 10 && open http://localhost:5173/bot) &

# Start bot + dashboard
npm run bot:dev
