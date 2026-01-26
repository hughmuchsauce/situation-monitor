import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// Enable prerendering for static site generation
export const prerender = true;
export const ssr = false;

// Initialize Vercel Web Analytics
injectAnalytics({ mode: dev ? 'development' : 'production' });
