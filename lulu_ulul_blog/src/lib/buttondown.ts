import { env } from '$env/dynamic/private';

const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1/emails';

export interface ButtondownEmailParams {
  subject: string;
  htmlBody: string;
  publishAt?: string;
  draft?: boolean;
}

export interface ButtondownEmailResponse {
  id: string;
  subject: string;
  publish_at: string | null;
  status: string;
}

export async function sendButtondownEmail({
  subject,
  htmlBody,
  publishAt,
  draft = false
}: ButtondownEmailParams): Promise<ButtondownEmailResponse> {
  const token = env.BUTTONDOWN_TOKEN;

  if (!token) {
    throw new Error('BUTTONDOWN_TOKEN is not configured');
  }

  const payload: Record<string, unknown> = {
    subject,
    body: htmlBody
  };

  if (draft) {
    payload.status = 'draft';
  } else {
    payload.publish_at = publishAt ?? new Date().toISOString();
  }

  const response = await fetch(BUTTONDOWN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Buttondown API error: ${response.status} ${errorBody}`);
  }

  return (await response.json()) as ButtondownEmailResponse;
}
