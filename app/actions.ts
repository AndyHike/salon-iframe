'use server';

export async function sendMessage(domain: string, formData: FormData) {
  const adminApiUrl = process.env.ADMIN_API_URL;
  const masterKey = process.env.SYSTEM_MASTER_KEY;

  if (!adminApiUrl || !masterKey) {
    console.warn('Missing ADMIN_API_URL or SYSTEM_MASTER_KEY. Mocking message send.');
    return { success: true, message: 'Message sent successfully (mock)' };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    const url = new URL(`${adminApiUrl}/api/public/v1/messages`);
    url.searchParams.append('domain', domain);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${masterKey}`,
        'x-public-api-key': masterKey,
      },
      body: JSON.stringify({ name, email, phone, subject, message }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || 'Failed to send message' };
    }

    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Internal server error' };
  }
}
