import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProductGrid from '../components/products/ProductGrid';

export default function Products() {
  const { t, i18n } = useTranslation();

  return (
    <main className="bg-white">
      {/* Page header */}
      <section className="bg-gradient-to-b from-surface-muted to-white border-b border-line">
        <div className="container-enterprise py-12 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow block mb-2">{t('nav.products')}</span>
            <h1 className="font-display text-[30px] lg:text-[40px] font-extrabold text-fg-strong tracking-[-0.02em]">
              {t('products.title')}
            </h1>
            <p className="text-[15px] lg:text-base text-fg-muted mt-3 max-w-[600px] leading-relaxed">
              {i18n.language === 'mn'
                ? 'MNS стандартад нийцсэн замаск, цавуу, шавардлага болон Кнауф брендийн иж бүрэн сонголт.'
                : 'A complete selection of MNS-compliant putty, adhesives, plasters and Knauf-branded systems.'}
            </p>
          </motion.div>
        </div>
      </section>

      <ProductGrid />
    </main>
  );
}
