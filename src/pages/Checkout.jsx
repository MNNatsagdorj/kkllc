import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { useCart, formatPrice } from '../context/cartStore';

const WHATSAPP_NUMBER = '97688204057';

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { items, totalPrice, clear } = useCart();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const inputClasses =
    'w-full h-12 px-3.5 rounded-xl border-[1.5px] border-line-strong bg-white focus:border-primary outline-none transition-colors text-[15px]';
  const labelClasses = 'block text-[13.5px] font-semibold text-fg mb-1.5';
  const errorClasses = 'text-[12.5px] text-red-600 mt-1';

  const onSubmit = (data) => {
    const lines = items.map((it) => {
      const name = i18n.language === 'mn' ? it.nameMN : it.nameEN;
      return `• ${name} × ${it.qty} = ${formatPrice((it.price || 0) * it.qty)}`;
    });
    const message = [
      `*${t('checkout.orderHeader')}*`,
      '',
      ...lines,
      '',
      `${t('cart.total')}: ${formatPrice(totalPrice)}`,
      '',
      `${t('checkout.name')}: ${data.name}`,
      `${t('checkout.phone')}: ${data.phone}`,
      `${t('checkout.address')}: ${data.address}`,
      data.note ? `${t('checkout.note')}: ${data.note}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    clear();
    setDone(true);
  };

  if (done) {
    return (
      <main className="bg-white">
        <div className="container-enterprise py-20 lg:py-28 text-center">
          <span className="inline-flex w-16 h-16 rounded-2xl bg-[#E7F6EF] text-success items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
          </span>
          <h1 className="font-display text-[26px] font-extrabold text-fg-strong mb-3">{t('checkout.successTitle')}</h1>
          <p className="text-[15px] text-fg-muted max-w-md mx-auto mb-7">{t('checkout.successText')}</p>
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

  if (items.length === 0) {
    return (
      <main className="bg-white">
        <div className="container-enterprise py-20 lg:py-28 text-center">
          <span className="inline-flex w-16 h-16 rounded-2xl bg-surface-sunken text-fg-subtle items-center justify-center mb-5">
            <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-[24px] font-extrabold text-fg-strong mb-4">{t('checkout.emptyTitle')}</h1>
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
          {t('checkout.title')}
        </h1>
        <p className="text-[14px] text-fg-muted mb-8">{t('checkout.subtitle')}</p>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="border border-line rounded-[20px] p-6 lg:p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>{t('checkout.name')} *</label>
                <input
                  className={inputClasses}
                  placeholder={i18n.language === 'mn' ? 'Таны нэр' : 'Your name'}
                  {...register('name', { required: i18n.language === 'mn' ? 'Нэр оруулна уу' : 'Name is required' })}
                />
                {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>{t('checkout.phone')} *</label>
                <input
                  className={inputClasses}
                  placeholder="9900-0000"
                  {...register('phone', { required: i18n.language === 'mn' ? 'Утас оруулна уу' : 'Phone is required' })}
                />
                {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>{t('checkout.address')} *</label>
                <input
                  className={inputClasses}
                  placeholder={i18n.language === 'mn' ? 'Дүүрэг, хороо, байр' : 'District, address'}
                  {...register('address', { required: i18n.language === 'mn' ? 'Хаяг оруулна уу' : 'Address is required' })}
                />
                {errors.address && <p className={errorClasses}>{errors.address.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>{t('checkout.note')}</label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-line-strong bg-white focus:border-primary outline-none transition-colors text-[15px] resize-none"
                  placeholder={t('checkout.notePlaceholder')}
                  {...register('note')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 h-[52px] rounded-xl bg-accent text-white font-bold text-[16px] hover:bg-accent-dark transition-colors shadow-[0_10px_24px_rgba(242,108,27,0.3)] disabled:opacity-60"
            >
              {t('checkout.submit')}
            </button>
          </motion.form>

          {/* Order summary */}
          <div className="border border-line rounded-[20px] p-6 lg:sticky lg:top-[96px]">
            <h2 className="font-bold text-[16px] text-fg-strong mb-4">{t('checkout.yourOrder')}</h2>
            <ul className="space-y-3">
              {items.map((it) => {
                const name = i18n.language === 'mn' ? it.nameMN : it.nameEN;
                return (
                  <li key={it.id} className="flex items-start justify-between gap-3 text-[14px]">
                    <span className="text-fg leading-snug">
                      {name} <span className="text-fg-subtle">× {it.qty}</span>
                    </span>
                    <span className="font-semibold text-fg-strong whitespace-nowrap">
                      {formatPrice((it.price || 0) * it.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="h-px bg-line my-4" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-fg-strong">{t('cart.total')}</span>
              <span className="font-display font-extrabold text-[20px] text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-[12px] text-fg-subtle mt-4 leading-relaxed">{t('cart.priceNote')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
