import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  Layers,
  Hammer,
  Home,
  Building2,
  Paintbrush,
  Package,
} from 'lucide-react';
import { useCart, formatPrice } from '../../context/cartStore';

const categoryIconMap = {
  putty: Layers,
  adhesive: Hammer,
  knauf: Home,
  facade: Building2,
  primer: Paintbrush,
};

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const name = i18n.language === 'mn' ? product.nameMN : product.nameEN;
  const description = i18n.language === 'mn' ? product.descriptionMN : product.descriptionEN;
  const CategoryIcon = categoryIconMap[product.category] || Package;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.04 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="group block bg-white border border-line rounded-[18px] overflow-hidden hover:shadow-[0_8px_28px_rgba(16,30,54,0.10)] hover:border-line-strong transition-all duration-300 h-full"
      >
        {/* Image zone */}
        <div className="relative h-[200px] bg-placeholder flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-[#9AABC2]">
            <CategoryIcon className="w-11 h-11" strokeWidth={1.25} />
            <span className="text-[10px] font-bold tracking-[0.14em]">
              {i18n.language === 'mn' ? 'ЗУРАГ' : 'IMAGE'}
            </span>
          </div>

          {product.brand && (
            <span className="absolute top-3.5 left-3.5 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
              {product.brand}
            </span>
          )}
          <span className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur text-success text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {product.inStock ? t('products.inStock') : t('products.outOfStock')}
          </span>
        </div>

        {/* Content */}
        <div className="p-[18px]">
          {product.brand ? (
            <span className="text-[11px] font-bold text-accent tracking-[0.06em] uppercase">
              {product.brand}
            </span>
          ) : (
            <span className="text-[11px] font-bold text-fg-subtle tracking-[0.06em] uppercase">
              {i18n.language === 'mn' ? product.packMN : product.packEN}
            </span>
          )}
          <h3 className="font-semibold text-[16px] text-fg-strong mt-1 leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-[13px] text-fg-subtle mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="font-display font-extrabold text-[20px] text-primary">
              {formatPrice(product.price)}
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 h-[42px] px-4 rounded-xl text-[13.5px] font-semibold text-white transition-colors ${
                added ? 'bg-success' : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  {t('product.added')}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                  {t('product.addToCart')}
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
