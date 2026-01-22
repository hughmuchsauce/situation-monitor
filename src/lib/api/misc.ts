/**
 * Miscellaneous API functions for specialized panels
 * Prediction market data from Polymarket and Kalshi
 * Filtered to only show Greenland-related markets
 */

export interface Prediction {
	id: string;
	question: string;
	yes: number;
	volume: number; // Raw number for sorting
	volumeDisplay: string; // Formatted for display
	source: 'polymarket' | 'kalshi';
	url?: string;
}

export interface WhaleTransaction {
	coin: string;
	amount: number;
	usd: number;
	hash: string;
}

export interface Contract {
	agency: string;
	description: string;
	vendor: string;
	amount: number;
}

export interface Layoff {
	company: string;
	count: number;
	title: string;
	date: string;
}

/**
 * Fetch Polymarket predictions via their CLOB API
 * Only returns markets mentioning "greenland"
 */
export async function fetchPolymarket(): Promise<Prediction[]> {
	try {
		// Use the CLOB API which has better CORS support
		const response = await fetch('https://clob.polymarket.com/markets?closed=false&limit=100', {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			console.warn('Polymarket CLOB API failed:', response.status);
			return [];
		}

		const data = await response.json();
		const markets = data.data || data || [];

		// Only filter for Greenland
		const filtered = markets.filter((market: { question?: string; description?: string }) => {
			const text = ((market.question || '') + ' ' + (market.description || '')).toLowerCase();
			return text.includes('greenland');
		});

		console.log(`Polymarket: Found ${filtered.length} Greenland markets out of ${markets.length} total`);

		return filtered.map(
			(market: {
				condition_id?: string;
				question?: string;
				tokens?: Array<{ price?: number }>;
				volume?: number;
				market_slug?: string;
			}) => {
				let yesPrice = 50;
				if (market.tokens && market.tokens[0]?.price) {
					yesPrice = Math.round(market.tokens[0].price * 100);
				}

				const vol = market.volume || 0;

				return {
					id: `pm-${market.condition_id || Math.random().toString(36)}`,
					question: market.question || 'Unknown market',
					yes: yesPrice,
					volume: vol,
					volumeDisplay: formatVolume(vol),
					source: 'polymarket' as const,
					url: market.market_slug
						? `https://polymarket.com/event/${market.market_slug}`
						: 'https://polymarket.com'
				};
			}
		);
	} catch (error) {
		console.error('Failed to fetch Polymarket data:', error);
		return [];
	}
}

/**
 * Fetch Kalshi predictions
 * Only returns markets mentioning "greenland"
 */
export async function fetchKalshi(): Promise<Prediction[]> {
	const endpoints = [
		'https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=open',
		'https://trading-api.kalshi.com/trade-api/v2/markets?limit=100&status=open'
	];

	for (const endpoint of endpoints) {
		try {
			const response = await fetch(endpoint, {
				headers: {
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				continue;
			}

			const data = await response.json();
			const markets = data.markets || [];

			return processKalshiMarkets(markets);
		} catch (error) {
			console.warn('Kalshi endpoint failed:', endpoint, error);
			continue;
		}
	}

	console.error('All Kalshi endpoints failed');
	return [];
}

function processKalshiMarkets(
	markets: Array<{
		ticker?: string;
		title?: string;
		yes_ask?: number;
		yes_bid?: number;
		volume?: number;
	}>
): Prediction[] {
	// Only filter for Greenland
	const filtered = markets.filter((market) => {
		const title = (market.title || '').toLowerCase();
		return title.includes('greenland');
	});

	console.log(`Kalshi: Found ${filtered.length} Greenland markets out of ${markets.length} total`);

	return filtered.map((market) => {
		const vol = market.volume || 0;

		return {
			id: `kalshi-${market.ticker || Math.random().toString(36)}`,
			question: market.title || 'Unknown market',
			yes: Math.round((market.yes_ask || market.yes_bid || 0.5) * 100),
			volume: vol,
			volumeDisplay: formatVolume(vol),
			source: 'kalshi' as const,
			url: market.ticker ? `https://kalshi.com/markets/${market.ticker}` : 'https://kalshi.com'
		};
	});
}

/**
 * Fetch all prediction market data from both sources
 * Sorted by volume (highest first)
 */
export async function fetchAllPredictions(): Promise<Prediction[]> {
	console.log('Fetching Greenland predictions from Polymarket and Kalshi...');

	const results = await Promise.allSettled([fetchPolymarket(), fetchKalshi()]);

	const polymarket = results[0].status === 'fulfilled' ? results[0].value : [];
	const kalshi = results[1].status === 'fulfilled' ? results[1].value : [];

	console.log(`Got ${polymarket.length} from Polymarket, ${kalshi.length} from Kalshi`);

	// Combine and sort by volume (highest first)
	const combined = [...polymarket, ...kalshi].sort((a, b) => b.volume - a.volume);

	return combined;
}

function formatVolume(volume: number): string {
	if (volume >= 1000000) {
		return `$${(volume / 1000000).toFixed(1)}M`;
	} else if (volume >= 1000) {
		return `$${(volume / 1000).toFixed(0)}K`;
	} else if (volume > 0) {
		return `$${volume.toFixed(0)}`;
	}
	return '$0';
}

/**
 * Fetch whale transactions - disabled
 */
export async function fetchWhaleTransactions(): Promise<WhaleTransaction[]> {
	return [];
}

/**
 * Fetch government contracts - disabled
 */
export async function fetchGovContracts(): Promise<Contract[]> {
	return [];
}

/**
 * Fetch layoffs data - disabled
 */
export async function fetchLayoffs(): Promise<Layoff[]> {
	return [];
}
