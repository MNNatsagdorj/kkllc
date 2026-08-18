'use client';

// Нөөц — 재고 현황 + 입고 등록(rpc stock_in) + 수불 내역 (08-roadmap P2)
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtMNT, type Product } from '@/lib/types';
import { Sack } from '@/components/Sack';

const LOW_THRESHOLD = 50;

interface Move {
  id: string; delta: number; reason: 'in' | 'sale' | 'adjust';
  order_id: number | null; note: string | null; created_at: string;
  product: { name_mn: string } | null;
}

const REASON_MN: Record<Move['reason'], { label: string; color: string }> = {
  in: { label: 'Орлого', color: 'var(--st-done)' },
  sale: { label: 'Борлуулалт', color: 'var(--st-way)' },
  adjust: { label: 'Залруулга', color: 'var(--st-asg)' },
};

export default function InventoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockIn, setStockIn] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const refetch = useMemo(() => async () => {
    const [p, m] = await Promise.all([
      supabase.from('products').select('*').order('sku'),
      supabase.from('stock_moves')
        .select('id, delta, reason, order_id, note, created_at, product:products(name_mn)')
        .order('created_at', { ascending: false }).limit(40),
    ]);
    setProducts((p.data ?? []) as Product[]);
    setMoves((m.data ?? []) as unknown as Move[]);
  }, [supabase]);

  useEffect(() => { refetch(); }, [refetch]);

  const submitStockIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(null);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.rpc('stock_in', {
      p_product_id: stockIn!.id,
      p_qty: Number(f.get('qty')),
      p_note: String(f.get('note') || '') || null,
    });
    if (error) { setErr(error.message); return; }
    setStockIn(null); refetch();
  };

  return (
    <div>
      <h1 className="disp" style={{ fontSize: 21, marginBottom: 16 }}>Нөөц</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12, marginBottom: 24 }}>
        {products.map((p) => {
          const low = p.stock_qty <= 0 ? 'out' : p.stock_qty < LOW_THRESHOLD ? 'low' : null;
          return (
            <div key={p.id} style={{ background: 'rgba(19,37,63,.55)', border: `1px solid ${low === 'out' ? 'color-mix(in srgb, var(--st-cancel) 55%, transparent)' : low === 'low' ? 'color-mix(in srgb, var(--st-asg) 55%, transparent)' : 'var(--line)'}`, borderRadius: 13, padding: 14, display: 'flex', gap: 12 }}>
              <Sack band={p.band_color} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#EFECE3' }}>{p.name_mn}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--mut)', marginTop: 2 }}>{fmtMNT(p.price_mnt)} · {p.weight_kg}кг</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                  <span className="mono" style={{ fontSize: 21, fontWeight: 700, color: low === 'out' ? 'var(--st-cancel)' : low === 'low' ? 'var(--st-asg)' : '#EFECE3' }}>
                    {p.stock_qty}ш
                  </span>
                  {low && (
                    <span className="st-chip" style={{ '--st': low === 'out' ? 'var(--st-cancel)' : 'var(--st-asg)' } as React.CSSProperties}>
                      {low === 'out' ? 'Дууссан' : 'Бага'}
                    </span>
                  )}
                </div>
                <button onClick={() => setStockIn(p)}
                  style={{ marginTop: 9, width: '100%', padding: '7px 0', borderRadius: 8, border: '1px dashed color-mix(in srgb, var(--kraft) 55%, transparent)', background: 'transparent', color: 'var(--kraft)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  + Орлого бүртгэх
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: 10 }}>
        Сүүлийн хөдөлгөөн
      </h2>
      <div style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, overflow: 'hidden' }}>
        {moves.map((m) => {
          const r = REASON_MN[m.reason];
          return (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '110px 90px 1fr 80px', gap: 10, alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: 12.5 }}>
              <span className="mono" style={{ color: 'var(--mut)', fontSize: 11.5 }}>{m.created_at.slice(5, 16).replace('T', ' ')}</span>
              <span className="st-chip" style={{ '--st': r.color, justifySelf: 'start' } as React.CSSProperties}>{r.label}</span>
              <span style={{ color: '#EFECE3' }}>
                {m.product?.name_mn}
                {m.order_id && <span className="mono" style={{ color: 'var(--kraft)', marginLeft: 8 }}>#{m.order_id}</span>}
                {m.note && <span style={{ color: 'var(--mut)', marginLeft: 8 }}>{m.note}</span>}
              </span>
              <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: m.delta > 0 ? 'var(--st-done)' : 'var(--st-way)' }}>
                {m.delta > 0 ? '+' : ''}{m.delta}ш
              </span>
            </div>
          );
        })}
        {moves.length === 0 && <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>Хөдөлгөөн алга.</div>}
      </div>

      {stockIn && (
        <div onClick={() => setStockIn(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(4,10,20,.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ width: 360, maxWidth: '92vw', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, color: '#EFECE3' }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Орлого бүртгэх — {stockIn.name_mn}</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 14 }}>Одоо: {stockIn.stock_qty}ш</div>
            <form onSubmit={submitStockIn} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <input name="qty" type="number" required placeholder="Тоо ширхэг (ш) — сөрөг бол залруулга" className="mono"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14, background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3' }} />
              <input name="note" placeholder="Тэмдэглэл (заавал биш)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13, background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3' }} />
              {err && <div style={{ color: 'var(--st-cancel)', fontSize: 12.5 }}>{err}</div>}
              <button type="submit" style={{ padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>
                Бүртгэх
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
