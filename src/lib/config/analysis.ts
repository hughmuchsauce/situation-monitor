/**
 * Analysis configuration - correlation topics, narrative patterns, source classification
 * Focused on Greenland, Arctic, and Danish relations
 */

export interface CorrelationTopic {
	id: string;
	patterns: RegExp[];
	category: string;
}

export interface NarrativePattern {
	id: string;
	keywords: string[];
	category: string;
	severity: 'watch' | 'emerging' | 'spreading' | 'disinfo';
}

export interface SourceTypes {
	fringe: string[];
	alternative: string[];
	mainstream: string[];
}

export const CORRELATION_TOPICS: CorrelationTopic[] = [
	// Greenland-specific topics
	{
		id: 'greenland-independence',
		patterns: [
			/greenland.*independence/i,
			/greenland.*sovereignty/i,
			/greenland.*self-rule/i,
			/kalaallit.*autonomy/i
		],
		category: 'Sovereignty'
	},
	{
		id: 'us-greenland',
		patterns: [
			/trump.*greenland/i,
			/us.*greenland/i,
			/america.*greenland/i,
			/greenland.*acquisition/i,
			/greenland.*purchase/i
		],
		category: 'Geopolitics'
	},
	{
		id: 'denmark-greenland',
		patterns: [
			/denmark.*greenland/i,
			/danish.*greenland/i,
			/frederiksen.*greenland/i,
			/danish realm/i,
			/rigsfaellesskab/i
		],
		category: 'Politics'
	},
	{
		id: 'greenland-mining',
		patterns: [
			/greenland.*mining/i,
			/greenland.*rare earth/i,
			/greenland.*minerals/i,
			/critical minerals.*greenland/i
		],
		category: 'Resources'
	},
	{
		id: 'arctic-security',
		patterns: [
			/arctic.*security/i,
			/arctic.*nato/i,
			/arctic.*military/i,
			/pituffik/i,
			/thule.*base/i
		],
		category: 'Security'
	},
	{
		id: 'arctic-climate',
		patterns: [
			/greenland.*ice/i,
			/arctic.*warming/i,
			/greenland.*melt/i,
			/ice sheet/i,
			/arctic.*climate/i
		],
		category: 'Climate'
	},
	{
		id: 'arctic-shipping',
		patterns: [/arctic.*shipping/i, /northwest passage/i, /northern sea route/i, /arctic.*route/i],
		category: 'Shipping'
	},
	{
		id: 'china-arctic',
		patterns: [/china.*arctic/i, /china.*greenland/i, /polar silk road/i, /chinese.*arctic/i],
		category: 'Geopolitics'
	},
	{
		id: 'russia-arctic',
		patterns: [/russia.*arctic/i, /russian.*arctic/i, /arctic.*militarization/i, /northern fleet/i],
		category: 'Security'
	},
	{
		id: 'nato-arctic',
		patterns: [/nato.*arctic/i, /arctic.*defense/i, /giuk gap/i, /arctic.*alliance/i],
		category: 'Security'
	},

	// General topics relevant to Greenland context
	{
		id: 'arctic-council',
		patterns: [/arctic council/i, /arctic.*cooperation/i, /arctic.*governance/i],
		category: 'Diplomacy'
	},
	{
		id: 'nordic-cooperation',
		patterns: [/nordic.*cooperation/i, /nordic council/i, /scandinavian.*greenland/i],
		category: 'Diplomacy'
	},
	{
		id: 'indigenous-rights',
		patterns: [/inuit.*rights/i, /indigenous.*arctic/i, /kalaallit.*rights/i, /inuit.*governance/i],
		category: 'Politics'
	},
	{
		id: 'arctic-research',
		patterns: [/arctic.*research/i, /greenland.*science/i, /ice core/i, /arctic.*expedition/i],
		category: 'Science'
	},
	{
		id: 'arctic-infrastructure',
		patterns: [
			/greenland.*airport/i,
			/arctic.*infrastructure/i,
			/greenland.*cable/i,
			/arctic.*internet/i
		],
		category: 'Infrastructure'
	}
];

export const NARRATIVE_PATTERNS: NarrativePattern[] = [
	// Greenland-specific narratives
	{
		id: 'greenland-sale',
		keywords: ['greenland for sale', 'buy greenland', 'greenland purchase', 'greenland deal'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'greenland-colonialism',
		keywords: ['danish colonialism', 'greenland colonial', 'decolonization greenland'],
		category: 'Political',
		severity: 'emerging'
	},
	{
		id: 'arctic-war',
		keywords: ['arctic war', 'arctic conflict', 'arctic confrontation', 'arctic cold war'],
		category: 'Security',
		severity: 'watch'
	},
	{
		id: 'rare-earth-war',
		keywords: ['rare earth war', 'mineral war', 'critical minerals conflict'],
		category: 'Resources',
		severity: 'watch'
	},
	{
		id: 'ice-apocalypse',
		keywords: ['ice sheet collapse', 'greenland melt disaster', 'arctic apocalypse'],
		category: 'Climate',
		severity: 'emerging'
	},
	{
		id: 'china-takeover',
		keywords: ['china takeover arctic', 'chinese arctic dominance', 'china greenland threat'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'nato-expansion-arctic',
		keywords: ['nato arctic expansion', 'arctic militarization', 'arctic arms race'],
		category: 'Security',
		severity: 'watch'
	},
	{
		id: 'indigenous-erasure',
		keywords: ['inuit erasure', 'indigenous displacement', 'kalaallit marginalization'],
		category: 'Society',
		severity: 'watch'
	}
];

export const SOURCE_TYPES: SourceTypes = {
	fringe: ['zerohedge', 'infowars', 'naturalnews', 'gateway', 'breitbart'],
	alternative: ['substack', 'rumble', 'telegram'],
	mainstream: [
		'reuters',
		'ap news',
		'bbc',
		'cnn',
		'nytimes',
		'wsj',
		'guardian',
		'arctic today',
		'high north news',
		'the local'
	]
};

// Main character patterns for tracking prominent figures in Greenland context
export interface PersonPattern {
	pattern: RegExp;
	name: string;
}

export const PERSON_PATTERNS: PersonPattern[] = [
	// Greenland leaders
	{ pattern: /\begede\b/gi, name: 'Múte B. Egede' },
	{ pattern: /\bmotzfeldt\b/gi, name: 'Vivian Motzfeldt' },

	// Danish leaders
	{ pattern: /\bfrederiksen\b/gi, name: 'Mette Frederiksen' },
	{ pattern: /\brasmussen\b/gi, name: 'Lars Løkke Rasmussen' },
	{ pattern: /\bfrederik\s*(x|ten)\b/gi, name: 'Frederik X' },

	// US figures
	{ pattern: /\btrump\b/gi, name: 'Trump' },
	{ pattern: /\brubio\b/gi, name: 'Marco Rubio' },
	{ pattern: /\bvance\b/gi, name: 'JD Vance' },

	// Other relevant leaders
	{ pattern: /\bputin\b/gi, name: 'Putin' },
	{ pattern: /\bxi\s*jinping\b|\bxi\b/gi, name: 'Xi Jinping' },
	{ pattern: /\bcarney\b/gi, name: 'Mark Carney' },
	{ pattern: /\bstøre\b|\bstore\b/gi, name: 'Jonas Gahr Støre' },

	// Key figures in Arctic discourse
	{ pattern: /\bblinken\b/gi, name: 'Antony Blinken' },
	{ pattern: /\bstoltenberg\b/gi, name: 'Jens Stoltenberg' }
];
