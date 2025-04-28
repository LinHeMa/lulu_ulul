<script lang="ts">
	import { onMount } from 'svelte';
	import { getPublishedPosts } from '$lib/github';
	import { formatDate, getExcerpt } from '$lib/markdown';
	import type { BlogPost } from '$lib/github';
	import NowPlaying from '$lib/components/nowPlaying/NowPlaying.svelte';
	import Weather from '$lib/components/Weather.svelte';

	let posts: BlogPost[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			posts = await getPublishedPosts();
			loading = false;

		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
			loading = false;
		}
	});
</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<title>LinHeMa de Blog</title>
	<meta name="description" content="LinHeMa de Blog" />
	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://lulu-ulul.vercel.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="LinHeMa de Blog" />
	<meta property="og:description" content="LinHeMa de Blog" />
	<meta property="og:image" content="https://lulu-ulul.vercel.app/images/og-default.jpg" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="lulu-ulul.vercel.app" />
	<meta property="twitter:url" content="https://lulu-ulul.vercel.app/" />
	<meta name="twitter:title" content="LinHeMa de Blog" />
	<meta name="twitter:description" content="LinHeMa de Blog" />
	<meta name="twitter:image" content="https://lulu-ulul.vercel.app/images/og-default.jpg" />
</svelte:head>

<section>
	<Weather />
	<NowPlaying />
	<h1 class="mb-6">Latest Posts</h1>

	{#if loading}
		<div class="py-4 text-center loader-container">
			<span class="loader"></span>
		</div>
	{:else if error}
		<div class="py-4 text-center">
			<p class="error">Error: {error}</p>
			<p class="text-light mt-2">Unable to load blog posts. Please try again later.</p>
		</div>
	{:else if posts.length === 0}
		<div class="py-4 text-center">
			<p class="text-light">
				No posts found. Create a GitHub Issue with the 'published' label to add your first post.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-3">
			{#each posts as post}
				<article class="card">
					<a href={post.url} class="card-link">
						<div class="card-body">
							<h2 class="card-title">{post.title}</h2>
							<div class="card-meta">
								{formatDate(post.created_at)}
							</div>
							<p class="card-excerpt">
								{getExcerpt(post.body, 150)}
							</p>

							{#if post.tags.length > 0}
								<div class="tags mt-4">
									{#each post.tags as tag}
										<span class="tag">
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				</article>
			{/each}
		</div>
	{/if}
</section>

<!-- TODO: move to scss file -->
<style>
	.error {
		color: #ef4444;
	}

	.card-link {
		display: block;
		color: inherit;
		text-decoration: none;
		height: 100%;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
	}

	.py-4 {
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.text-center {
		text-align: center;
	}

	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.text-light {
		color: var(--text-light);
	}

	.loader {
		animation: rotate 1s infinite;
		height: 50px;
		width: 50px;
	}

	.loader:before,
	.loader:after {
		border-radius: 50%;
		content: '';
		display: block;
		height: 20px;
		width: 20px;
	}
	.loader:before {
		animation: ball1 1s infinite;
		background-color: #fff;
		box-shadow: 30px 0 0 #ff3d00;
		margin-bottom: 10px;
	}
	.loader:after {
		animation: ball2 1s infinite;
		background-color: #ff3d00;
		box-shadow: 30px 0 0 #fff;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg) scale(0.8);
		}
		50% {
			transform: rotate(360deg) scale(1.2);
		}
		100% {
			transform: rotate(720deg) scale(0.8);
		}
	}

	@keyframes ball1 {
		0% {
			box-shadow: 30px 0 0 #ff3d00;
		}
		50% {
			box-shadow: 0 0 0 #ff3d00;
			margin-bottom: 0;
			transform: translate(15px, 15px);
		}
		100% {
			box-shadow: 30px 0 0 #ff3d00;
			margin-bottom: 10px;
		}
	}

	@keyframes ball2 {
		0% {
			box-shadow: 30px 0 0 #fff;
		}
		50% {
			box-shadow: 0 0 0 #fff;
			margin-top: -20px;
			transform: translate(15px, 15px);
		}
		100% {
			box-shadow: 30px 0 0 #fff;
			margin-top: 0;
		}
	}
</style>
