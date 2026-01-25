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
	minTradeSize: number; // Whale threshold in USD (e.g., 2000000 = $2M)
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
	pollIntervalMs: 60000, // Check every 60 seconds

	categories: [], // Track ALL markets (no filtering)
	minVolume: 10000, // $10k minimum volume to reduce noise

	minTradeSize: 1000000, // $2M whale threshold (in dollar value, calculated dynamically)
	volumeSpikeTreshold: 50, // 50% volume spike to detect whale activity
	followRatio: 0.1, // Copy 10% of detected whale trade
	maxPositionSize: 10000, // Max 10k contracts per market

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
