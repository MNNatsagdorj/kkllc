// 기사 셸 — 밝은 고대비 + 네이비 헤더 (06/07 문서). 역할 가드: driver만.
import type { Metadata, Viewport } from 'next';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PushSetup } from './_components/PushSetup';
import { LogoutButton } from './_components/LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'KK Хүргэлт',
  manifest: '/manifest.json',
};
export const viewport: Viewport = { themeColor: '#0E1B2E' };

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect('/login?next=/driver');
  if (profile.role !== 'driver') redirect('/admin');

  const supabase = await createClient();
  const { data: driver } = await supabase
    .from('drivers')
    .select('name, phone, vehicle:vehicles(model, plate)')
    .eq('user_id', profile.userId).single();
  const vehicle = (driver?.vehicle ?? null) as { model: string; plate: string } | null;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--driver-bg)', maxWidth: 560, margin: '0 auto', width: '100%' }}>
      <header style={{ background: 'var(--ink)', color: '#EFECE3', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 800 }}>Сайн уу, {driver?.name ?? profile.name ?? 'Жолооч'}</div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--mut)', marginTop: 3 }}>
            {vehicle ? `${vehicle.model} · ${vehicle.plate} · ` : ''}{today}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
          <span className="st-chip" style={{ '--st': 'var(--st-done)' } as React.CSSProperties}>АЖИЛД ✓</span>
          <LogoutButton />
        </div>
      </header>
      <PushSetup />
      <main style={{ padding: '14px 14px 40px' }}>{children}</main>
    </div>
  );
}
