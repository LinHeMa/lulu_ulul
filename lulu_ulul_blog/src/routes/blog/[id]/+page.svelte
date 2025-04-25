<!-- src/routes/blog/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getBlogPost } from '$lib/github';
	import { parseMarkdown, formatDate } from '$lib/markdown';
	import Giscus from '@giscus/svelte';
	import type { BlogPost } from '$lib/github';

	let post: BlogPost | null = null;
	let loading = true;
	let error: string | null = null;
	let htmlContent = '';

	onMount(async () => {
		try {
			const id = parseInt($page.params.id);
			post = await getBlogPost(id);

			if (post) {
				htmlContent = parseMarkdown(post.body);
			} else {
				error = 'Post not found';
			}

			loading = false;
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'Unknown error';
			loading = false;
		}
	});

	// Site metadata
	const siteName = 'LinHeMa de Blog';
	const siteUrl = 'https://linhema.dev'; // Change to your actual domain
	const defaultImage = 'static/images/og-default.jpg'; // Path to your default OG image
</script>

<svelte:head>
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

<div>
	{#if loading}
		<div class="py-12 text-center">
			<p class="text-gray-500 dark:text-gray-400">Loading post...</p>
		</div>
	{:else if error}
		<div class="py-12 text-center">
			<p class="text-red-500">Error: {error}</p>
			<p class="text-gray-500 dark:text-gray-400 mt-2">
				Unable to load blog post. Please try again later.
			</p>
			<div class="mt-6">
				<a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
					Return to Home
				</a>
			</div>
		</div>
	{:else if post}
		<article class="prose dark:prose-invert lg:prose-lg max-w-none">
			<header class="mb-8">
				<h1 class="mb-2">{post.title}</h1>
				<div class="flex items-center text-gray-500 dark:text-gray-400 mb-4">
					<span>{formatDate(post.created_at)}</span>
					{#if post.created_at !== post.updated_at}
						<span class="mx-2">•</span>
						<span>Updated: {formatDate(post.updated_at)}</span>
					{/if}
				</div>

				{#if post.tags.length > 0}
					<div class="flex flex-wrap gap-2 mb-6">
						{#each post.tags as tag}
							<a
								href={`/tags/${tag}`}
								class="inline-block px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
							>
								{tag}
							</a>
						{/each}
					</div>
				{/if}
			</header>

			<div class="blog-content">
				{@html htmlContent}
			</div>

			<div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
				<div class="flex justify-between items-center mb-6">
					<a
						href="/"
						class="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
					>
						&larr; Back to all posts
					</a>
					<a
						href={post.html_url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						View on GitHub
					</a>
				</div>
			</div>
		</article>

		<!-- Comments section -->
		<section class="mt-12">
			<h2 class="text-2xl font-bold mb-6">Comments</h2>

			<Giscus
				id="comments"
				repo="linhema/lulu_ulul"
				repoId="R_kgDOLbYpXQ"
				category="Announcements"
				categoryId="DIC_kwDOLbYpXc4CUYS5"
				mapping="pathname"
				term="not-used-with-pathname"
				reactionsEnabled="1"
				emitMetadata="0"
				inputPosition="top"
				theme="light"
				lang="en"
			/>
		</section>
	{/if}
</div>
