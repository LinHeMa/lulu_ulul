<script lang="ts">
	import { onMount } from 'svelte';
	import { getPublishedPosts } from '$lib/github';
	import { formatDate, getExcerpt } from '$lib/markdown';
	import type { BlogPost } from '$lib/github';

	let posts: BlogPost[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			posts = await getPublishedPosts();
			loading = false;
		} catch (e: unknown) {
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
	<meta
		property="og:image"
		content="https://lulu-ulul.vercel.app/images/og-default.jpg"
	/>

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="lulu-ulul.vercel.app" />
	<meta property="twitter:url" content="https://lulu-ulul.vercel.app/" />
	<meta name="twitter:title" content="LinHeMa de Blog" />
	<meta name="twitter:description" content="LinHeMa de Blog" />
	<meta
		name="twitter:image"
		content="https://lulu-ulul.vercel.app/images/og-default.jpg"
	/>
</svelte:head>

<section>
	<h1 class="mb-6">Latest Posts</h1>

	{#if loading}
		<div class="py-4 text-center">
			<p class="text-light">Loading posts...</p>
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

	.text-light {
		color: var(--text-light);
	}
</style>
