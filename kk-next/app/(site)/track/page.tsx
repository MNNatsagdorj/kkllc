'use client';

// 주문조회 — 전화번호 → 상태 컨베이어 + 배송 중 지도 (04 문서 §6)
import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Conveyor } from '@/components/Conveyor';
import { fmtMNT, fmtOrderNo, type OrderStatus } from '@/lib/types';
import { STATUS_LABEL_MN, STATUS_COLOR } from '@/lib/status';

const PinMap = dynamic(() => import('@/components/PinMap').then((m) => m.PinMap), { ssr: false });

interface TrackOrder {
  id: number; status: OrderStatus; created_at: string; scheduled_date: string | null;
  total_mnt: number; is_free_delivery: boolean; items_summary: string;
  dest: { lat: number; lng: number } | null;
  driver_loc: { lat: number; lng: number; at: string } | null;
}

const minsAgo = (iso: string) => Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));

function TrackInner() {
  const search = useSearchParams();
  const [phone, setPhone] = useState(search.get('phone') ?? '');
  const [orders, setOrders] = useState<TrackOrder[] | null>(null);
  const [busy, setBusy] = useState(false);

  const check = useCallback(async (p: string, silent = false) => {
    if (!p.trim()) return;
    if (!silent) setBusy(true);
    const res = await fetch(`/api/track?phone=${encodeURIComponent(p.trim())}`);
    const json = await res.json();
    if (!silent) setBusy(false);
    setOrders(json.orders ?? []);
  }, []);

  useEffect(() => {
    const p = search.get('phone');
    if (p) check(p);
  }, [search, check]);

  // 배송 중(기사 위치)·승인 대기(승인 반영) 주문이 있으면 20초마다 조용히 갱신
  useEffect(() => {
    if (!orders?.some((o) => o.status === 'en_route' || o.status === 'pending')) return;
    const t = setInterval(() => check(phone, true), 20_000);
    return () => clearInterval(t);
  }, [orders, phone, check]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '38px 20px 60px' }}>
      <h1 className="disp" style={{ fontSize: 24, color: 'var(--site-text)' }}>Захиалга шалгах</h1>
      <p style={{ fontSize: 13.5, color: '#5E6C80', margin: '8px 0 18px', lineHeight: 1.6 }}>
        Бүртгүүлэх шаардлагагүй — захиалга өгсөн утасны дугаараа оруулаад явцаа хараарай.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); check(phone); }} style={{ display: 'flex', gap: 9 }}>
        <input className="mono" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
          placeholder="9911-2233"
          style={{ flex: 1, padding: '13px 15px', borderRadius: 10, fontSize: 15, background: '#fff', border: '1px solid var(--site-line)', color: 'var(--site-text)' }} />
        <button type="submit" disabled={busy}
          style={{ padding: '0 26px', borderRadius: 10, border: 0, background: 'var(--ink)', color: '#EFECE3', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
          {busy ? '…' : 'Шалгах'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
        {orders?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#8A8062', fontSize: 14 }}>
            Энэ дугаараар захиалга олдсонгүй.
          </div>
        )}
        {orders?.map((o) => (
          <div key={o.id} style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 15, padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--kraft-deep)' }}>{fmtOrderNo(o.id)}</span>
              <span className="st-chip" style={{ '--st': STATUS_COLOR[o.status] } as React.CSSProperties}>
                {STATUS_LABEL_MN[o.status]}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#5E6C80', marginBottom: 14 }}>
              {o.items_summary} · <b className="mono" style={{ color: 'var(--site-text)' }}>{fmtMNT(o.total_mnt)}</b>
              {o.is_free_delivery && <span style={{ color: 'var(--st-done)', fontWeight: 700 }}> · хүргэлт үнэгүй</span>}
            </div>
            {o.status === 'cancelled' ? (
              <div style={{ fontSize: 13, color: 'var(--st-cancel)', fontWeight: 700 }}>Захиалга цуцлагдсан.</div>
            ) : o.status === 'pending' ? (
              <div style={{ background: 'color-mix(in srgb, #E3A63B 12%, transparent)', border: '1px solid color-mix(in srgb, #E3A63B 40%, transparent)', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: '#8A6D1F', fontWeight: 700, lineHeight: 1.55 }}>
                ⏳ Захиалгыг хүлээн авлаа — менежер баталгаажуулахыг хүлээж байна.
                Баталгаажмагц хүргэлтийн явц энд харагдана.
              </div>
            ) : (
              <Conveyor status={o.status} />
            )}
            {o.status === 'en_route' && (o.dest || o.driver_loc) && (
              <div style={{ marginTop: 13 }}>
                <PinMap lat={o.dest?.lat} lng={o.dest?.lng} driver={o.driver_loc} height={190} />
                <div style={{ fontSize: 12.5, color: '#8A8062', marginTop: 7, fontWeight: 700 }}>
                  {o.driver_loc
                    ? `🚚 Жолооч замд явж байна · ${minsAgo(o.driver_loc.at) === 0 ? 'дөнгөж сая' : `${minsAgo(o.driver_loc.at)} мин өмнө`}`
                    : '📍 Хүргэх байршил — жолоочийн байршил удахгүй харагдана'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return <Suspense><TrackInner /></Suspense>;
}
