/**
 * Greenland-specific configuration
 * Centralized constants for the Greenland Situation Monitor
 */

export const GREENLAND_CONFIG = {
	name: 'Greenland Situation Monitor',
	tagline: 'Real-time intelligence on Greenland, the Arctic, and Danish relations',
	iso: 'GL',
	dkIso: 'DK'
};

// Map configuration centered on Greenland
export const GREENLAND_MAP = {
	center: { lat: 72.0, lon: -40.0 },
	zoom: 2.5,
	bounds: {
		north: 84,
		south: 59,
		east: -11,
		west: -73
	}
};

// Primary keywords for filtering Greenland-related content
export const GREENLAND_KEYWORDS = {
	// Location names
	locations: [
		'greenland',
		'nuuk',
		'ilulissat',
		'thule',
		'pituffik',
		'sisimiut',
		'qaqortoq',
		'tasiilaq',
		'upernavik',
		'kangerlussuaq',
		'narsarsuaq',
		'maniitsoq',
		'paamiut',
		'qaanaaq',
		'kalaallit nunaat',
		'kalaallit',
		'inuit greenland'
	],

	// Political terms
	political: [
		'danish realm',
		'kingdom of denmark',
		'naalakkersuisut',
		'inatsisartut',
		'greenland independence',
		'greenland autonomy',
		'greenland self-rule',
		'greenland self-government',
		'greenland parliament',
		'greenland premier'
	],

	// Strategic/Geopolitical terms
	strategic: [
		'pituffik space base',
		'thule air base',
		'arctic nato',
		'nato arctic',
		'greenland rare earth',
		'greenland mining',
		'greenland minerals',
		'critical minerals greenland',
		'arctic shipping',
		'northwest passage',
		'arctic route',
		'greenland strait',
		'davis strait',
		'greenland us',
		'trump greenland',
		'greenland acquisition',
		'greenland purchase',
		'greenland sale',
		'china greenland',
		'china arctic',
		'russian arctic',
		'arctic geopolitics'
	],

	// Climate and environment
	climate: [
		'greenland ice',
		'greenland glacier',
		'greenland ice sheet',
		'greenland melt',
		'arctic warming',
		'arctic climate',
		'greenland permafrost',
		'greenland sea level'
	],

	// Denmark relations
	denmark: [
		'denmark greenland',
		'danish greenland',
		'copenhagen greenland',
		'danish arctic',
		'rigsfaellesskab',
		'faroe greenland'
	]
};

// All keywords flattened for search
export const ALL_GREENLAND_KEYWORDS = [
	...GREENLAND_KEYWORDS.locations,
	...GREENLAND_KEYWORDS.political,
	...GREENLAND_KEYWORDS.strategic,
	...GREENLAND_KEYWORDS.climate,
	...GREENLAND_KEYWORDS.denmark
];

// GDELT query string for Greenland content
export const GREENLAND_GDELT_QUERY =
	'(Greenland OR Nuuk OR "Kalaallit Nunaat" OR Pituffik OR Thule OR "Danish realm" OR "arctic greenland" OR "greenland ice")';

// Alert keywords specific to Greenland context
export const GREENLAND_ALERT_KEYWORDS = [
	'military',
	'nato',
	'base',
	'troops',
	'defense',
	'acquisition',
	'purchase',
	'independence',
	'referendum',
	'sovereignty',
	'conflict',
	'dispute',
	'sanctions',
	'treaty',
	'emergency',
	'evacuation',
	'mining rights',
	'territorial'
];

// Topic keywords for Greenland
export const GREENLAND_TOPICS = {
	ARCTIC_SECURITY: [
		'nato',
		'military',
		'base',
		'defense',
		'security',
		'pituffik',
		'thule',
		'troops'
	],
	SOVEREIGNTY: [
		'independence',
		'autonomy',
		'self-rule',
		'referendum',
		'sovereignty',
		'danish realm'
	],
	RESOURCES: ['mining', 'rare earth', 'minerals', 'oil', 'gas', 'critical minerals', 'uranium'],
	CLIMATE: ['ice sheet', 'glacier', 'melt', 'climate', 'warming', 'permafrost', 'sea level'],
	US_RELATIONS: ['trump', 'acquisition', 'purchase', 'us greenland', 'american'],
	CHINA_RUSSIA: ['china', 'chinese', 'russia', 'russian', 'beijing', 'moscow'],
	DENMARK: ['denmark', 'danish', 'copenhagen', 'frederiksen']
};
