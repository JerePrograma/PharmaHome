import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const code = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
function harness() {
  const handlers = {};
  const deleted = [];
  const cache = { addAll: async () => {}, match: async () => null, put: async () => {} };
  vm.runInNewContext(code, {
    URL, Response,
    self: {
      registration: { scope: 'https://scalaris.com.ar/pharmahome/' },
      addEventListener: (name, callback) => { handlers[name] = callback; },
      skipWaiting: () => {}, clients: { claim: async () => {} },
    },
    caches: {
      keys: async () => ['another-app-cache', 'pharmahome-v2', 'pharmahome-v3'],
      delete: async key => { deleted.push(key); },
      open: async () => cache,
      match: async () => null,
    },
    fetch: async () => new Response('asset'),
  });
  return { handlers, deleted };
}

test('activation preserves caches belonging to other Scalaris applications', async () => {
  const { handlers, deleted } = harness();
  let pending;
  handlers.activate({ waitUntil: task => { pending = task; } });
  await pending;
  assert.deepEqual(deleted, ['pharmahome-v2']);
});

test('the worker never intercepts another application or API', async () => {
  const { handlers } = harness();
  for (const url of ['https://scalaris.com.ar/gestudio-api/api/login', 'https://scalaris.com.ar/tienda/', 'https://elsewhere.example/pharmahome/']) {
    handlers.fetch({ request: { method: 'GET', url }, respondWith: () => assert.fail('out-of-scope request intercepted') });
  }
  let pending;
  handlers.fetch({ request: { method: 'GET', url: 'https://scalaris.com.ar/pharmahome/assets/app.js' }, respondWith: task => { pending = task; } });
  assert.equal(await (await pending).text(), 'asset');
});
