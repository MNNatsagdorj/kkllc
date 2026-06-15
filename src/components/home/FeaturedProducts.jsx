import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { products } from '../../data/products';

export default function FeaturedProducts() {
  const { t, i18n } = useTranslation();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="bg-surface-muted">
      <div className="container-enterprise py-14 lg:py-16">
        <div className="flex items-end justify-between mb-7 gap-4">
          <div>
            <span className="eyebrow block mb-2">
              {i18n.language === 'mn' ? 'Эрэлттэй бараа' : 'Best sellers'}
            </span>
            <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong">
              {i18n.language === 'mn' ? 'Их зарагддаг материал' : 'Most ordered materials'}
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
          >
            {t('hero.viewProducts')}
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[22px]">
          {featured.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
