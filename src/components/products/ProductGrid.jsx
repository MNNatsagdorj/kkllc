import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, X, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import { products, categories, getCategoryCount } from '../../data/products';

export default function ProductGrid() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  // Sync input when navigated here with a new ?q= (e.g. from the hero).
  // React's recommended render-time adjustment instead of an effect.
  const [prevQuery, setPrevQuery] = useState(queryParam);
  if (queryParam !== prevQuery) {
    setPrevQuery(queryParam);
    setSearchTerm(queryParam);
  }

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const name = (i18n.language === 'mn' ? product.nameMN : product.nameEN).toLowerCase();
      const nameAlt = (i18n.language === 'mn' ? product.nameEN : product.nameMN).toLowerCase();
      const matchesSearch = name.includes(term) || nameAlt.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, i18n.language]);

  const handleCategoryChange = (categoryId) => {
    const next = new URLSearchParams(searchParams);
    if (categoryId === 'all') next.delete('category');
    else next.set('category', categoryId);
    setSearchParams(next);
  };

  const filterList = [
    { id: 'all', name: t('products.all'), count: products.length },
    ...categories.map((c) => ({
      id: c.id,
      name: i18n.language === 'mn' ? c.nameMN : c.nameEN,
      count: getCategoryCount(c.id),
    })),
  ];

  return (
    <div className="container-enterprise py-10 lg:py-12">
      <div className="grid lg:grid-cols-[248px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[96px] self-start">
          <div className="border border-line rounded-[18px] p-5">
            <div className="font-bold text-[14px] text-fg-strong mb-3.5">
              {t('categories.eyebrow')}
            </div>
            <div className="flex flex-col gap-1">
              {filterList.map((f) => {
                const active = activeCategory === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleCategoryChange(f.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[14px] transition-colors ${
                      active
                        ? 'bg-primary-soft text-primary font-semibold'
                        : 'text-fg hover:bg-surface-muted'
                    }`}
                  >
                    <span>{f.name}</span>
                    <span className="text-[12px] text-fg-subtle">{f.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-line my-[18px]" />

            <div className="font-bold text-[14px] text-fg-strong mb-2">{t('products.helpTitle')}</div>
            <p className="text-[13px] text-fg-muted mb-3 leading-relaxed">{t('products.helpText')}</p>
            <Link
              to="/contact"
              className="flex items-center justify-center w-full h-[42px] rounded-xl bg-primary text-white font-semibold text-[14px] hover:bg-primary-dark transition-colors"
            >
              {t('products.helpCta')}
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-fg-subtle" strokeWidth={2} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className="w-full h-12 pl-11 pr-11 rounded-2xl border-[1.5px] border-line-strong bg-white focus:border-primary outline-none transition-colors text-[15px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg-strong transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <p className="text-[13.5px] text-fg-muted mb-5">
                <span className="font-bold text-fg-strong">{filteredProducts.length}</span>{' '}
                {t('products.found')}
              </p>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </motion.div>
            </>
          ) : (
            <div className="border border-line rounded-[18px] py-20 text-center">
              <SearchX className="w-10 h-10 text-fg-subtle mx-auto mb-4" strokeWidth={1.25} />
              <h3 className="font-display text-xl font-extrabold text-fg-strong mb-1.5">
                {t('products.notFoundTitle')}
              </h3>
              <p className="text-sm text-fg-muted">{t('products.notFoundText')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
