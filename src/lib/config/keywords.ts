/**
 * Keyword configuration for alerts and categorization
 * Focused on Greenland, Arctic, and Danish relations
 */

export const ALERT_KEYWORDS = [
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
	'territorial',
	'invasion',
	'nuclear',
	'missile',
	'attack',
	'strike'
] as const;

export type AlertKeyword = (typeof ALERT_KEYWORDS)[number];

// Region keywords focused on Greenland and related areas
export const REGION_KEYWORDS: Record<string, string[]> = {
	GREENLAND: [
		'greenland',
		'nuuk',
		'ilulissat',
		'pituffik',
		'thule',
		'kalaallit',
		'sisimiut',
		'qaqortoq',
		'tasiilaq',
		'upernavik'
	],
	ARCTIC: [
		'arctic',
		'north pole',
		'arctic circle',
		'arctic ocean',
		'arctic council',
		'high north',
		'polar'
	],
	DENMARK: ['denmark', 'danish', 'copenhagen', 'frederiksen', 'danish realm', 'rigsfaellesskab'],
	NORDIC: ['iceland', 'faroe', 'norway', 'sweden', 'finland', 'nordic', 'scandinavia'],
	NATO_ARCTIC: ['nato arctic', 'arctic defense', 'arctic security', 'northern flank']
};

// Topic keywords for Greenland context
export const TOPIC_KEYWORDS: Record<string, string[]> = {
	ARCTIC_SECURITY: [
		'nato',
		'military',
		'base',
		'defense',
		'security',
		'pituffik',
		'thule',
		'troops',
		'arctic defense'
	],
	SOVEREIGNTY: [
		'independence',
		'autonomy',
		'self-rule',
		'referendum',
		'sovereignty',
		'self-government',
		'decolonization'
	],
	RESOURCES: [
		'mining',
		'rare earth',
		'minerals',
		'oil',
		'gas',
		'critical minerals',
		'uranium',
		'lithium'
	],
	CLIMATE: [
		'ice sheet',
		'glacier',
		'melt',
		'climate',
		'warming',
		'permafrost',
		'sea level',
		'arctic warming'
	],
	GEOPOLITICS: [
		'acquisition',
		'purchase',
		'china',
		'russia',
		'us greenland',
		'trump greenland',
		'great power'
	],
	SHIPPING: [
		'northwest passage',
		'arctic shipping',
		'arctic route',
		'northern sea route',
		'maritime',
		'shipping lane'
	]
};

/**
 * Check if a headline contains alert keywords
 */
export function containsAlertKeyword(text: string): { isAlert: boolean; keyword?: string } {
	const lowerText = text.toLowerCase();
	for (const keyword of ALERT_KEYWORDS) {
		if (lowerText.includes(keyword)) {
			return { isAlert: true, keyword };
		}
	}
	return { isAlert: false };
}

/**
 * Detect region from text
 */
export function detectRegion(text: string): string | null {
	const lowerText = text.toLowerCase();
	for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
		if (keywords.some((k) => lowerText.includes(k))) {
			return region;
		}
	}
	return null;
}

/**
 * Detect topics from text
 */
export function detectTopics(text: string): string[] {
	const lowerText = text.toLowerCase();
	const detected: string[] = [];
	for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
		if (keywords.some((k) => lowerText.includes(k))) {
			detected.push(topic);
		}
	}
	return detected;
}

/**
 * Check if text is relevant to Greenland
 */
export function isGreenlandRelevant(text: string): boolean {
	const lowerText = text.toLowerCase();
	const greenlandTerms = [
		'greenland',
		'nuuk',
		'kalaallit',
		'pituffik',
		'thule',
		'ilulissat',
		'danish realm',
		'arctic',
		'denmark'
	];
	return greenlandTerms.some((term) => lowerText.includes(term));
}
