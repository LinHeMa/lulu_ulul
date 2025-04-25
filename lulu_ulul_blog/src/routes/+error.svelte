<script>
	import { page } from '$app/state';
	import { emojis } from './emojis';
</script>

<h1>{emojis[page.status] ?? emojis[500]} {page.error?.message}</h1>
<p class="not-found-text">我正在努力架設中，希望下次你點進來就會有東西了</p>
<p>
	Go back to <a href="/">home</a>
</p>

<style>
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
	.not-found-text {
		width: 38rem;
		animation:
			typing 2s steps(23),
			blink 0.5s step-end infinite alternate;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		font-family: monospace;
		font-size: 2em;
	}
</style>
