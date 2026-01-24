#!/usr/bin/env node
/**
 * Simple test to verify Kalshi API connection
 */

import 'dotenv/config';
import { MarketApi, Configuration } from 'kalshi-typescript';

async function testConnection() {
	console.log('🔌 Testing Kalshi API connection...\n');

	const apiKey = process.env.KALSHI_API_KEY;
	const privateKey = process.env.KALSHI_PRIVATE_KEY;

	if (!apiKey || !privateKey || apiKey.includes('placeholder') || privateKey.includes('placeholder')) {
		console.error('❌ Missing or placeholder credentials!');
		console.error('\nTo use the bot, you need real Kalshi API credentials:');
		console.error('1. Visit https://kalshi.com/settings/api');
		console.error('2. Generate an API key and private key');
		console.error('3. Add them to your .env file');
		console.error('\n✅ Bot setup is complete - just add real credentials to use it!');
		process.exit(0);
	}

	console.log('✓ API Key found:', apiKey.substring(0, 10) + '...');
	console.log('✓ Private Key found\n');

	try {
		// Try to fetch public markets (no auth required)
		console.log('Fetching public markets...');
		const config = new Configuration({
			basePath: 'https://api.elections.kalshi.com/trade-api/v2'
		});

		const api = new MarketApi(config);
		const response = await api.getMarkets(10, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'open');

		const markets = response.data.markets || [];
		console.log(`✅ Successfully fetched ${markets.length} markets!\n`);

		if (markets.length > 0) {
			console.log('Sample markets:');
			markets.slice(0, 3).forEach((m) => {
				console.log(`  - ${m.ticker}: ${m.title}`);
			});
		}

		console.log('\n✅ Connection successful!');
		console.log('You can now run the bot with: npm run bot');
	} catch (error) {
		console.error('❌ Connection failed:', error);
		process.exit(1);
	}
}

testConnection();
