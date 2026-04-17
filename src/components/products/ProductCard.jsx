import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Shield,
  Truck,
  MessageCircle,
  Layers,
  Hammer,
  Home,
  Building2,
  Paintbrush,
  ArrowUpRight,
  Scale,
} from 'lucide-react';
import Badge from '../common/Badge';

const categoryIconMap = {
  putty: Layers,
  adhesive: Hammer,
  knauf: Home,
  facade: Building2,
  primer: Paintbrush,
};

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();

  const name = i18n.language === 'mn' ? product.nameMN : product.nameEN;
  const description = i18n.language === 'mn' ? product.descriptionMN : product.descriptionEN;
  const unit = i18n.language === 'mn' ? product.unit : product.unitEN;
  const CategoryIcon = categoryIconMap[product.category] || Layers;

  const waHref = `https://wa.me/97688204057?text=${encodeURIComponent(
    `Сайн байна уу! ${name} бүтээгдэхүүний бөөний үнийг асуумаар байна.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.04 }}
      className="group bg-white border border-line flex flex-col hover:border-fg-strong transition-all duration-300"
    >
      {/* Image zone */}
      <div className="relative aspect-[4/3] bg-surface-muted border-b border-line overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-light opacity-50" />

        {/* Category icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-2xl" />
            <CategoryIcon className="relative w-16 h-16 text-fg-muted group-hover:text-primary transition-colors duration-500" strokeWidth={1.25} />
          </div>
        </div>

        {/* Index */}
        <div className="absolute top-3 left-3 text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-subtle">
          #{String(product.id).padStart(3, '0')}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <Badge variant="success">{t('products.inStock')}</Badge>
          ) : (
            <Badge variant="warning">{t('products.outOfStock')}</Badge>
          )}
        </div>

        {/* MNS stamp */}
        {product.isStandardFormula && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="orange" icon={Shield}>
              {t('usp.mnsStandard')}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-fg-strong tracking-tight leading-snug group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        <p className="text-[13px] text-fg-muted leading-relaxed line-clamp-2 mb-5">
          {description}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.isWeightGuaranteed && (
            <Badge variant="secondary" icon={Scale}>
              {t('usp.weightGuarantee')}
            </Badge>
          )}
          {product.isFreeDelivery && (
            <Badge variant="secondary" icon={Truck}>
              100+ {i18n.language === 'mn' ? 'үнэгүй' : 'free'}
            </Badge>
          )}
        </div>

        {/* Unit */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-line">
          <div>
            <p className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.2em] text-fg-subtle">
              {i18n.language === 'mn' ? 'Нэгж' : 'Unit'}
            </p>
            <p className="text-sm font-medium text-fg-strong mt-0.5">{unit}</p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-[12px] font-wide font-semibold uppercase tracking-[0.14em] rounded-sm hover:bg-primary transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{t('products.inquirePrice')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" strokeWidth={2} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
