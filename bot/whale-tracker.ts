/**
 * Whale Activity Tracker
 * Tracks and stores large trades, volume spikes, and whale patterns
 */

export interface WhaleSignal {
	id: string;
	timestamp: Date;
	ticker: string;
	marketTitle: string;
	signalType: 'volume_spike' | 'directional_flow' | 'large_trade';
	side: 'yes' | 'no';
	confidence: number;
	price: number;
	size: number;
	reason: string;
	volume24h: number;
	metadata?: {
		volumeChange?: number;
		flowRatio?: number;
		tradeSize?: number;
	};
}

export interface MarketStats {
	ticker: string;
	title: string;
	volume24h: number;
	lastPrice: number;
	signalCount: number;
	lastSignal?: Date;
	whaleActivity: number; // 0-100 score
}

export class WhaleActivityTracker {
	private signals: WhaleSignal[] = [];
	private maxSignals = 1000;

	addSignal(signal: Omit<WhaleSignal, 'id' | 'timestamp'>): WhaleSignal {
		const newSignal: WhaleSignal = {
			...signal,
			id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			timestamp: new Date()
		};

		this.signals.unshift(newSignal);

		// Keep only recent signals
		if (this.signals.length > this.maxSignals) {
			this.signals = this.signals.slice(0, this.maxSignals);
		}

		return newSignal;
	}

	getRecentSignals(limit = 50): WhaleSignal[] {
		return this.signals.slice(0, limit);
	}

	getSignalsByMarket(ticker: string): WhaleSignal[] {
		return this.signals.filter((s) => s.ticker === ticker);
	}

	getSignalsByType(type: WhaleSignal['signalType']): WhaleSignal[] {
		return this.signals.filter((s) => s.signalType === type);
	}

	getMarketStats(): MarketStats[] {
		const marketMap = new Map<string, MarketStats>();

		this.signals.forEach((signal) => {
			if (!marketMap.has(signal.ticker)) {
				marketMap.set(signal.ticker, {
					ticker: signal.ticker,
					title: signal.marketTitle,
					volume24h: signal.volume24h,
					lastPrice: signal.price,
					signalCount: 0,
					whaleActivity: 0
				});
			}

			const stats = marketMap.get(signal.ticker)!;
			stats.signalCount++;
			stats.lastSignal = signal.timestamp;
			stats.volume24h = Math.max(stats.volume24h, signal.volume24h);

			// Calculate whale activity score
			const confidenceScore = signal.confidence;
			const sizeScore = Math.min(signal.size / 100, 1) * 100;
			stats.whaleActivity = Math.max(stats.whaleActivity, (confidenceScore + sizeScore) / 2);
		});

		return Array.from(marketMap.values()).sort((a, b) => b.whaleActivity - a.whaleActivity);
	}

	getTimeSeriesData(hours = 24): Array<{ time: Date; count: number; avgConfidence: number }> {
		const now = Date.now();
		const hourMs = 60 * 60 * 1000;
		const buckets = new Map<number, { count: number; totalConfidence: number }>();

		this.signals.forEach((signal) => {
			const age = now - signal.timestamp.getTime();
			if (age <= hours * hourMs) {
				const bucket = Math.floor(age / hourMs);
				if (!buckets.has(bucket)) {
					buckets.set(bucket, { count: 0, totalConfidence: 0 });
				}
				const data = buckets.get(bucket)!;
				data.count++;
				data.totalConfidence += signal.confidence;
			}
		});

		const result: Array<{ time: Date; count: number; avgConfidence: number }> = [];
		for (let i = 0; i < hours; i++) {
			const data = buckets.get(i) || { count: 0, totalConfidence: 0 };
			result.unshift({
				time: new Date(now - i * hourMs),
				count: data.count,
				avgConfidence: data.count > 0 ? data.totalConfidence / data.count : 0
			});
		}

		return result;
	}

	getSummary() {
		const recent1h = this.signals.filter(
			(s) => Date.now() - s.timestamp.getTime() < 60 * 60 * 1000
		);
		const recent24h = this.signals.filter(
			(s) => Date.now() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
		);

		return {
			total: this.signals.length,
			last1h: recent1h.length,
			last24h: recent24h.length,
			avgConfidence: recent24h.length > 0 ? recent24h.reduce((sum, s) => sum + s.confidence, 0) / recent24h.length : 0,
			topMarkets: this.getMarketStats().slice(0, 5)
		};
	}

	clear() {
		this.signals = [];
	}
}
