'use client';

// Харилцагч — 목록 + 등록/수정 모달 + 상세 드로어 + Зээл(외상) 장부.
// 구 관리자(kk-admin-web)의 KPI·등급·핀 지도 패턴을 이식 (0007 마이그레이션 필요).
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtMNT } from '@/lib/types';
import { CustomerModal } from '../_components/CustomerModal';
import {
  CustomerDetailDrawer, TierChip,
  type CustomerRow, type MiniOrder,
} from '../_components/CustomerDetailDrawer';

const GRID = '1.5fr 110px 70px 80px 90px 120px 130px 110px';

export default function CustomersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [orders, setOrders] = useState<MiniOrder[]>([]);
  const [q, setQ] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ customer: CustomerRow | null } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const refetch = useCallback(async () => {
    const full = await supabase.from('customers')
      .select('id, name, phone, type, district, address, email, tier, lat, lng, note, credit_balance')
      .order('name');
    let data = full.data as Partial<CustomerRow>[] | null;
    if (full.error) {
      // 0007(email·tier) 미적용 DB — 기존 컬럼만으로 폴백해 페이지는 계속 동작
      console.error('customers select failed (0007 마이그레이션 적용됐는지 확인)', full.error);
      const fb = await supabase.from('customers')
        .select('id, name, phone, type, district, address, lat, lng, note, credit_balance')
        .order('name');
      data = fb.data as Partial<CustomerRow>[] | null;
    }
    const o = await supabase.from('orders')
      .select('id, customer_id, status, created_at, subtotal_mnt, delivery_fee_mnt, payment_method')
      .order('created_at', { ascending: false }).limit(1000);
    setCustomers((data ?? []).map((r) => ({ email: null, tier: 'new', ...r })) as CustomerRow[]);
    setOrders((o.data ?? []) as MiniOrder[]);
  }, [supabase]);

  useEffect(() => { refetch(); }, [refetch]);

  const byCustomer = useMemo(() => {
    const m = new Map<string, MiniOrder[]>();
    for (const o of orders) {
      if (!o.customer_id) continue;
      (m.get(o.customer_id) ?? m.set(o.customer_id, []).get(o.customer_id)!).push(o);
    }
    return m;
  }, [orders]);

  const rows = customers.filter((c) =>
    !q || (c.name + c.phone + (c.email ?? '') + (c.address ?? '')).toLowerCase().includes(q.toLowerCase()));

  // KPI (구 관리자 상단 카드)
  const vip = customers.filter((c) => c.tier === 'vip').length;
  const fresh = customers.filter((c) => (c.tier ?? 'new') === 'new').length;
  const stats = [
    { label: 'нийт харилцагч', value: String(customers.length) },
    { label: 'VIP', value: String(vip), accent: true },
    { label: 'шинэ', value: String(fresh) },
  ];

  const repay = async (c: CustomerRow) => {
    const raw = window.prompt(`${c.name} — Зээл төлөлт бүртгэх\nҮлдэгдэл: ${fmtMNT(c.credit_balance)}\n\nТөлсөн дүн (₮):`);
    const amount = Number(raw?.replace(/\D/g, ''));
    if (!amount || amount <= 0) return;
    const { error } = await supabase.rpc('credit_repay', { p_customer_id: c.id, p_amount: amount, p_note: null });
    if (error) window.alert(error.message);
    else { notify('Төлөлт бүртгэгдлээ'); refetch(); }
  };

  const detail = detailId != null ? customers.find((c) => c.id === detailId) ?? null : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Харилцагч</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 10, padding: '7px 13px' }}>
              <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: s.accent ? '#E3A63B' : '#EFECE3' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: 'var(--mut)', marginLeft: 7 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Хайх: нэр · утас · и-мэйл"
            style={{ width: 210, padding: '8px 11px', borderRadius: 8, fontSize: 12.5, background: 'var(--ink2)', border: '1px solid var(--line)', color: '#EFECE3' }} />
          <button onClick={() => setModal({ customer: null })}
            style={{ background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 13, border: 0, borderRadius: 9, padding: '8px 15px', cursor: 'pointer' }}>
            + Харилцагч нэмэх
          </button>
        </div>
      </div>

      <div className="table-scroll" style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13 }}>
        <div style={{ minWidth: 940 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 10, padding: '11px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', borderBottom: '1px solid var(--line)' }}>
          <span>Нэр</span><span>Утас</span><span>Төрөл</span><span style={{ textAlign: 'center' }}>Зэрэг</span>
          <span style={{ textAlign: 'center' }}>Захиалга</span>
          <span style={{ textAlign: 'right' }}>Нийт дүн</span><span style={{ textAlign: 'right' }}>Зээл үлдэгдэл</span><span></span>
        </div>
        {rows.map((c) => {
          const os = byCustomer.get(c.id) ?? [];
          const total = os.filter((o) => o.status === 'delivered')
            .reduce((s, o) => s + o.subtotal_mnt + o.delivery_fee_mnt, 0);
          return (
            <div key={c.id} onClick={() => setDetailId(c.id)}
              style={{ display: 'grid', gridTemplateColumns: GRID, gap: 10, alignItems: 'center', padding: '11px 16px', fontSize: 12.5, cursor: 'pointer', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontWeight: 700, color: '#EFECE3', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
                {c.district && <span style={{ color: '#5CA8FF', fontSize: 11, marginLeft: 8 }}>{c.district}</span>}
              </span>
              <span className="mono" style={{ color: 'var(--mut)' }}>{c.phone}</span>
              <span style={{ color: 'var(--mut)', fontSize: 11.5 }}>{c.type === 'shop' ? 'Дэлгүүр' : 'Хувь хүн'}</span>
              <span style={{ textAlign: 'center' }}><TierChip tier={c.tier} /></span>
              <span className="mono" style={{ textAlign: 'center', color: '#EFECE3' }}>{os.length}</span>
              <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#EFECE3' }}>{fmtMNT(total)}</span>
              <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: c.credit_balance > 0 ? 'var(--st-asg)' : 'var(--mut)' }}>
                {fmtMNT(c.credit_balance)}
              </span>
              <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                {c.credit_balance > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); repay(c); }}
                    style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--st-done)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}>
                    Төлөлт
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); setModal({ customer: c }); }} title="Засах"
                  style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--kraft)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}>
                  ✎
                </button>
              </span>
            </div>
          );
        })}
        {rows.length === 0 && <div style={{ padding: '38px 0', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>Үр дүн олдсонгүй.</div>}
        </div>
      </div>

      {detail && (
        <CustomerDetailDrawer
          customer={detail}
          orders={byCustomer.get(detail.id) ?? []}
          onClose={() => setDetailId(null)}
          onEdit={() => setModal({ customer: detail })}
          onRepay={() => repay(detail)}
        />
      )}
      {modal && (
        <CustomerModal
          customer={modal.customer}
          onClose={() => setModal(null)}
          onSaved={(msg) => { setModal(null); notify(msg); refetch(); }}
        />
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', background: '#EFECE3', color: 'var(--ink)', fontSize: 13.5, fontWeight: 700, padding: '11px 20px', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,.4)', zIndex: 90 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
