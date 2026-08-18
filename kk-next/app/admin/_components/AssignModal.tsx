'use client';

// 기사 배정 모달 — BR-5 용량 경고 + 같은 방향(지역구) 주문 묶음 배차(P3 рейс 계획)
import { useState } from 'react';
import { checkCapacity } from '@/lib/delivery';
import { fmtWeight, itemsSummary, type DriverRow, type OrderRow } from '@/lib/queries';
import { fmtOrderNo } from '@/lib/types';

export function AssignModal({ order, drivers, candidates = [], onClose, onDone }: {
  order: OrderRow;
  drivers: DriverRow[];
  /** 같은 지역구의 미배정(new) 주문 — 묶음 배차 후보 */
  candidates?: OrderRow[];
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState<{ driverId: string; message: string } | null>(null);
  const [picked, setPicked] = useState<DriverRow | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const assignOne = async (orderId: number, driverId: string, force: boolean) => {
    const res = await fetch(`/api/orders/${orderId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: driverId, force }),
    });
    return { res, json: await res.json() };
  };

  // 단독 배정 (서버 409 경고 플로우)
  const assignSingle = async (driverId: string, force = false) => {
    setBusy(true);
    const { res, json } = await assignOne(order.id, driverId, force);
    setBusy(false);
    if (res.status === 409) { setWarning({ driverId, message: json.warning }); return; }
    if (!res.ok) { onDone(json.error ?? 'Алдаа гарлаа'); return; }
    onDone(`${fmtOrderNo(order.id)} хуваарилагдлаа${json.pushed ? ' · пуш илгээв' : ''}`);
  };

  // 묶음 배정 — 용량 정보를 로컬에서 보여준 뒤 force로 일괄 처리
  const assignBundle = async () => {
    if (!picked) return;
    setBusy(true);
    const ids = [order.id, ...selected];
    let ok = 0;
    for (const id of ids) {
      const { res } = await assignOne(id, picked.id, true);
      if (res.ok) ok++;
    }
    setBusy(false);
    onDone(`${ok} захиалга ${picked.name}-д хуваарилагдлаа (рейс)`);
  };

  const pickDriver = (d: DriverRow) => {
    if (candidates.length) setPicked(d);
    else assignSingle(d.id);
  };

  const bundleWeight = Number(order.total_weight_kg) +
    candidates.filter((c) => selected.has(c.id)).reduce((s, c) => s + Number(c.total_weight_kg), 0);
  const cap = picked?.vehicle
    ? checkCapacity(bundleWeight, picked.vehicle.capacity_kg, picked.vehicle.model)
    : { overloaded: false, trips: 1, message: undefined as string | undefined };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,10,20,.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: 430, maxWidth: '92vw', maxHeight: '86vh', overflowY: 'auto', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, color: '#EFECE3' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
          Жолооч хуваарилах — <span className="mono" style={{ color: 'var(--kraft)' }}>{fmtOrderNo(order.id)}</span>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 14 }}>
          {order.district ? `${order.district} · ` : ''}Ачаа: {fmtWeight(Number(order.total_weight_kg))}
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
              <button onClick={() => assignSingle(warning.driverId, true)} disabled={busy}
                style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--st-asg)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>
                Зөвшөөрч үргэлжлүүлэх
              </button>
            </div>
          </div>
        ) : picked ? (
          // 묶음 배차 단계 — 같은 지역구 후보 선택
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13, padding: '9px 12px', background: 'var(--ink3)', borderRadius: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                {picked.name.charAt(0)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{picked.name}</span>
              {picked.vehicle && (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>
                  {picked.vehicle.model} · {fmtWeight(picked.vehicle.capacity_kg)}
                </span>
              )}
              <button onClick={() => setPicked(null)} style={{ marginLeft: 'auto', background: 'none', border: 0, color: 'var(--mut)', fontSize: 12, cursor: 'pointer' }}>солих</button>
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.05em', color: 'var(--mut)', marginBottom: 8 }}>
              МӨН ЭНЭ ЧИГЛЭЛД ({order.district}) — хамт ачих уу?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 13 }}>
              {candidates.map((c) => {
                const on = selected.has(c.id);
                return (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: `1px solid ${on ? 'color-mix(in srgb, var(--kraft) 55%, transparent)' : 'var(--line)'}`, background: on ? 'color-mix(in srgb, var(--kraft) 10%, transparent)' : 'transparent', cursor: 'pointer', fontSize: 12.5 }}>
                    <input type="checkbox" checked={on} style={{ width: 17, height: 17, accentColor: 'var(--kraft)' }}
                      onChange={(e) => setSelected((s) => {
                        const n = new Set(s);
                        if (e.target.checked) n.add(c.id); else n.delete(c.id);
                        return n;
                      })} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--kraft)' }}>{fmtOrderNo(c.id)}</span>
                      <span style={{ color: '#EFECE3', marginLeft: 8, fontWeight: 600 }}>{c.customer?.name}</span>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--mut)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemsSummary(c)}</span>
                    </span>
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>{fmtWeight(Number(c.total_weight_kg))}</span>
                  </label>
                );
              })}
            </div>

            <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '9px 12px', borderRadius: 9, background: 'var(--ink)', border: '1px solid var(--line)', marginBottom: 6 }}>
              <span style={{ color: 'var(--mut)' }}>Нийт ачаа ({1 + selected.size} захиалга)</span>
              <span style={{ fontWeight: 700, color: cap.overloaded ? 'var(--st-asg)' : '#EFECE3' }}>{fmtWeight(bundleWeight)}</span>
            </div>
            {cap.overloaded && (
              <div style={{ fontSize: 12, color: 'var(--st-asg)', marginBottom: 8 }}>⚠ {cap.message}</div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => assignSingle(picked.id)} disabled={busy}
                style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: '1px solid var(--line)', background: 'transparent', color: 'var(--mut)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                Зөвхөн энэ захиалга
              </button>
              <button onClick={assignBundle} disabled={busy || selected.size === 0}
                style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: 0, background: selected.size ? 'var(--kraft)' : 'var(--ink3)', color: selected.size ? 'var(--ink)' : 'var(--mut)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}>
                Хамтад нь ({1 + selected.size})
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drivers.map((d) => (
              <button key={d.id} onClick={() => pickDriver(d)} disabled={busy}
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
