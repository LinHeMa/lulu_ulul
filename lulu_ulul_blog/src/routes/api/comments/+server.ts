import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchCommentsForPost, createComment } from '$lib/server/comments';
import type { CreateCommentInput } from '$lib/comments/types';

const parsePostId = (value: string | null): number | null => {
	if (!value) return null;
	const id = Number(value);
	if (!Number.isFinite(id) || id <= 0) {
		return null;
	}
	return id;
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const postId = parsePostId(url.searchParams.get('postId'));
		if (!postId) {
			return json({ error: 'postId 參數缺失' }, { status: 400 });
		}

		const comments = await fetchCommentsForPost(postId);
		return json(comments);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as Partial<CreateCommentInput>;
		const postId = typeof payload.postId === 'number' ? payload.postId : Number(payload.postId);
		if (!postId || !Number.isFinite(postId) || postId <= 0) {
			return json({ error: '文章資訊錯誤' }, { status: 400 });
		}

		const authorName = payload.authorName?.trim();
		const content = payload.content?.trim();
		const authorEmail = payload.authorEmail?.trim();

		if (!authorName || authorName.length < 2) {
			return json({ error: '請輸入至少 2 個字的暱稱' }, { status: 400 });
		}

		if (!content || content.length < 5) {
			return json({ error: '留言內容至少 5 個字' }, { status: 400 });
		}

		if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
			return json({ error: 'Email 格式不正確' }, { status: 400 });
		}

		const { comment, requiresApproval } = await createComment({
			postId,
			authorName,
			authorEmail,
			content
		});

		return json({ comment, requiresApproval });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};
