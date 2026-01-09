import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProductGrid from '../components/products/ProductGrid';

export default function Products() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-concrete">
      {/* Header */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('products.title')}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <ProductGrid />
    </main>
  );
}

