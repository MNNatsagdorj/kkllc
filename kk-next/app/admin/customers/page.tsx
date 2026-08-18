'use client';

// Харилцагч — 주문 이력 + Зээл(외상) 장부 (08-roadmap P2)
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatusChip } from '@/components/StatusChip';
import { fmtMNT, fmtOrderNo, type OrderStatus } from '@/lib/types';

interface CustomerRow {
  id: string; name: string; phone: string; type: 'individual' | 'shop';
  district: string | null; credit_balance: number;
}
interface MiniOrder {
  id: number; customer_id: string; status: OrderStatus; created_at: string;
  subtotal_mnt: number; delivery_fee_mnt: number; payment_method: string | null;
}

export default function CustomersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [orders, setOrders] = useState<MiniOrder[]>([]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const refetch = useMemo(() => async () => {
    const [c, o] = await Promise.all([
      supabase.from('customers').select('id, name, phone, type, district, credit_balance').order('name'),
      supabase.from('orders')
        .select('id, customer_id, status, created_at, subtotal_mnt, delivery_fee_mnt, payment_method')
        .order('created_at', { ascending: false }).limit(1000),
    ]);
    setCustomers((c.data ?? []) as CustomerRow[]);
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
    !q || (c.name + c.phone).toLowerCase().includes(q.toLowerCase()));

  const repay = async (c: CustomerRow) => {
    const raw = window.prompt(`${c.name} — Зээл төлөлт бүртгэх\nҮлдэгдэл: ${fmtMNT(c.credit_balance)}\n\nТөлсөн дүн (₮):`);
    const amount = Number(raw?.replace(/\D/g, ''));
    if (!amount || amount <= 0) return;
    const { error } = await supabase.rpc('credit_repay', { p_customer_id: c.id, p_amount: amount, p_note: null });
    if (error) window.alert(error.message);
    else refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Харилцагч</h1>
        <span className="mono" style={{ fontSize: 12, color: 'var(--mut)' }}>{rows.length}</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Хайх: нэр · утас"
          style={{ marginLeft: 'auto', width: 220, padding: '8px 11px', borderRadius: 8, fontSize: 12.5, background: 'var(--ink2)', border: '1px solid var(--line)', color: '#EFECE3' }} />
      </div>

      <div style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 110px 70px 90px 120px 130px 110px', gap: 10, padding: '11px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', borderBottom: '1px solid var(--line)' }}>
          <span>Нэр</span><span>Утас</span><span>Төрөл</span><span style={{ textAlign: 'center' }}>Захиалга</span>
          <span style={{ textAlign: 'right' }}>Нийт дүн</span><span style={{ textAlign: 'right' }}>Зээл үлдэгдэл</span><span></span>
        </div>
        {rows.map((c) => {
          const os = byCustomer.get(c.id) ?? [];
          const total = os.filter((o) => o.status === 'delivered')
            .reduce((s, o) => s + o.subtotal_mnt + o.delivery_fee_mnt, 0);
          const expanded = open === c.id;
          return (
            <div key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
              <div onClick={() => setOpen(expanded ? null : c.id)}
                style={{ display: 'grid', gridTemplateColumns: '1.4fr 110px 70px 90px 120px 130px 110px', gap: 10, alignItems: 'center', padding: '11px 16px', fontSize: 12.5, cursor: 'pointer', background: expanded ? 'var(--ink3)' : 'transparent' }}>
                <span style={{ fontWeight: 700, color: '#EFECE3' }}>{c.name}
                  {c.district && <span style={{ color: '#5CA8FF', fontSize: 11, marginLeft: 8 }}>{c.district}</span>}
                </span>
                <span className="mono" style={{ color: 'var(--mut)' }}>{c.phone}</span>
                <span style={{ color: 'var(--mut)', fontSize: 11.5 }}>{c.type === 'shop' ? 'Дэлгүүр' : 'Хувь хүн'}</span>
                <span className="mono" style={{ textAlign: 'center', color: '#EFECE3' }}>{os.length}</span>
                <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#EFECE3' }}>{fmtMNT(total)}</span>
                <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: c.credit_balance > 0 ? 'var(--st-asg)' : 'var(--mut)' }}>
                  {fmtMNT(c.credit_balance)}
                </span>
                <span style={{ textAlign: 'right' }}>
                  {c.credit_balance > 0 && (
                    <button onClick={(e) => { e.stopPropagation(); repay(c); }}
                      style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--st-done)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}>
                      Төлөлт
                    </button>
                  )}
                </span>
              </div>
              {expanded && (
                <div style={{ padding: '4px 16px 12px', background: 'var(--ink3)' }}>
                  {os.slice(0, 8).map((o) => (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', fontSize: 12, borderBottom: '1px solid var(--line)' }}>
                      <span className="mono" style={{ color: 'var(--kraft)', fontWeight: 700, width: 56 }}>{fmtOrderNo(o.id)}</span>
                      <span className="mono" style={{ color: 'var(--mut)', width: 78 }}>{o.created_at.slice(0, 10)}</span>
                      <span className="mono" style={{ color: '#EFECE3', fontWeight: 700, width: 110, textAlign: 'right' }}>{fmtMNT(o.subtotal_mnt + o.delivery_fee_mnt)}</span>
                      <span style={{ color: 'var(--mut)', width: 60 }}>{o.payment_method === 'credit' ? 'Зээл' : o.payment_method === 'transfer' ? 'Данс' : o.payment_method === 'cash' ? 'Бэлэн' : '—'}</span>
                      <StatusChip status={o.status} />
                    </div>
                  ))}
                  {os.length === 0 && <div style={{ padding: '8px 0', fontSize: 12, color: 'var(--mut)' }}>Захиалга алга.</div>}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && <div style={{ padding: '38px 0', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>Үр дүн олдсонгүй.</div>}
      </div>
    </div>
  );
}
