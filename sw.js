const CACHE_NAME = 'sos-safety-pro-v10';
const assets = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn-icons-png.flaticon.com/512/10263/10263336.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // إرجاع الملف من الكاش أو محاولة جلب نسخة جديدة
      return response || fetch(event.request).catch(() => {
        // إذا فشل الاتصال، نفتح الصفحة الرئيسية المحفوظة
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
