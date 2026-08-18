'use client';

// 🎙 음성 주문 입력 (BR-8) — 녹음 → STT → 파싱 → 폼 채움. 절대 자동 저장하지 않음.
import { useRef, useState } from 'react';
import { parseVoiceOrder, type ParsedVoice } from '@/lib/voice-parse';
import type { Product } from '@/lib/types';

export function VoiceInput({ products, onParsed }: {
  products: Product[];
  onParsed: (p: ParsedVoice, transcript: string) => void;
}) {
  const [state, setState] = useState<'idle' | 'rec' | 'busy'>('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    setErr(null); setTranscript(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setState('busy');
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const res = await fetch('/api/voice/transcribe', {
          method: 'POST', headers: { 'Content-Type': 'audio/webm' }, body: blob,
        });
        const json = await res.json();
        setState('idle');
        if (!res.ok) { setErr(json.error ?? 'Алдаа гарлаа'); return; }
        setTranscript(json.text);
        onParsed(parseVoiceOrder(json.text, products), json.text);
      };
      recRef.current = rec;
      rec.start();
      setState('rec');
    } catch {
      setErr('Микрофон нээж чадсангүй');
    }
  };

  const stop = () => recRef.current?.stop();

  return (
    <div style={{ marginBottom: 16 }}>
      <button type="button"
        onClick={state === 'rec' ? stop : state === 'idle' ? start : undefined}
        style={{
          width: '100%', padding: '11px 0', borderRadius: 9, cursor: 'pointer',
          fontSize: 13, fontWeight: 800,
          border: state === 'rec' ? '1px solid var(--st-way)' : '1px dashed color-mix(in srgb, var(--st-way) 55%, transparent)',
          background: state === 'rec' ? 'color-mix(in srgb, var(--st-way) 18%, transparent)' : 'transparent',
          color: 'var(--st-way)',
          animation: state === 'rec' ? 'pulse-step 1.4s ease-out infinite' : undefined,
        }}>
        {state === 'rec' ? '⏺ Бичиж байна — дуусгах' : state === 'busy' ? '⏳ Таниж байна…' : '🎙 Дуугаар бүртгэх'}
      </button>
      {transcript && (
        <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 9, background: 'var(--ink)', border: '1px solid color-mix(in srgb, #5CA8FF 40%, transparent)', fontSize: 12.5, color: '#D8DEE8', lineHeight: 1.55 }}>
          <span style={{ color: '#5CA8FF', fontWeight: 700, fontSize: 10.5, letterSpacing: '.05em' }}>ТРАНСКРИПТ · дуунаас</span>
          <div style={{ marginTop: 4 }}>{transcript}</div>
        </div>
      )}
      {err && <div style={{ marginTop: 7, fontSize: 12, color: 'var(--st-cancel)' }}>{err}</div>}
    </div>
  );
}
