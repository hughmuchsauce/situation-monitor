/**
 * Market Analyzer - Identifies profitable trading patterns
 */

import type { Market, Trade } from 'kalshi-typescript';
import type { BotConfig } from './config';

export interface TradeSignal {
	ticker: string;
	marketTitle: string;
	side: 'yes' | 'no';
	confidence: number; // 0-100
	suggestedPrice: number;
	suggestedSize: number;
	reason: string;
}

export interface MarketSnapshot {
	ticker: string;
	title: string;
	volume24h: number;
	yesPrice: number;
	noPrice: number;
	lastChecked: number;
}

export class MarketAnalyzer {
	private marketSnapshots: Map<string, MarketSnapshot> = new Map();
	private recentTrades: Map<string, Trade[]> = new Map();

	constructor(private config: BotConfig) {}

	/**
	 * Analyze recent trades to identify trading signals
	 */
	analyzeMarket(market: Market, trades: Trade[]): TradeSignal | null {
		// Skip if market doesn't meet volume requirements
		if ((market.volume || 0) < this.config.minVolume) {
			return null;
		}

		// Get previous snapshot
		const prevSnapshot = this.marketSnapshots.get(market.ticker!);

		// Update current snapshot
		const currentSnapshot: MarketSnapshot = {
			ticker: market.ticker!,
			title: market.title || '',
			volume24h: market.volume || 0,
			yesPrice: market.yes_bid || 50,
			noPrice: market.no_bid || 50,
			lastChecked: Date.now()
		};
		this.marketSnapshots.set(market.ticker!, currentSnapshot);

		// Store recent trades
		this.recentTrades.set(market.ticker!, trades);

		// Need previous snapshot for comparison
		if (!prevSnapshot) {
			return null;
		}

		// Analyze for signals
		const signals: TradeSignal[] = [];

		// Signal 1: Volume spike
		const volumeSignal = this.detectVolumeSpike(currentSnapshot, prevSnapshot, trades);
		if (volumeSignal) signals.push(volumeSignal);

		// Signal 2: Strong directional flow
		const flowSignal = this.detectDirectionalFlow(market, trades);
		if (flowSignal) signals.push(flowSignal);

		// Signal 3: Large trades
		const largeTradeSignal = this.detectLargeTrades(market, trades);
		if (largeTradeSignal) signals.push(largeTradeSignal);

		// Return the strongest signal
		if (signals.length > 0) {
			return signals.sort((a, b) => b.confidence - a.confidence)[0];
		}

		return null;
	}

	/**
	 * Detect sudden volume spikes that might indicate informed trading
	 */
	private detectVolumeSpike(
		current: MarketSnapshot,
		previous: MarketSnapshot,
		trades: Trade[]
	): TradeSignal | null {
		const volumeIncrease =
			((current.volume24h - previous.volume24h) / previous.volume24h) * 100;

		if (volumeIncrease >= this.config.volumeSpikeTreshold) {
			// Determine which side has more volume
			const yesTrades = trades.filter((t) => t.taker_side === 'yes');
			const noTrades = trades.filter((t) => t.taker_side === 'no');

			const yesVolume = yesTrades.reduce((sum, t) => sum + (t.count || 0), 0);
			const noVolume = noTrades.reduce((sum, t) => sum + (t.count || 0), 0);

			const side: 'yes' | 'no' = yesVolume > noVolume ? 'yes' : 'no';
			const dominantVolume = Math.max(yesVolume, noVolume);
			const totalVolume = yesVolume + noVolume;

			// Confidence based on how one-sided the flow is
			const flowRatio = dominantVolume / totalVolume;
			const confidence = Math.min(95, Math.round(flowRatio * 100));

			return {
				ticker: current.ticker,
				marketTitle: current.title,
				side,
				confidence,
				suggestedPrice: side === 'yes' ? current.yesPrice : current.noPrice,
				suggestedSize: Math.round(dominantVolume * this.config.followRatio),
				reason: `Volume spike: +${volumeIncrease.toFixed(1)}% with ${flowRatio.toFixed(0)}% ${side} flow`
			};
		}

		return null;
	}

