// Offline support: when the site is installed as an app (or just visited), every game, the stories and
// all the read-aloud sound files are stored on the device, so everything works without internet.
// Pages and scripts are fetched fresh when there is a connection, so updates on GitHub arrive by themselves.
// Bump VERSION when files are added to or removed from CORE.
const VERSION = 'v1';
const CACHE = 'bella-' + VERSION;
const CORE = [
  './', 'index.html', 'rodhette.html', 'tordenborgen.html', 'regnbuehopp.html', 'gresskarnatta.html', 'veien-hjem.html',
  'touch.css', 'touch.js', 'manifest.webmanifest', 'ikon-192.png', 'ikon-512.png', 'apple-touch-icon.png', 'lyd/liste.json'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE.map(u => new Request(u, {cache: 'reload'})));
    // the sound files are named by their text, so a stored file never goes stale
    try {
      const names = await (await cache.match('lyd/liste.json')).json();
      const have = new Set((await cache.keys()).map(r => r.url));
      const missing = names.map(n => new URL('lyd/' + n, self.registration.scope).href).filter(u => !have.has(u));
      for (let i = 0; i < missing.length; i += 20) await Promise.all(missing.slice(i, i + 20).map(u => cache.add(u).catch(() => {})));
    } catch (_) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('bella-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromCache(req) {
  return (await caches.match(req, {ignoreSearch: true})) ||
    (req.mode === 'navigate' ? await caches.match('index.html') : undefined);
}

// network first (gives up after a few seconds), falling back to the stored copy
async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(no, 4000))]);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (_) {
    return (await fromCache(req)) || Response.error();
  }
}

// stored copy first; fetch and store it if it is missing
async function cacheFirst(req) {
  const hit = await caches.match(req, {ignoreSearch: true});
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) (await caches.open(CACHE)).put(req, res.clone());
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(url.pathname.endsWith('.mp3') || url.pathname.endsWith('.png') ? cacheFirst(req) : networkFirst(req));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(req));
  }
});
