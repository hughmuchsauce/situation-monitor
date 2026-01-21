<script lang="ts">
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/layout';
	import { SettingsModal, MonitorFormModal, OnboardingModal } from '$lib/components/modals';
	import {
		NewsPanel,
		MarketsPanel,
		HeatmapPanel,
		CommoditiesPanel,
		CryptoPanel,
		MainCharPanel,
		CorrelationPanel,
		NarrativePanel,
		MonitorsPanel,
		MapPanel,
		IntelPanel,
		SituationPanel,
		WorldLeadersPanel,
		FedPanel,
		LiveFeedPanel,
		BettingOddsPanel
	} from '$lib/components/panels';
	import {
		news,
		markets,
		monitors,
		settings,
		refresh,
		allNewsItems,
		fedIndicators,
		fedNews
	} from '$lib/stores';
	import {
		fetchAllNews,
		fetchAllMarkets,
		fetchWorldLeaders,
		fetchFedIndicators,
		fetchFedNews
	} from '$lib/api';
	import type { CustomMonitor, WorldLeader } from '$lib/types';
	import type { PanelId } from '$lib/config';

	// Modal state
	let settingsOpen = $state(false);
	let monitorFormOpen = $state(false);
	let onboardingOpen = $state(false);
	let editingMonitor = $state<CustomMonitor | null>(null);

	// Panel data
	let leaders = $state<WorldLeader[]>([]);
	let leadersLoading = $state(false);

	// Data fetching
	async function loadNews() {
		const categories = ['politics', 'tech', 'finance', 'gov', 'ai', 'intel'] as const;
		categories.forEach((cat) => news.setLoading(cat, true));

		try {
			const data = await fetchAllNews();
			Object.entries(data).forEach(([category, items]) => {
				news.setItems(category as keyof typeof data, items);
			});
		} catch (error) {
			categories.forEach((cat) => news.setError(cat, String(error)));
		}
	}

	async function loadMarkets() {
		try {
			const data = await fetchAllMarkets();
			markets.setIndices(data.indices);
			markets.setSectors(data.sectors);
			markets.setCommodities(data.commodities);
			markets.setCrypto(data.crypto);
		} catch (error) {
			console.error('Failed to load markets:', error);
		}
	}

	async function loadWorldLeaders() {
		if (!isPanelVisible('leaders')) return;
		leadersLoading = true;
		try {
			leaders = await fetchWorldLeaders();
		} catch (error) {
			console.error('Failed to load world leaders:', error);
		} finally {
			leadersLoading = false;
		}
	}

	async function loadFedData() {
		if (!isPanelVisible('fed')) return;
		fedIndicators.setLoading(true);
		fedNews.setLoading(true);
		try {
			const [indicatorsData, newsData] = await Promise.all([fetchFedIndicators(), fetchFedNews()]);
			fedIndicators.setData(indicatorsData);
			fedNews.setItems(newsData);
		} catch (error) {
			console.error('Failed to load Fed data:', error);
			fedIndicators.setError(String(error));
			fedNews.setError(String(error));
		}
	}

	// Refresh handlers
	async function handleRefresh() {
		refresh.startRefresh();
		try {
			await Promise.all([loadNews(), loadMarkets()]);
			refresh.endRefresh();
		} catch (error) {
			refresh.endRefresh([String(error)]);
		}
	}

	// Monitor handlers
	function handleCreateMonitor() {
		editingMonitor = null;
		monitorFormOpen = true;
	}

	function handleEditMonitor(monitor: CustomMonitor) {
		editingMonitor = monitor;
		monitorFormOpen = true;
	}

	function handleDeleteMonitor(id: string) {
		monitors.deleteMonitor(id);
	}

	function handleToggleMonitor(id: string) {
		monitors.toggleMonitor(id);
	}

	// Get panel visibility
	function isPanelVisible(id: PanelId): boolean {
		return $settings.enabled[id] !== false;
	}

	// Handle preset selection from onboarding
	function handleSelectPreset(presetId: string) {
		settings.applyPreset(presetId);
		onboardingOpen = false;
		handleRefresh();
	}

	// Show onboarding again (called from settings)
	function handleReconfigure() {
		settingsOpen = false;
		settings.resetOnboarding();
		onboardingOpen = true;
	}

	// Initial load
	onMount(() => {
		if (!settings.isOnboardingComplete()) {
			onboardingOpen = true;
		}

		async function initialLoad() {
			refresh.startRefresh();
			try {
				await Promise.all([loadNews(), loadMarkets(), loadWorldLeaders(), loadFedData()]);
				refresh.endRefresh();
			} catch (error) {
				refresh.endRefresh([String(error)]);
			}
		}
		initialLoad();
		refresh.setupAutoRefresh(handleRefresh);

		return () => {
			refresh.stopAutoRefresh();
		};
	});
