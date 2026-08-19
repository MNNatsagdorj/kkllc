// Падаан (영수증) — 브라우저 인쇄 (08-roadmap P2). 흰 배경 카드, print CSS로 사이드바 숨김.
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { fmtMNT, fmtOrderNo } from '@/lib/types';
import { PrintButton } from './PrintButton';

export const dynamic = 'force-dynamic';

interface ItemRow { qty: number; unit_price_mnt: number; line: number; name: string }

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: o } = await supabase.from('orders')
    .select('*, customer:customers(name, phone), items:order_items(qty, unit_price_mnt, product:products(name_mn))')
    .eq('id', Number(id)).single();

  if (!o) return <div style={{ color: 'var(--mut)', padding: 30 }}>Захиалга олдсонгүй.</div>;

  type Raw = { qty: number; unit_price_mnt: number; product: { name_mn: string } | null };
  const items: ItemRow[] = ((o.items ?? []) as Raw[]).map((i) => ({
    qty: i.qty, unit_price_mnt: i.unit_price_mnt,
    line: i.qty * i.unit_price_mnt, name: i.product?.name_mn ?? '?',
  }));
  const total = o.subtotal_mnt + o.delivery_fee_mnt;
  const PAY_MN: Record<string, string> = { cash: 'Бэлэн', transfer: 'Данс', credit: 'Зээл' };

  return (
    <div style={{ maxWidth: 460, margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <Link href="/admin/orders" style={{ color: 'var(--mut)', fontSize: 13 }}>← Захиалга</Link>
        <PrintButton />
      </div>

      <div style={{ background: '#fff', color: '#14263E', borderRadius: 12, padding: '26px 26px 22px', fontSize: 13 }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #14263E', paddingBottom: 12, marginBottom: 14 }}>
          <div className="disp" style={{ fontSize: 18 }}>KK LLC</div>
          <div style={{ fontSize: 11, color: '#5E6C80', marginTop: 3 }}>
            Kokorozashi Kibou LLC · СХД, Улаанбаатар · ☎ 8820-4057
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 9, letterSpacing: '.06em' }}>ПАДААН</div>
        </div>

        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
          <span>{fmtOrderNo(o.id)}</span>
          <span>{(o.delivered_at ?? o.created_at)?.slice(0, 10)}</span>
        </div>
        <div style={{ fontSize: 12.5, marginBottom: 14 }}>
          {o.customer?.name} <span className="mono" style={{ color: '#5E6C80' }}>· {o.customer?.phone}</span>
          {o.district && <span style={{ color: '#5E6C80' }}> · {o.district}</span>}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #D8D2C0', textAlign: 'left', color: '#5E6C80', fontSize: 10.5 }}>
              <th style={{ padding: '5px 0' }}>Бараа</th>
              <th style={{ textAlign: 'right' }}>Үнэ</th>
              <th style={{ textAlign: 'center' }}>ш</th>
              <th style={{ textAlign: 'right' }}>Дүн</th>
            </tr>
          </thead>
          <tbody className="mono">
            {items.map((it, i) => (
              <tr key={i} style={{ borderBottom: '1px dashed #E3DECF' }}>
                <td style={{ padding: '6px 0', fontFamily: 'var(--font-body-stack)', fontWeight: 600 }}>{it.name}</td>
                <td style={{ textAlign: 'right' }}>{it.unit_price_mnt.toLocaleString('en-US')}</td>
                <td style={{ textAlign: 'center' }}>{it.qty}</td>
                <td style={{ textAlign: 'right' }}>{it.line.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5E6C80' }}>
            <span>Барааны дүн</span><span className="mono">{fmtMNT(o.subtotal_mnt)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5E6C80' }}>
            <span>Хүргэлт{o.is_free_delivery ? ' (100+ш үнэгүй)' : ''}</span>
            <span className="mono">{fmtMNT(o.delivery_fee_mnt)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #14263E', paddingTop: 7, marginTop: 4, fontWeight: 800, fontSize: 15 }}>
            <span>НИЙТ</span><span className="mono">{fmtMNT(total)}</span>
          </div>
          {o.payment_method && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5E6C80', fontSize: 12 }}>
              <span>Төлбөрийн хэлбэр</span><span>{PAY_MN[o.payment_method]}</span>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', fontSize: 10.5, color: '#8A8062', marginTop: 18, borderTop: '1px dashed #D8D2C0', paddingTop: 10 }}>
          Худалдан авалтад баярлалаа · kkllc.mn
        </div>
      </div>
    </div>
  );
}
