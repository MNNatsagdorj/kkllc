import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  ChevronRight,
  Layers,
  Hammer,
  Home,
  Building2,
  Paintbrush,
  Package,
} from 'lucide-react';
import { products } from '../data/products';
import { useCart, formatPrice } from '../context/cartStore';
import ProductCard from '../components/products/ProductCard';

const categoryIconMap = {
  putty: Layers,
  adhesive: Hammer,
  knauf: Home,
  facade: Building2,
  primer: Paintbrush,
};

export default function ProductDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <main className="container-enterprise py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-fg-strong mb-4">
          {t('product.notFound')}
        </h1>
        <Link to="/products" className="text-primary font-semibold hover:underline">
          {t('product.backToProducts')}
        </Link>
      </main>
    );
  }

  const name = i18n.language === 'mn' ? product.nameMN : product.nameEN;
  const description = i18n.language === 'mn' ? product.descriptionMN : product.descriptionEN;
  const pack = i18n.language === 'mn' ? product.packMN : product.packEN;
  const Icon = categoryIconMap[product.category] || Package;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <main className="bg-white">
      <div className="container-enterprise py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13.5px] text-fg-subtle mb-6 flex-wrap">
          <Link to="/" className="hover:text-fg-strong transition-colors">{t('product.breadcrumbHome')}</Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
          <Link to="/products" className="hover:text-fg-strong transition-colors">{t('product.breadcrumbProducts')}</Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="text-fg-strong font-semibold">{name}</span>
        </nav>

        {/* Detail */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-start">
          {/* Image */}
          <div>
            <div className="h-[320px] lg:h-[420px] rounded-[20px] bg-placeholder flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-[#9AABC2]">
                <Icon className="w-16 h-16" strokeWidth={1} />
                <span className="text-[11px] font-bold tracking-[0.14em]">
                  {i18n.language === 'mn' ? 'ЗУРАГ' : 'IMAGE'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[0, 1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-[72px] rounded-xl bg-surface-sunken ${n === 0 ? 'border-[1.5px] border-accent' : 'border border-line'}`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {product.brand && (
              <span className="text-[12px] font-bold text-accent tracking-[0.08em] uppercase">
                {product.brand}
              </span>
            )}
            <h1 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong tracking-[-0.02em] leading-[1.15] mt-1.5">
              {name}
            </h1>

            <div className="flex items-center gap-2.5 mt-3">
              <span className="text-accent text-[15px] tracking-[2px]">{'★'.repeat(5)}</span>
              <span className="text-[13.5px] text-fg-subtle">{product.rating}</span>
              <span className="w-1 h-1 rounded-full bg-line-strong" />
              <span className="text-[13.5px] text-success font-semibold inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </span>
            </div>

            <p className="text-[15.5px] leading-relaxed text-fg mt-4">{description}</p>

            <div className="flex items-baseline gap-2.5 mt-6">
              <div className="font-display text-[34px] font-extrabold text-primary">
                {formatPrice(product.price)}
              </div>
              <div className="text-[14px] text-fg-subtle">/ {pack}</div>
            </div>

            {/* Qty + actions */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <div className="flex items-center border-[1.5px] border-line-strong rounded-[13px] overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-[50px] text-primary hover:bg-surface-muted transition-colors inline-flex items-center justify-center"
                  aria-label="decrease"
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="w-12 text-center font-bold text-[16px]">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-11 h-[50px] text-primary hover:bg-surface-muted transition-colors inline-flex items-center justify-center"
                  aria-label="increase"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 min-w-[180px] inline-flex items-center justify-center gap-2.5 h-[50px] rounded-[13px] text-white font-bold text-[15.5px] transition-colors ${
                  added ? 'bg-success' : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {added ? (
                  <><Check className="w-5 h-5" strokeWidth={2.5} />{t('product.added')}</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" strokeWidth={2} />{t('product.addToCartLong')}</>
                )}
              </button>

              <a
                href={`https://wa.me/97688204057?text=${encodeURIComponent(
                  `${i18n.language === 'mn' ? 'Сайн байна уу!' : 'Hello!'} ${name} — ${t('product.inquire')}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[50px] px-5 rounded-[13px] border-[1.5px] border-line-strong bg-white text-primary font-semibold text-[14.5px] hover:border-primary transition-colors"
              >
                {t('product.inquire')}
              </a>
            </div>

            {/* Specs */}
            {product.specs?.length > 0 && (
              <div className="mt-8 border border-line rounded-2xl divide-y divide-line">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 text-[14px]">
                    <span className="text-fg-muted">{i18n.language === 'mn' ? s.labelMN : s.labelEN}</span>
                    <span className="font-semibold text-fg-strong">
                      {i18n.language === 'mn' ? s.valueMN : s.valueEN}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-[22px] lg:text-[26px] font-extrabold text-fg-strong mb-6">
              {t('product.related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {related.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
