// FCM 푸시 발송 (서버 전용) — HTTP v1 API + 서비스 계정 (레거시 서버 키는 Google이 폐기)
// FIREBASE_SERVICE_ACCOUNT: 서비스 계정 JSON 원문 또는 base64. 미설정 시 조용히 건너뜀.
import 'server-only';
import crypto from 'node:crypto';

interface ServiceAccount { project_id: string; client_email: string; private_key: string }

let cachedToken: { token: string; exp: number } | null = null;

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const jsonStr = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const sa = JSON.parse(jsonStr) as ServiceAccount;
    if (sa.project_id && sa.client_email && sa.private_key) {
      // 환경변수에 한 줄로 넣으면 개행이 \n 리터럴로 들어옴
      sa.private_key = sa.private_key.replace(/\\n/g, '\n');
      return sa;
    }
  } catch (e) {
    console.warn('FIREBASE_SERVICE_ACCOUNT parse failed', e);
  }
  return null;
}

/** 서비스 계정 JWT → OAuth2 액세스 토큰 (55분 캐시) */
async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp > now + 60) return cachedToken.token;

  const b64url = (s: string) => Buffer.from(s).toString('base64url');
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(sa.private_key).toString('base64url')}`;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
    });
    if (!res.ok) {
      console.error('FCM token exchange failed', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    cachedToken = { token: json.access_token, exp: now + (json.expires_in ?? 3600) };
    return cachedToken.token;
  } catch (e) {
    console.error('FCM token exchange error', e);
    return null;
  }
}

export async function sendPush(token: string | null | undefined, title: string, body: string): Promise<boolean> {
  const sa = loadServiceAccount();
  if (!sa || !token) return false;
  const access = await getAccessToken(sa);
  if (!access) return false;

  try {
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          webpush: { notification: { title, body, icon: '/icons/icon.svg' } },
          data: { title, body },
        },
      }),
    });
    if (!res.ok) console.error('FCM send failed', res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error('FCM send error', e);
    return false;
  }
}
