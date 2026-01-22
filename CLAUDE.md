# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Greenland Monitor** - A real-time dashboard focused on Greenland geopolitics, featuring:
- Interactive Arctic map centered on Greenland with hotspots
- Live news feed from GDELT (Greenland-filtered)
- Live prediction market odds from Polymarket and Kalshi (Greenland-only)

**Live URL**: https://greenland-monitor.vercel.app

## Current Dashboard Layout

```
+----------------------------------------------------------+
|                    GREENLAND MONITOR                      |
+----------------------------+-----------------------------+
|                            |                             |
|     Arctic Map             |       Live Feed             |
|  (Orthographic view        |    (GDELT news +            |
|   centered on Greenland)   |     X posts placeholder)    |
|                            |                             |
+----------------------------+-----------------------------+
|              Prediction Markets (Greenland-only)         |
|           (Polymarket + Kalshi odds, sorted by volume)   |
+----------------------------------------------------------+
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
- **D3.js** for interactive map visualization (orthographic projection)
- **Vercel** for deployment

## Key Files

### Main Dashboard
- `src/routes/+page.svelte` - Main page layout (map + feed + betting odds)

### Components
- `src/lib/components/panels/MapPanel.svelte` - Arctic map (orthographic, centered on Greenland)
- `src/lib/components/panels/LiveFeedPanel.svelte` - Live news feed from GDELT
- `src/lib/components/panels/BettingOddsPanel.svelte` - Polymarket/Kalshi predictions

### API
- `src/lib/api/misc.ts` - Polymarket CLOB API + Kalshi API + GDELT live feed

### Configuration
- `src/lib/config/map.ts` - Greenland hotspots and Arctic locations
- `src/lib/config/greenland.ts` - Centralized Greenland constants

## APIs Used

| API | Status | Purpose |
|-----|--------|---------|
| Polymarket CLOB | Active | Prediction market odds (Greenland-filtered) |
| Kalshi | Active | Prediction market odds (Greenland-filtered) |
| GDELT | Active | Live news feed (Greenland keywords) |
| D3/TopoJSON | Active | Map rendering |
| Open-Meteo | Active | Weather data for map tooltips |

## Path Aliases

```typescript
$lib        -> src/lib
$components -> src/lib/components
$stores     -> src/lib/stores
$config     -> src/lib/config
```

## Deployment

- **Platform**: Vercel (auto-deploys on push to main)
- **URL**: https://greenland-monitor.vercel.app
- **Repo**: https://github.com/hughmuchsauce/situation-monitor

## Features

### Prediction Markets
- Filters markets for "greenland" keyword only
- Displays volume (formatted as $M/$K)
- Sorted by volume (highest first)
- Shows source (Polymarket/Kalshi)

### Live Feed
- News articles from GDELT API
- Filtered for Greenland keywords
- Alert badges for breaking news
- X/Twitter placeholder (requires API access)

### Map
- Orthographic projection centered on Greenland (lat: 72, lon: -42)
- Hotspots for key locations (Nuuk, Pituffik, Ilulissat, etc.)
- Day/night terminator
- Weather tooltips on hover

## Next Steps

1. Integrate X/Twitter API for politician posts (requires API keys)
2. Add more Greenland-specific hotspots
3. Real-time WebSocket updates for prediction markets
