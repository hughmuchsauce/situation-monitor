/**
 * Onboarding presets for Greenland Situation Monitor
 */

import type { PanelId } from './panels';

export interface Preset {
	id: string;
	name: string;
	icon: string;
	description: string;
	panels: PanelId[];
}

export const PRESETS: Record<string, Preset> = {
	'greenland-focus': {
		id: 'greenland-focus',
		name: 'Greenland Focus',
		icon: '🇬🇱',
		description: 'Primary Greenland monitoring with news, leaders, and situation tracking',
		panels: ['map', 'politics', 'greenland', 'leaders', 'intel', 'correlation', 'monitors']
	},
	'arctic-watcher': {
		id: 'arctic-watcher',
		name: 'Arctic Watcher',
		icon: '🌍',
		description: 'Broader Arctic focus including security, shipping, and climate',
		panels: ['map', 'politics', 'greenland', 'intel', 'leaders', 'gov', 'correlation', 'narrative']
	},
	'intel-analyst': {
		id: 'intel-analyst',
		name: 'Intelligence Analyst',
		icon: '🔍',
		description: 'Deep analysis with pattern detection and narrative tracking',
		panels: ['map', 'intel', 'leaders', 'correlation', 'narrative', 'mainchar', 'greenland']
	},
	minimal: {
		id: 'minimal',
		name: 'Minimal',
		icon: '⚡',
		description: 'Just the essentials - map, news, and Greenland situation',
		panels: ['map', 'politics', 'greenland']
	},
	everything: {
		id: 'everything',
		name: 'Everything',
		icon: '🎛️',
		description: 'All available panels enabled',
		panels: [
			'map',
			'politics',
			'tech',
			'finance',
			'gov',
			'monitors',
			'mainchar',
			'greenland',
			'leaders',
			'intel',
			'correlation',
			'narrative'
		]
	}
};

export const PRESET_ORDER = [
	'greenland-focus',
	'arctic-watcher',
	'intel-analyst',
	'minimal',
	'everything'
];

// Storage keys
export const ONBOARDING_STORAGE_KEY = 'onboardingComplete';
export const PRESET_STORAGE_KEY = 'selectedPreset';
