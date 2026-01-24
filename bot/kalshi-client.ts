/**
 * Kalshi API Client wrapper
 */

import { MarketApi, PortfolioApi, OrdersApi, Configuration } from 'kalshi-typescript';
import type { Market, Trade } from 'kalshi-typescript';
import { createHmac } from 'crypto';

export interface KalshiCredentials {
	apiKey: string;
	privateKey: string;
}

export class KalshiClient {
	private marketApi: MarketApi;
	private portfolioApi: PortfolioApi;
	private ordersApi: OrdersApi;
	private credentials: KalshiCredentials;
	private baseUrl = 'https://api.elections.kalshi.com/trade-api/v2';

	constructor(credentials: KalshiCredentials) {
		this.credentials = credentials;

		// Create configuration with auth
		const config = new Configuration({
			basePath: this.baseUrl,
			// Note: The SDK handles auth headers automatically
			apiKey: credentials.apiKey
		});

		this.marketApi = new MarketApi(config);
		this.portfolioApi = new PortfolioApi(config);
		this.ordersApi = new OrdersApi(config);
	}

	/**
	 * Get all open markets, optionally filtered by series ticker
	 */
	async getMarkets(seriesTicker?: string): Promise<Market[]> {
		try {
			const response = await this.marketApi.getMarkets(
				1000, // limit
				undefined, // cursor
				undefined, // eventTicker
				seriesTicker, // seriesTicker
				undefined, // minCreatedTs
				undefined, // maxCreatedTs
				undefined, // maxCloseTs
				undefined, // minCloseTs
				undefined, // minSettledTs
				undefined, // maxSettledTs
				'open' // status - only open markets
			);

			return response.data.markets || [];
		} catch (error) {
			console.error('Error fetching markets:', error);
			return [];
		}
	}

	/**
	 * Get recent trades for a specific market or all markets
	 */
	async getTrades(ticker?: string, limit: number = 100): Promise<Trade[]> {
		try {
			const minTs = Math.floor(Date.now() / 1000) - 3600; // Last hour

			const response = await this.marketApi.getTrades(
				limit,
				undefined, // cursor
				ticker,
				minTs
			);

			return response.data.trades || [];
		} catch (error) {
			console.error('Error fetching trades:', error);
			return [];
		}
	}

	/**
	 * Get market orderbook to see current bids/asks
	 */
	async getOrderbook(ticker: string) {
		try {
			const response = await this.marketApi.getMarketOrderbook(ticker, 10);
			return response.data.orderbook;
		} catch (error) {
			console.error('Error fetching orderbook:', error);
			return null;
		}
	}

	/**
	 * Get current portfolio positions
	 */
	async getPositions() {
		try {
			const response = await this.portfolioApi.getPositions();
			return response.data.market_positions || [];
		} catch (error) {
			console.error('Error fetching positions:', error);
			return [];
		}
	}

	/**
	 * Place a buy order
	 */
	async placeBuyOrder(ticker: string, side: 'yes' | 'no', count: number, price: number) {
		try {
			const response = await this.ordersApi.createOrder({
				ticker,
				action: 'buy',
				side,
				count,
				type: 'limit',
				yes_price: side === 'yes' ? price : undefined,
				no_price: side === 'no' ? price : undefined
			});

			return response.data;
		} catch (error) {
			console.error('Error placing order:', error);
			throw error;
		}
	}

	/**
	 * Get market by ticker
	 */
	async getMarket(ticker: string): Promise<Market | null> {
		try {
			const response = await this.marketApi.getMarket(ticker);
			return response.data.market || null;
		} catch (error) {
			console.error('Error fetching market:', error);
			return null;
		}
	}
}
