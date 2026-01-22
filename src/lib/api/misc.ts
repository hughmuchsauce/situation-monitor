/**
 * Miscellaneous API functions for specialized panels
 * Uses real APIs where available, returns empty arrays where APIs require authentication
 */

import { CORS_PROXY_URL } from '$lib/config/api';

export interface Prediction {
	id: string;
	question: string;
	yes: number;
	volume: string;
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
 * Fetch Polymarket predictions via their public Gamma API
 * Filters for Greenland and Arctic related markets
 */
export async function fetchPolymarket(): Promise<Prediction[]> {
	try {
		// Polymarket Gamma API - public endpoint for market data
		// Use CORS proxy to avoid proxy restrictions in development
		const apiUrl = 'https://gamma-api.polymarket.com/markets?closed=false&limit=100';
		const proxyUrl = CORS_PROXY_URL + encodeURIComponent(apiUrl);
		const response = await fetch(proxyUrl);

		if (!response.ok) {
			console.warn('Polymarket API returned non-OK status:', response.status);
			return [];
		}

		const markets = await response.json();

		// Filter for relevant topics (Greenland, Arctic, Trump, Denmark, NATO)
		const relevantKeywords = [
			'greenland',
			'arctic',
			'denmark',
			'trump',
			'nato',
			'russia',
			'china',
			'military',
			'territory',
			'acquisition'
		];

		const filtered = markets
			.filter((market: { question: string }) => {
				const q = market.question.toLowerCase();
				return relevantKeywords.some((kw) => q.includes(kw));
			})
			.slice(0, 10);

		return filtered.map(
			(market: {
				id: string;
				question: string;
				outcomePrices: string;
				volume: number;
				slug: string;
			}) => {
				// outcomePrices is a JSON string like "[0.65, 0.35]" for [Yes, No]
				let yesPrice = 50;
				try {
					const prices = JSON.parse(market.outcomePrices || '[0.5, 0.5]');
					yesPrice = Math.round(prices[0] * 100);
				} catch {
					yesPrice = 50;
				}

				return {
					id: `pm-${market.id}`,
					question: market.question,
					yes: yesPrice,
					volume: formatVolume(market.volume || 0),
					source: 'polymarket' as const,
					url: `https://polymarket.com/event/${market.slug}`
				};
			}
		);
	} catch (error) {
		console.error('Failed to fetch Polymarket data:', error);
		return [];
	}
}

/**
 * Fetch Kalshi predictions via their public API
 * Filters for relevant geopolitical markets
 */
export async function fetchKalshi(): Promise<Prediction[]> {
	try {
		// Kalshi public API for market data
		// Use CORS proxy to avoid proxy restrictions in development
		const apiUrl = 'https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=open';
		const proxyUrl = CORS_PROXY_URL + encodeURIComponent(apiUrl);
		const response = await fetch(proxyUrl);

		if (!response.ok) {
			// Try alternative endpoint
			const altApiUrl = 'https://trading-api.kalshi.com/trade-api/v2/markets?limit=100&status=open';
			const altProxyUrl = CORS_PROXY_URL + encodeURIComponent(altApiUrl);
			const altResponse = await fetch(altProxyUrl);
			if (!altResponse.ok) {
				console.warn('Kalshi API returned non-OK status');
				return [];
			}
			const altData = await altResponse.json();
			return processKalshiMarkets(altData.markets || []);
		}

		const data = await response.json();
		return processKalshiMarkets(data.markets || []);
	} catch (error) {
		console.error('Failed to fetch Kalshi data:', error);
		return [];
	}
}

function processKalshiMarkets(
	markets: Array<{
		ticker: string;
		title: string;
		yes_ask: number;
		volume: number;
	}>
): Prediction[] {
	const relevantKeywords = [
		'greenland',
		'arctic',
		'denmark',
		'trump',
		'nato',
		'russia',
		'china',
		'territory'
	];

	const filtered = markets
		.filter((market) => {
			const title = market.title.toLowerCase();
			return relevantKeywords.some((kw) => title.includes(kw));
		})
		.slice(0, 10);

	return filtered.map((market) => ({
		id: `kalshi-${market.ticker}`,
		question: market.title,
		yes: Math.round((market.yes_ask || 0.5) * 100),
		volume: formatVolume(market.volume || 0),
		source: 'kalshi' as const,
		url: `https://kalshi.com/markets/${market.ticker}`
	}));
}

/**
 * Fetch all prediction market data from both sources
 */
export async function fetchAllPredictions(): Promise<Prediction[]> {
	const [polymarket, kalshi] = await Promise.all([fetchPolymarket(), fetchKalshi()]);

	// Combine and sort by volume
	return [...polymarket, ...kalshi].sort((a, b) => {
		const volA = parseVolume(a.volume);
		const volB = parseVolume(b.volume);
		return volB - volA;
	});
}

function formatVolume(volume: number): string {
	if (volume >= 1000000) {
		return `${(volume / 1000000).toFixed(1)}M`;
	} else if (volume >= 1000) {
		return `${(volume / 1000).toFixed(0)}K`;
	}
	return volume.toString();
}

function parseVolume(vol: string): number {
	if (vol.endsWith('M')) {
		return parseFloat(vol) * 1000000;
	} else if (vol.endsWith('K')) {
		return parseFloat(vol) * 1000;
	}
	return parseFloat(vol) || 0;
}

/**
 * Fetch whale transactions
 * Requires Whale Alert API key - returns empty without it
 */
export async function fetchWhaleTransactions(): Promise<WhaleTransaction[]> {
	// Whale Alert API requires authentication
	// Return empty array - users should configure VITE_WHALE_ALERT_API_KEY
	return [];
}

/**
 * Fetch government contracts
 * USASpending.gov API - would need specific implementation
 */
export async function fetchGovContracts(): Promise<Contract[]> {
	// USASpending.gov has a public API but requires specific query building
	// Return empty for now
	return [];
}

/**
 * Fetch layoffs data
 * Would need to scrape layoffs.fyi or similar - no public API
 */
export async function fetchLayoffs(): Promise<Layoff[]> {
	// No reliable public API for layoff data
	return [];
}
