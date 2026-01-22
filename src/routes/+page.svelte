<script lang="ts">
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/layout';
	import { SettingsModal, OnboardingModal } from '$lib/components/modals';
	import { MapPanel, BettingOddsPanel, LiveFeedPanel } from '$lib/components/panels';
	import { monitors, settings, refresh } from '$lib/stores';
	import type { PanelId } from '$lib/config';

	// Modal state
	let settingsOpen = $state(false);
	let onboardingOpen = $state(false);

	// Get panel visibility
	function isPanelVisible(id: PanelId): boolean {
		return $settings.enabled[id] !== false;
	}

	// Handle preset selection from onboarding
	function handleSelectPreset(presetId: string) {
		settings.applyPreset(presetId);
		onboardingOpen = false;
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
		refresh.init();
	});
</script>

<svelte:head>
	<title>Greenland Monitor</title>
	<meta
		name="description"
		content="Real-time prediction market odds on Greenland and geopolitics"
	/>
</svelte:head>

<div class="app">
	<Header onSettingsClick={() => (settingsOpen = true)} />

	<main class="main-layout">
		<!-- Top Section: Map + Live Feed placeholder -->
		<div class="top-section">
			<!-- Map Panel - Left Side -->
			<div class="map-container">
				{#if isPanelVisible('map')}
					<MapPanel monitors={$monitors.monitors} />
				{/if}
			</div>

			<!-- Right Side - Live Feed -->
			<div class="feed-container">
				<LiveFeedPanel />
			</div>
		</div>

		<!-- Bottom Section: Betting Odds -->
		<div class="bottom-section">
			<BettingOddsPanel />
		</div>
	</main>

	<!-- Modals -->
	<SettingsModal
		open={settingsOpen}
		onClose={() => (settingsOpen = false)}
		onReconfigure={handleReconfigure}
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

	/* Top Section: Map + Feed placeholder */
	.top-section {
		display: flex;
		gap: 0.5rem;
		flex: 1;
		min-height: 0;
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
		border-radius: 6px;
		overflow: hidden;
	}

	/* Bottom Section: Betting Odds */
	.bottom-section {
		height: 280px;
		min-height: 200px;
	}

	.bottom-section :global(.panel) {
		height: 100%;
	}

	.bottom-section :global(.panel-content) {
		height: calc(100% - 2.5rem);
		overflow-y: auto;
	}

	/* Responsive adjustments */
	@media (max-width: 900px) {
		.top-section {
			flex-direction: column;
		}

		.map-container {
			height: 350px;
			flex: none;
		}

		.feed-container {
			max-width: none;
			min-width: auto;
			height: 300px;
			flex: none;
		}

		.bottom-section {
			height: 250px;
		}
	}

	@media (max-width: 600px) {
		.main-layout {
			padding: 0.25rem;
		}

		.map-container {
			height: 280px;
		}

		.feed-container {
			height: 250px;
		}

		.bottom-section {
			height: 220px;
		}
	}
</style>
