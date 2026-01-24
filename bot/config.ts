/**
 * Configuration for Kalshi Follower Bot
 */

import 'dotenv/config';

export interface BotConfig {
	// Kalshi API credentials
	apiKey: string;
	privateKey: string;

	// Bot behavior
	demoMode: boolean; // If true, only simulates trades without executing
	pollIntervalMs: number; // How often to check for new trades

	// Market filtering
	categories: string[]; // e.g., ['weather', 'climate']
	minVolume: number; // Minimum 24h volume to consider a market

	// Trade following logic
	minTradeSize: number; // Minimum contract count to consider a trade "significant"
	volumeSpikeTreshold: number; // % increase in volume to trigger a follow (e.g., 50 means 50% spike)
	followRatio: number; // What % of detected trade to copy (e.g., 0.5 = copy 50% of size)
	maxPositionSize: number; // Maximum contracts to hold in a single market

	// Risk management
	maxDailyTrades: number;
	stopLossPercent: number; // Exit if position loses this % (not implemented yet)
}

export const defaultConfig: BotConfig = {
	apiKey: process.env.KALSHI_API_KEY || '',
	privateKey: process.env.KALSHI_PRIVATE_KEY || '',

	demoMode: true, // Start in demo mode for safety
	pollIntervalMs: 30000, // Check every 30 seconds

	categories: ['weather', 'climate'],
	minVolume: 1000, // $1000 minimum volume

	minTradeSize: 10, // Trades of 10+ contracts are "significant"
	volumeSpikeTreshold: 30, // 30% volume spike
	followRatio: 0.3, // Copy 30% of detected trade size
	maxPositionSize: 100, // Max 100 contracts per market

	maxDailyTrades: 20,
	stopLossPercent: 20
};

export function loadConfig(): BotConfig {
	return {
		...defaultConfig,
		apiKey: process.env.KALSHI_API_KEY || defaultConfig.apiKey,
		privateKey: process.env.KALSHI_PRIVATE_KEY || defaultConfig.privateKey,
		demoMode: process.env.BOT_DEMO_MODE === 'false' ? false : defaultConfig.demoMode
	};
}
