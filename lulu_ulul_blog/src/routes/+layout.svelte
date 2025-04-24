<script lang="ts">
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<header class="header">
		<div class="container nav">
			<!-- Site title and logo -->
			<div>
				<a href="/" class="site-title">
					LinHeMa de Blog
				</a>
			</div>
			
			<!-- Navigation -->
			<nav>
				<ul class="nav-list">
					<li><a href="/" class="nav-link">Home</a></li>
					<li><a href="/tags" class="nav-link">Tags</a></li>
					<li><a href="/about" class="nav-link">About</a></li>
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
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	.min-h-screen {
		min-height: 100vh;
	}
	
	.site-title {
		font-weight: bold;
		font-size: 1.25rem;
		color: var(--text-dark);
		text-decoration: none;
	}
	
	@media (min-width: 768px) {
		.site-title {
			font-size: 1.5rem;
		}
	}
	
	.text-light {
		color: var(--text-light);
	}
</style>
