<script lang="ts">
	import './tag.scss';
    const { tagId } = $props();
</script>

<a href={`/tags/${tagId}`} class="article-tag">
	{tagId}
</a>
