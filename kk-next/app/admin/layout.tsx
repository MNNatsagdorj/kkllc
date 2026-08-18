// 관리자 셸 — 다크 네이비 관제실 (05/07 문서). 역할 가드: manager만.
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { Sidebar } from './_components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect('/login?next=/admin');
  if (profile.role !== 'manager') redirect('/driver');

  return (
    <div className="blueprint" style={{ display: 'flex', minHeight: '100dvh', color: '#EFECE3' }}>
      <Sidebar managerName={profile.name ?? 'Менежер'} />
      <main style={{ flex: 1, minWidth: 0, padding: '18px 22px' }}>{children}</main>
    </div>
  );
}
