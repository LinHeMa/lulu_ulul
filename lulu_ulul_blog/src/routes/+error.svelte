<script>
	import { page } from '$app/state';
	import { emojis } from './emojis';
</script>

<h1>{emojis[page.status] ?? emojis[500]} {page.error?.message}</h1>
<p class="not-found-text isDesktop">我正在努力架設中，希望下次你點進來就會有東西了</p>
<p class="not-found-text isMobile">我正在努力架設中</p>
<p class="not-found-text isMobile delay-1">希望下次你點進來</p>
<p class="not-found-text isMobile delay-2">就會有東西了</p>
<p>
	Go back to <a href="/">home</a>
</p>

<style>
	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes blink {
		50% {
			border-color: transparent;
		}
	}
	.delay-1 {
		animation-delay: 5s;
	}
	.delay-2 {
		animation-delay: 10s;
	}
	.isDesktop {
		@media screen and (max-width: 768px) {
			display: none;
		}
	}
	.isMobile {
		@media screen and (min-width: 768px) {
			display: none;
		}
	}

	.not-found-text {
		width: 38rem;
		animation: typing 5s steps(90, end);
		animation-delay: 3s;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		font-family: monospace;
		font-size: 2em;
		@media screen and (max-width: 768px) {
			max-width: 300px;
			text-wrap: wrap;
		}
	}
</style>
