import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
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
      {/* Filters */}
      <div className="bg-white sticky top-16 md:top-20 z-40 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={i18n.language === 'mn' ? 'Бүтээгдэхүүн хайх...' : 'Search products...'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-gray focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="w-5 h-5 text-gray-500 hidden md:block" />
              
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-concrete text-gray-600 hover:bg-neutral-gray'
                }`}
              >
                {i18n.language === 'mn' ? 'Бүгд' : 'All'}
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-concrete text-gray-600 hover:bg-neutral-gray'
                  }`}
                >
                  {i18n.language === 'mn' ? category.nameMN : category.nameEN}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length > 0 ? (
          <>
            {/* Results count */}
            <p className="text-gray-600 mb-6">
              {filteredProducts.length} {i18n.language === 'mn' ? 'бүтээгдэхүүн олдлоо' : 'products found'}
            </p>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              {i18n.language === 'mn' ? 'Бүтээгдэхүүн олдсонгүй' : 'No products found'}
            </h3>
            <p className="text-gray-600">
              {i18n.language === 'mn' 
                ? 'Өөр хайлт хийж үзнэ үү' 
                : 'Try a different search term'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

