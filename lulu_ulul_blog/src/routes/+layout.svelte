<script lang="ts">
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/clickOutside';
	import { currentTheme, destroyTheme, initTheme, toggleTheme } from '$lib/theme';
	import '../app.scss';
	import '../css/prism.css';

	let isMenuOpen = $state(false);
	const navItemsEnum = {
		HOME: 'Home',
		TAGS: 'Tags',
		ABOUT: 'About',
		RSS: 'Rss'
	};
	const navItems = [
		{ href: '/', title: navItemsEnum.HOME },
		{ href: '/tags', title: navItemsEnum.TAGS },
		{ href: '/about', title: navItemsEnum.ABOUT },
		{ href: '/feed.xml', title: navItemsEnum.RSS }
	];
	function closeMenu() {
		isMenuOpen = false;
	}

	onMount(() => {
		initTheme();
		return () => {
			destroyTheme();
		};
	});
</script>

<svelte:head>
	<!-- RSS Feed -->
	<link
		rel="alternate"
		type="application/rss+xml"
		title="RSS Feed for LinHeMa de Blog"
		href="/feed.xml"
	/>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="header">
		<div class="container nav">
			<!-- Site title and logo -->
			<div>
				<a href="/" class="site-title site-title-text"> LinHeMa de Blog </a>
			</div>

			<!-- Navigation -->
			<nav class="nav-controls">
				<ul class="nav-list">
					<li><a href="/" class="nav-link">Home</a></li>
					<li><a href="/tags" class="nav-link">Tags</a></li>
					<li><a href="/about" class="nav-link">About</a></li>
					<li>
						<a href="/feed.xml" class="nav-link" title="RSS Feed">
							<span class="rss-icon">RSS</span>
						</a>
					</li>
				</ul>
				<button
					class="theme-toggle"
					type="button"
					onclick={toggleTheme}
					aria-label={$currentTheme === 'dark' ? '切換成淺色主題' : '切換成深色主題'}
				>
					<span class="theme-toggle__icon" aria-hidden="true">
						{$currentTheme === 'dark' ? '🌙' : '☀️'}
					</span>
					<span class="theme-toggle__text">
						{$currentTheme === 'dark' ? 'Dark' : 'Light'}
					</span>
				</button>
				{#if isMenuOpen}
					<div class="full-screen-cover"></div>
					<ul class="nav-list-mobile" use:clickOutside={closeMenu}>
						{#each navItems as item}
							<li>
								{#if item.title === navItemsEnum.RSS}
									<a
										href={item.href}
										class="nav-link"
										title="RSS Feed"
										onclick={closeMenu}
									>
										<span class="rss-icon">{item.title}</span>
									</a>
								{:else}
									<a href={item.href} class="nav-link" onclick={closeMenu}>
										{item.title}
									</a>
								{/if}
							</li>
						{/each}
						<li class="mobile-toggle">
							<button
								class="theme-toggle theme-toggle--inline"
								type="button"
								onclick={toggleTheme}
								aria-label={$currentTheme === 'dark' ? '切換成淺色主題' : '切換成深色主題'}
							>
								<span class="theme-toggle__icon" aria-hidden="true">
									{$currentTheme === 'dark' ? '🌙' : '☀️'}
								</span>
								<span class="theme-toggle__text">
									{$currentTheme === 'dark' ? 'Dark' : 'Light'}
								</span>
							</button>
						</li>
					</ul>
				{/if}
				<button
					class="menu-button"
					type="button"
					aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}
					aria-expanded={isMenuOpen}
					onclick={() => (isMenuOpen = !isMenuOpen)}
				>
					<img src="/icons/icon-menu.png" alt="" aria-hidden="true" class="menu-icon" />
				</button>
			</nav>
		</div>
	</header>

	<main class="main">
		<div class="container">
			<slot />
		</div>
	</main>

	<footer class="footer">
		<div class="container">
			<div class="flex flex-col items-center justify-between">
				<div class="mb-4">
					<p class="text-light">
						&copy; {new Date().getFullYear()} LinHeMa de Blog. All rights reserved.
					</p>
				</div>
				<div>
					<a
						href="https://github.com/linhema"
						target="_blank"
						rel="noopener noreferrer"
						class="nav-link"
					>
						GitHub
					</a>
					<a href="/feed.xml" class="nav-link" title="RSS Feed">RSS</a>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	.min-h-screen {
		min-height: 100vh;
	}

	@media (min-width: 768px) {
		.site-title {
			font-size: 1.5rem;
		}
	}

	.nav-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.text-light {
		color: var(--text-light);
	}

	.rss-icon {
		display: inline-block;
		padding: 2px 5px;
		background-color: #f26522;
		color: white;
		font-size: 0.75rem;
		border-radius: 3px;
	}

	@keyframes typing {
		from {
			width: 0;
		}
	}

	@keyframes blink {
		50% {
			border-color: transparent;
		}
	}
	.site-title-text {
		display: block;
		color: #f26522;
		width: 15rem;
		animation:
			typing 2s steps(15),
			blink 0.5s step-end infinite alternate;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		font-family: monospace;
		font-size: 2em;
	}

	.menu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		border: 1px solid transparent;
		background: transparent;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.menu-button:focus-visible {
		outline: 2px solid var(--primary-color);
		outline-offset: 2px;
	}

	.menu-icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0;
		display: block;
	}

	@media screen and (min-width: 768px) {
		.menu-button {
			display: none;
		}
	}

	.full-screen-cover {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.theme-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background-color: var(--card-bg);
		color: var(--text-color);
		font-size: 0.85rem;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	.theme-toggle:hover {
		background-color: var(--border-color);
	}

	.theme-toggle__icon {
		line-height: 1;
		font-size: 1rem;
	}

	.theme-toggle__text {
		font-weight: 600;
	}

	@media screen and (max-width: 768px) {
		.theme-toggle {
			padding: 0.35rem 0.6rem;
			border-radius: 1rem;
		}

		.theme-toggle__text {
			display: none;
		}
	}

	.theme-toggle--inline {
		width: 100%;
		justify-content: flex-start;
	}

	.theme-toggle--inline .theme-toggle__text {
		display: inline;
	}

	.mobile-toggle {
		border-top: 1px solid var(--border-color);
		padding-top: 0.5rem;
	}
</style>
