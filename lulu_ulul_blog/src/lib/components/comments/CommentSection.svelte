<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/markdown';
	import type { CommentRecord } from '$lib/comments/types';

	export let postId: number;
	export let postTitle: string;

	type MessageState = { type: 'success' | 'error'; text: string } | null;

	let comments: CommentRecord[] = [];
	let loading = true;
	let error: string | null = null;
	let submitting = false;
	let submitMessage: MessageState = null;

	let authorName = '';
	let authorEmail = '';
	let content = '';

	const fetchComments = async () => {
		if (!postId) return;
		loading = true;
		error = null;
		try {
			const response = await fetch(`/api/comments?postId=${postId}`);
			if (!response.ok) {
				throw new Error('無法載入留言');
			}
			comments = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : '載入留言失敗';
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		void fetchComments();
	});

	const resetForm = () => {
		authorName = '';
		authorEmail = '';
		content = '';
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (submitting) return;
		submitMessage = null;
		const trimmedName = authorName.trim();
		const trimmedContent = content.trim();
		const trimmedEmail = authorEmail.trim();

		if (trimmedName.length < 2) {
			submitMessage = { type: 'error', text: '請輸入至少 2 個字的暱稱' };
			return;
		}

		if (trimmedContent.length < 5) {
			submitMessage = { type: 'error', text: '留言內容至少 5 個字' };
			return;
		}

		if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			submitMessage = { type: 'error', text: 'Email 格式不正確' };
			return;
		}

		try {
			submitting = true;
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					postId,
					authorName: trimmedName,
					authorEmail: trimmedEmail || undefined,
					content: trimmedContent
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.error || '留言送出失敗');
			}

			if (data.comment && !data.requiresApproval) {
				comments = [...comments, data.comment];
			} else {
				void fetchComments();
			}

			submitMessage = {
				type: 'success',
				text: data.requiresApproval
					? '留言已送出，待我審核後就會顯示'
					: '留言已送出！'
			};
			resetForm();
		} catch (err) {
			submitMessage = {
				type: 'error',
				text: err instanceof Error ? err.message : '留言送出失敗'
			};
		} finally {
			submitting = false;
		}
	};
</script>

<div class="comment-section">
	<div class="comment-list">
		{#if loading}
			<p class="text-muted">留言載入中...</p>
		{:else if error}
			<div class="error-banner">{error}</div>
		{:else if comments.length === 0}
			<p class="text-muted">目前還沒有留言，歡迎搶頭香！</p>
		{:else}
			<ul aria-live="polite">
				{#each comments as comment}
					<li class="comment-item" aria-label={`留言者 ${comment.author_name}`}>
						<div class="comment-meta">
							<span class="comment-author">{comment.author_name}</span>
							<span class="comment-date">{formatDate(comment.created_at)}</span>
						</div>
						<p class="comment-content">{comment.content}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="comment-form" aria-label="新增留言">
		<h3>留下你的想法</h3>
		<form onsubmit={handleSubmit} aria-describedby="comment-hint">
			<label>
				<span>暱稱 *</span>
				<input
					type="text"
					name="authorName"
					bind:value={authorName}
					required
					minlength={2}
					placeholder="你怎麼稱呼？"
					aria-required="true"
				/>
			</label>

			<label>
				<span>Email（不會公開）</span>
				<input
					type="email"
					name="authorEmail"
					bind:value={authorEmail}
					placeholder="example@mail.com"
				/>
			</label>

			<label>
				<span>留言內容 *</span>
				<textarea
					name="content"
					bind:value={content}
					required
					minlength={5}
					rows={4}
					placeholder={`想對「${postTitle}」說些什麼？`}
					aria-required="true"
				></textarea>
			</label>

			<p id="comment-hint" class="text-muted">
				送出後若顯示「待審核」，代表我會先過目避免垃圾留言。
			</p>

			<button type="submit" class="submit-button" disabled={submitting}>
				{submitting ? '送出中…' : '送出留言'}
			</button>
		</form>

		{#if submitMessage}
			<p class={submitMessage.type === 'success' ? 'message success' : 'message error'}>
				{submitMessage.text}
			</p>
		{/if}
	</div>
</div>
