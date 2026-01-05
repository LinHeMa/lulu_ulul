import type { ThemeName } from '$lib/theme';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		CUSDIS?: {
			renderTo: (element: HTMLElement) => void;
			setTheme?: (theme: ThemeName) => void;
		};
	}
}

export {};
