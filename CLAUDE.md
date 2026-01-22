# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Greenland Monitor** - A real-time dashboard focused on Greenland geopolitics, featuring:
- Interactive Arctic map with Greenland hotspots
- Live prediction market odds from Polymarket and Kalshi
- (Coming soon) Live news feed

**Live URL**: https://greenland-monitor.vercel.app

## Current Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│                    GREENLAND MONITOR                │
├───────────────────────────┬─────────────────────────┤
│                           │                         │
│      Arctic Map           │    Live Feed            │
│   (Greenland focus)       │    (Coming Soon)        │
│                           │                         │
├───────────────────────────┴─────────────────────────┤
│              Prediction Markets                      │
│         (Polymarket + Kalshi odds)                  │
└─────────────────────────────────────────────────────┘
```

## Build & Development Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build to /build directory
npm run preview      # Preview production build (localhost:4173)
npm run check        # TypeScript type checking
npm run format       # Auto-format with Prettier
npm run lint         # ESLint + Prettier check
```

## Technology Stack

- **SvelteKit 2.0** with Svelte 5 reactivity (`$state`, `$derived`, `$effect` runes)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** with custom dark theme
- **D3.js** for interactive map visualization
- **Vercel** for deployment

## Key Files

### Main Dashboard
- `src/routes/+page.svelte` - Main page layout (map + feed placeholder + betting odds)

### Components
- `src/lib/components/panels/MapPanel.svelte` - Arctic map with Greenland hotspots
- `src/lib/components/panels/BettingOddsPanel.svelte` - Polymarket/Kalshi predictions
- `src/lib/components/panels/LiveFeedPanel.svelte` - (Ready for integration)

### API
- `src/lib/api/misc.ts` - Polymarket CLOB API + Kalshi API integration

### Configuration
- `src/lib/config/map.ts` - Greenland hotspots and Arctic locations
- `src/lib/config/greenland.ts` - Centralized Greenland constants

## APIs Used

| API | Status | Purpose |
|-----|--------|---------|
| Polymarket CLOB | ✅ Active | Prediction market odds |
| Kalshi | ✅ Active | Prediction market odds |
| D3/TopoJSON | ✅ Active | Map rendering |

## Path Aliases

```typescript
$lib        → src/lib
$components → src/lib/components
$stores     → src/lib/stores
$config     → src/lib/config
```

## Deployment

- **Platform**: Vercel (auto-deploys on push to main)
- **URL**: https://greenland-monitor.vercel.app
- **Repo**: https://github.com/hughmuchsauce/situation-monitor

## Next Steps

1. Implement live news feed (right panel)
2. Add more Greenland-specific prediction markets
3. Real-time updates via WebSocket or polling
