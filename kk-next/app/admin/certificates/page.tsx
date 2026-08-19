'use client';

// Гэрчилгээ — 인증서·시험성적서 업로드/관리 (홈 "ЧАНАР · ГЭРЧИЛГЭЭ" 섹션의 소스)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

export interface CertRow {
  id: string; title_mn: string; type: 'certificate' | 'test_report';
  issued_by: string | null; issued_at: string | null;
  product_id: string | null; file_path: string; is_active: boolean; sort: number;
}

const TYPE_MN: Record<CertRow['type'], { label: string; color: string }> = {
  certificate: { label: 'Гэрчилгээ', color: '#5CA8FF' },
  test_report: { label: 'Шинжилгээний дүн', color: '#4CAF7D' },
};

const isImage = (p: string) => /\.(jpe?g|png|webp|gif)$/i.test(p);

const input: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: 8, fontSize: 13,
  background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3',
};
const label: React.CSSProperties = { display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--mut)', marginBottom: 5 };

export default function CertificatesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const publicUrl = useCallback((path: string) =>
    supabase.storage.from('certificates').getPublicUrl(path).data.publicUrl, [supabase]);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('certificates')
      .select('*').order('sort').order('created_at', { ascending: false });
    if (error) setErr(error.message.includes('does not exist')
      ? '0008 마이그레이션(certificates)을 Supabase SQL Editor에서 실행하세요' : error.message);
    setCerts((data ?? []) as CertRow[]);
  }, [supabase]);

  useEffect(() => {
    refetch();
    supabase.from('products').select('*').order('sku')
      .then(({ data }) => setProducts((data ?? []) as Product[]));
  }, [supabase, refetch]);

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const f = new FormData(e.currentTarget);
    const file = f.get('file') as File | null;
    if (!file || !file.size) { setErr('Файл сонгоно уу'); setBusy(false); return; }

    const ext = (file.name.split('.').pop() ?? 'pdf').toLowerCase();
    const path = `${Date.now()}.${ext}`;
    const { error: sErr } = await supabase.storage.from('certificates').upload(path, file);
    if (sErr) { setErr(sErr.message); setBusy(false); return; }

    const { error } = await supabase.from('certificates').insert({
      title_mn: String(f.get('title_mn')).trim(),
      type: String(f.get('type')),
      issued_by: String(f.get('issued_by') || '').trim() || null,
      issued_at: String(f.get('issued_at') || '') || null,
      product_id: String(f.get('product_id') || '') || null,
      file_path: path,
      sort: Number(f.get('sort') || 0),
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setOpen(false); refetch();
  };

  const toggle = async (c: CertRow) => {
    await supabase.from('certificates').update({ is_active: !c.is_active }).eq('id', c.id);
    refetch();
  };

  const remove = async (c: CertRow) => {
    if (!window.confirm(`«${c.title_mn}» устгах уу?`)) return;
    await supabase.from('certificates').delete().eq('id', c.id);
    await supabase.storage.from('certificates').remove([c.file_path]);
    refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Гэрчилгээ</h1>
        <span className="mono" style={{ fontSize: 12, color: 'var(--mut)' }}>{certs.length}</span>
        <span style={{ fontSize: 12, color: 'var(--mut)' }}>— идэвхтэй нь нүүр хуудасны «Чанар · Гэрчилгээ» хэсэгт харагдана</span>
        <button onClick={() => setOpen(true)}
          style={{ marginLeft: 'auto', border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 12.5, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
          + Файл нэмэх
        </button>
      </div>

      {err && <div style={{ color: 'var(--st-cancel)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{err}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        {certs.map((c) => {
          const t = TYPE_MN[c.type];
          const product = products.find((p) => p.id === c.product_id);
          return (
            <div key={c.id} style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, overflow: 'hidden', opacity: c.is_active ? 1 : .5 }}>
              <a href={publicUrl(c.file_path)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, background: 'var(--ink)' }}>
                {isImage(c.file_path) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicUrl(c.file_path)} alt={c.title_mn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 38 }}>📄</span>
                )}
              </a>
              <div style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.04em', color: t.color, border: `1px solid color-mix(in srgb, ${t.color} 45%, transparent)`, background: `color-mix(in srgb, ${t.color} 14%, transparent)`, borderRadius: 999, padding: '2px 8px' }}>
                  {t.label}
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#EFECE3', margin: '8px 0 3px' }}>{c.title_mn}</div>
                <div style={{ fontSize: 11.5, color: 'var(--mut)' }}>
                  {[c.issued_by, c.issued_at, product?.name_mn].filter(Boolean).join(' · ') || '—'}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button onClick={() => toggle(c)}
                    style={{ fontSize: 11.5, fontWeight: 700, color: c.is_active ? 'var(--st-asg)' : 'var(--st-done)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
                    {c.is_active ? 'Нуух' : 'Харуулах'}
                  </button>
                  <button onClick={() => remove(c)}
                    style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--st-cancel)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {certs.length === 0 && !err && (
          <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>
            Одоогоор файл алга — «+ Файл нэмэх» дарж эхлүүлнэ үү.
          </div>
        )}
      </div>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,20,.6)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 440, maxWidth: '94vw', maxHeight: '92vh', overflowY: 'auto', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 15, padding: 20, color: '#EFECE3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
              <span style={{ fontSize: 15, fontWeight: 800 }}>Гэрчилгээ нэмэх</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 0, color: 'var(--mut)', fontSize: 17, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={upload} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div><span style={label}>Файл (PDF эсвэл зураг)</span>
                <input name="file" type="file" accept="application/pdf,image/*" required style={{ ...input, padding: '7px' }} /></div>
              <div><span style={label}>Гарчиг</span>
                <input name="title_mn" required placeholder="Чанарын гэрчилгээ MNS 3456" style={input} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={label}>Төрөл</span>
                  <select name="type" style={input}>
                    <option value="certificate">Гэрчилгээ</option>
                    <option value="test_report">Шинжилгээний дүн</option>
                  </select></div>
                <div><span style={label}>Огноо</span>
                  <input name="issued_at" type="date" style={input} /></div>
              </div>
              <div><span style={label}>Олгосон байгууллага</span>
                <input name="issued_by" placeholder="СХЗГ / лаборатори…" style={input} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 10 }}>
                <div><span style={label}>Холбогдох бүтээгдэхүүн (заавал биш)</span>
                  <select name="product_id" style={input}>
                    <option value="">— Компанийн ерөнхий —</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name_mn}</option>)}
                  </select></div>
                <div><span style={label}>Эрэмбэ</span>
                  <input name="sort" type="number" defaultValue={0} className="mono" style={input} /></div>
              </div>
              <button type="submit" disabled={busy}
                style={{ padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer', opacity: busy ? .6 : 1 }}>
                {busy ? 'Илгээж байна…' : 'Хадгалах'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
