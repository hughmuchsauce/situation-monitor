#!/usr/bin/env node
/**
 * Kalshi Follower Bot
 * Monitors weather/climate markets and follows profitable trading patterns
 */

import { KalshiClient } from './kalshi-client';
import { MarketAnalyzer, type TradeSignal } from './market-analyzer';
import { loadConfig } from './config';
import { WhaleActivityTracker } from './whale-tracker';
import { BotAPIServer } from './api-server';

class KalshiFollowerBot {
	private client: KalshiClient;
	private analyzer: MarketAnalyzer;
	private config = loadConfig();
	private dailyTrades = 0;
	private isRunning = false;
	private whaleTracker: WhaleActivityTracker;
	private apiServer: BotAPIServer;

	constructor() {
		// Validate credentials
		if (!this.config.apiKey || !this.config.privateKey) {
			console.error('❌ Missing API credentials!');
			console.error('Set KALSHI_API_KEY and KALSHI_PRIVATE_KEY environment variables');
			process.exit(1);
		}

		this.client = new KalshiClient({
			apiKey: this.config.apiKey,
			privateKey: this.config.privateKey
		});

		this.analyzer = new MarketAnalyzer(this.config);
		this.whaleTracker = new WhaleActivityTracker();
		this.apiServer = new BotAPIServer(this.whaleTracker, 3001);

		console.log('🤖 Kalshi Follower Bot initialized');
		console.log(`📊 Mode: ${this.config.demoMode ? 'DEMO (no real trades)' : 'LIVE'}`);
		console.log(`⏱️  Poll interval: ${this.config.pollIntervalMs / 1000}s`);
		console.log(`📈 Target categories: ${this.config.categories.join(', ')}`);
	}

	/**
	 * Start the bot
	 */
	async start() {
		this.isRunning = true;

		// Start API server for dashboard
		this.apiServer.start();

		console.log('\n🚀 Starting bot...');
		console.log('📊 Dashboard available at: http://localhost:5173/bot\n');

		// Reset daily trade counter at midnight
		this.scheduleDailyReset();

		// Main loop
		while (this.isRunning) {
			await this.runAnalysisLoop();
			await this.sleep(this.config.pollIntervalMs);
		}
	}

	/**
	 * Stop the bot
	 */
	stop() {
		console.log('\n⏸️  Stopping bot...');
		this.isRunning = false;
		this.apiServer.stop();
	}

	/**
	 * Main analysis loop
	 */
	private async runAnalysisLoop() {
		try {
			console.log(`[${new Date().toISOString()}] 🔍 Scanning markets...`);

			// Get all open markets
			const markets = await this.client.getMarkets();
			console.log(`   Found ${markets.length} total markets`);

			// Filter for weather/climate
			const targetMarkets = markets.filter((m) => this.analyzer.isWeatherOrClimateMarket(m));
			console.log(`   → ${targetMarkets.length} weather/climate markets`);

			if (targetMarkets.length === 0) {
				console.log('   ⚠️  No target markets found');
				return;
			}

			// Analyze each market
			const signals: TradeSignal[] = [];

			for (const market of targetMarkets) {
				// Get recent trades
				const trades = await this.client.getTrades(market.ticker, 50);

				// Analyze for signals
				const signal = this.analyzer.analyzeMarket(market, trades);
				if (signal) {
					signals.push(signal);
				}

				// Rate limiting
				await this.sleep(100);
			}

			// Process signals
			if (signals.length > 0) {
				console.log(`\n   🎯 Found ${signals.length} trading signal(s):`);
				for (const signal of signals) {
					await this.processSignal(signal);
				}
			} else {
				console.log('   ℹ️  No signals detected');
			}
		} catch (error) {
			console.error('❌ Error in analysis loop:', error);
		}
	}

	/**
	 * Process a trading signal
	 */
	private async processSignal(signal: TradeSignal) {
		console.log(`\n   📊 SIGNAL: ${signal.marketTitle}`);
		console.log(`      Ticker: ${signal.ticker}`);
		console.log(`      Side: ${signal.side.toUpperCase()}`);
		console.log(`      Confidence: ${signal.confidence}%`);
		console.log(`      Suggested: ${signal.suggestedSize} contracts @ ${signal.suggestedPrice}¢`);
		console.log(`      Reason: ${signal.reason}`);

		// Track whale activity
		const signalType = signal.reason.toLowerCase().includes('volume spike')
			? ('volume_spike' as const)
			: signal.reason.toLowerCase().includes('large trade')
				? ('large_trade' as const)
				: ('directional_flow' as const);

		this.whaleTracker.addSignal({
			ticker: signal.ticker,
			marketTitle: signal.marketTitle,
			signalType,
			side: signal.side,
			confidence: signal.confidence,
			price: signal.suggestedPrice,
			size: signal.suggestedSize,
			reason: signal.reason,
			volume24h: 0
		});

		// Check if we can trade
		if (this.dailyTrades >= this.config.maxDailyTrades) {
			console.log('      ⚠️  Daily trade limit reached, skipping');
			return;
		}

		// Check position size
		if (signal.suggestedSize === 0) {
			console.log('      ⚠️  Position size too small, skipping');
			return;
		}

		// Execute or simulate trade
		if (this.config.demoMode) {
			console.log(
				`      💡 DEMO: Would buy ${signal.suggestedSize} ${signal.side} @ ${signal.suggestedPrice}¢`
			);
		} else {
			try {
				console.log(`      🔄 Placing order...`);
				const order = await this.client.placeBuyOrder(
					signal.ticker,
					signal.side,
					signal.suggestedSize,
					signal.suggestedPrice
				);
				console.log(`      ✅ Order placed: ${order.order?.order_id}`);
				this.dailyTrades++;
			} catch (error) {
				console.error(`      ❌ Failed to place order:`, error);
			}
		}
	}

	/**
	 * Schedule daily counter reset
	 */
	private scheduleDailyReset() {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		const msUntilMidnight = tomorrow.getTime() - now.getTime();

		setTimeout(() => {
			this.dailyTrades = 0;
			console.log('\n🔄 Daily trade counter reset');
			this.scheduleDailyReset(); // Schedule next reset
		}, msUntilMidnight);
	}

	/**
	 * Sleep utility
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Display current positions
	 */
	async showPositions() {
		console.log('\n📊 Current Positions:\n');
		try {
			const positions = await this.client.getPositions();

			if (positions.length === 0) {
				console.log('   No open positions');
				return;
			}

			for (const pos of positions) {
				const pnl = (pos.total_traded_value || 0) - (pos.market_exposure || 0);
				const pnlSign = pnl >= 0 ? '+' : '';
				console.log(`   ${pos.ticker}: ${pos.position} contracts`);
				console.log(`      P&L: ${pnlSign}$${pnl.toFixed(2)}`);
			}
		} catch (error) {
			console.error('   Error fetching positions:', error);
		}
	}
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
	const bot = new KalshiFollowerBot();

	// Handle shutdown gracefully
	process.on('SIGINT', () => {
		bot.stop();
		process.exit(0);
	});

	process.on('SIGTERM', () => {
		bot.stop();
		process.exit(0);
	});

	// Parse command
	const command = process.argv[2];

	if (command === 'positions') {
		bot.showPositions().then(() => process.exit(0));
	} else {
		bot.start().catch((error) => {
			console.error('Fatal error:', error);
			process.exit(1);
		});
	}
}

export { KalshiFollowerBot };
