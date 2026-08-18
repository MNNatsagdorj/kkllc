// FCM 푸시 발송 (서버 전용) — 기사 배정 알림 (05 문서)
// FIREBASE_SERVER_KEY 미설정 시 조용히 건너뜀(개발 환경).
import 'server-only';

export async function sendPush(token: string | null | undefined, title: string, body: string): Promise<boolean> {
  const key = process.env.FIREBASE_SERVER_KEY;
  if (!key || !token) return false;
  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${key}`,
      },
      body: JSON.stringify({
        to: token,
        notification: { title, body },
        data: { title, body },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('FCM send failed', e);
    return false;
  }
}
