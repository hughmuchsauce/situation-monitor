// Map configuration - Greenland-focused hotspots and strategic locations

import { GREENLAND_MAP } from './greenland';

export interface Hotspot {
	name: string;
	lat: number;
	lon: number;
	level: 'critical' | 'high' | 'elevated' | 'low';
	desc: string;
}

export interface ConflictZone {
	name: string;
	coords: [number, number][];
	color: string;
}

export interface Chokepoint {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface CableLanding {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface NuclearSite {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface MilitaryBase {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface Ocean {
	name: string;
	lat: number;
	lon: number;
}

export const THREAT_COLORS = {
	critical: '#ff0000',
	high: '#ff4444',
	elevated: '#ffcc00',
	low: '#00ff88'
} as const;

// Default map center on Greenland
export const MAP_CENTER = GREENLAND_MAP.center;
export const MAP_DEFAULT_ZOOM = GREENLAND_MAP.zoom;

// No sanctioned countries for Greenland focus
export const SANCTIONED_COUNTRY_IDS: number[] = [];

// Greenland-focused hotspots
export const HOTSPOTS: Hotspot[] = [
	{
		name: 'Nuuk',
		lat: 64.18,
		lon: -51.72,
		level: 'low',
		desc: 'Nuuk — Capital of Greenland, seat of Naalakkersuisut (government), population ~19,000'
	},
	{
		name: 'Pituffik',
		lat: 76.53,
		lon: -68.75,
		level: 'elevated',
		desc: 'Pituffik Space Base — US military installation, formerly Thule Air Base, strategic Arctic location'
	},
	{
		name: 'Ilulissat',
		lat: 69.22,
		lon: -51.1,
		level: 'low',
		desc: 'Ilulissat — UNESCO World Heritage site, Ilulissat Icefjord, major tourism hub'
	},
	{
		name: 'Sisimiut',
		lat: 66.94,
		lon: -53.67,
		level: 'low',
		desc: 'Sisimiut — Second largest town, Arctic Circle location, fishing industry center'
	},
	{
		name: 'Kangerlussuaq',
		lat: 67.01,
		lon: -50.7,
		level: 'low',
		desc: 'Kangerlussuaq — Main international airport hub, former US air base, ice sheet access point'
	},
	{
		name: 'Qaanaaq',
		lat: 77.47,
		lon: -69.23,
		level: 'elevated',
		desc: 'Qaanaaq — Northernmost town, Inughuit community, near Pituffik Space Base'
	},
	{
		name: 'Tasiilaq',
		lat: 65.61,
		lon: -37.64,
		level: 'low',
		desc: 'Tasiilaq — Largest town in East Greenland, gateway to remote eastern regions'
	},
	{
		name: 'Qaqortoq',
		lat: 60.72,
		lon: -46.03,
		level: 'low',
		desc: 'Qaqortoq — Largest town in South Greenland, Norse history, agricultural area'
	},
	{
		name: 'Upernavik',
		lat: 72.79,
		lon: -56.15,
		level: 'low',
		desc: 'Upernavik — Northern fishing community, ice sheet research area'
	},
	{
		name: 'Narsarsuaq',
		lat: 61.16,
		lon: -45.43,
		level: 'low',
		desc: 'Narsarsuaq — Southern airport, former WWII US base, agricultural region'
	},
	{
		name: 'Copenhagen',
		lat: 55.68,
		lon: 12.57,
		level: 'low',
		desc: 'Copenhagen — Danish capital, seat of Danish government, Greenland policy decisions'
	},
	{
		name: 'Reykjavik',
		lat: 64.15,
		lon: -21.94,
		level: 'low',
		desc: 'Reykjavik — Iceland capital, Arctic Council participant, regional partner'
	},
	{
		name: 'DC',
		lat: 38.9,
		lon: -77.0,
		level: 'elevated',
		desc: 'Washington DC — US political center, Greenland acquisition discussions, Arctic policy'
	}
];

// Arctic-focused zones of interest (not conflict zones)
export const CONFLICT_ZONES: ConflictZone[] = [
	{
		name: 'Greenland',
		coords: [
			[-73, 60],
			[-73, 84],
			[-11, 84],
			[-11, 60],
			[-73, 60]
		],
		color: '#00ff8844'
	},
	{
		name: 'Arctic Shipping Route',
		coords: [
			[-100, 70],
			[-100, 85],
			[40, 85],
			[40, 70],
			[-100, 70]
		],
		color: '#4488ff22'
	}
];

// Arctic-relevant strategic passages
export const CHOKEPOINTS: Chokepoint[] = [
	{
		name: 'Davis Strait',
		lat: 66.5,
		lon: -57.0,
		desc: 'Davis Strait — Between Greenland and Canada, Arctic shipping route'
	},
	{
		name: 'Denmark Strait',
		lat: 66.0,
		lon: -26.0,
		desc: 'Denmark Strait — Between Greenland and Iceland, North Atlantic access'
	},
	{
		name: 'Nares Strait',
		lat: 80.5,
		lon: -67.0,
		desc: 'Nares Strait — Between Greenland and Canada, High Arctic passage'
	},
	{
		name: 'Fram Strait',
		lat: 79.0,
		lon: 0.0,
		desc: 'Fram Strait — Between Greenland and Svalbard, Arctic Ocean gateway'
	},
	{
		name: 'GIUK Gap',
		lat: 63.0,
		lon: -20.0,
		desc: 'GIUK Gap — Greenland-Iceland-UK gap, NATO strategic chokepoint'
	}
];

// Arctic cable infrastructure
export const CABLE_LANDINGS: CableLanding[] = [
	{
		name: 'Nuuk',
		lat: 64.18,
		lon: -51.72,
		desc: 'Nuuk — Greenland Connect cable, link to Iceland and Canada'
	},
	{
		name: 'Qaqortoq',
		lat: 60.72,
		lon: -46.03,
		desc: 'Qaqortoq — Southern Greenland cable landing'
	},
	{
		name: 'Reykjavik',
		lat: 64.15,
		lon: -21.94,
		desc: 'Reykjavik — Iceland hub, connects Greenland to Europe'
	}
];

// No nuclear sites in Greenland focus (though Thule historically had nuclear presence)
export const NUCLEAR_SITES: NuclearSite[] = [];

// Arctic military installations
export const MILITARY_BASES: MilitaryBase[] = [
	{
		name: 'Pituffik',
		lat: 76.53,
		lon: -68.75,
		desc: 'Pituffik Space Base — US Space Force, missile warning, Arctic operations'
	},
	{
		name: 'Keflavik',
		lat: 64.0,
		lon: -22.6,
		desc: 'Keflavik — NATO Air Policing, Iceland, regional defense'
	},
	{
		name: 'Station Nord',
		lat: 81.6,
		lon: -16.65,
		desc: 'Station Nord — Danish military outpost, northernmost in Greenland'
	},
	{
		name: 'Mestersvig',
		lat: 72.24,
		lon: -23.93,
		desc: 'Mestersvig — Danish Sirius Patrol base, East Greenland'
	}
];

// Ocean labels for Greenland region
export const OCEANS: Ocean[] = [
	{ name: 'ARCTIC OCEAN', lat: 82, lon: -40 },
	{ name: 'GREENLAND SEA', lat: 75, lon: -10 },
	{ name: 'BAFFIN BAY', lat: 73, lon: -65 },
	{ name: 'LABRADOR SEA', lat: 58, lon: -55 },
	{ name: 'NORTH ATLANTIC', lat: 55, lon: -30 }
];

export const WEATHER_CODES: Record<number, string> = {
	0: '☀️ Clear',
	1: '🌤️ Mostly clear',
	2: '⛅ Partly cloudy',
	3: '☁️ Overcast',
	45: '🌫️ Fog',
	48: '🌫️ Fog',
	51: '🌧️ Drizzle',
	53: '🌧️ Drizzle',
	55: '🌧️ Drizzle',
	61: '🌧️ Rain',
	63: '🌧️ Rain',
	65: '🌧️ Heavy rain',
	71: '🌨️ Snow',
	73: '🌨️ Snow',
	75: '🌨️ Heavy snow',
	77: '🌨️ Snow',
	80: '🌧️ Showers',
	81: '🌧️ Showers',
	82: '⛈️ Heavy showers',
	85: '🌨️ Snow',
	86: '🌨️ Snow',
	95: '⛈️ Thunderstorm',
	96: '⛈️ Thunderstorm',
	99: '⛈️ Thunderstorm'
};
