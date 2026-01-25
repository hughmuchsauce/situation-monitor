#!/bin/bash
#
# Local test script - verifies bot can start
#

echo "🧪 Testing bot startup..."

# Set timeout
timeout 10s tsx bot/index.ts &
BOT_PID=$!

# Wait a bit
sleep 5

# Check if process is still running
if ps -p $BOT_PID > /dev/null 2>&1; then
    echo "✅ Bot started successfully"
    kill $BOT_PID 2>/dev/null
    exit 0
else
    echo "❌ Bot failed to start"
    exit 1
fi
