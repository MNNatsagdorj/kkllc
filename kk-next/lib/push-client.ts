'use client';

// 기사 PWA 푸시 설정 — SW 등록 + FCM 토큰 발급·서버 저장 + 포그라운드 수신 (06 문서)
// NEXT_PUBLIC_FIREBASE_CONFIG 미설정 시 SW 캐시만 등록하고 조용히 종료.

export async function setupPushAndSW(
  onForeground: (title: string, body: string) => void,
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const cfgStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  const swUrl = cfgStr ? `/sw.js?fcfg=${encodeURIComponent(cfgStr)}` : '/sw.js';
  const reg = await navigator.serviceWorker.register(swUrl).catch(() => null);
  if (!reg || !cfgStr) return;

  try {
    const cfg = JSON.parse(cfgStr);
    const { initializeApp } = await import('firebase/app');
    const { getMessaging, getToken, onMessage, isSupported } = await import('firebase/messaging');
    if (!(await isSupported())) return;

    if (Notification.permission === 'default') await Notification.requestPermission();
    if (Notification.permission !== 'granted') return;

    const app = initializeApp(cfg);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      serviceWorkerRegistration: reg,
      vapidKey: cfg.vapidKey,
    });
    if (token) {
      await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
    onMessage(messaging, (p) => {
      const title = p.notification?.title ?? p.data?.title;
      const body = p.notification?.body ?? p.data?.body;
      if (title) onForeground(title, body ?? '');
    });
  } catch (e) {
    console.warn('push setup skipped', e);
  }
}
