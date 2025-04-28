<script lang="ts"></script>

<div class="now-playing-container">
	<p class="title">Now Playing</p>
	<p>這裡是會不定期更新的播放</p>
	<iframe
		src="https://www.youtube.com/embed/ogxU3tW9WLU?si=DPTDBy1xqsQEmY0g"
		title="科幻小說 (prod. by Sōryo)"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</div>

<style>
	.now-playing-container {
		max-width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1rem;
		.title {
			font-size: 2rem;
			margin-bottom: 1.5rem;
			font-weight: 700;
		}
		iframe {
			flex: 1;
			aspect-ratio: 16/9;
		}
	}
</style>
