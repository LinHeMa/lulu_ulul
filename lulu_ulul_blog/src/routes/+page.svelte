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
  <title>LinHeMa de Blog</title>
  <meta name="description" content="Taiwan is a country" />
  <meta property="og:image" content="http://ia.media-imdb.com/rock.jpg"/>
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
      <p class="text-light">No posts found. Create a GitHub Issue with the 'published' label to add your first post.</p>
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
              <p>
                {getExcerpt(post.body, 150)}
              </p>
              
              {#if post.tags.length > 0}
                <div class="tags mt-4">
                  {#each post.tags as tag}
                    <a href={`/tags/${tag}`} class="tag">
                      {tag}
                    </a>
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

<style>
  .error {
    color: #ef4444;
  }
  
  .card-link {
    display: block;
    color: inherit;
    text-decoration: none;
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
