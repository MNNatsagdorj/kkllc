// 장바구니 + 주문 폼 (04 문서) — 제출 시 POST /api/orders (source: website)
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { CartForm } from '../_components/CartForm';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('is_active', true);
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '34px 20px 60px' }}>
      <h1 className="disp" style={{ fontSize: 24, color: 'var(--site-text)', marginBottom: 18 }}>Таны сагс</h1>
      <CartForm products={(data ?? []) as Product[]} />
    </div>
  );
}
