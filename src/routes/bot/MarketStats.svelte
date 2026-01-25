<script lang="ts">
	interface MarketStat {
		ticker: string;
		title: string;
		volume24h: number;
		signalCount: number;
		whaleActivity: number;
	}

	let { markets }: { markets: MarketStat[] } = $props();

	function formatVolume(vol: number) {
		if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
		if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
		return `$${vol.toFixed(0)}`;
	}

	function getActivityColor(score: number) {
		if (score >= 80) return 'bg-red-500';
		if (score >= 65) return 'bg-yellow-500';
		if (score >= 50) return 'bg-blue-500';
		return 'bg-gray-500';
	}

	function getActivityLabel(score: number) {
		if (score >= 80) return '🔥 HOT';
		if (score >= 65) return '⚡ Active';
		if (score >= 50) return '📊 Moderate';
		return '💤 Quiet';
	}
</script>

<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
	<div class="p-6 border-b border-gray-800">
		<h2 class="text-2xl font-bold">Top Markets by Whale Activity</h2>
		<p class="text-gray-400 text-sm mt-1">Markets with the most large trader interest</p>
	</div>

	<div class="divide-y divide-gray-800">
		{#each markets as market, i}
			<div class="p-6 hover:bg-gray-800/50 transition-colors">
				<div class="flex items-center gap-4">
					<div class="text-3xl font-bold text-gray-600 w-8">
						#{i + 1}
					</div>

					<div class="flex-1">
						<h3 class="font-semibold mb-1">{market.title}</h3>
						<p class="text-sm font-mono text-gray-500">{market.ticker}</p>
					</div>

					<div class="flex items-center gap-6">
						<div class="text-right">
							<div class="text-sm text-gray-500">Volume</div>
							<div class="text-lg font-semibold">{formatVolume(market.volume24h)}</div>
						</div>

						<div class="text-right">
							<div class="text-sm text-gray-500">Signals</div>
							<div class="text-lg font-semibold text-blue-400">{market.signalCount}</div>
						</div>

						<div class="text-right min-w-[120px]">
							<div class="text-sm text-gray-500 mb-1">Activity</div>
							<div class="flex items-center gap-2">
								<div class="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
									<div
										class={`h-full ${getActivityColor(market.whaleActivity)}`}
										style="width: {market.whaleActivity}%"
									></div>
								</div>
								<span class="text-xs whitespace-nowrap">{getActivityLabel(market.whaleActivity)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
