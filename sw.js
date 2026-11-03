/* Service worker: aplikacja działa bez internetu.
   Strona: najpierw sieć (żeby od razu widzieć nowe wersje), w razie braku – kopia.
   Pozostałe pliki: najpierw kopia, w tle odświeżanie. */
const CACHE = 'gory-sila-v2';
const PRECACHE = ['./', './index.html', './exercises.js', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png', './image_3bed76.png'];
const TAILWIND = 'https://cdn.tailwindcss.com';

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(PRECACHE);
    try { await c.put(TAILWIND, await fetch(TAILWIND, { mode: 'no-cors' })); } catch (err) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isPage = req.mode === 'navigate';
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (isPage) {
      try {
        const fresh = await fetch(req);
        c.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        return (await c.match('./index.html')) || Response.error();
      }
    }
    const cached = await c.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
