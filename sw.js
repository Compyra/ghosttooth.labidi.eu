/* GHOSTTOOTH service worker.
 *
 * WHY THIS EXISTS
 * ---------------
 * Two groups of people read this site with no usable connection:
 *
 *   1. Someone troubleshooting "my Bluetooth will not scan", who is by
 *      definition having a bad time with their device.
 *   2. Someone who has just been told they may be carrying a tracker and is
 *      opening /safety/ — possibly having deliberately turned off mobile data,
 *      possibly somewhere with no signal.
 *
 * Both need the page to open anyway. The site is a handful of self-contained
 * HTML files with no CDN, so caching it properly is cheap.
 *
 * STRATEGY
 *   - App shell (pages, styles, icons): cache-first, refreshed in the
 *     background. Instant, and works offline.
 *   - Reference registries (media/*.js, registry-index.json): network-first
 *     with a cache fallback, because stale detection definitions are worse than
 *     slow ones.
 *   - Everything else: network, falling back to cache, falling back to the
 *     offline page.
 *
 * Bump CACHE_VERSION on every release; the activate handler deletes anything
 * that does not match, so old assets never linger.
 */

const CACHE_VERSION = 'ghosttooth-v4-2026-08-08';
const RUNTIME = `${CACHE_VERSION}-runtime`;

/* Kept deliberately small: the pages a stranded reader actually needs. Anything
 * else is picked up opportunistically at runtime. */
const SHELL = [
  '/',
  '/faq/',
  '/safety/',
  '/privacy/',
  '/terms/',
  '/accessibility/',
  '/changelog/',
  '/fr/',
  '/fr/faq/',
  '/fr/safety/',
  '/nl/',
  '/nl/faq/',
  '/nl/safety/',
  '/404.html',
  '/media/css/style.css',
  '/media/img/GhostTooth-mascot.png',
  '/media/img/GhostTooth-mascot-512.png',
  '/media/img/app-icon-512.png',
  '/site.webmanifest',
];

/* Registries are refreshed from the network whenever possible. Matches both
 * the canonical identifiers/ paths and the legacy media/ copies old apps use. */
const REGISTRY = /\/media\/(identifiers\/)?(company_identifiers|long_company_identifiers|known-devices|device-types)\.js$|\/media\/(identifiers\/)?registry-index\.json$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // addAll() is atomic: one 404 would reject the whole install and leave
      // the worker unregistered, so add individually and tolerate misses.
      .then((cache) => Promise.all(
        SHELL.map((url) => cache.add(url).catch(() => { /* optional asset */ })),
      ))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== RUNTIME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never touch anything that is not a plain GET on our own origin: the local
  // Bluetooth bridge on 127.0.0.1 must reach the network untouched.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Detection definitions: network first, cache as the safety net.
  if (REGISTRY.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Navigations: cache first for instant loads, revalidate in the background,
  // and fall back to the offline-friendly 404 page if we have nothing at all.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached || caches.match('/404.html'));
        return cached || network;
      }),
    );
    return;
  }

  // Static assets: cache first, populate on miss.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(RUNTIME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => cached)),
  );
});
