'use client';

// "Хэдэн уут хэрэгтэй вэ?" 계산기 — Home-C 시안 이식.
// 소모량 норм은 시안 값 그대로 (인기 3종 기준); 정확 수량은 엔지니어 확인 문구 포함.
import { useState } from 'react';

const CALC = [
  { id: 'ts50', label: 'Хавтанцрын цавуу', bag: 25, pp: 48, rate: 4.5, note: 'Норм 4.5 кг/м² — 8 мм тармуур · 25 кг уут' },
  { id: 'tt61', label: 'Тэгшлэгч хольц', bag: 25, pp: 48, rate: 8, note: 'Норм 8 кг/м² — 5 мм үе (1.6 кг/м²·мм) · 25 кг уут' },
  { id: 'hantek', label: 'Шпатлёвка', bag: 20, pp: 60, rate: 2.2, note: 'Норм 2.2 кг/м² — 2 мм үе · 20 кг уут' },
] as const;

export function BagCalculator() {
  const [sel, setSel] = useState<(typeof CALC)[number]['id']>('ts50');
  const [area, setArea] = useState(25);
  const c = CALC.find((x) => x.id === sel)!;
  const bags = Math.ceil((area * c.rate) / c.bag) || 0;

  return (
    <section style={{ background: '#14181D', color: '#fff', marginTop: 56 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '54px 20px', display: 'grid', gap: 40, alignItems: 'center' }}
        className="md:grid-cols-[.9fr_1.1fr]">
        <div>
          <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', margin: '0 0 13px', textTransform: 'uppercase' }}>Хэдэн уут хэрэгтэй вэ?</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.65)', margin: 0, maxWidth: 380 }}>
            Талбайгаа оруулахад хэдэн уут хэрэгтэйг шууд харуулна. Тооцоо дундаж норм дээр
            суурилах бөгөөд нарийвчилсан хэмжээг манай ажилтан баталгаажуулна.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.14)', padding: '24px 26px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CALC.map((p) => {
              const on = p.id === sel;
              return (
                <button key={p.id} onClick={() => setSel(p.id)}
                  style={{ fontSize: 13, fontWeight: 700, padding: '9px 15px', cursor: 'pointer', border: `1px solid ${on ? 'var(--accent)' : 'rgba(255,255,255,.3)'}`, background: on ? 'var(--accent)' : 'transparent', color: on ? 'var(--accent-ink)' : '#fff' }}>
                  {p.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', margin: '17px 0 7px' }}>ТАЛБАЙ (М²)</div>
          <input type="number" value={area} min={0} inputMode="numeric"
            onChange={(e) => setArea(Math.max(0, Number(e.target.value) || 0))}
            className="mono"
            style={{ width: '100%', boxSizing: 'border-box', height: 48, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 17, fontWeight: 600, padding: '0 14px', borderRadius: 0 }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 8 }}>{c.note}</div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', marginTop: 17, paddingTop: 15, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="disp" style={{ fontSize: 34, lineHeight: 1 }}>
                {bags} <span style={{ fontSize: 18 }}>уут</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 7 }}>
                {c.bag} кг/уут · нийт {bags * c.bag} кг · ≈ {(bags / c.pp).toFixed(1)} паллет
              </div>
            </div>
            <a href="#products"
              style={{ background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 700, fontSize: 13.5, padding: '13px 20px', flex: 'none' }}>
              Захиалга өгөх →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
