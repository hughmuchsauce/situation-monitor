/**
 * News API - Fetch Greenland-focused news from GDELT
 */

import { FEEDS } from '$lib/config/feeds';
import type { NewsItem, NewsCategory } from '$lib/types';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { fetchWithProxy, API_DELAYS, logger } from '$lib/config/api';
import { GREENLAND_GDELT_QUERY } from '$lib/config/greenland';

/**
 * Simple hash function to generate unique IDs from URLs
 */
function hashCode(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash).toString(36);
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse GDELT date format (20251202T224500Z) to valid Date
 */
function parseGdeltDate(dateStr: string): Date {
	if (!dateStr) return new Date();
	// Convert 20251202T224500Z to 2025-12-02T22:45:00Z
	const match = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
	if (match) {
		const [, year, month, day, hour, min, sec] = match;
		return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
	}
	// Fallback to standard parsing
	return new Date(dateStr);
}

interface GdeltArticle {
	title: string;
	url: string;
	seendate: string;
	domain: string;
	socialimage?: string;
}

interface GdeltResponse {
	articles?: GdeltArticle[];
}

/**
 * Transform GDELT article to NewsItem
 */
function transformGdeltArticle(
	article: GdeltArticle,
	category: NewsCategory,
	source: string,
	index: number
): NewsItem {
	const title = article.title || '';
	const alert = containsAlertKeyword(title);
	// Generate unique ID using category, URL hash, and index
	const urlHash = article.url ? hashCode(article.url) : Math.random().toString(36).slice(2);
	const uniqueId = `gdelt-${category}-${urlHash}-${index}`;

	const parsedDate = parseGdeltDate(article.seendate);

	return {
		id: uniqueId,
		title,
		link: article.url,
		pubDate: article.seendate,
		timestamp: parsedDate.getTime(),
		source: source || article.domain || 'Unknown',
		category,
		isAlert: !!alert,
		alertKeyword: alert?.keyword || undefined,
		region: detectRegion(title) ?? undefined,
		topics: detectTopics(title)
	};
}

// Greenland filter to append to all queries
const GREENLAND_FILTER =
	'(Greenland OR Nuuk OR "Kalaallit Nunaat" OR Pituffik OR Thule OR "Danish realm" OR "arctic greenland" OR Denmark)';

/**
 * Fetch news for a specific category using GDELT via proxy
 * All queries are filtered to include Greenland-relevant content
 */
export async function fetchCategoryNews(category: NewsCategory): Promise<NewsItem[]> {
	// Build query from category keywords with Greenland focus
	const categoryQueries: Record<NewsCategory, string> = {
		politics: `(${GREENLAND_FILTER} AND (politics OR government OR election OR parliament OR independence))`,
		tech: `(${GREENLAND_FILTER} AND (technology OR mining OR "rare earth" OR infrastructure OR research))`,
		finance: `(${GREENLAND_FILTER} AND (economy OR investment OR mining OR trade OR business))`,
		gov: `(${GREENLAND_FILTER} AND (government OR policy OR "foreign affairs" OR treaty OR nato))`,
		ai: `(arctic OR greenland) AND ("artificial intelligence" OR "machine learning" OR climate OR research)`,
		intel: `(${GREENLAND_FILTER} AND (military OR security OR defense OR nato OR "arctic security"))`
	};

	try {
		// Add English language filter and timespan for fresh results
		const baseQuery = categoryQueries[category];
		const fullQuery = `${baseQuery} sourcelang:english`;
		// Build the raw GDELT URL with timespan=7d to get recent articles
		const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(fullQuery)}&timespan=7d&mode=artlist&maxrecords=25&format=json&sort=date`;

		logger.log('News API', `Fetching ${category} from GDELT with Greenland filter`);

		const response = await fetchWithProxy(gdeltUrl);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		// Check content type before parsing as JSON
		const contentType = response.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			logger.warn('News API', `Non-JSON response for ${category}:`, contentType);
			return [];
		}

		const text = await response.text();
		let data: GdeltResponse;
		try {
			data = JSON.parse(text);
		} catch {
			logger.warn('News API', `Invalid JSON for ${category}:`, text.slice(0, 100));
			return [];
		}

		if (!data?.articles) return [];

		// Get source names for this category
		const categoryFeeds = FEEDS[category] || [];
		const defaultSource = categoryFeeds[0]?.name || 'News';

		return data.articles.map((article, index) =>
			transformGdeltArticle(article, category, article.domain || defaultSource, index)
		);
	} catch (error) {
		logger.error('News API', `Error fetching ${category}:`, error);
		return [];
	}
}

/** All news categories in fetch order */
const NEWS_CATEGORIES: NewsCategory[] = ['politics', 'tech', 'finance', 'gov', 'ai', 'intel'];

/** Create an empty news result object */
function createEmptyNewsResult(): Record<NewsCategory, NewsItem[]> {
	return { politics: [], tech: [], finance: [], gov: [], ai: [], intel: [] };
}

/**
 * Fetch all news - sequential with delays to avoid rate limiting
 */
export async function fetchAllNews(): Promise<Record<NewsCategory, NewsItem[]>> {
	const result = createEmptyNewsResult();

	for (let i = 0; i < NEWS_CATEGORIES.length; i++) {
		const category = NEWS_CATEGORIES[i];

		if (i > 0) {
			await delay(API_DELAYS.betweenCategories);
		}

		result[category] = await fetchCategoryNews(category);
	}

	return result;
}

/**
 * Fetch Greenland-specific news (primary query)
 */
export async function fetchGreenlandNews(): Promise<NewsItem[]> {
	try {
		const fullQuery = `${GREENLAND_GDELT_QUERY} sourcelang:english`;
		const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(fullQuery)}&timespan=7d&mode=artlist&maxrecords=50&format=json&sort=date`;

		logger.log('News API', 'Fetching primary Greenland news');

		const response = await fetchWithProxy(gdeltUrl);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const contentType = response.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return [];
		}

		const text = await response.text();
		let data: GdeltResponse;
		try {
			data = JSON.parse(text);
		} catch {
			return [];
		}

		if (!data?.articles) return [];

		return data.articles.map((article, index) =>
			transformGdeltArticle(article, 'politics', article.domain || 'News', index)
		);
	} catch (error) {
		logger.error('News API', 'Error fetching Greenland news:', error);
		return [];
	}
}
