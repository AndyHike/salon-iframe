'use server';

import { cmsFetchResult } from '../../cms/client';

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readCmsError(body: unknown) {
  if (!body || typeof body !== 'object') return null;

  const record = body as Record<string, unknown>;
  const error = record.error ?? record.message;
  return typeof error === 'string' ? error : null;
}

export async function submitContactForm(domain: string, formData: FormData) {
  const name = readFormString(formData, 'name');
  const email = readFormString(formData, 'email');
  const phone = readFormString(formData, 'phone');
  const subject = readFormString(formData, 'subject') || 'Website contact form';
  const message = readFormString(formData, 'message');

  if (!name || !email || !email.includes('@') || !message) {
    return { success: false, error: 'Name, valid email, and message are required' };
  }

  const result = await cmsFetchResult<{ success: boolean }>('/api/public/v1/messages', {
    domain,
    method: 'POST',
    body: {
      name,
      email,
      message,
      subject,
      ...(phone ? { phone } : {}),
    },
  });

  if (result.ok && result.data.success) {
    return { success: true };
  }

  if (!result.ok) {
    console.error('Contact form submit failed:', {
      status: result.status,
      statusText: result.statusText,
      error: readCmsError(result.body),
    });
  }

  return { success: false, error: 'Failed to send message' };
}
