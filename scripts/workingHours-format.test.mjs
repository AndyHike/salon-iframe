import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeWorkingHours } from '../presentation/themes/shared/workingHours.ts';

test('normalizes structured working hours from admin object', () => {
  const result = normalizeWorkingHours({
    byAppointment: true,
    days: [
      { day: 'monday', open: '09:00', close: '18:00', isClosed: false },
      { day: 'sunday', open: null, close: null, isClosed: true },
    ],
  });

  assert.deepEqual(result, {
    kind: 'structured',
    byAppointment: true,
    days: [
      { day: 'monday', open: '09:00', close: '18:00', isClosed: false },
      { day: 'sunday', open: '', close: '', isClosed: true },
    ],
  });
});

test('normalizes structured working hours from JSON string', () => {
  const result = normalizeWorkingHours(
    JSON.stringify({
      days: [{ day: 'friday', open: '10:00', close: '19:00', isClosed: false }],
    }),
  );

  assert.deepEqual(result, {
    kind: 'structured',
    byAppointment: false,
    days: [{ day: 'friday', open: '10:00', close: '19:00', isClosed: false }],
  });
});

test('keeps legacy plain text working hours readable', () => {
  const result = normalizeWorkingHours('Mon-Fri: 9:00 - 19:00');

  assert.deepEqual(result, {
    kind: 'text',
    text: 'Mon-Fri: 9:00 - 19:00',
  });
});

test('returns null for missing working hours', () => {
  assert.equal(normalizeWorkingHours(null), null);
  assert.equal(normalizeWorkingHours(''), null);
});
