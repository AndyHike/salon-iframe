import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRequestDomain, requestDomainMatchesHost } from '../lib/domain.ts';

test('normalizes valid hostnames before passing them to the CMS API', () => {
  assert.equal(normalizeRequestDomain('Salon.EXAMPLE.com'), 'salon.example.com');
  assert.equal(normalizeRequestDomain('salon.localhost'), 'salon.localhost');
  assert.equal(normalizeRequestDomain('127.0.0.1'), '127.0.0.1');
});

test('rejects dotfile probes before passing them to the CMS API', () => {
  assert.equal(normalizeRequestDomain('.env'), null);
  assert.equal(normalizeRequestDomain('.git'), null);
});

test('rejects non-hostname domain values before passing them to the CMS API', () => {
  assert.equal(normalizeRequestDomain('https://salon.example.com'), null);
  assert.equal(normalizeRequestDomain('salon.example.com/path'), null);
  assert.equal(normalizeRequestDomain('salon_example.com'), null);
  assert.equal(normalizeRequestDomain('-salon.example.com'), null);
  assert.equal(normalizeRequestDomain('salon..example.com'), null);
});

test('rejects route domain values that do not match the request host', () => {
  assert.equal(requestDomainMatchesHost('salon.example.com', 'Salon.Example.com:443'), true);
  assert.equal(requestDomainMatchesHost('wp-login.php', 'salon.example.com'), false);
  assert.equal(requestDomainMatchesHost('.env', 'salon.example.com'), false);
});
