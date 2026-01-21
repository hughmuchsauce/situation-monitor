/**
 * Panel configuration for Greenland Situation Monitor
 */

export interface PanelConfig {
	name: string;
	priority: 1 | 2 | 3;
}

export type PanelId =
	| 'map'
	| 'politics'
	| 'tech'
	| 'finance'
	| 'gov'
	| 'heatmap'
	| 'markets'
	| 'monitors'
	| 'commodities'
	| 'crypto'
	| 'polymarket'
	| 'whales'
	| 'mainchar'
	| 'printer'
	| 'contracts'
	| 'ai'
	| 'layoffs'
	| 'greenland'
	| 'leaders'
	| 'intel'
	| 'correlation'
	| 'narrative'
	| 'fed'
	| 'betting';

export const PANELS: Record<PanelId, PanelConfig> = {
	// Primary panels for Greenland focus
	map: { name: 'Arctic Map', priority: 1 },
	politics: { name: 'Greenland / Arctic News', priority: 1 },
	greenland: { name: 'Greenland Situation', priority: 1 },
	leaders: { name: 'Key Leaders', priority: 1 },
	intel: { name: 'Intel Feed', priority: 1 },
	correlation: { name: 'Correlation Engine', priority: 1 },
	narrative: { name: 'Narrative Tracker', priority: 1 },

	// Secondary panels
	gov: { name: 'Government / Policy', priority: 2 },
	monitors: { name: 'My Monitors', priority: 2 },
	tech: { name: 'Arctic Tech / Research', priority: 2 },
	finance: { name: 'Arctic Economy', priority: 2 },
	mainchar: { name: 'Main Character', priority: 2 },

	// Betting / Prediction Markets
	betting: { name: 'Betting Odds', priority: 1 },

	// Tertiary panels (optional/hidden by default)
	heatmap: { name: 'Sector Heatmap', priority: 3 },
	markets: { name: 'Markets', priority: 3 },
	commodities: { name: 'Commodities', priority: 3 },
	crypto: { name: 'Crypto', priority: 3 },
	polymarket: { name: 'Polymarket', priority: 3 },
	whales: { name: 'Whale Watch', priority: 3 },
	printer: { name: 'Money Printer', priority: 3 },
	contracts: { name: 'Gov Contracts', priority: 3 },
	ai: { name: 'AI / Climate Research', priority: 3 },
	layoffs: { name: 'Layoffs Tracker', priority: 3 },
	fed: { name: 'Federal Reserve', priority: 3 }
};

export const NON_DRAGGABLE_PANELS: PanelId[] = ['map'];

export const MAP_ZOOM_MIN = 1;
export const MAP_ZOOM_MAX = 4;
export const MAP_ZOOM_STEP = 0.5;

// Default panels for Greenland focus
export const DEFAULT_PANELS: PanelId[] = [
	'map',
	'betting',
	'politics',
	'greenland',
	'leaders',
	'intel',
	'correlation',
	'monitors'
];
