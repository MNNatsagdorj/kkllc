import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart, formatPrice } from '../context/cartStore';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { items, updateQty, removeItem, totalPrice, totalCount } = useCart();

  if (items.length === 0) {
    return (
      <main className="bg-white">
        <div className="container-enterprise py-20 lg:py-28 text-center">
          <span className="inline-flex w-16 h-16 rounded-2xl bg-surface-sunken text-fg-subtle items-center justify-center mb-5">
            <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-[24px] font-extrabold text-fg-strong mb-4">{t('cart.empty')}</h1>
          <Link
            to="/products"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            {t('cart.emptyCta')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="container-enterprise py-10 lg:py-12">
        <h1 className="font-display text-[28px] lg:text-[32px] font-extrabold text-fg-strong mb-1">
          {t('cart.title')}
        </h1>
        <p className="text-[14px] text-fg-muted mb-8">
          {totalCount} {totalCount === 1 ? t('cart.item') : t('cart.items')}
        </p>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Items */}
          <div className="border border-line rounded-[18px] divide-y divide-line">
            {items.map((it) => {
              const name = i18n.language === 'mn' ? it.nameMN : it.nameEN;
              return (
                <div key={it.id} className="flex items-center gap-4 p-4 lg:p-5">
                  <Link
                    to={`/products/${it.id}`}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-placeholder flex-shrink-0"
                    aria-label={name}
                  />
                  <div className="flex-1 min-w-0">
                    {it.brand && (
                      <span className="text-[11px] font-bold text-accent uppercase tracking-[0.06em]">{it.brand}</span>
                    )}
                    <Link to={`/products/${it.id}`} className="block font-semibold text-[15px] text-fg-strong hover:text-primary transition-colors truncate">
                      {name}
                    </Link>
                    <div className="font-display font-extrabold text-[16px] text-primary mt-0.5">
                      {formatPrice(it.price)}
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center border-[1.5px] border-line-strong rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQty(it.id, it.qty - 1)}
                      className="w-9 h-10 text-primary hover:bg-surface-muted inline-flex items-center justify-center"
                      aria-label="decrease"
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    <span className="w-9 text-center font-bold text-[14px]">{it.qty}</span>
                    <button
                      onClick={() => updateQty(it.id, it.qty + 1)}
                      className="w-9 h-10 text-primary hover:bg-surface-muted inline-flex items-center justify-center"
                      aria-label="increase"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Line total + remove */}
                  <div className="hidden sm:block w-24 text-right font-bold text-[15px] text-fg-strong">
                    {formatPrice((it.price || 0) * it.qty)}
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-fg-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={t('cart.remove')}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="border border-line rounded-[18px] p-6 lg:sticky lg:top-[96px]">
            <h2 className="font-bold text-[16px] text-fg-strong mb-4">{t('cart.summary')}</h2>
            <div className="flex items-center justify-between text-[14px] text-fg-muted mb-2">
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold text-fg-strong">{formatPrice(totalPrice)}</span>
            </div>
            <div className="h-px bg-line my-4" />
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold text-fg-strong">{t('cart.total')}</span>
              <span className="font-display font-extrabold text-[22px] text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 w-full h-[52px] rounded-xl bg-accent text-white font-bold text-[15.5px] hover:bg-accent-dark transition-colors shadow-[0_10px_24px_rgba(242,108,27,0.3)]"
            >
              {t('cart.checkout')}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link
              to="/products"
              className="flex items-center justify-center w-full h-11 mt-3 text-[14px] font-semibold text-primary hover:underline"
            >
              {t('cart.continue')}
            </Link>
            <p className="text-[12px] text-fg-subtle mt-4 leading-relaxed">{t('cart.priceNote')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
