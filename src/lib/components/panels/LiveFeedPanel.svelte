<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { NewsItem } from '$lib/types';
	import { allNewsItems } from '$lib/stores';
	import { fetchAllNews } from '$lib/api';
	import { news } from '$lib/stores';

	// Feed items with metadata for display
	interface FeedItem {
		id: string;
		title: string;
		source: string;
		url: string;
		timestamp: Date;
		type: 'news' | 'alert' | 'breaking';
		category?: string;
	}

	let feedItems = $state<FeedItem[]>([]);
	let feedContainer: HTMLDivElement;
	let autoScroll = $state(true);
	let pollInterval: ReturnType<typeof setInterval> | null = null;
	let lastSeenIds = new Set<string>();

	// Convert news items to feed items
	function newsToFeedItems(items: NewsItem[]): FeedItem[] {
		return items.map((item) => ({
			id: item.id,
			title: item.title,
			source: item.source || 'Unknown',
			url: item.link,
			timestamp: new Date(item.pubDate || Date.now()),
			type: isBreaking(item.title) ? 'breaking' : isAlert(item.title) ? 'alert' : 'news',
			category: item.category
		}));
	}

	// Check if title suggests breaking news
	function isBreaking(title: string): boolean {
		const lower = title.toLowerCase();
		return lower.includes('breaking') || lower.includes('just in') || lower.includes('developing');
	}

	// Check if title contains alert keywords
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
			'russia'
		];
		return alertWords.some((word) => lower.includes(word));
	}

	// Format timestamp like Twitch chat
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	// Get source color
	function getSourceColor(source: string): string {
		const colors: Record<string, string> = {
			reuters: '#ff6600',
			'associated press': '#ff0000',
			bbc: '#bb1919',
			cnn: '#cc0000',
			'the guardian': '#052962',
			politico: '#ff3333',
			'arctic today': '#00ccff',
			'high north news': '#0099cc',
			default: '#888888'
		};
		const key = source.toLowerCase();
		for (const [name, color] of Object.entries(colors)) {
			if (key.includes(name)) return color;
		}
		return colors.default;
	}

	// Get type badge
	function getTypeBadge(type: 'news' | 'alert' | 'breaking'): { text: string; class: string } {
		switch (type) {
			case 'breaking':
				return { text: 'BREAKING', class: 'badge-breaking' };
			case 'alert':
				return { text: 'ALERT', class: 'badge-alert' };
			default:
				return { text: '', class: '' };
		}
	}

	// Poll for new items
	async function pollForUpdates() {
		try {
			const data = await fetchAllNews();
			Object.entries(data).forEach(([category, items]) => {
				news.setItems(category as keyof typeof data, items);
			});
		} catch (error) {
			console.error('Feed poll error:', error);
		}
	}

	// Update feed when store changes
	$effect(() => {
		const items = $allNewsItems;
		const newFeedItems = newsToFeedItems(items);

		// Find truly new items
		const newItems = newFeedItems.filter((item) => !lastSeenIds.has(item.id));

		if (newItems.length > 0) {
			newItems.forEach((item) => lastSeenIds.add(item.id));
			// Sort by timestamp, newest first for display (but we'll reverse for chat style)
			feedItems = [...newFeedItems]
				.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				.slice(0, 100); // Keep last 100 items
		} else if (feedItems.length === 0) {
			// Initial load
			feedItems = newFeedItems
				.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				.slice(0, 100);
			feedItems.forEach((item) => lastSeenIds.add(item.id));
		}
	});

	// Auto-scroll when new items arrive
	$effect(() => {
		if (autoScroll && feedContainer && feedItems.length > 0) {
			// Scroll to top since newest items are at top
			feedContainer.scrollTop = 0;
		}
	});

	// Handle scroll to toggle auto-scroll
	function handleScroll() {
		if (feedContainer) {
			// If user scrolled down, disable auto-scroll
			autoScroll = feedContainer.scrollTop < 50;
		}
	}

	onMount(() => {
		// Poll every 30 seconds for updates
		pollInterval = setInterval(pollForUpdates, 30000);
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
		{#if feedItems.length === 0}
			<div class="feed-loading">
				<div class="loading-spinner"></div>
				<span>Waiting for updates...</span>
			</div>
		{:else}
			{#each feedItems as item (item.id)}
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					class="feed-item"
					class:breaking={item.type === 'breaking'}
					class:alert={item.type === 'alert'}
				>
					<div class="item-meta">
						<span class="timestamp">{formatTime(item.timestamp)}</span>
						{#if item.type !== 'news'}
							{@const badge = getTypeBadge(item.type)}
							<span class="badge {badge.class}">{badge.text}</span>
						{/if}
						<span class="source" style="color: {getSourceColor(item.source)}">{item.source}</span>
					</div>
					<div class="item-title">{item.title}</div>
				</a>
			{/each}
		{/if}
	</div>

	{#if !autoScroll}
		<button
			class="scroll-to-top"
			onclick={() => {
				autoScroll = true;
				feedContainer.scrollTop = 0;
			}}
		>
			↑ New updates
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

	.feed-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		color: var(--text-muted, #7d8590);
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
		-webkit-box-orient: vertical;
		overflow: hidden;
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
