'use client';

// Нөөц — 재고 현황 + 입고 등록 + 수불 내역 + 제품 관리(추가/수정/활성화) (08-roadmap P2)
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtMNT, type Product } from '@/lib/types';
import { Sack } from '@/components/Sack';

const LOW_THRESHOLD = 50;

// 07-design-system 밴드 색 프리셋
const BAND_PRESETS = ['#F4F1E8', '#2A2A2E', '#3E9B6B', '#3D7DD8', '#0A9BDC', '#C89B5E', '#E05252', '#8b5cf6'];

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

const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13.5,
  background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3',
};
const label: React.CSSProperties = { display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--mut)', marginBottom: 5 };

export default function InventoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockIn, setStockIn] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Partial<Product> | null>(null); // {} = 신규
  const [band, setBand] = useState<string>(BAND_PRESETS[0]);
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

  const active = products.filter((p) => p.is_active);
  const inactive = products.filter((p) => !p.is_active);

  const openEdit = (p: Partial<Product>) => {
    setEditing(p);
    setBand(p.band_color ?? BAND_PRESETS[0]);
    setErr(null);
  };

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

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(null);
    const f = new FormData(e.currentTarget);
    const body = {
      name_mn: String(f.get('name_mn')).trim(),
      use_mn: String(f.get('use_mn') || '').trim() || null,
      price_mnt: Number(f.get('price_mnt')),
      weight_kg: Number(f.get('weight_kg')) || 25,
      band_color: band,
      sku: String(f.get('sku') || '').trim()
        || `SKU-${Date.now().toString(36).toUpperCase()}`,
      is_active: editing?.id ? f.get('is_active') === 'on' : true,
    };
    if (!body.name_mn || !body.price_mnt || body.price_mnt <= 0) {
      setErr('Нэр болон зөв үнэ оруулна уу'); return;
    }
    const q = editing?.id
      ? supabase.from('products').update(body).eq('id', editing.id)
      : supabase.from('products').insert(body);
    const { error } = await q;
    if (error) { setErr(error.message.includes('duplicate') ? 'SKU давхардаж байна' : error.message); return; }
    setEditing(null); refetch();
  };

  const reactivate = async (p: Product) => {
    await supabase.from('products').update({ is_active: true }).eq('id', p.id);
    refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Нөөц</h1>
        <button onClick={() => openEdit({})}
          style={{ marginLeft: 'auto', border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 12.5, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
          + Бүтээгдэхүүн
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12, marginBottom: 24 }}>
        {active.map((p) => {
          const low = p.stock_qty <= 0 ? 'out' : p.stock_qty < LOW_THRESHOLD ? 'low' : null;
          return (
            <div key={p.id} style={{ position: 'relative', background: 'rgba(19,37,63,.55)', border: `1px solid ${low === 'out' ? 'color-mix(in srgb, var(--st-cancel) 55%, transparent)' : low === 'low' ? 'color-mix(in srgb, var(--st-asg) 55%, transparent)' : 'var(--line)'}`, borderRadius: 13, padding: 14, display: 'flex', gap: 12 }}>
              <button onClick={() => openEdit(p)} title="Засах"
                style={{ position: 'absolute', top: 9, right: 9, width: 26, height: 26, borderRadius: 7, border: '1px solid var(--line)', background: 'transparent', color: 'var(--mut)', cursor: 'pointer', fontSize: 12 }}>
                ✎
              </button>
              <Sack band={p.band_color} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#EFECE3', paddingRight: 26 }}>{p.name_mn}</div>
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
                <button onClick={() => { setStockIn(p); setErr(null); }}
                  style={{ marginTop: 9, width: '100%', padding: '7px 0', borderRadius: 8, border: '1px dashed color-mix(in srgb, var(--kraft) 55%, transparent)', background: 'transparent', color: 'var(--kraft)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  + Орлого бүртгэх
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 비활성 제품 */}
      {inactive.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: 10 }}>
            Идэвхгүй бүтээгдэхүүн
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {inactive.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 14px', borderRadius: 10, border: '1px dashed var(--line)', opacity: 0.75 }}>
                <Sack band={p.band_color} size={22} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--mut)' }}>{p.name_mn}</span>
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>{fmtMNT(p.price_mnt)} · {p.stock_qty}ш</span>
                <button onClick={() => reactivate(p)}
                  style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--st-done)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
                  Идэвхжүүлэх
                </button>
                <button onClick={() => openEdit(p)}
                  style={{ fontSize: 11.5, color: 'var(--mut)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
                  Засах
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: 10 }}>
        Сүүлийн хөдөлгөөн
      </h2>
      <div className="table-scroll" style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13 }}>
        <div style={{ minWidth: 620 }}>
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
      </div>

      {/* 입고 등록 */}
      {stockIn && (
        <Modal title={`Орлого бүртгэх — ${stockIn.name_mn}`} onClose={() => setStockIn(null)}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 14 }}>Одоо: {stockIn.stock_qty}ш</div>
          <form onSubmit={submitStockIn} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input name="qty" type="number" required placeholder="Тоо ширхэг (ш) — сөрөг бол залруулга" className="mono" style={input} />
            <input name="note" placeholder="Тэмдэглэл (заавал биш)" style={input} />
            {err && <div style={{ color: 'var(--st-cancel)', fontSize: 12.5 }}>{err}</div>}
            <button type="submit" style={{ padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>
              Бүртгэх
            </button>
          </form>
        </Modal>
      )}

      {/* 제품 추가/수정 */}
      {editing && (
        <Modal title={editing.id ? `Бүтээгдэхүүн засах — ${editing.name_mn}` : 'Шинэ бүтээгдэхүүн'} onClose={() => setEditing(null)}>
          <form onSubmit={submitProduct} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <span style={label}>Нэр</span>
              <input name="name_mn" defaultValue={editing.name_mn} required style={input} placeholder="Ж: Шохойн зуурмаг" />
            </div>
            <div>
              <span style={label}>Зориулалт (сайт дээр харагдана)</span>
              <input name="use_mn" defaultValue={editing.use_mn ?? ''} style={input} placeholder="Ж: Хананы өнгөлгөө" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={label}>Үнэ (₮/ш)</span>
                <input name="price_mnt" type="number" min={1} defaultValue={editing.price_mnt} required className="mono" style={input} />
              </div>
              <div>
                <span style={label}>Жин (кг/ш)</span>
                <input name="weight_kg" type="number" min={1} step="0.5" defaultValue={editing.weight_kg ?? 25} className="mono" style={input} />
              </div>
            </div>
            <div>
              <span style={label}>Уутны өнгө</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                {BAND_PRESETS.map((c) => (
                  <button key={c} type="button" onClick={() => setBand(c)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: c, cursor: 'pointer', border: band === c ? '2px solid var(--kraft)' : '1px solid var(--line)' }} />
                ))}
                <input type="color" value={band} onChange={(e) => setBand(e.target.value)}
                  style={{ width: 38, height: 32, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--ink)', cursor: 'pointer' }} title="Өөр өнгө" />
                <Sack band={band} size={26} />
              </div>
            </div>
            <div>
              <span style={label}>SKU (код — хоосон бол автоматаар)</span>
              <input name="sku" defaultValue={editing.sku} className="mono" style={input} placeholder="LIME_MORTAR" />
            </div>
            {editing.id && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--mut)' }}>
                <input type="checkbox" name="is_active" defaultChecked={editing.is_active} />
                Идэвхтэй (сайт·захиалгад харагдана)
              </label>
            )}
            <div style={{ fontSize: 11, color: 'var(--mut)', lineHeight: 1.5 }}>
              Үнэ өөрчлөхөд өмнөх захиалгуудад нөлөөлөхгүй — захиалга бүр үүсэх үеийн үнээ хадгалдаг.
            </div>
            {err && <div style={{ color: 'var(--st-cancel)', fontSize: 12.5 }}>{err}</div>}
            <button type="submit" style={{ padding: '12px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Хадгалах
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,10,20,.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: 400, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, color: '#EFECE3' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}
