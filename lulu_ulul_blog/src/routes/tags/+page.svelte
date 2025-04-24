<!-- src/routes/tags/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllTags } from '$lib/github';
  
  let tags: string[] = [];
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      tags = await getAllTags();
      loading = false;
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Unknown error';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Tags | LinHeMa de Blog</title>
  <meta name="description" content="Browse blog posts by tag" />
</svelte:head>

<section>
  <h1 class="text-3xl md:text-4xl font-bold mb-6">Browse by Tag</h1>
  
  {#if loading}
    <div class="py-12 text-center">
      <p class="text-gray-500 dark:text-gray-400">Loading tags...</p>
    </div>
  {:else if error}
    <div class="py-12 text-center">
      <p class="text-red-500">Error: {error}</p>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Unable to load tags. Please try again later.</p>
    </div>
  {:else if tags.length === 0}
    <div class="py-12 text-center">
      <p class="text-gray-500 dark:text-gray-400">No tags found.</p>
      <p class="text-gray-600 dark:text-gray-300 mt-2">Add labels to your GitHub Issues to create tags.</p>
    </div>
  {:else}
    <div class="flex flex-wrap gap-4">
      {#each tags as tag}
        <a href={`/tags/${tag}`} class="inline-block px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-lg">
          {tag}
        </a>
      {/each}
    </div>
  {/if}
</section> 