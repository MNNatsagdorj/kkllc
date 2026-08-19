// 관리자 셸 — 다크 네이비 관제실 (05/07 문서). 역할 가드: manager만.
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { AdminShell } from './_components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect('/login?next=/admin');
  if (profile.role !== 'manager') redirect('/driver');

  return <AdminShell managerName={profile.name ?? 'Менежер'}>{children}</AdminShell>;
}
