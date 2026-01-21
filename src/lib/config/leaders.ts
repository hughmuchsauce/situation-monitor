/**
 * Leaders configuration for tracking
 * Focused on Greenland, Denmark, Arctic nations, and key global figures
 */

import type { WorldLeader } from '$lib/types';

export const WORLD_LEADERS: WorldLeader[] = [
	// Greenland
	{
		id: 'egede',
		name: 'Múte Bourup Egede',
		title: 'Premier',
		country: 'Greenland',
		flag: '🇬🇱',
		keywords: ['egede', 'greenland premier', 'naalakkersuisut', 'inuit ataqatigiit'],
		since: 'Apr 2021',
		party: 'Inuit Ataqatigiit',
		focus: ['independence', 'mining policy', 'danish relations']
	},
	{
		id: 'broberg',
		name: 'Vivian Motzfeldt',
		title: 'Foreign Minister',
		country: 'Greenland',
		flag: '🇬🇱',
		keywords: ['motzfeldt', 'greenland foreign', 'naalakkersuisut'],
		since: 'Apr 2021',
		party: 'Inuit Ataqatigiit'
	},

	// Denmark
	{
		id: 'frederiksen',
		name: 'Mette Frederiksen',
		title: 'Prime Minister',
		country: 'Denmark',
		flag: '🇩🇰',
		keywords: ['frederiksen', 'danish pm', 'denmark prime minister', 'statsminister'],
		since: 'Jun 2019',
		party: 'Social Democrats',
		focus: ['greenland policy', 'arctic security', 'nato']
	},
	{
		id: 'frederik',
		name: 'Frederik X',
		title: 'King',
		country: 'Denmark',
		flag: '🇩🇰',
		keywords: ['frederik', 'danish king', 'king of denmark', 'danish monarch'],
		since: 'Jan 2024',
		party: 'Royal Family'
	},
	{
		id: 'rasmussen',
		name: 'Lars Løkke Rasmussen',
		title: 'Foreign Minister',
		country: 'Denmark',
		flag: '🇩🇰',
		keywords: ['rasmussen', 'danish foreign minister', 'udenrigsminister'],
		since: 'Dec 2022',
		party: 'Moderates',
		focus: ['arctic policy', 'greenland', 'eu relations']
	},

	// United States
	{
		id: 'trump',
		name: 'Donald Trump',
		title: 'President',
		country: 'United States',
		flag: '🇺🇸',
		keywords: ['trump', 'potus', 'white house'],
		since: 'Jan 2025',
		party: 'Republican',
		focus: ['greenland acquisition', 'arctic', 'nato']
	},
	{
		id: 'vance',
		name: 'JD Vance',
		title: 'Vice President',
		country: 'United States',
		flag: '🇺🇸',
		keywords: ['jd vance', 'vice president vance'],
		since: 'Jan 2025',
		party: 'Republican'
	},
	{
		id: 'rubio',
		name: 'Marco Rubio',
		title: 'Secretary of State',
		country: 'United States',
		flag: '🇺🇸',
		keywords: ['rubio', 'secretary of state', 'state department'],
		since: 'Jan 2025',
		party: 'Republican',
		focus: ['arctic policy', 'china', 'nato']
	},

	// Nordic Countries
	{
		id: 'jakobsdottir',
		name: 'Katrín Jakobsdóttir',
		title: 'Prime Minister',
		country: 'Iceland',
		flag: '🇮🇸',
		keywords: ['jakobsdottir', 'iceland pm', 'icelandic prime minister'],
		since: 'Nov 2017',
		party: 'Left-Green Movement',
		focus: ['arctic council', 'nato', 'climate']
	},
	{
		id: 'store',
		name: 'Jonas Gahr Støre',
		title: 'Prime Minister',
		country: 'Norway',
		flag: '🇳🇴',
		keywords: ['store', 'støre', 'norway pm', 'norwegian prime minister'],
		since: 'Oct 2021',
		party: 'Labour Party',
		focus: ['arctic', 'nato', 'energy']
	},
	{
		id: 'kristersson',
		name: 'Ulf Kristersson',
		title: 'Prime Minister',
		country: 'Sweden',
		flag: '🇸🇪',
		keywords: ['kristersson', 'sweden pm', 'swedish prime minister'],
		since: 'Oct 2022',
		party: 'Moderate Party',
		focus: ['nato', 'arctic', 'defense']
	},
	{
		id: 'orpo',
		name: 'Petteri Orpo',
		title: 'Prime Minister',
		country: 'Finland',
		flag: '🇫🇮',
		keywords: ['orpo', 'finland pm', 'finnish prime minister'],
		since: 'Jun 2023',
		party: 'National Coalition',
		focus: ['nato', 'arctic', 'russia border']
	},

	// Canada
	{
		id: 'carney',
		name: 'Mark Carney',
		title: 'Prime Minister',
		country: 'Canada',
		flag: '🇨🇦',
		keywords: ['carney', 'canadian pm', 'canada prime minister', 'ottawa'],
		since: 'Mar 2025',
		party: 'Liberal',
		focus: ['arctic sovereignty', 'northwest passage', 'us relations']
	},

	// Russia (Arctic neighbor)
	{
		id: 'putin',
		name: 'Vladimir Putin',
		title: 'President',
		country: 'Russia',
		flag: '🇷🇺',
		keywords: ['putin', 'kremlin', 'russian president'],
		since: 'May 2012',
		party: 'United Russia',
		focus: ['arctic militarization', 'northern sea route', 'resources']
	},

	// China (Arctic interests)
	{
		id: 'xi',
		name: 'Xi Jinping',
		title: 'President',
		country: 'China',
		flag: '🇨🇳',
		keywords: ['xi jinping', 'xi', 'chinese president'],
		since: 'Mar 2013',
		party: 'CCP',
		focus: ['polar silk road', 'arctic shipping', 'rare earth']
	}
];
