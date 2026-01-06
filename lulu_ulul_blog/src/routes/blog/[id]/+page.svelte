<!-- src/routes/blog/[id]/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getBlogPost } from '$lib/github';
	import { parseMarkdown, formatDate } from '$lib/markdown';
	import CommentSection from '$lib/components/comments/CommentSection.svelte';
	import type { BlogPost } from '$lib/github';
	import './_styles/page.scss';
	import Tag from '$lib/components/tag/Tag.svelte';
	type ImageDimensions = { width: number; height: number };
	type ImageDimensionMap = Record<string, ImageDimensions>;
	const IMAGE_CACHE_KEY = 'blog-image-dimensions';
	const FALLBACK_IMAGE_DIMENSIONS: ImageDimensions = { width: 4, height: 3 };

	let post: BlogPost | null = null;
	let loading = true;
	let error: string | null = null;
	let htmlContent = '';
	let contentRef: HTMLDivElement | null = null;
	let imageDimensionCache: ImageDimensionMap = {};

	const loadImageDimensionCache = (): ImageDimensionMap => {
		if (!browser) return {};
		try {
			const cached = localStorage.getItem(IMAGE_CACHE_KEY);
			return cached ? (JSON.parse(cached) as ImageDimensionMap) : {};
		} catch (cacheError) {
			console.warn('Unable to parse cached image dimensions.', cacheError);
			return {};
		}
	};

	const persistImageDimensionCache = () => {
		if (!browser) return;
		try {
			localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(imageDimensionCache));
		} catch (persistError) {
			console.warn('Unable to store image dimensions.', persistError);
		}
	};

	const applyImageDimensions = (img: HTMLImageElement, dims?: ImageDimensions) => {
		const dimension = dims ?? FALLBACK_IMAGE_DIMENSIONS;
		img.style.setProperty('--image-width', String(dimension.width));
		img.style.setProperty('--image-height', String(dimension.height));
		img.dataset.loaded = dims ? 'true' : 'false';
	};

	const decodeImageKey = (img: HTMLImageElement): string => {
		const encoded = img.dataset.imgKey;
		if (encoded) {
			try {
				return decodeURIComponent(encoded);
			} catch {
				return encoded;
			}
		}
		return img.getAttribute('src') ?? '';
	};

	const captureImageDimensions = (img: HTMLImageElement) => {
		if (!img.naturalWidth || !img.naturalHeight) return;
		const key = decodeImageKey(img);
		if (!key) return;
		const dimensions = {
			width: img.naturalWidth,
			height: img.naturalHeight
		};
		imageDimensionCache[key] = dimensions;
		applyImageDimensions(img, dimensions);
		img.dataset.loaded = 'true';
		persistImageDimensionCache();
	};

	const hydrateImageElement = (img: HTMLImageElement) => {
		if (img.dataset.hydrated === 'true') {
			return;
		}

		img.dataset.hydrated = 'true';
		const key = decodeImageKey(img);
		const cached = key ? imageDimensionCache[key] : undefined;
		applyImageDimensions(img, cached);

		if (img.complete) {
			captureImageDimensions(img);
		} else {
			img.addEventListener(
				'load',
				() => {
					captureImageDimensions(img);
				},
				{ once: true }
			);
			img.addEventListener(
				'error',
				() => {
					img.dataset.loaded = 'error';
				},
				{ once: true }
			);
		}
	};

	const hydrateImages = async () => {
		await tick();
		if (!contentRef) return;
		const images = contentRef.querySelectorAll<HTMLImageElement>('img[data-content-image="true"]');
		images.forEach(hydrateImageElement);
	};

	onMount(async () => {
		if (browser) {
			imageDimensionCache = loadImageDimensionCache();
		}

		try {
			const id = parseInt($page.params.id);
			post = await getBlogPost(id);

			if (post) {
				htmlContent = parseMarkdown(post.body);
				await hydrateImages();
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
	const articleId = $page.params.id;
</script>

<svelte:head>
	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://lulu-ulul.vercel.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="LinHeMa de Blog" />
	<meta property="og:description" content="LinHeMa de Blog" />
	<meta
		property="og:image"
		content={`https://lulu-ulul.vercel.app/images/og-${articleId}.jpg`}
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
		<article class="article-container">
			<header class="mb-8">
				<h1 class="mb-2">{post.title}</h1>
				<div class="flex items-center text-gray-500 dark:text-gray-400 mb-4">
					<span>{formatDate(post.created_at)}</span>
					{#if post.created_at !== post.updated_at}
						<span class="mx-2">•</span>
						<span class="article-date">Updated: {formatDate(post.updated_at)}</span>
					{/if}
				</div>

				{#if post.tags.length > 0}
					<div class="flex flex-wrap gap-2 mb-6">
						{#each post.tags as tag}
							<Tag tagId={tag} />
						{/each}
					</div>
				{/if}
			</header>

			<div class="blog-content" bind:this={contentRef}>
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

			<CommentSection postId={post.number} postTitle={post.title} />
		</section>
	{/if}
</div>
