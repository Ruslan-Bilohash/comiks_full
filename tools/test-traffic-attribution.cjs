'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'hits.js'), 'utf8');

async function run({ search = '', referrer = '', dnt = '0' } = {}) {
  const sent = [];
  const storage = new Map();
  const listeners = {};
  const context = {
    Blob,
    URL,
    URLSearchParams,
    setInterval() { return 1; },
    fetch() { return Promise.resolve({ ok: true }); },
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(key, String(value)); },
    },
    location: { protocol: 'https:', hostname: 'bilohash.com', search, hash: '#/words' },
    navigator: {
      doNotTrack: dnt,
      globalPrivacyControl: false,
      webdriver: false,
      maxTouchPoints: 0,
      userAgent: 'Mozilla/5.0 Test Browser',
      sendBeacon(url, blob) { sent.push({ url, blob }); return true; },
    },
    document: { readyState: 'complete', referrer, visibilityState: 'visible', addEventListener() {} },
    window: { doNotTrack: dnt, addEventListener(type, fn) { listeners[type] = fn; } },
  };
  context.window.window = context.window;
  context.window.document = context.document;
  context.window.location = context.location;
  context.window.navigator = context.navigator;
  context.window.localStorage = context.localStorage;
  vm.runInNewContext(source, context, { filename: 'assets/hits.js' });
  const bodies = [];
  for (const item of sent) bodies.push(JSON.parse(await item.blob.text()));
  return bodies;
}

(async () => {
  let bodies = await run({ search: '?utm_source=chatgpt.com&utm_medium=referral', referrer: 'https://google.com/' });
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].u, 'chatgpt.com', 'standard utm_source is sent on the first view');
  assert.equal(bodies[0].r, 'google.com', 'referrer remains available as fallback');

  bodies = await run({ referrer: 'https://www.linkedin.com/feed/' });
  assert.equal(bodies[0].r, 'www.linkedin.com');
  assert.equal(Object.hasOwn(bodies[0], 'u'), false);

  bodies = await run({ search: '?fbclid=tracking-id' });
  assert.equal(bodies[0].u, 'facebook', 'Facebook click id is recognized without a referrer');

  bodies = await run({ search: '?li_fat_id=tracking-id' });
  assert.equal(bodies[0].u, 'linkedin', 'LinkedIn click id is recognized without a referrer');

  bodies = await run({ search: '?utm_source=facebook', dnt: '1' });
  assert.equal(bodies.length, 0, 'Do Not Track still disables analytics');
  console.log('ALL TRAFFIC ATTRIBUTION BROWSER TESTS PASSED');
})().catch(error => { console.error(error); process.exit(1); });
