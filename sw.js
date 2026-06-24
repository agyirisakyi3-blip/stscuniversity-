const CACHE = 'stsc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/admissions.html',
  '/contact.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/og-image.jpg',
  '/assets/images/slide-graduation.jpg',
  '/assets/images/slide-campus.jpg',
  '/assets/images/slide-graduates.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(cache => {
        if (resp.ok && request.url.startsWith(self.location.origin)) cache.put(request, clone);
      });
      return resp;
    }).catch(() => caches.match('/index.html')))
  );
});
