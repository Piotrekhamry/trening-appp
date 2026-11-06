/* Service worker: aplikacja działa bez internetu.
   - pliki aplikacji (ta sama domena): najpierw sieć, żeby od razu widzieć nowe wersje; bez sieci – kopia
   - biblioteki z CDN (Tailwind, Firebase): najpierw kopia, w tle odświeżanie
   - wszystko inne (np. połączenia z bazą Firebase, logowanie) przechodzi bez zmian */
const CACHE = 'gory-sila-v3';
const PRECACHE = ['./', './index.html', './exercises.js', './firebase-config.js', './cloud.js', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-180.png', './image_3bed76.png'];
const CDN_HOSTS = ['cdn.tailwindcss.com', 'www.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(PRECACHE);
    try { await c.put('https://cdn.tailwindcss.com', await fetch('https://cdn.tailwindcss.com', { mode: 'no-cors' })); } catch (err) {}
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
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Logowanie Firebase przez własną domenę – zawsze prosto do sieci
  if (sameOrigin && url.pathname.startsWith('/__/')) return;

  if (sameOrigin) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh.ok) c.put(req.mode === 'navigate' ? './index.html' : req, fresh.clone());
        return fresh;
      } catch (err) {
        return (await c.match(req.mode === 'navigate' ? './index.html' : req, { ignoreSearch: true })) || Response.error();
      }
    })());
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const cached = await c.match(req);
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })());
  }
  // pozostałe adresy: bez ingerencji
});
