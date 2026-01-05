import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

export type ThemeName = 'light' | 'dark';
export type ThemePreference = ThemeName | 'system';

export const THEME_STORAGE_KEY = 'theme-preference';

const preference = writable<ThemePreference>('system');
const resolved = writable<ThemeName>('light');

let mediaQuery: MediaQueryList | null = null;
let initialized = false;
let unsubscribePreference: (() => void) | null = null;

const isThemePreference = (value: unknown): value is ThemePreference =>
	value === 'light' || value === 'dark' || value === 'system';

const resolveTheme = (pref: ThemePreference): ThemeName => {
	if (pref === 'system') {
		return mediaQuery?.matches ? 'dark' : 'light';
	}
	return pref;
};

const syncDom = (theme: ThemeName) => {
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
};

const applyPreference = (pref: ThemePreference) => {
	if (!browser) return;
	if (pref === 'system') {
		localStorage.removeItem(THEME_STORAGE_KEY);
	} else {
		localStorage.setItem(THEME_STORAGE_KEY, pref);
	}
	const theme = resolveTheme(pref);
	resolved.set(theme);
	syncDom(theme);
};

function handleSystemChange() {
	if (get(preference) === 'system') {
		const theme = resolveTheme('system');
		resolved.set(theme);
		syncDom(theme);
	}
}

export const initTheme = () => {
	if (!browser || initialized) return;
	initialized = true;

	mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (isThemePreference(stored)) {
		preference.set(stored);
	}

	applyPreference(get(preference));

	unsubscribePreference = preference.subscribe((value) => {
		applyPreference(value);
	});

	mediaQuery?.addEventListener('change', handleSystemChange);
};

export const destroyTheme = () => {
	if (!browser || !initialized) return;
	mediaQuery?.removeEventListener('change', handleSystemChange);
	unsubscribePreference?.();
	unsubscribePreference = null;
	initialized = false;
};

export const toggleTheme = () => {
	preference.update((value) => {
		const current = value === 'system' ? resolveTheme('system') : value;
		return current === 'dark' ? 'light' : 'dark';
	});
};

export const setThemePreference = (value: ThemePreference) => {
	preference.set(value);
};

export const themePreference = preference;
export const currentTheme = resolved;
