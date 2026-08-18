'use client';

// 신규 주문 드로어 (05 문서) — 입력 즉시 합계·중량·100ш 미터 자동 계산
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calcDelivery, calcTotalWeight } from '@/lib/delivery';
import { Meter } from '@/components/Meter';
import { fmtWeight, type DriverRow } from '@/lib/queries';
import { UB_DISTRICTS, fmtMNT, type Product } from '@/lib/types';

interface Line { product_id: string; qty: number }
const PAY_OPTS = [
  { v: 'cash', label: 'Бэлэн' },
  { v: 'transfer', label: 'Данс' },
  { v: 'credit', label: 'Зээл' },
] as const;

const input: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: 8, fontSize: 13.5,
  background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3',
};
const label: React.CSSProperties = { display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--mut)', marginBottom: 5 };

export function NewOrderDrawer({ products, drivers, onClose, onCreated }: {
  products: Product[];
  drivers: DriverRow[];
  onClose: () => void;
  onCreated: (msg: string) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [lines, setLines] = useState<Line[]>([{ product_id: '', qty: 0 }]);
  const [payment, setPayment] = useState<string>('cash');
  const [driverId, setDriverId] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [matched, setMatched] = useState(false);

  // 전화 입력 후 기존 고객 자동 채움 (05 문서)
  const lookupCustomer = async () => {
    if (!phone.trim()) return;
    const { data } = await supabase.from('customers')
      .select('name, district, address').eq('phone', phone.trim()).limit(1).maybeSingle();
    if (data) {
      setMatched(true);
      if (!name) setName(data.name);
      if (!district && data.district) setDistrict(data.district);
      if (!address && data.address) setAddress(data.address);
    } else setMatched(false);
  };

  const rows = lines
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.product_id) }))
    .filter((l) => l.product && l.qty > 0);
  const subtotal = rows.reduce((s, r) => s + r.product!.price_mnt * r.qty, 0);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const weight = calcTotalWeight(rows.map((r) => ({ qty: r.qty, weight_kg: r.product!.weight_kg })));
  const delivery = calcDelivery(rows.map((r) => ({ qty: r.qty })));

  const submit = async () => {
    setErr(null);
    if (!name.trim() || !phone.trim()) { setErr('Нэр, утас оруулна уу'); return; }
    if (!address.trim()) { setErr('Хаяг оруулна уу'); return; }
    if (!rows.length) { setErr('Дор хаяж нэг бараа сонгоно уу'); return; }
    setBusy(true);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: name.trim(), phone: phone.trim() },
        district: district || undefined,
        address: address.trim(),
        items: rows.map((r) => ({ product_id: r.product_id, qty: r.qty })),
        payment_method: payment,
        note: note.trim() || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok) { setErr(json.error ?? 'Алдаа гарлаа'); setBusy(false); return; }

    let msg = `Захиалга #${json.id} үүслээ`;
    if (driverId) {
      const ar = await fetch(`/api/orders/${json.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId }),
      });
      const aj = await ar.json();
      if (ar.status === 409 && window.confirm(`${aj.warning}\n\nҮргэлжлүүлэх үү?`)) {
        await fetch(`/api/orders/${json.id}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driver_id: driverId, force: true }),
        });
        msg += ' · жолооч хуваарилагдлаа';
      } else if (ar.ok) msg += ' · жолооч хуваарилагдлаа';
    }
    onCreated(msg);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,20,.55)' }} />
      <aside style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '94vw', background: 'var(--ink2)', borderLeft: '1px solid var(--line)', padding: 20, overflowY: 'auto', color: '#EFECE3' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Шинэ захиалга</span>
          <button onClick={onClose} style={{ background: 'none', border: 0, color: 'var(--mut)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        {/* 음성 입력 자리 (Phase 3, BR-8) */}
        <button disabled title="Phase 3"
          style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: '1px dashed color-mix(in srgb, var(--st-way) 45%, transparent)', background: 'transparent', color: 'color-mix(in srgb, var(--st-way) 55%, transparent)', fontSize: 12.5, fontWeight: 700, marginBottom: 16, cursor: 'default' }}>
          🎙 Дуугаар бүртгэх — удахгүй (P3)
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <span style={label}>Утас {matched && <em style={{ color: 'var(--st-done)', fontStyle: 'normal' }}>· бүртгэлтэй ✓</em>}</span>
              <input className="mono" style={input} value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={lookupCustomer} placeholder="9911-2233" />
            </div>
            <div>
              <span style={label}>Нэр</span>
              <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Мөнх трейд ХХК" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10 }}>
            <div>
              <span style={label}>Дүүрэг</span>
              <select style={input} value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">—</option>
                {UB_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <span style={label}>Хаяг</span>
              <input style={input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Да хүрээ зах, 21-р гудамж…" />
            </div>
          </div>

          {/* 품목 */}
          <div>
            <span style={label}>Бараа</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {lines.map((l, i) => {
                const p = products.find((x) => x.id === l.product_id);
                return (
                  <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <select style={{ ...input, flex: 1 }} value={l.product_id}
                      onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, product_id: e.target.value } : x))}>
                      <option value="">— сонгох —</option>
                      {products.map((pr) => (
                        <option key={pr.id} value={pr.id}>{pr.name_mn} · {fmtMNT(pr.price_mnt)}</option>
                      ))}
                    </select>
                    <input className="mono" type="number" min={0} style={{ ...input, width: 72 }} value={l.qty || ''}
                      placeholder="ш"
                      onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                    <span className="mono" style={{ width: 86, textAlign: 'right', fontSize: 11.5, color: 'var(--mut)' }}>
                      {p && l.qty > 0 ? fmtMNT(p.price_mnt * l.qty) : ''}
                    </span>
                    <button onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 0, color: 'var(--mut)', cursor: 'pointer' }}>✕</button>
                  </div>
                );
              })}
              <button onClick={() => setLines((ls) => [...ls, { product_id: '', qty: 0 }])}
                style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid var(--line)', color: 'var(--mut)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                + Мөр нэмэх
              </button>
            </div>
          </div>

          {/* 자동 계산 (BR-1) */}
          <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 11, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--mut)' }}>
              <span>Нийт {totalQty}ш · {fmtWeight(weight)}</span>
              <span>Хүргэлт: <b className="mono" style={{ color: delivery.isFree ? 'var(--st-done)' : '#EFECE3' }}>{delivery.isFree ? '0₮' : fmtMNT(delivery.fee)}</b></span>
            </div>
            <Meter calc={delivery} dark />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--mut)' }}>Нийт дүн</span>
              <span className="mono" style={{ fontSize: 19, fontWeight: 700 }}>{fmtMNT(subtotal + delivery.fee)}</span>
            </div>
          </div>

          {/* 결제 */}
          <div>
            <span style={label}>Төлбөр</span>
            <div style={{ display: 'flex', gap: 7 }}>
              {PAY_OPTS.map((p) => (
                <button key={p.v} onClick={() => setPayment(p.v)}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: '1px solid var(--line)', background: payment === p.v ? 'var(--kraft)' : 'transparent', color: payment === p.v ? 'var(--ink)' : 'var(--mut)' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={label}>Тэмдэглэл</span>
            <textarea style={{ ...input, resize: 'vertical' }} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div>
            <span style={label}>Жолооч сонгох (заавал биш)</span>
            <select style={input} value={driverId} onChange={(e) => setDriverId(e.target.value)}>
              <option value="">— дараа хуваарилах —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}{d.vehicle ? ` · ${d.vehicle.model} ${d.vehicle.plate}` : ''}
                </option>
              ))}
            </select>
          </div>

          {err && <div style={{ color: 'var(--st-cancel)', fontSize: 13 }}>{err}</div>}
          <button onClick={submit} disabled={busy}
            style={{ padding: '13px 0', borderRadius: 10, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Үүсгэж байна…' : 'Захиалга үүсгэх'}
          </button>
        </div>
      </aside>
    </div>
  );
}
