export type CommentStatus = 'pending' | 'approved' | 'spam';

export interface CommentRecord {
	id: string;
	post_id: number;
	author_name: string;
	author_email?: string | null;
	content: string;
	status: CommentStatus;
	created_at: string;
}

export interface CreateCommentInput {
	postId: number;
	authorName: string;
	authorEmail?: string;
	content: string;
}
