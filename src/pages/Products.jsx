import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';

export default function Products() {
  const { t, i18n } = useTranslation();

  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Page hero */}
      <section className="relative bg-ink text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-0 right-0 w-[35%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent" />

        <div className="relative container-enterprise py-16 lg:py-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="section-index text-white/50">{i18n.language === 'mn' ? 'БҮТЭЭГДЭХҮҮН' : 'CATALOG'}</span>
            <span className="flex-1 h-px bg-white/10" />
            <span className="section-index text-white/50 inline-flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              50+ {i18n.language === 'mn' ? 'БҮТЭЭГДЭХҮҮН' : 'ITEMS'}
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
                {t('products.title')}
                <span className="block serif-accent italic text-primary-light text-3xl md:text-4xl lg:text-5xl font-medium mt-3">
                  {t('products.subtitle')}
                </span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-4"
            >
              <div className="h-px w-12 bg-primary mb-5" />
              <p className="text-[14px] text-white/65 leading-relaxed">
                {i18n.language === 'mn'
                  ? 'MNS стандартад нийцсэн замаск, цавуу, шавардлага болон Кнауф брендийн иж бүрэн сонголт.'
                  : 'A complete selection of MNS-compliant putty, adhesives, plasters and Knauf-branded systems.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductGrid />
    </main>
  );
}
