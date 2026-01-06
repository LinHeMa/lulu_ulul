import { getSupabaseAdminClient, getSupabasePublicClient } from './supabase';
import type { CommentRecord, CreateCommentInput } from '$lib/comments/types';

const TABLE_NAME = 'comments';

const sanitize = (value: string): string => value.replace(/\s+/g, ' ').trim();

const selectFields = 'id, post_id, author_name, author_email, content, status, created_at';

export const fetchCommentsForPost = async (postId: number): Promise<CommentRecord[]> => {
	const supabase = getSupabasePublicClient();
	const { data, error } = await supabase
		.from(TABLE_NAME)
		.select(selectFields)
		.eq('post_id', postId)
		.eq('status', 'approved')
		.order('created_at', { ascending: true });

	if (error) {
		console.error('Supabase fetch comments error:', error);
		throw new Error('無法取得留言資料');
	}

	return (data as CommentRecord[]) ?? [];
};

export const createComment = async (
	input: CreateCommentInput
): Promise<{ comment: CommentRecord; requiresApproval: boolean }> => {
	const supabase = getSupabaseAdminClient();

	const payload = {
		post_id: input.postId,
		author_name: sanitize(input.authorName),
		author_email: input.authorEmail ? sanitize(input.authorEmail) : null,
		content: input.content.trim(),
		status: 'pending' as const
	};

	const { data, error } = await supabase.from(TABLE_NAME).insert(payload).select(selectFields).single();

	if (error || !data) {
		console.error('Supabase insert comment error:', error);
		throw new Error('無法送出留言，請稍後再試');
	}

	return {
		comment: data as CommentRecord,
		requiresApproval: (data as CommentRecord).status !== 'approved'
	};
};
