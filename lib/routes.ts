export function serviceDetailHref(slug: string): string {
  return `/services/${encodeURIComponent(slug)}`;
}

export function serviceBookingHref(serviceId: string): string {
  return `/?serviceId=${encodeURIComponent(serviceId)}#contacts`;
}
