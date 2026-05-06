export type StructuredWorkingHoursDay = {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
};

export type NormalizedWorkingHours =
  | {
      kind: 'structured';
      byAppointment: boolean;
      days: StructuredWorkingHoursDay[];
    }
  | {
      kind: 'text';
      text: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeStructuredWorkingHours(value: unknown): NormalizedWorkingHours | null {
  if (!isRecord(value)) return null;

  const rawDays = value.days;
  const days = Array.isArray(rawDays)
    ? rawDays.flatMap((rawDay): StructuredWorkingHoursDay[] => {
        if (!isRecord(rawDay) || typeof rawDay.day !== 'string' || rawDay.day.trim() === '') {
          return [];
        }

        return [
          {
            day: rawDay.day,
            open: typeof rawDay.open === 'string' ? rawDay.open : '',
            close: typeof rawDay.close === 'string' ? rawDay.close : '',
            isClosed: rawDay.isClosed === true,
          },
        ];
      })
    : [];

  if (days.length === 0 && value.byAppointment !== true) return null;

  return {
    kind: 'structured',
    byAppointment: value.byAppointment === true,
    days,
  };
}

export function normalizeWorkingHours(value: unknown): NormalizedWorkingHours | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    try {
      const parsedValue = JSON.parse(trimmedValue);
      const structuredValue = normalizeStructuredWorkingHours(parsedValue);
      if (structuredValue) return structuredValue;
    } catch {
      return {
        kind: 'text',
        text: value,
      };
    }

    return {
      kind: 'text',
      text: value,
    };
  }

  return normalizeStructuredWorkingHours(value);
}
