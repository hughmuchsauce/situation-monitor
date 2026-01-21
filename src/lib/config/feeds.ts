/**
 * RSS feed and news source configuration
 * Focused on Greenland, Arctic, and Nordic news
 */

import type { NewsCategory } from '$lib/types';

export interface FeedSource {
	name: string;
	url: string;
}

export interface IntelSource extends FeedSource {
	type: 'think-tank' | 'defense' | 'regional' | 'osint' | 'govt' | 'cyber' | 'arctic';
	topics: string[];
	region?: string;
}

export const FEEDS: Record<NewsCategory, FeedSource[]> = {
	politics: [
		{ name: 'Arctic Today', url: 'https://www.arctictoday.com/feed/' },
		{ name: 'High North News', url: 'https://www.highnorthnews.com/en/rss.xml' },
		{ name: 'The Local Denmark', url: 'https://feeds.thelocal.com/rss/dk' },
		{ name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
		{ name: 'Reuters', url: 'https://www.reutersagency.com/feed/' }
	],
	tech: [
		{ name: 'Arctic Today', url: 'https://www.arctictoday.com/feed/' },
		{ name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
		{ name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' }
	],
	finance: [
		{ name: 'High North News', url: 'https://www.highnorthnews.com/en/rss.xml' },
		{
			name: 'Reuters Business',
			url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best'
		},
		{ name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' }
	],
	gov: [
		{ name: 'Arctic Council', url: 'https://arctic-council.org/feed/' },
		{ name: 'NATO News', url: 'https://www.nato.int/cps/en/natolive/news.xml' },
		{ name: 'US State Dept', url: 'https://www.state.gov/rss-feed/press-releases/feed/' }
	],
	ai: [
		{ name: 'ArXiv Climate', url: 'https://rss.arxiv.org/rss/physics.ao-ph' },
		{ name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' }
	],
	intel: [
		{ name: 'High North News', url: 'https://www.highnorthnews.com/en/rss.xml' },
		{ name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
		{ name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/' }
	]
};

export const INTEL_SOURCES: IntelSource[] = [
	// Arctic-focused sources
	{
		name: 'Arctic Institute',
		url: 'https://www.thearcticinstitute.org/feed/',
		type: 'arctic',
		topics: ['arctic', 'geopolitics', 'climate'],
		region: 'ARCTIC'
	},
	{
		name: 'High North News',
		url: 'https://www.highnorthnews.com/en/rss.xml',
		type: 'arctic',
		topics: ['arctic', 'norway', 'security'],
		region: 'ARCTIC'
	},
	{
		name: 'Arctic Today',
		url: 'https://www.arctictoday.com/feed/',
		type: 'arctic',
		topics: ['arctic', 'greenland', 'climate'],
		region: 'ARCTIC'
	},

	// Think tanks with Arctic coverage
	{
		name: 'CSIS',
		url: 'https://www.csis.org/analysis/feed',
		type: 'think-tank',
		topics: ['defense', 'geopolitics', 'arctic']
	},
	{
		name: 'Brookings',
		url: 'https://www.brookings.edu/feed/',
		type: 'think-tank',
		topics: ['policy', 'geopolitics']
	},
	{
		name: 'CFR',
		url: 'https://www.cfr.org/rss.xml',
		type: 'think-tank',
		topics: ['foreign-policy', 'arctic']
	},
	{
		name: 'Atlantic Council',
		url: 'https://www.atlanticcouncil.org/feed/',
		type: 'think-tank',
		topics: ['nato', 'arctic', 'security']
	},

	// Defense sources
	{
		name: 'Defense One',
		url: 'https://www.defenseone.com/rss/all/',
		type: 'defense',
		topics: ['military', 'defense', 'arctic']
	},
	{
		name: 'Breaking Defense',
		url: 'https://breakingdefense.com/feed/',
		type: 'defense',
		topics: ['military', 'defense']
	},
	{
		name: 'The Drive War Zone',
		url: 'https://www.thedrive.com/the-war-zone/feed',
		type: 'defense',
		topics: ['military']
	},

	// Nordic/Regional sources
	{
		name: 'The Local Denmark',
		url: 'https://feeds.thelocal.com/rss/dk',
		type: 'regional',
		topics: ['denmark', 'nordic'],
		region: 'DENMARK'
	},
	{
		name: 'Iceland Review',
		url: 'https://www.icelandreview.com/feed/',
		type: 'regional',
		topics: ['iceland', 'nordic', 'arctic'],
		region: 'NORDIC'
	},

	// OSINT
	{
		name: 'Bellingcat',
		url: 'https://www.bellingcat.com/feed/',
		type: 'osint',
		topics: ['investigation', 'osint']
	},

	// Government/Official
	{
		name: 'Arctic Council',
		url: 'https://arctic-council.org/feed/',
		type: 'govt',
		topics: ['arctic', 'policy', 'climate'],
		region: 'ARCTIC'
	}
];
