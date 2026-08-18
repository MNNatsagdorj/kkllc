// 고객 SMS 발송 (서버 전용) — 출발 시 "Ачаа тань замд гарлаа" (08-roadmap P3)
// 통신사 중립: SMS_API_URL 템플릿의 {to}/{text}를 치환해 GET 호출.
// 예 (messagepro.mn): https://api.messagepro.mn/send?key=KEY&from=70112233&to={to}&text={text}
// 미설정 시 조용히 건너뜀.
import 'server-only';

export async function sendSMS(phone: string | null | undefined, text: string): Promise<boolean> {
  const tpl = process.env.SMS_API_URL;
  if (!tpl || !phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 8) return false;
  try {
    const url = tpl.replace('{to}', digits).replace('{text}', encodeURIComponent(text));
    const res = await fetch(url);
    return res.ok;
  } catch (e) {
    console.warn('SMS send failed', e);
    return false;
  }
}
