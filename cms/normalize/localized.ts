export function resolveLocalizedText(
  record: Record<string, string> | null | undefined,
  locale: string,
  defaultLocale: string = 'uk'
): string {
  if (!record) return '';

  // 1. Requested locale
  if (record[locale]) return record[locale];

  // 2. Default locale from settings
  if (record[defaultLocale]) return record[defaultLocale];

  // 3. Hardcoded fallbacks
  if (record['uk']) return record['uk'];
  if (record['en']) return record['en'];

  // 4. First available value
  const values = Object.values(record);
  if (values.length > 0) return values[0];

  return '';
}
