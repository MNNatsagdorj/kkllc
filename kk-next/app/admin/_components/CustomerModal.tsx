'use client';

// 고객 등록·수정 모달 — 구 관리자(kk-admin-web CustomersPage)에서 이식.
// 이름·전화·유형·등급·이메일·구역·주소·핀 지도·메모. 관리자 RLS로 직접 저장.
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { UB_DISTRICTS } from '@/lib/types';
import type { CustomerRow } from './CustomerDetailDrawer';

const PinMap = dynamic(() => import('@/components/PinMap').then((m) => m.PinMap), {
  ssr: false,
  loading: () => (
    <div style={{ height: 180, borderRadius: 10, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mut)', fontSize: 12.5 }}>
      Газрын зураг ачаалж байна…
    </div>
  ),
});

const input: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: 8, fontSize: 13.5,
  background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3',
};
const label: React.CSSProperties = { display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--mut)', marginBottom: 5 };

export function CustomerModal({ customer, onClose, onSaved }: {
  customer: CustomerRow | null; // null → 신규
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [pin, setPin] = useState<{ lat: number | null; lng: number | null }>({
    lat: customer?.lat ?? null, lng: customer?.lng ?? null,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get('name')).trim(),
      phone: String(f.get('phone')).trim(),
      type: String(f.get('type')),
      tier: String(f.get('tier')),
      email: String(f.get('email') || '').trim() || null,
      district: String(f.get('district') || '') || null,
      address: String(f.get('address') || '').trim() || null,
      note: String(f.get('note') || '').trim() || null,
      lat: pin.lat,
      lng: pin.lng,
    };
    const { error } = customer
      ? await supabase.from('customers').update(body).eq('id', customer.id)
      : await supabase.from('customers').insert(body);
    setBusy(false);
    if (error) {
      // 0007 마이그레이션 미적용 안내
      setErr(error.message.includes('tier') || error.message.includes('email')
        ? '0007 마이그레이션(email·tier 컬럼)을 Supabase SQL Editor에서 실행하세요'
        : error.message);
      return;
    }
    onSaved(customer ? 'Хадгалагдлаа' : 'Харилцагч нэмэгдлээ');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,20,.6)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 560, maxWidth: '94vw', maxHeight: '92vh', overflowY: 'auto', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 15, padding: 20, color: '#EFECE3' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>{customer ? 'Харилцагч засах' : 'Харилцагч нэмэх'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 0, color: 'var(--mut)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><span style={label}>Нэр</span><input name="name" required defaultValue={customer?.name} style={input} /></div>
            <div><span style={label}>Утас</span><input name="phone" required className="mono" defaultValue={customer?.phone} style={input} inputMode="tel" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <span style={label}>Төрөл</span>
              <select name="type" defaultValue={customer?.type ?? 'individual'} style={input}>
                <option value="individual">Хувь хүн</option>
                <option value="shop">Дэлгүүр</option>
              </select>
            </div>
            <div>
              <span style={label}>Зэрэг</span>
              <select name="tier" defaultValue={customer?.tier ?? 'new'} style={input}>
                <option value="new">Шинэ</option>
                <option value="reg">Тогтмол</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>
          <div><span style={label}>И-мэйл</span><input name="email" type="email" defaultValue={customer?.email ?? ''} style={input} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10 }}>
            <div>
              <span style={label}>Дүүрэг</span>
              <select name="district" defaultValue={customer?.district ?? ''} style={input}>
                <option value="">—</option>
                {UB_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <span style={label}>Хаяг / байршлын тайлбар</span>
              <input name="address" defaultValue={customer?.address ?? ''} style={input}
                placeholder="Ж: 3-р хороо, Маршалын гүүрний баруун талд" />
            </div>
          </div>
          <div>
            <span style={label}>Байршил (газрын зураг дээр дарж тэмдэглэнэ)</span>
            <PinMap lat={pin.lat} lng={pin.lng} onChange={(lat, lng) => setPin({ lat, lng })} height={180} expandable />
          </div>
          <div><span style={label}>Тэмдэглэл</span><textarea name="note" rows={2} defaultValue={customer?.note ?? ''} style={{ ...input, resize: 'vertical' }} /></div>

          {err && <div style={{ fontSize: 12.5, color: 'var(--st-cancel)', fontWeight: 700 }}>{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 3 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, background: 'transparent', color: 'var(--mut)', border: '1px solid var(--line)', cursor: 'pointer' }}>
              Цуцлах
            </button>
            <button type="submit" disabled={busy}
              style={{ padding: '10px 22px', borderRadius: 9, fontSize: 13, fontWeight: 800, background: 'var(--kraft)', color: 'var(--ink)', border: 0, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? 'Хадгалж байна…' : 'Хадгалах'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
