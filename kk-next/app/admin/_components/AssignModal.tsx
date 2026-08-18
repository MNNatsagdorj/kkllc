'use client';

// 기사 배정 모달 — 용량 초과 시 409 경고를 받아 관리자 확인 후 force 재요청 (BR-5)
import { useState } from 'react';
import { fmtWeight, type DriverRow, type OrderRow } from '@/lib/queries';
import { fmtOrderNo } from '@/lib/types';

export function AssignModal({ order, drivers, onClose, onDone }: {
  order: OrderRow;
  drivers: DriverRow[];
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState<{ driverId: string; message: string } | null>(null);

  const assign = async (driverId: string, force = false) => {
    setBusy(true);
    const res = await fetch(`/api/orders/${order.id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: driverId, force }),
    });
    const json = await res.json();
    setBusy(false);
    if (res.status === 409) {
      setWarning({ driverId, message: json.warning });
      return;
    }
    if (!res.ok) { onDone(json.error ?? 'Алдаа гарлаа'); return; }
    onDone(`${fmtOrderNo(order.id)} хуваарилагдлаа${json.pushed ? ' · пуш илгээв' : ''}`);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,10,20,.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: 400, maxWidth: '92vw', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, color: '#EFECE3' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
          Жолооч хуваарилах — <span className="mono" style={{ color: 'var(--kraft)' }}>{fmtOrderNo(order.id)}</span>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 14 }}>
          Ачаа: {fmtWeight(Number(order.total_weight_kg))}
        </div>

        {warning ? (
          <div>
            <div style={{ background: 'color-mix(in srgb, var(--st-asg) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--st-asg) 45%, transparent)', color: 'var(--st-asg)', borderRadius: 10, padding: '12px 14px', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
              ⚠ {warning.message}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setWarning(null)} disabled={busy}
                style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: '1px solid var(--line)', background: 'transparent', color: 'var(--mut)', fontWeight: 700, cursor: 'pointer' }}>
                Болих
              </button>
              <button onClick={() => assign(warning.driverId, true)} disabled={busy}
                style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--st-asg)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>
                Зөвшөөрч үргэлжлүүлэх
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drivers.map((d) => (
              <button key={d.id} onClick={() => assign(d.id)} disabled={busy}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--ink3)', color: '#EFECE3', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ink)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {d.name.charAt(0)}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{d.name}</span>
                  {d.vehicle && (
                    <span className="mono" style={{ display: 'block', fontSize: 11.5, color: 'var(--mut)' }}>
                      {d.vehicle.model} · {d.vehicle.plate} · {fmtWeight(d.vehicle.capacity_kg)}
                    </span>
                  )}
                </span>
              </button>
            ))}
            {drivers.length === 0 && <div style={{ fontSize: 13, color: 'var(--mut)' }}>Идэвхтэй жолооч алга.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