	/**
	 * Detect strong directional buying/selling flow
	 */
	private detectDirectionalFlow(market: Market, trades: Trade[]): TradeSignal | null {
		if (trades.length < 5) return null; // Need enough data

		const yesTrades = trades.filter((t) => t.taker_side === 'yes');
		const noTrades = trades.filter((t) => t.taker_side === 'no');

		const yesVolume = yesTrades.reduce((sum, t) => sum + (t.count || 0), 0);
		const noVolume = noTrades.reduce((sum, t) => sum + (t.count || 0), 0);
		const totalVolume = yesVolume + noVolume;

		if (totalVolume === 0) return null;

		const yesRatio = yesVolume / totalVolume;
		const noRatio = noVolume / totalVolume;

		// Strong directional flow: 70%+ on one side
		if (yesRatio >= 0.7) {
			return {
				ticker: market.ticker!,
				marketTitle: market.title || '',
				side: 'yes',
				confidence: Math.round(yesRatio * 100),
				suggestedPrice: market.yes_bid || 50,
				suggestedSize: Math.min(
					Math.round(yesVolume * this.config.followRatio),
					this.config.maxPositionSize
				),
				reason: `Strong YES flow: ${(yesRatio * 100).toFixed(0)}% of ${totalVolume} contracts`
			};
		}

		if (noRatio >= 0.7) {
			return {
				ticker: market.ticker!,
				marketTitle: market.title || '',
				side: 'no',
				confidence: Math.round(noRatio * 100),
				suggestedPrice: market.no_bid || 50,
				suggestedSize: Math.min(
					Math.round(noVolume * this.config.followRatio),
					this.config.maxPositionSize
				),
				reason: `Strong NO flow: ${(noRatio * 100).toFixed(0)}% of ${totalVolume} contracts`
			};
		}

		return null;
	}

	/**
	 * Calculate dollar value of a trade (contracts * price / 100)
	 * Price is in cents (0-100), so divide by 100 to get dollars
	 */
	private getTradeValue(trade: Trade): number {
		const count = trade.count || 0;
		const price = trade.taker_side === 'yes' ? (trade.yes_price || 50) : (trade.no_price || 50);
		return (count * price) / 100;
	}

	/**
	 * Detect large individual trades that might be from informed traders (whales)
	 * Whale threshold: $2M in actual dollars spent
	 */
	private detectLargeTrades(market: Market, trades: Trade[]): TradeSignal | null {
		// Filter for whale-sized trades ($2M threshold)
		const whaleTrades = trades.filter((t) => {
			const tradeValue = this.getTradeValue(t);
			return tradeValue >= this.config.minTradeSize; // $2M in config
		});

		if (whaleTrades.length === 0) return null;

		// Get the most recent whale trade
		const latestWhale = whaleTrades.sort(
			(a, b) => new Date(b.created_time!).getTime() - new Date(a.created_time!).getTime()
		)[0];

		const whaleValue = this.getTradeValue(latestWhale);
		const whaleValueStr = whaleValue >= 1000000
			? `$${(whaleValue / 1000000).toFixed(2)}M`
			: `$${(whaleValue / 1000).toFixed(0)}K`;

		return {
			ticker: market.ticker!,
			marketTitle: market.title || '',
			side: latestWhale.taker_side as 'yes' | 'no',
			confidence: 85, // High confidence for whale trades
			suggestedPrice:
				latestWhale.taker_side === 'yes' ? latestWhale.yes_price : latestWhale.no_price,
			suggestedSize: Math.min(
				Math.round((latestWhale.count || 0) * this.config.followRatio),
				this.config.maxPositionSize
			),
			reason: `🐋 WHALE DETECTED: ${whaleValueStr} (${latestWhale.count} contracts @ ${latestWhale.yes_price || latestWhale.no_price}¢)`
		};
	}

	/**
	 * Filter markets for weather/climate categories
	 */
	isWeatherOrClimateMarket(market: Market): boolean {
		const title = (market.title || '').toLowerCase();
		const seriesTicker = (market.series_ticker || '').toLowerCase();
		const category = (market.category || '').toLowerCase();
		const subtitle = (market.subtitle || '').toLowerCase();

		// Weather keywords (expanded)
		const weatherKeywords = [
			'weather',
			'temperature',
			'rain',
			'snow',
			'storm',
			'hurricane',
			'tornado',
			'flood',
			'drought',
			'precipitation',
			'celsius',
			'fahrenheit',
			'wind',
			'heat',
			'cold',
			'freeze',
			'frost',
			'blizzard',
			'hail',
			'thunder',
			'lightning',
			'degrees',
			'°f',
			'°c'
		];

		// Climate keywords
		const climateKeywords = [
			'climate',
			'warming',
			'carbon',
			'emissions',
			'sea level',
			'glacier',
			'ice cap',
			'el nino',
			'la nina',
			'arctic',
			'antarctic'
		];

		// Common Kalshi weather series
		const weatherSeries = ['kxhigh', 'kxlow', 'kxsnow', 'kxrain', 'highnyc', 'temp'];

		const allKeywords = [...weatherKeywords, ...climateKeywords];

		// Check all fields
		const matchesKeyword = allKeywords.some(
			(keyword) =>
				title.includes(keyword) ||
				seriesTicker.includes(keyword) ||
				category.includes(keyword) ||
				subtitle.includes(keyword)
		);

		const matchesSeries = weatherSeries.some((series) => seriesTicker.includes(series));

		return matchesKeyword || matchesSeries;
	}
}
