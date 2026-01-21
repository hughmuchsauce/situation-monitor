<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Panel } from '$lib/components/common';
	import { fetchAllPredictions } from '$lib/api';
	import type { Prediction } from '$lib/api';

	let predictions = $state<Prediction[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	async function loadPredictions() {
		try {
			loading = predictions.length === 0;
			const data = await fetchAllPredictions();
			predictions = data;
			error = null;
		} catch (e) {
			console.error('Failed to fetch predictions:', e);
			error = 'Failed to load prediction markets';
		} finally {
			loading = false;
		}
	}

	// Get color based on probability
	function getOddsColor(odds: number): string {
		if (odds >= 70) return '#22c55e'; // green - likely
		if (odds >= 50) return '#eab308'; // yellow - toss-up
		if (odds >= 30) return '#f97316'; // orange - unlikely
		return '#ef4444'; // red - very unlikely
	}

	// Get source badge color
	function getSourceColor(source: 'polymarket' | 'kalshi'): string {
		return source === 'polymarket' ? '#8b5cf6' : '#3b82f6';
	}

	onMount(() => {
		loadPredictions();
		// Poll every 60 seconds for updates
		pollInterval = setInterval(loadPredictions, 60000);
	});

	onDestroy(() => {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
	});
</script>

<Panel id="betting" title="Prediction Markets" count={predictions.length} {loading} {error}>
	<div class="betting-container">
		{#if predictions.length === 0 && !loading}
			<div class="no-data">
				<span class="no-data-icon">📊</span>
				<p>No relevant prediction markets found</p>
				<p class="no-data-hint">
					Markets related to Greenland, Arctic, or geopolitics will appear here
				</p>
			</div>
		{:else}
			<div class="predictions-list">
				{#each predictions as prediction (prediction.id)}
					<a
						href={prediction.url}
						target="_blank"
						rel="noopener noreferrer"
						class="prediction-item"
					>
						<div class="prediction-header">
							<span
								class="source-badge"
								style="background-color: {getSourceColor(prediction.source)}"
							>
								{prediction.source === 'polymarket' ? 'PM' : 'K'}
							</span>
							<span class="volume">${prediction.volume}</span>
						</div>
						<div class="prediction-question">{prediction.question}</div>
						<div class="prediction-odds">
							<div class="odds-bar-container">
								<div
									class="odds-bar"
									style="width: {prediction.yes}%; background-color: {getOddsColor(prediction.yes)}"
								></div>
							</div>
							<div class="odds-labels">
								<span class="yes-odds" style="color: {getOddsColor(prediction.yes)}">
									{prediction.yes}% Yes
								</span>
								<span class="no-odds">
									{100 - prediction.yes}% No
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</Panel>

<style>
	.betting-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.no-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: var(--text-muted, #7d8590);
	}

	.no-data-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.no-data-hint {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-top: 0.25rem;
	}

	.predictions-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prediction-item {
		display: block;
		padding: 0.75rem;
		background: var(--surface-hover, #161b22);
		border: 1px solid var(--border, #30363d);
		border-radius: 6px;
		text-decoration: none;
		transition:
			border-color 0.15s,
			transform 0.15s;
	}

	.prediction-item:hover {
		border-color: var(--accent, #58a6ff);
		transform: translateY(-1px);
	}

	.prediction-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.source-badge {
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
		color: white;
		text-transform: uppercase;
	}

	.volume {
		font-size: 0.7rem;
		color: var(--text-muted, #7d8590);
		font-family: monospace;
	}

	.prediction-question {
		font-size: 0.8rem;
		color: var(--text, #e6edf3);
		line-height: 1.4;
		margin-bottom: 0.5rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.prediction-odds {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.odds-bar-container {
		height: 6px;
		background: var(--border, #30363d);
		border-radius: 3px;
		overflow: hidden;
	}

	.odds-bar {
		height: 100%;
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.odds-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.yes-odds {
		font-family: monospace;
	}

	.no-odds {
		color: var(--text-muted, #7d8590);
		font-family: monospace;
	}
</style>
