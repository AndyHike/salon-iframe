'use server';

import { cmsFetch } from '../../cms/client';

export async function submitContactForm(domain: string, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || !phone) {
    return { success: false, error: 'Name and phone are required' };
  }

  const result = await cmsFetch<{ success: boolean }>('/api/public/v1/messages', {
    domain,
    method: 'POST',
    body: { name, phone, message },
  });

  if (result && result.success) {
    return { success: true };
  } else {
    return { success: false, error: 'Failed to send message' };
  }
}
