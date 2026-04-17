import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, X, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import { products, categories } from '../../data/products';

export default function ProductGrid() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const name = i18n.language === 'mn' ? product.nameMN : product.nameEN;
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, i18n.language]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white sticky top-16 lg:top-20 z-40 border-b border-line">
        <div className="container-enterprise py-5">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle"
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  i18n.language === 'mn' ? 'Бүтээгдэхүүн хайх...' : 'Search products...'
                }
                className="w-full h-11 pl-10 pr-10 rounded-sm border border-line bg-surface-muted focus:bg-white focus:border-fg-strong outline-none transition-colors text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg-strong transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`h-9 px-4 text-[12px] font-wide font-semibold uppercase tracking-[0.14em] whitespace-nowrap border rounded-sm transition-all ${
                  activeCategory === 'all'
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-fg border-line hover:border-fg-strong hover:text-fg-strong'
                }`}
              >
                {i18n.language === 'mn' ? 'Бүгд' : 'All'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`h-9 px-4 text-[12px] font-wide font-semibold uppercase tracking-[0.14em] whitespace-nowrap border rounded-sm transition-all ${
                    activeCategory === category.id
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-fg border-line hover:border-fg-strong hover:text-fg-strong'
                  }`}
                >
                  {i18n.language === 'mn' ? category.nameMN : category.nameEN}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-enterprise py-12 lg:py-16">
        {filteredProducts.length > 0 ? (
          <>
            {/* Results meta */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-line">
              <p className="text-[11px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-muted">
                <span className="text-fg-strong font-display text-base font-semibold mr-2">
                  {String(filteredProducts.length).padStart(2, '0')}
                </span>
                {i18n.language === 'mn' ? 'бүтээгдэхүүн олдлоо' : 'products found'}
              </p>
              <span className="section-index text-fg-subtle hidden md:block">CATALOG · 2024</span>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
            >
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-line py-24 text-center"
          >
            <SearchX className="w-10 h-10 text-fg-subtle mx-auto mb-5" strokeWidth={1.25} />
            <h3 className="font-display text-xl font-semibold text-fg-strong mb-2 tracking-tight">
              {i18n.language === 'mn' ? 'Бүтээгдэхүүн олдсонгүй' : 'No products found'}
            </h3>
            <p className="text-sm text-fg-muted">
              {i18n.language === 'mn' ? 'Өөр хайлт хийж үзнэ үү' : 'Try a different search term'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
