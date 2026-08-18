/* KK Хүргэлт Service Worker — 오프라인 캐시 + FCM 백그라운드 푸시 (06 문서)
 * FCM 설정은 등록 URL의 ?fcfg= 쿼리로 주입된다 (lib/push-client.ts). */

const CACHE = 'kk-driver-v1';
const OFFLINE_URLS = ['/driver', '/manifest.json', '/icons/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(OFFLINE_URLS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

// 페이지·정적 자원: 네트워크 우선, 실패 시 캐시 (오프라인에서 주소·전화 열람)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // API는 캐시하지 않음
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit ?? caches.match('/driver'))),
  );
});

// ===== FCM 백그라운드 푸시 =====
try {
  const cfgStr = new URL(self.location.href).searchParams.get('fcfg');
  if (cfgStr) {
    importScripts(
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
    );
    firebase.initializeApp(JSON.parse(cfgStr));
    firebase.messaging().onBackgroundMessage((p) => {
      const title = (p.notification && p.notification.title) || (p.data && p.data.title) || 'KK Хүргэлт';
      const body = (p.notification && p.notification.body) || (p.data && p.data.body) || '';
      self.registration.showNotification(title, { body, icon: '/icons/icon.svg' });
    });
  }
} catch (e) {
  // FCM 미설정 시 캐시 기능만 동작
}
