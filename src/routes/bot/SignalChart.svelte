<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	interface TimeSeriesPoint {
		time: string;
		count: number;
		avgConfidence: number;
	}

	let { data }: { data: TimeSeriesPoint[] } = $props();

	let chartContainer: HTMLDivElement;

	onMount(() => {
		if (!data || data.length === 0) return;

		// Clear any existing chart
		d3.select(chartContainer).selectAll('*').remove();

		const margin = { top: 20, right: 80, bottom: 30, left: 50 };
		const width = chartContainer.clientWidth - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Parse data
		const parsedData = data.map((d) => ({
			time: new Date(d.time),
			count: d.count,
			avgConfidence: d.avgConfidence
		}));

		// Scales
		const x = d3
			.scaleTime()
			.domain(d3.extent(parsedData, (d) => d.time) as [Date, Date])
			.range([0, width]);

		const yCount = d3
			.scaleLinear()
			.domain([0, d3.max(parsedData, (d) => d.count) || 10])
			.nice()
			.range([height, 0]);

		const yConfidence = d3.scaleLinear().domain([0, 100]).range([height, 0]);

		// Area generator for count
		const area = d3
			.area<{ time: Date; count: number }>()
			.x((d) => x(d.time))
			.y0(height)
			.y1((d) => yCount(d.count))
			.curve(d3.curveMonotoneX);

		// Line generator for confidence
		const line = d3
			.line<{ time: Date; avgConfidence: number }>()
			.x((d) => x(d.time))
			.y((d) => yConfidence(d.avgConfidence))
			.curve(d3.curveMonotoneX);

		// Add area gradient
		const gradient = svg
			.append('defs')
			.append('linearGradient')
			.attr('id', 'area-gradient')
			.attr('x1', '0%')
			.attr('x2', '0%')
			.attr('y1', '0%')
			.attr('y2', '100%');

		gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.6);

		gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0);

		// Draw area (count)
		svg
			.append('path')
			.datum(parsedData)
			.attr('class', 'area')
			.attr('d', area)
			.attr('fill', 'url(#area-gradient)');

		// Draw line (confidence)
		svg
			.append('path')
			.datum(parsedData)
			.attr('class', 'line')
			.attr('d', line)
			.attr('fill', 'none')
			.attr('stroke', '#10b981')
			.attr('stroke-width', 2);

		// X Axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(
				d3
					.axisBottom(x)
					.ticks(6)
					.tickFormat((d) => d3.timeFormat('%H:%M')(d as Date))
			)
			.attr('color', '#6b7280');

		// Y Axis (count) - left
		svg
			.append('g')
			.call(d3.axisLeft(yCount).ticks(5))
			.attr('color', '#6b7280')
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -40)
			.attr('x', -height / 2)
			.attr('fill', '#3b82f6')
			.attr('text-anchor', 'middle')
			.text('Signal Count');

		// Y Axis (confidence) - right
		svg
			.append('g')
			.attr('transform', `translate(${width},0)`)
			.call(d3.axisRight(yConfidence).ticks(5))
			.attr('color', '#6b7280')
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 40)
			.attr('x', -height / 2)
			.attr('fill', '#10b981')
			.attr('text-anchor', 'middle')
			.text('Avg Confidence %');

		// Add legend
		const legend = svg.append('g').attr('transform', `translate(${width - 150}, 10)`);

		legend
			.append('rect')
			.attr('width', 20)
			.attr('height', 10)
			.attr('fill', '#3b82f6')
			.attr('opacity', 0.6);

		legend
			.append('text')
			.attr('x', 25)
			.attr('y', 10)
			.attr('fill', '#9ca3af')
			.style('font-size', '12px')
			.text('Signal Count');

		legend
			.append('line')
			.attr('x1', 0)
			.attr('y1', 25)
			.attr('x2', 20)
			.attr('y2', 25)
			.attr('stroke', '#10b981')
			.attr('stroke-width', 2);

		legend
			.append('text')
			.attr('x', 25)
			.attr('y', 30)
			.attr('fill', '#9ca3af')
			.style('font-size', '12px')
			.text('Avg Confidence');
	});

	// Re-render when data changes
	$effect(() => {
		if (chartContainer && data) {
			onMount();
		}
	});
</script>

<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
	<h2 class="text-xl font-bold mb-4">Signal Activity (24 Hours)</h2>
	<div bind:this={chartContainer} class="w-full"></div>
</div>

<style>
	:global(.area) {
		opacity: 0.8;
	}

	:global(.line) {
		filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.5));
	}
</style>
