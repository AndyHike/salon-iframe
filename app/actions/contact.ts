'use server';

import { cmsFetchResult } from '../../cms/client';

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readCmsError(body: unknown) {
  if (!body || typeof body !== 'object') return null;

  const record = body as Record<string, unknown>;
  const code = record.code;
  const field = record.field;
  const error = record.error ?? record.message;
  const suffix = [
    typeof code === 'string' ? code : null,
    typeof field === 'string' ? field : null,
  ].filter(Boolean).join(' / ');

  if (typeof error === 'string' && suffix) return `${error} (${suffix})`;
  return typeof error === 'string' ? error : null;
}

function hasExplicitFailure(body: unknown): boolean {
  return Boolean(
    body &&
    typeof body === 'object' &&
    (body as Record<string, unknown>).success === false
  );
}

function readFormNumber(formData: FormData, key: string) {
  const value = readFormString(formData, key);
  if (!value) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export async function submitContactForm(domain: string, formData: FormData) {
  const name = readFormString(formData, 'name');
  const email = readFormString(formData, 'email');
  const phone = readFormString(formData, 'phone');
  const message = readFormString(formData, 'message');
  const serviceId = readFormString(formData, 'serviceId');
  const serviceTitle = readFormString(formData, 'serviceTitle');
  const servicePrice = readFormString(formData, 'servicePrice');
  const serviceDurationMinutes = readFormNumber(formData, 'serviceDurationMinutes');
  const categoryId = readFormString(formData, 'categoryId');
  const categoryTitle = readFormString(formData, 'categoryTitle');
  const preferredDate = readFormString(formData, 'preferredDate');
  const preferredTime = readFormString(formData, 'preferredTime');
  const preferredTimeLabel = readFormString(formData, 'preferredTimeLabel');
  const timezone = readFormString(formData, 'timezone') || 'Europe/Prague';
  const locale = readFormString(formData, 'locale');
  const source = readFormString(formData, 'source') || 'contact_form';
  const pageUrl = readFormString(formData, 'pageUrl');
  const requestedType = readFormString(formData, 'requestType');
  const hasAppointmentContext = Boolean(serviceId || serviceTitle || preferredDate || preferredTimeLabel);
  const requestType = requestedType === 'appointment_request' || hasAppointmentContext
    ? 'appointment_request'
    : 'general_message';
  const subject = readFormString(formData, 'subject')
    || (requestType === 'appointment_request'
      ? `Appointment request${serviceTitle ? `: ${serviceTitle}` : ''}`
      : 'Website contact form');

  if (requestedType && requestedType !== 'general_message' && requestedType !== 'appointment_request') {
    return { success: false, error: 'Invalid request type' };
  }

  if (!name || (!email && !phone)) {
    return { success: false, error: 'Name and at least one contact are required' };
  }

  if (email && !email.includes('@')) {
    return { success: false, error: 'Valid email is required' };
  }

  if (preferredTime && !preferredDate) {
    return { success: false, error: 'Preferred date is required when preferred time is selected' };
  }

  if (requestType === 'appointment_request' && !hasAppointmentContext) {
    return { success: false, error: 'Appointment context is required' };
  }

  const result = await cmsFetchResult<unknown>('/api/public/v1/messages', {
    domain,
    method: 'POST',
    body: {
      requestType,
      name,
      subject,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(message ? { message } : {}),
      ...(locale ? { locale } : {}),
      ...(source ? { source } : {}),
      ...(pageUrl ? { pageUrl } : {}),
      ...(serviceId ? { serviceId } : {}),
      ...(serviceTitle ? { serviceTitle } : {}),
      ...(servicePrice ? { servicePrice } : {}),
      ...(serviceDurationMinutes ? { serviceDurationMinutes } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(categoryTitle ? { categoryTitle } : {}),
      ...(preferredDate ? { preferredDate } : {}),
      ...(preferredTime ? { preferredTime, timezone } : {}),
      ...(preferredTimeLabel ? { preferredTimeLabel } : {}),
    },
  });

  if (result.ok && !hasExplicitFailure(result.data)) {
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
