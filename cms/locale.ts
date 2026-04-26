import { headers } from 'next/headers';

export const SUPPORTED_LOCALES = [
  { code: 'uk', name: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' },
  { code: 'en', name: 'English' },
  { code: 'cs', name: '\u010ce\u0161tina' },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]['code'];

const DEFAULT_LOCALE: SupportedLocale = 'uk';
const supportedLocaleCodes = new Set<string>(SUPPORTED_LOCALES.map((locale) => locale.code));

export function normalizeLocale(locale: string | null | undefined): SupportedLocale | null {
  if (!locale) return null;

  const code = locale.toLowerCase().split('-')[0];
  return supportedLocaleCodes.has(code) ? (code as SupportedLocale) : null;
}

function parseAcceptLanguage(headerValue: string | null): SupportedLocale | null {
  if (!headerValue) return null;

  return (
    headerValue
      .split(',')
      .map((part) => {
        const [rawLocale, rawQuality] = part.trim().split(';q=');
        return {
          locale: normalizeLocale(rawLocale),
          quality: rawQuality ? Number.parseFloat(rawQuality) : 1,
        };
      })
      .filter((item): item is { locale: SupportedLocale; quality: number } => !!item.locale)
      .sort((a, b) => b.quality - a.quality)[0]?.locale || null
  );
}

export async function resolveRequestLocale(): Promise<SupportedLocale> {
  const headersList = await headers();
  return parseAcceptLanguage(headersList.get('accept-language')) || DEFAULT_LOCALE;
}
