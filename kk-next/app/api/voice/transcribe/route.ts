// POST /api/voice/transcribe — 몽골어 STT 프록시 (BR-8)
// 1차 Chimege, 폴백 Google STT mn-MN. 키 미설정 시 503 (음성 버튼은 안내만 표시).
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api-guard';

export async function POST(request: Request) {
  const auth = await requireRole('manager');
  if ('error' in auth) return auth.error;

  const audio = Buffer.from(await request.arrayBuffer());
  if (!audio.length) return NextResponse.json({ error: 'Хоосон бичлэг' }, { status: 400 });
  const mime = request.headers.get('content-type') ?? 'audio/webm';

  // 1차: Chimege (몽골어 전문)
  const chimegeKey = process.env.CHIMEGE_API_KEY;
  if (chimegeKey) {
    try {
      const url = process.env.CHIMEGE_API_URL ?? 'https://api.chimege.com/v1.2/transcribe';
      const res = await fetch(url, {
        method: 'POST',
        headers: { Token: chimegeKey, 'Content-Type': 'application/octet-stream' },
        body: audio,
      });
      if (res.ok) {
        const raw = await res.text();
        let text = raw;
        try { text = JSON.parse(raw).text ?? JSON.parse(raw).transcript ?? raw; } catch {}
        if (text.trim()) return NextResponse.json({ text: text.trim(), engine: 'chimege' });
      } else {
        console.warn('chimege failed', res.status);
      }
    } catch (e) {
      console.warn('chimege error', e);
    }
  }

  // 폴백: Google STT mn-MN
  const googleKey = process.env.GOOGLE_STT_API_KEY;
  if (googleKey) {
    try {
      const res = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: mime.includes('wav') ? 'LINEAR16' : mime.includes('webm') ? 'WEBM_OPUS' : 'ENCODING_UNSPECIFIED',
            sampleRateHertz: mime.includes('wav') ? 16000 : 48000,
            languageCode: 'mn-MN',
          },
          audio: { content: audio.toString('base64') },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const text = (json.results ?? [])
          .map((r: { alternatives?: { transcript?: string }[] }) => r.alternatives?.[0]?.transcript ?? '')
          .join(' ').trim();
        if (text) return NextResponse.json({ text, engine: 'google' });
      } else {
        console.warn('google stt failed', res.status);
      }
    } catch (e) {
      console.warn('google stt error', e);
    }
  }

  return NextResponse.json(
    { error: chimegeKey || googleKey ? 'Танигдсангүй — дахин ярина уу' : 'STT тохируулаагүй (CHIMEGE_API_KEY)' },
    { status: 503 });
}
