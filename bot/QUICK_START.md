# Quick Start Guide

## 1. Install

```bash
npm install
```

## 2. Get API Keys

1. Sign up at https://kalshi.com
2. Go to https://kalshi.com/settings/api
3. Generate API key + private key

## 3. Configure

```bash
# Edit .env file
nano .env

# Add your keys:
KALSHI_API_KEY=your_key_here
KALSHI_PRIVATE_KEY=your_private_key_here
BOT_DEMO_MODE=true
```

## 4. Test

```bash
npm run bot:test
```

## 5. Run (Demo Mode)

```bash
npm run bot
```

Watch it scan markets and detect signals without placing real trades!

## 6. Go Live (Optional)

```bash
# Edit .env:
BOT_DEMO_MODE=false

# Run:
npm run bot
```

**⚠️ This will place real trades with real money!**

---

**Need help?** Read [KALSHI_BOT.md](../KALSHI_BOT.md) for full documentation.
