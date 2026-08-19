'use client';

// Жолооч — 기사·차량 CRUD + 오늘 현황 (05 문서 P2)
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtWeight } from '@/lib/queries';

interface Vehicle { id: string; model: string; plate: string; capacity_kg: number }
interface Driver {
  id: string; name: string; phone: string; vehicle_id: string | null;
  is_active: boolean; user_id: string | null;
  vehicle: Vehicle | null;
}
interface TodayStat { assigned: number; delivered: number; weight: number }

const input: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: 8, fontSize: 13,
  background: 'var(--ink)', border: '1px solid var(--line)', color: '#EFECE3',
};
const card: React.CSSProperties = {
  background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, padding: 16,
};

export default function DriversPage() {
  const supabase = useMemo(() => createClient(), []);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<Record<string, TodayStat>>({});
  const [editing, setEditing] = useState<Partial<Driver> | null>(null);
  const [newVehicle, setNewVehicle] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refetch = useMemo(() => async () => {
    const [d, v, o] = await Promise.all([
      supabase.from('drivers').select('*, vehicle:vehicles(*)').order('name'),
      supabase.from('vehicles').select('*').order('model'),
      supabase.from('orders')
        .select('driver_id, status, total_weight_kg')
        .gte('created_at', new Date().toISOString().slice(0, 10)),
    ]);
    setDrivers((d.data ?? []) as unknown as Driver[]);
    setVehicles((v.data ?? []) as Vehicle[]);
    const s: Record<string, TodayStat> = {};
    for (const row of o.data ?? []) {
      if (!row.driver_id) continue;
      const t = (s[row.driver_id] ??= { assigned: 0, delivered: 0, weight: 0 });
      if (row.status === 'delivered') t.delivered++;
      else { t.assigned++; t.weight += Number(row.total_weight_kg); }
    }
    setStats(s);
  }, [supabase]);

  useEffect(() => { refetch(); }, [refetch]);

  // 저장은 서버 경유 — PIN이 있으면 Auth 계정 생성/재설정 + user_id 자동 연결
  const saveDriver = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editing?.id,
        name: String(f.get('name')).trim(),
        phone: String(f.get('phone')).trim(),
        vehicle_id: String(f.get('vehicle_id') || '') || null,
        is_active: f.get('is_active') === 'on',
        pin: String(f.get('pin') || '').trim() || undefined,
      }),
    });
    if (!res.ok) { setErr((await res.json()).error ?? 'Алдаа гарлаа'); return; }
    setEditing(null); refetch();
  };

  const saveVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(null);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from('vehicles').insert({
      model: String(f.get('model')).trim(),
      plate: String(f.get('plate')).trim(),
      capacity_kg: Number(f.get('capacity_kg')),
    });
    if (error) { setErr(error.message); return; }
    setNewVehicle(false); refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Жолооч</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setNewVehicle(true)}
            style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--mut)', fontWeight: 700, fontSize: 12.5, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
            + Машин
          </button>
          <button onClick={() => setEditing({})}
            style={{ border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 12.5, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
            + Жолооч
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
        {drivers.map((d) => {
          const s = stats[d.id];
          return (
            <div key={d.id} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>
                  {d.name.charAt(0)}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: 14.5, color: '#EFECE3' }}>
                    {d.name}
                    {!d.is_active && <em style={{ fontStyle: 'normal', color: 'var(--st-cancel)', fontSize: 11, marginLeft: 7 }}>идэвхгүй</em>}
                  </span>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>
                    {d.phone}{d.vehicle ? ` · ${d.vehicle.model} ${d.vehicle.plate} · ${fmtWeight(d.vehicle.capacity_kg)}` : ' · машингүй'}
                  </span>
                </span>
                <button onClick={() => setEditing(d)}
                  style={{ border: '1px solid var(--line)', background: 'none', color: 'var(--mut)', borderRadius: 7, padding: '5px 10px', fontSize: 11.5, cursor: 'pointer' }}>
                  Засах
                </button>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--line)', fontSize: 12 }}>
                <span style={{ color: 'var(--mut)' }}>Өнөөдөр: <b className="mono" style={{ color: '#EFECE3' }}>{s?.assigned ?? 0}</b> идэвхтэй</span>
                <span style={{ color: 'var(--mut)' }}>ачаа <b className="mono" style={{ color: 'var(--st-way)' }}>{fmtWeight(s?.weight ?? 0)}</b></span>
                <span style={{ color: 'var(--mut)' }}>дууссан <b className="mono" style={{ color: 'var(--st-done)' }}>{s?.delivered ?? 0}</b></span>
              </div>
              {d.user_id ? (
                <div style={{ marginTop: 9, fontSize: 11, color: 'var(--st-done)' }}>
                  🔑 Нэвтрэх эрхтэй — утас + PIN
                </div>
              ) : (
                <div style={{ marginTop: 9, fontSize: 11, color: 'var(--st-asg)' }}>
                  ⚠ Нэвтрэх эрхгүй — «Засах» дээр дарж PIN өгөхөд автоматаар холбогдоно
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 기사 등록/수정 */}
      {editing && (
        <Modal title={editing.id ? 'Жолооч засах' : 'Жолооч нэмэх'} onClose={() => setEditing(null)}>
          <form onSubmit={saveDriver} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input name="name" defaultValue={editing.name} placeholder="Нэр" required style={input} />
            <input name="phone" defaultValue={editing.phone} placeholder="Утас (9900-0001)" required className="mono" style={input} />
            <select name="vehicle_id" defaultValue={editing.vehicle_id ?? ''} style={input}>
              <option value="">Машингүй</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.model} · {v.plate} · {fmtWeight(v.capacity_kg)}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--mut)' }}>
              <input type="checkbox" name="is_active" defaultChecked={editing.is_active ?? true} /> Идэвхтэй
            </label>
            <div>
              <input name="pin" inputMode="numeric" pattern="\d{4,8}" className="mono"
                required={!editing.user_id}
                placeholder={editing.user_id ? 'Шинэ PIN (солихгүй бол хоосон)' : 'PIN (4–8 тоо) — нэвтрэхэд ашиглана'}
                style={input} />
              <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 5, lineHeight: 1.5 }}>
                Жолооч <b style={{ color: '#EFECE3' }}>/login → Жолооч</b> таб дээр утасны дугаар + энэ PIN-ээр нэвтэрнэ.
                {editing.user_id ? ' PIN бичвэл шинэчлэгдэнэ.' : ' Хадгалахад нэвтрэх эрх автоматаар үүснэ.'}
              </div>
            </div>
            {err && <div style={{ color: 'var(--st-cancel)', fontSize: 12.5 }}>{err}</div>}
            <button type="submit" style={{ padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>Хадгалах</button>
          </form>
        </Modal>
      )}

      {/* 차량 등록 */}
      {newVehicle && (
        <Modal title="Машин нэмэх" onClose={() => setNewVehicle(false)}>
          <form onSubmit={saveVehicle} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input name="model" placeholder="Модель (Майти)" required style={input} />
            <input name="plate" placeholder="Улсын дугаар (01-23 УБА)" required className="mono" style={input} />
            <input name="capacity_kg" type="number" min={100} placeholder="Даац (кг)" required className="mono" style={input} />
            {err && <div style={{ color: 'var(--st-cancel)', fontSize: 12.5 }}>{err}</div>}
            <button type="submit" style={{ padding: '11px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}>Хадгалах</button>
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
        style={{ width: 380, maxWidth: '92vw', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, color: '#EFECE3' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}
