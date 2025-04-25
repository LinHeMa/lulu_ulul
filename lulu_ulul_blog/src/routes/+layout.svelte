<script lang="ts">
	import '../app.scss';
	import '../css/prism.css';
	
	// Site configuration
	const siteUrl = 'https://lulu-ulul.vercel.app';
</script>

<svelte:head>
	<!-- RSS Feed -->
	<link rel="alternate" type="application/rss+xml" title="RSS Feed for LinHeMa de Blog" href="/feed.xml" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="header">
		<div class="container nav">
			<!-- Site title and logo -->
			<div>
				<a href="/" class="site-title site-title-text">
					LinHeMa de Blog
				</a>
			</div>
			
			<!-- Navigation -->
			<nav>
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
					<a href="https://github.com/linhema" target="_blank" rel="noopener noreferrer" class="nav-link">
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
	
	/* .site-title {
		font-weight: bold;
		font-size: 1.25rem;
		color: var(--text-dark);
		text-decoration: none;
	} */
	
	@media (min-width: 768px) {
		.site-title {
			font-size: 1.5rem;
		}
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
</style>
