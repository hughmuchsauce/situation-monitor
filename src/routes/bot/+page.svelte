<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import SignalChart from './SignalChart.svelte';
	import MarketStats from './MarketStats.svelte';

	interface WhaleSignal {
		id: string;
		timestamp: string;
		ticker: string;
		marketTitle: string;
		signalType: 'volume_spike' | 'directional_flow' | 'large_trade';
		side: 'yes' | 'no';
		confidence: number;
		price: number;
		size: number;
		reason: string;
	}

	interface Summary {
		total: number;
		last1h: number;
		last24h: number;
		avgConfidence: number;
		topMarkets: any[];
	}

	let signals: WhaleSignal[] = $state([]);
	let summary: Summary = $state({
		total: 0,
		last1h: 0,
		last24h: 0,
		avgConfidence: 0,
		topMarkets: []
	});
	let timeSeriesData: any[] = $state([]);
	let isConnected = $state(false);
	let error = $state<string | null>(null);
	let refreshInterval: number;

	const API_URL = 'http://localhost:3001';

	async function fetchData() {
		try {
			// Fetch summary
			const summaryRes = await fetch(`${API_URL}/api/summary`);
			if (summaryRes.ok) {
				summary = await summaryRes.json();
				isConnected = true;
				error = null;
			}

			// Fetch recent signals
			const signalsRes = await fetch(`${API_URL}/api/signals?limit=50`);
			if (signalsRes.ok) {
				signals = await signalsRes.json();
			}

			// Fetch time series
			const timeSeriesRes = await fetch(`${API_URL}/api/timeseries?hours=24`);
			if (timeSeriesRes.ok) {
				timeSeriesData = await timeSeriesRes.json();
			}
		} catch (err) {
			isConnected = false;
			error = 'Bot not running. Start it with: npm run bot';
			console.error('Failed to fetch data:', err);
		}
	}

	onMount(() => {
		fetchData();
		refreshInterval = setInterval(fetchData, 5000) as any; // Refresh every 5 seconds
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	function formatTime(timestamp: string) {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return date.toLocaleDateString();
	}

	function getSignalTypeLabel(type: string) {
		switch (type) {
			case 'volume_spike':
				return '📈 Volume Spike';
			case 'large_trade':
				return '🐋 Large Trade';
			case 'directional_flow':
				return '➡️ Directional Flow';
			default:
				return type;
		}
	}

	function getConfidenceColor(confidence: number) {
		if (confidence >= 80) return 'text-green-400';
		if (confidence >= 65) return 'text-yellow-400';
		return 'text-gray-400';
	}
</script>

<svelte:head>
	<title>Kalshi Whale Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100 p-6">
	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-4xl font-bold mb-2">🐋 Kalshi Whale Tracker</h1>
				<p class="text-gray-400">Real-time weather/climate market activity from large traders</p>
			</div>
			<div class="text-right">
				<div class="flex items-center gap-2 mb-2">
					<div class={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
					<span class="text-sm {isConnected ? 'text-green-400' : 'text-red-400'}">
						{isConnected ? 'Bot Running' : 'Bot Offline'}
					</span>
				</div>
				{#if error}
					<p class="text-xs text-red-400">{error}</p>
				{/if}
			</div>
		</div>
	</header>

	{#if !isConnected}
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
			<p class="text-xl mb-4">🤖 Bot is not running</p>
			<p class="text-gray-400 mb-4">Start the bot to see whale activity in real-time</p>
			<code class="bg-gray-950 px-4 py-2 rounded">npm run bot</code>
		</div>
	{:else}
		<!-- Summary Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
			<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
				<div class="text-gray-400 text-sm mb-1">Total Signals</div>
				<div class="text-3xl font-bold">{summary.total}</div>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
				<div class="text-gray-400 text-sm mb-1">Last Hour</div>
				<div class="text-3xl font-bold text-blue-400">{summary.last1h}</div>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
				<div class="text-gray-400 text-sm mb-1">Last 24 Hours</div>
				<div class="text-3xl font-bold text-purple-400">{summary.last24h}</div>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
				<div class="text-gray-400 text-sm mb-1">Avg Confidence</div>
				<div class="text-3xl font-bold text-green-400">{summary.avgConfidence.toFixed(0)}%</div>
			</div>
		</div>

		<!-- Time Series Chart -->
		{#if timeSeriesData.length > 0}
			<div class="mb-8">
				<SignalChart data={timeSeriesData} />
			</div>
		{/if}

		<!-- Market Stats -->
		{#if summary.topMarkets && summary.topMarkets.length > 0}
			<div class="mb-8">
				<MarketStats markets={summary.topMarkets} />
			</div>
		{/if}

		<!-- Whale Signals List -->
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="p-6 border-b border-gray-800">
				<h2 class="text-2xl font-bold">Recent Whale Activity</h2>
				<p class="text-gray-400 text-sm mt-1">Latest signals from large traders</p>
			</div>

			{#if signals.length === 0}
				<div class="p-12 text-center text-gray-500">
					<p class="text-lg mb-2">No signals detected yet</p>
					<p class="text-sm">Waiting for whale activity...</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-800">
					{#each signals as signal}
						<div class="p-6 hover:bg-gray-800/50 transition-colors">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<span class="text-lg">{getSignalTypeLabel(signal.signalType)}</span>
										<span class="text-sm text-gray-500">{formatTime(signal.timestamp)}</span>
									</div>
									<h3 class="text-lg font-semibold mb-2">{signal.marketTitle}</h3>
									<p class="text-sm text-gray-400 mb-3">{signal.reason}</p>
									<div class="flex items-center gap-4 text-sm">
										<div>
											<span class="text-gray-500">Ticker:</span>
											<span class="font-mono ml-1">{signal.ticker}</span>
										</div>
										<div>
											<span class="text-gray-500">Side:</span>
											<span
												class="ml-1 font-semibold {signal.side === 'yes'
													? 'text-green-400'
													: 'text-red-400'}"
											>
												{signal.side.toUpperCase()}
											</span>
										</div>
										<div>
											<span class="text-gray-500">Size:</span>
											<span class="ml-1 font-semibold">{signal.size} contracts</span>
										</div>
										<div>
											<span class="text-gray-500">Price:</span>
											<span class="ml-1">{signal.price}¢</span>
										</div>
									</div>
								</div>
								<div class="text-right">
									<div class={`text-3xl font-bold ${getConfidenceColor(signal.confidence)}`}>
										{signal.confidence}%
									</div>
									<div class="text-xs text-gray-500 mt-1">confidence</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
