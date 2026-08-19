'use client';

// 주문 상세 — 적재 체크리스트 → 출발 → 사진 증빙 → 완료 (06 문서 화면 2·3, BR-3/4/6)
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Conveyor } from '@/components/Conveyor';
import { StatusChip } from '@/components/StatusChip';
import { ORDER_SELECT, fmtWeight, type OrderRow } from '@/lib/queries';
import { fmtMNT, fmtOrderNo } from '@/lib/types';

const PinMap = dynamic(() => import('@/components/PinMap').then((m) => m.PinMap), { ssr: false });

const bigBtn = (bg: string, enabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '16px 0', borderRadius: 14, border: 0,
  fontSize: 15.5, fontWeight: 800, cursor: enabled ? 'pointer' : 'default',
  background: enabled ? bg : '#B9AF93', color: '#fff',
});

export default function DriverOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [proofPath, setProofPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refetch = useCallback(async () => {
    const { data } = await supabase.from('orders')
      .select(ORDER_SELECT).eq('id', Number(id)).single();
    if (data) setOrder(data as unknown as OrderRow);
  }, [supabase, id]);

  useEffect(() => {
    refetch();
    const ch = supabase.channel(`order-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, id, refetch]);

  if (!order) return <div style={{ padding: 40, textAlign: 'center', color: '#8A8062' }}>Ачаалж байна…</div>;

  const allLoaded = order.items.length > 0 && order.items.every((i) => i.loaded);
  const phoneDigits = order.customer?.phone?.replace(/\D/g, '') ?? '';
  const mapUrl = order.lat != null && order.lng != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([order.district, order.address].filter(Boolean).join(' '))}`;

  const toggleLoaded = async (itemId: string, loaded: boolean) => {
    // 낙관적 갱신 → RLS(loaded 컬럼만) 직접 저장 (BR-4)
    setOrder((o) => o && { ...o, items: o.items.map((i) => i.id === itemId ? { ...i, loaded } : i) });
    const { error } = await supabase.from('order_items').update({ loaded }).eq('id', itemId);
    if (error) { setErr(error.message); refetch(); }
  };

  const changeStatus = async (status: string, extra?: Record<string, unknown>) => {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(json.error ?? 'Алдаа гарлаа'); return; }
    refetch();
    if (status === 'delivered') router.push('/driver');
  };

  const uploadProof = async (file: File) => {
    setUploading(true); setErr(null);
    const path = `${order.id}/${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('delivery-proofs').upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { setErr(`Зураг илгээж чадсангүй — дахин оролдоно уу (${error.message})`); return; }
    setProofPath(path);
  };

  const cash = order.payment_method === 'cash'
    ? order.cash_amount_mnt ?? order.subtotal_mnt + order.delivery_fee_mnt : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Link href="/driver" style={{ fontSize: 13, color: '#8A8062' }}>← Буцах</Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="mono disp" style={{ fontSize: 20, color: 'var(--site-text)' }}>{fmtOrderNo(order.id)}</span>
        <StatusChip status={order.status} />
      </div>

      <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 13, padding: '14px 16px' }}>
        <Conveyor status={order.status} compact />
      </div>

      {/* 전화 (풀폭 네이비) */}
      {phoneDigits && (
        <a href={`tel:${phoneDigits}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px 0', borderRadius: 14, background: 'var(--ink)', color: '#EFECE3', fontSize: 15, fontWeight: 800 }}>
          ☎ {order.customer?.name} — залгах
          <span className="mono" style={{ fontWeight: 400, color: 'var(--mut)' }}>{order.customer?.phone}</span>
        </a>
      )}

      {/* 지도 — 핀 미리보기(OSM) + 탭하면 구글맵 내비 딥링크 */}
      <a href={mapUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 13, padding: '14px 16px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--site-text)' }}>
          📍 {[order.district, order.address].filter(Boolean).join(' · ')}
        </div>
        {order.lat != null && order.lng != null && (
          <div style={{ margin: '10px 0 2px', pointerEvents: 'none' }}>
            <PinMap lat={order.lat} lng={order.lng} height={150} />
          </div>
        )}
        <div style={{ fontSize: 13, color: '#3D7DD8', fontWeight: 700, marginTop: 5 }}>
          Газрын зураг нээх — маршрут ↗
        </div>
      </a>

      {/* 적재 체크리스트 (BR-4) */}
      {(order.status === 'assigned' || order.status === 'loading') && (
        <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 13, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--site-text)', marginBottom: 10 }}>
            Ачилтын жагсаалт · <span className="mono">{order.total_qty}ш</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.items.map((it) => (
              <label key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 4px', borderBottom: '1px solid #EEE9DB', cursor: order.status === 'loading' ? 'pointer' : 'default' }}>
                <input type="checkbox" checked={it.loaded}
                  disabled={order.status !== 'loading'}
                  onChange={(e) => toggleLoaded(it.id, e.target.checked)}
                  style={{ width: 27, height: 27, accentColor: 'var(--st-done)', flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--site-text)' }}>{it.product?.name_mn}</span>
                  <span className="mono" style={{ display: 'block', fontSize: 11.5, color: '#8A8062' }}>
                    {it.batch_no ? `Багц ${it.batch_no} · ` : ''}{it.product?.weight_kg ?? 25}кг
                  </span>
                </span>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--site-text)' }}>×{it.qty}</span>
              </label>
            ))}
          </div>
          {order.status === 'assigned' ? (
            <button onClick={() => changeStatus('loading')} disabled={busy} style={{ ...bigBtn('var(--kraft)', true), marginTop: 13 }}>
              Ачилт эхлэх
            </button>
          ) : (
            <button onClick={() => allLoaded && changeStatus('en_route')} disabled={busy || !allLoaded}
              style={{ ...bigBtn('var(--st-way)', allLoaded), marginTop: 13 }}>
              {allLoaded ? 'Замд гарах →' : 'Бүгдийг ачсаны дараа — Замд гарах'}
            </button>
          )}
        </div>
      )}

      {/* 배송 진행/완료 (BR-6) */}
      {order.status === 'en_route' && (
        <>
          {cash != null && (
            <div style={{ background: 'var(--ink)', borderRadius: 13, padding: '16px 18px', color: '#EFECE3' }}>
              <div style={{ fontSize: 12, color: 'var(--mut)' }}>Бэлнээр авах дүн</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, margin: '4px 0 6px' }}>{fmtMNT(cash)}</div>
              <div style={{ fontSize: 11.5, color: 'var(--mut)', lineHeight: 1.5 }}>
                Тоолж аваад доор тэмдэглэнэ — падаан менежер дээр автоматаар үүснэ
              </div>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadProof(f); }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ width: '100%', padding: '22px 0', borderRadius: 14, cursor: 'pointer', border: `2px dashed ${proofPath ? 'var(--st-done)' : '#B9AF93'}`, background: proofPath ? 'color-mix(in srgb, var(--st-done) 10%, transparent)' : '#FBFAF5', color: proofPath ? 'var(--st-done)' : '#8A8062', fontSize: 14, fontWeight: 700 }}>
            {uploading ? 'Илгээж байна…' : proofPath ? '✓ Зураг хадгалагдлаа — дахин авах' : '📷 Зураг авах — Буулгасан ачааны баталгаа · заавал 1 зураг'}
          </button>

          <button onClick={() => proofPath && changeStatus('delivered', { proof_photo_url: proofPath })}
            disabled={busy || !proofPath}
            style={bigBtn('var(--st-done)', !!proofPath)}>
            ✓ Хүргэгдсэн гэж тэмдэглэх
          </button>
        </>
      )}

      {order.status === 'delivered' && (
        <div style={{ textAlign: 'center', padding: '26px 0', color: 'var(--st-done)', fontSize: 15, fontWeight: 800 }}>
          ✓ Хүргэлт амжилттай дууслаа
        </div>
      )}

      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#8A8062' }}>
        <span>{fmtWeight(Number(order.total_weight_kg))}</span>
        <span>Нийт {fmtMNT(order.subtotal_mnt + order.delivery_fee_mnt)}</span>
      </div>

      {err && <div style={{ color: 'var(--st-cancel)', fontSize: 13.5, fontWeight: 700 }}>{err}</div>}
    </div>
  );
}