</script>

<svelte:head>
	<title>Greenland Situation Monitor</title>
	<meta
		name="description"
		content="Real-time intelligence on Greenland, the Arctic, and Danish relations"
	/>
</svelte:head>

<div class="app">
	<Header onSettingsClick={() => (settingsOpen = true)} />

	<main class="main-layout">
		<!-- Top Section: Map + Live Feed -->
		<div class="top-section">
			<!-- Map Panel - Left Side -->
			<div class="map-container">
				{#if isPanelVisible('map')}
					<MapPanel monitors={$monitors.monitors} />
				{/if}
			</div>

			<!-- Live Feed - Right Side -->
			<div class="feed-container">
				<LiveFeedPanel />
			</div>
		</div>

		<!-- Betting Odds Section - Below Map -->
		{#if isPanelVisible('betting')}
			<div class="betting-section">
				<BettingOddsPanel />
			</div>
		{/if}

		<!-- Bottom Section: All Other Panels -->
		<div class="bottom-section">
			<div class="panels-grid">
				<!-- Greenland Situation Panel -->
				{#if isPanelVisible('greenland')}
					<div class="panel-slot">
						<SituationPanel
							panelId="greenland"
							config={{
								title: 'Greenland Watch',
								subtitle: 'Arctic geopolitics, sovereignty & strategic interests',
								criticalKeywords: [
									'greenland',
									'arctic',
									'nuuk',
									'denmark',
									'pituffik',
									'thule',
									'independence',
									'acquisition',
									'nato',
									'rare earth'
								]
							}}
							news={$allNewsItems.filter(
								(n) =>
									n.title.toLowerCase().includes('greenland') ||
									n.title.toLowerCase().includes('arctic') ||
									n.title.toLowerCase().includes('nuuk') ||
									n.title.toLowerCase().includes('denmark')
							)}
						/>
					</div>
				{/if}

				<!-- World Leaders Panel -->
				{#if isPanelVisible('leaders')}
					<div class="panel-slot">
						<WorldLeadersPanel {leaders} loading={leadersLoading} />
					</div>
				{/if}

				<!-- News Panels -->
				{#if isPanelVisible('politics')}
					<div class="panel-slot">
						<NewsPanel category="politics" panelId="politics" title="Politics" />
					</div>
				{/if}

				{#if isPanelVisible('tech')}
					<div class="panel-slot">
						<NewsPanel category="tech" panelId="tech" title="Tech" />
					</div>
				{/if}

				{#if isPanelVisible('finance')}
					<div class="panel-slot">
						<NewsPanel category="finance" panelId="finance" title="Finance" />
					</div>
				{/if}

				{#if isPanelVisible('gov')}
					<div class="panel-slot">
						<NewsPanel category="gov" panelId="gov" title="Government" />
					</div>
				{/if}

				{#if isPanelVisible('ai')}
					<div class="panel-slot">
						<NewsPanel category="ai" panelId="ai" title="AI" />
					</div>
				{/if}

				<!-- Markets Panels -->
				{#if isPanelVisible('markets')}
					<div class="panel-slot">
						<MarketsPanel />
					</div>
				{/if}

				{#if isPanelVisible('heatmap')}
					<div class="panel-slot">
						<HeatmapPanel />
					</div>
				{/if}

				{#if isPanelVisible('commodities')}
					<div class="panel-slot">
						<CommoditiesPanel />
					</div>
				{/if}

				{#if isPanelVisible('crypto')}
					<div class="panel-slot">
						<CryptoPanel />
					</div>
				{/if}

				<!-- Analysis Panels -->
				{#if isPanelVisible('mainchar')}
					<div class="panel-slot">
						<MainCharPanel />
					</div>
				{/if}

				{#if isPanelVisible('correlation')}
					<div class="panel-slot">
						<CorrelationPanel news={$allNewsItems} />
					</div>
				{/if}

				{#if isPanelVisible('narrative')}
					<div class="panel-slot">
						<NarrativePanel news={$allNewsItems} />
					</div>
				{/if}

				<!-- Intel Panel -->
				{#if isPanelVisible('intel')}
					<div class="panel-slot">
						<IntelPanel />
					</div>
				{/if}

				<!-- Fed Panel -->
				{#if isPanelVisible('fed')}
					<div class="panel-slot">
						<FedPanel />
					</div>
				{/if}

				<!-- Custom Monitors -->
				{#if isPanelVisible('monitors')}
					<div class="panel-slot">
						<MonitorsPanel
							monitors={$monitors.monitors}
							matches={$monitors.matches}
							onCreateMonitor={handleCreateMonitor}
							onEditMonitor={handleEditMonitor}
							onDeleteMonitor={handleDeleteMonitor}
							onToggleMonitor={handleToggleMonitor}
						/>
					</div>
				{/if}
			</div>
		</div>
	</main>

	<!-- Modals -->
	<SettingsModal
		open={settingsOpen}
		onClose={() => (settingsOpen = false)}
		onReconfigure={handleReconfigure}
	/>
	<MonitorFormModal
		open={monitorFormOpen}
		onClose={() => (monitorFormOpen = false)}
		editMonitor={editingMonitor}
	/>
	<OnboardingModal open={onboardingOpen} onSelectPreset={handleSelectPreset} />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
	}

	.main-layout {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		gap: 0.5rem;
		overflow: hidden;
	}

	/* Top Section: Map + Live Feed side by side */
	.top-section {
		display: flex;
		gap: 0.5rem;
		height: 55vh;
		min-height: 400px;
	}

	.map-container {
		flex: 2;
		min-width: 0;
		border-radius: 6px;
		overflow: hidden;
	}

	.map-container :global(.panel) {
		height: 100%;
	}

	.map-container :global(.panel-content) {
		height: calc(100% - 2.5rem);
	}

	.feed-container {
		flex: 1;
		min-width: 300px;
		max-width: 400px;
		position: relative;
	}

	/* Betting Section */
	.betting-section {
		width: 100%;
	}

	.betting-section :global(.panel) {
		max-height: 300px;
	}

	/* Bottom Section: Panel Grid */
	.bottom-section {
		flex: 1;
		overflow-y: auto;
		min-height: 200px;
	}

	.panels-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0.5rem;
	}

	.panel-slot {
		min-height: 200px;
	}

	/* Responsive adjustments */
	@media (max-width: 1200px) {
		.top-section {
			height: 50vh;
		}

		.feed-container {
			max-width: 350px;
		}
	}

	@media (max-width: 900px) {
		.top-section {
			flex-direction: column;
			height: auto;
		}

		.map-container {
			height: 400px;
		}

		.feed-container {
			max-width: none;
			height: 350px;
		}
	}

	@media (max-width: 600px) {
		.main-layout {
			padding: 0.25rem;
		}

		.map-container {
			height: 300px;
		}

		.feed-container {
			height: 300px;
			min-width: auto;
		}

		.panels-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
