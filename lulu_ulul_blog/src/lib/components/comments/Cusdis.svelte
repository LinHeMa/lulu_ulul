<script lang="ts">
 	import { browser } from '$app/environment';
 	import { onDestroy, onMount } from 'svelte';
 	import { get } from 'svelte/store';
	import { env as publicEnv } from '$env/dynamic/public';
	import { currentTheme, type ThemeName } from '$lib/theme';

	export let pageId: string;
	export let pageUrl: string;
	export let pageTitle: string;

	const cusdisHost = (publicEnv.PUBLIC_CUSDIS_HOST || 'https://cusdis.com').replace(/\/$/, '');
	const appId = publicEnv.PUBLIC_CUSDIS_APP_ID;

  let threadEl: HTMLDivElement | null = null;
  let scriptLoaded = false;
  let unsubscribe: (() => void) | null = null;

  type CusdisGlobal = {
    renderTo: (element: HTMLElement) => void;
    setTheme?: (theme: ThemeName) => void;
  };

  const ensureCusdisScript = () => {
    if (!browser) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-cusdis-script="true"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          scriptLoaded = true;
          resolve();
          return;
        }
        existing.addEventListener(
          'load',
          () => {
            existing.dataset.loaded = 'true';
            scriptLoaded = true;
            resolve();
          },
          { once: true }
        );
        return;
      }

      const script = document.createElement('script');
      script.src = `${cusdisHost}/js/cusdis.es.js`;
      script.async = true;
      script.defer = true;
      script.dataset.cusdisScript = 'true';
      script.addEventListener(
        'load',
        () => {
          script.dataset.loaded = 'true';
          scriptLoaded = true;
          resolve();
        },
        { once: true }
      );
      document.head.appendChild(script);
    });
  };

  const syncTheme = (theme: ThemeName) => {
    if (!browser) return;
    window.CUSDIS?.setTheme?.(theme);
  };

  const renderComments = () => {
    if (!browser || !threadEl) return;
    window.CUSDIS?.renderTo(threadEl);
  };

  let lastRenderKey = '';

  const refreshIfNeeded = () => {
    if (!browser || !scriptLoaded || !threadEl) return;
    const nextKey = `${pageId}:${pageUrl}:${pageTitle}`;
    if (nextKey === lastRenderKey) return;
    lastRenderKey = nextKey;
    renderComments();
  };

  onMount(async () => {
    if (!appId) {
      console.warn('Cusdis app id is missing. Comments widget is disabled.');
      return;
    }

    await ensureCusdisScript();
    renderComments();
    syncTheme(get(currentTheme));

    unsubscribe = currentTheme.subscribe((theme) => {
      syncTheme(theme);
    });
  });

  onDestroy(() => {
    unsubscribe?.();
    unsubscribe = null;
  });

  $: refreshIfNeeded();
</script>

{#if !appId}
  <p class="text-gray-500 dark:text-gray-400">Comments are unavailable because Cusdis is not configured.</p>
{:else}
  <div
    id="cusdis_thread"
    bind:this={threadEl}
    data-host={cusdisHost}
    data-app-id={appId}
    data-page-id={pageId}
    data-page-url={pageUrl}
    data-page-title={pageTitle}
  ></div>
{/if}
