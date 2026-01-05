import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getBlogPost } from '$lib/github';
import { parseMarkdown, getExcerpt } from '$lib/markdown';
import { sendButtondownEmail } from '$lib/buttondown';

interface NotifyPayload {
  issueNumber: number;
  draft?: boolean;
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
  const secret = env.BUTTONDOWN_NOTIFY_SECRET;

  if (secret) {
    const authHeader = request.headers.get('authorization');
    const expected = `Bearer ${secret}`;

    if (authHeader !== expected) {
      throw error(401, 'Unauthorized');
    }
  }

  let payload: NotifyPayload;
  try {
    payload = await request.json();
  } catch {
    throw error(400, 'Invalid JSON payload');
  }

  if (!payload.issueNumber || typeof payload.issueNumber !== 'number') {
    throw error(400, 'issueNumber is required');
  }

  if (!env.BUTTONDOWN_TOKEN) {
    throw error(500, 'BUTTONDOWN_TOKEN is not configured');
  }

  const post = await getBlogPost(payload.issueNumber, fetch);

  if (!post) {
    throw error(404, `Post #${payload.issueNumber} not found`);
  }

  const siteUrl = env.PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || url.origin;
  const htmlBody = `
    <h1>${post.title}</h1>
    <p>${getExcerpt(post.body, 200)}</p>
    <div>${parseMarkdown(post.body)}</div>
    <p><a href="${siteUrl}${post.url}">Read on LinHeMa de Blog</a></p>
  `.trim();

  const response = await sendButtondownEmail({
    subject: `New post: ${post.title}`,
    htmlBody,
    draft: payload.draft ?? false
  });

  return json({
    status: 'queued',
    buttondownEmailId: response.id,
    publishAt: response.publish_at,
    draft: payload.draft ?? false
  });
};
