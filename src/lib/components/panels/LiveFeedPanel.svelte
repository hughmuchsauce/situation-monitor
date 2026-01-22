<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fetchGreenlandLiveFeed } from '$lib/api';
	import type { LiveFeedItem } from '$lib/api';

	let feedItems = $state<LiveFeedItem[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let feedContainer: HTMLDivElement;
	let autoScroll = $state(true);
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	// Format timestamp like Twitch chat
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	// Get source color for major outlets
	function getSourceColor(source: string): string {
		const colors: Record<string, string> = {
			reuters: '#ff6600',
			'associated press': '#ff0000',
			ap: '#ff0000',
			bbc: '#bb1919',
			cnn: '#cc0000',
			guardian: '#052962',
			politico: '#ff3333',
			'arctic today': '#00ccff',
			'high north news': '#0099cc',
			nytimes: '#000000',
			'new york times': '#000000',
			washingtonpost: '#2a2a2a',
			'washington post': '#2a2a2a',
			default: '#888888'
		};
		const key = source.toLowerCase();
		for (const [name, color] of Object.entries(colors)) {
			if (key.includes(name)) return color;
		}
		return colors.default;
	}

	// Check if title suggests breaking/alert news
	function isAlert(title: string): boolean {
		const lower = title.toLowerCase();
		const alertWords = [
			'trump',
			'greenland',
			'arctic',
			'nato',
			'military',
			'acquisition',
			'independence',
			'sovereignty',
			'rare earth',
			'china',
			'russia',
			'breaking',
			'just in'
		];
		return alertWords.some((word) => lower.includes(word));
	}

	function isBreaking(title: string): boolean {
		const lower = title.toLowerCase();
		return lower.includes('breaking') || lower.includes('just in') || lower.includes('developing');
	}

	async function loadFeed() {
		try {
			loading = feedItems.length === 0;
			const items = await fetchGreenlandLiveFeed();
			feedItems = items;
			error = null;
		} catch (e) {
			console.error('Failed to fetch live feed:', e);
			error = 'Failed to load live feed';
		} finally {
			loading = false;
		}
	}

	// Handle scroll to toggle auto-scroll
	function handleScroll() {
		if (feedContainer) {
			autoScroll = feedContainer.scrollTop < 50;
		}
	}

	onMount(() => {
		loadFeed();
		// Poll every 60 seconds for updates
		pollInterval = setInterval(loadFeed, 60000);
	});

	onDestroy(() => {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
	});
</script>

<div class="live-feed">
	<div class="feed-header">
		<div class="feed-title">
			<span class="live-indicator"></span>
			LIVE FEED
		</div>
		<div class="feed-count">{feedItems.length} items</div>
	</div>

	<div class="feed-container" bind:this={feedContainer} onscroll={handleScroll}>
		{#if loading && feedItems.length === 0}
			<div class="feed-loading">
				<div class="loading-spinner"></div>
				<span>Loading news...</span>
			</div>
		{:else if error && feedItems.length === 0}
			<div class="feed-error">
				<span>Failed to load feed</span>
				<button onclick={() => loadFeed()}>Retry</button>
			</div>
		{:else if feedItems.length === 0}
			<div class="feed-empty">
				<span class="empty-icon">📰</span>
				<span>No Greenland news found</span>
			</div>
		{:else}
			<!-- News Section -->
			<div class="feed-section">
				<div class="section-label">NEWS</div>
				{#each feedItems as item (item.id)}
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="feed-item"
						class:breaking={isBreaking(item.title)}
						class:alert={isAlert(item.title) && !isBreaking(item.title)}
					>
						<div class="item-meta">
							<span class="timestamp">{formatTime(item.timestamp)}</span>
							{#if isBreaking(item.title)}
								<span class="badge badge-breaking">BREAKING</span>
							{:else if isAlert(item.title)}
								<span class="badge badge-alert">ALERT</span>
							{/if}
							<span class="source" style="color: {getSourceColor(item.source)}">{item.source}</span>
						</div>
						<div class="item-title">{item.title}</div>
					</a>
				{/each}
			</div>

			<!-- X/Twitter Placeholder Section -->
			<div class="feed-section x-section">
				<div class="section-label">X POSTS</div>
				<div class="x-placeholder">
					<span class="x-icon">𝕏</span>
					<span class="x-text">X/Twitter integration requires API access</span>
					<span class="x-subtext">Politicians & influencers (200K+ followers)</span>
				</div>
			</div>
		{/if}
	</div>

	{#if !autoScroll && feedItems.length > 0}
		<button
			class="scroll-to-top"
			onclick={() => {
				autoScroll = true;
				feedContainer.scrollTop = 0;
			}}
		>
			↑ Back to top
		</button>
	{/if}
</div>

<style>
	.live-feed {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--surface, #0d1117);
		border: 1px solid var(--border, #30363d);
		border-radius: 6px;
		overflow: hidden;
		position: relative;
	}

	.feed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--surface-hover, #161b22);
		border-bottom: 1px solid var(--border, #30363d);
	}

	.feed-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text, #e6edf3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.live-indicator {
		width: 8px;
		height: 8px;
		background: #ff0000;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
		}
		50% {
			opacity: 0.8;
			box-shadow: 0 0 0 4px rgba(255, 0, 0, 0);
		}
	}

	.feed-count {
		font-size: 0.75rem;
		color: var(--text-muted, #7d8590);
	}

	.feed-container {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
		scroll-behavior: smooth;
	}

	.feed-container::-webkit-scrollbar {
		width: 6px;
	}

	.feed-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.feed-container::-webkit-scrollbar-thumb {
		background: var(--border, #30363d);
		border-radius: 3px;
	}

	.feed-loading,
	.feed-error,
	.feed-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 2rem;
		color: var(--text-muted, #7d8590);
		text-align: center;
	}

	.loading-spinner {
		width: 24px;
		height: 24px;
		border: 2px solid var(--border, #30363d);
		border-top-color: var(--accent, #58a6ff);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-icon {
		font-size: 2rem;
		opacity: 0.5;
	}

	.feed-error button {
		padding: 0.5rem 1rem;
		background: var(--accent, #58a6ff);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.feed-section {
		margin-bottom: 1rem;
	}

	.section-label {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--text-muted, #7d8590);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.5rem 0.5rem 0.25rem;
		border-bottom: 1px solid var(--border, #30363d);
		margin-bottom: 0.5rem;
	}

	.feed-item {
		display: block;
		padding: 0.5rem 0.75rem;
		margin-bottom: 0.25rem;
		border-radius: 4px;
		text-decoration: none;
		transition: background-color 0.15s;
		border-left: 2px solid transparent;
	}

	.feed-item:hover {
		background: var(--surface-hover, #161b22);
	}

	.feed-item.breaking {
		border-left-color: #ff0000;
		background: rgba(255, 0, 0, 0.1);
	}

	.feed-item.alert {
		border-left-color: #ff6600;
		background: rgba(255, 102, 0, 0.05);
	}

	.item-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
		flex-wrap: wrap;
	}

	.timestamp {
		font-size: 0.7rem;
		color: var(--text-muted, #7d8590);
		font-family: monospace;
	}

	.badge {
		font-size: 0.6rem;
		font-weight: 700;
		padding: 0.1rem 0.3rem;
		border-radius: 2px;
		text-transform: uppercase;
	}

	.badge-breaking {
		background: #ff0000;
		color: white;
		animation: flash 1s infinite;
	}

	@keyframes flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.badge-alert {
		background: #ff6600;
		color: white;
	}

	.source {
		font-size: 0.7rem;
		font-weight: 600;
	}

	.item-title {
		font-size: 0.8rem;
		color: var(--text, #e6edf3);
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* X/Twitter placeholder section */
	.x-section {
		margin-top: auto;
	}

	.x-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px dashed var(--border, #30363d);
		border-radius: 6px;
		color: var(--text-muted, #7d8590);
		text-align: center;
	}

	.x-icon {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		opacity: 0.5;
	}

	.x-text {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.x-subtext {
		font-size: 0.65rem;
		opacity: 0.7;
		margin-top: 0.25rem;
	}

	.scroll-to-top {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.5rem 1rem;
		background: var(--accent, #58a6ff);
		color: white;
		border: none;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		transition: transform 0.15s;
	}

	.scroll-to-top:hover {
		transform: translateX(-50%) scale(1.05);
	}
</style>
