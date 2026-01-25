/**
 * Simple HTTP API server to serve whale tracking data
 * Runs alongside the bot to provide real-time data to the dashboard
 */

import http from 'http';
import { WhaleActivityTracker } from './whale-tracker.js';

export class BotAPIServer {
	private server: http.Server | null = null;
	private port: number;

	constructor(
		private whaleTracker: WhaleActivityTracker,
		port = 3001
	) {
		this.port = port;
	}

	start() {
		this.server = http.createServer((req, res) => {
			// Enable CORS
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

			if (req.method === 'OPTIONS') {
				res.writeHead(200);
				res.end();
				return;
			}

			if (req.method !== 'GET') {
				res.writeHead(405);
				res.end('Method not allowed');
				return;
			}

			const url = new URL(req.url || '/', `http://localhost:${this.port}`);

			try {
				let data: any;

				switch (url.pathname) {
					case '/api/signals':
						const limit = parseInt(url.searchParams.get('limit') || '50');
						data = this.whaleTracker.getRecentSignals(limit);
						break;

					case '/api/signals/market':
						const ticker = url.searchParams.get('ticker');
						if (!ticker) {
							res.writeHead(400);
							res.end(JSON.stringify({ error: 'ticker parameter required' }));
							return;
						}
						data = this.whaleTracker.getSignalsByMarket(ticker);
						break;

					case '/api/stats':
						data = this.whaleTracker.getMarketStats();
						break;

					case '/api/timeseries':
						const hours = parseInt(url.searchParams.get('hours') || '24');
						data = this.whaleTracker.getTimeSeriesData(hours);
						break;

					case '/api/summary':
						data = this.whaleTracker.getSummary();
						break;

					case '/health':
						data = { status: 'ok', timestamp: new Date() };
						break;

					default:
						res.writeHead(404);
						res.end(JSON.stringify({ error: 'Not found' }));
						return;
				}

				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(data));
			} catch (error) {
				console.error('API error:', error);
				res.writeHead(500);
				res.end(JSON.stringify({ error: 'Internal server error' }));
			}
		});

		this.server.listen(this.port, () => {
			console.log(`📊 Bot API server running at http://localhost:${this.port}`);
			console.log(`   Available endpoints:`);
			console.log(`   - GET /api/signals?limit=50`);
			console.log(`   - GET /api/signals/market?ticker=TICKER`);
			console.log(`   - GET /api/stats`);
			console.log(`   - GET /api/timeseries?hours=24`);
			console.log(`   - GET /api/summary`);
		});

		return this.server;
	}

	stop() {
		if (this.server) {
			this.server.close();
			this.server = null;
		}
	}
}
