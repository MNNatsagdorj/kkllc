import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Scale, Shield, Truck, MessageCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();

  const name = i18n.language === 'mn' ? product.nameMN : product.nameEN;
  const description = i18n.language === 'mn' ? product.descriptionMN : product.descriptionEN;
  const unit = i18n.language === 'mn' ? product.unit : product.unitEN;

  // Placeholder images based on category
  const placeholderImages = {
    putty: '🏗️',
    adhesive: '🔨',
    knauf: '🏠',
    facade: '🏢',
    primer: '🎨',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-gray group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-concrete to-neutral-gray overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {placeholderImages[product.category] || '📦'}
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {product.inStock ? (
            <Badge variant="success">
              {t('products.inStock')}
            </Badge>
          ) : (
            <Badge variant="warning">
              {t('products.outOfStock')}
            </Badge>
          )}
        </div>

        {/* MNS Badge */}
        {product.isStandardFormula && (
          <div className="absolute top-3 right-3">
            <Badge variant="orange" icon={Shield}>
              {t('usp.mnsStandard')}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-secondary text-lg mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isWeightGuaranteed && (
            <Badge variant="success" icon={Scale}>
              {t('usp.weightGuarantee')}
            </Badge>
          )}
          {product.isFreeDelivery && (
            <Badge variant="primary" icon={Truck}>
              100+ {i18n.language === 'mn' ? 'үнэгүй' : 'free'}
            </Badge>
          )}
        </div>

        {/* Unit info */}
        <p className="text-sm text-gray-500 mb-4">
          {i18n.language === 'mn' ? 'Нэгж' : 'Unit'}: {unit}
        </p>

        {/* CTA */}
        <Button
          variant="primary"
          icon={MessageCircle}
          href={`https://wa.me/97699999999?text=${encodeURIComponent(`Сайн байна уу! ${name} бүтээгдэхүүний бөөний үнийг асуумаар байна.`)}`}
          className="w-full"
        >
          {t('products.inquirePrice')}
        </Button>
      </div>
    </motion.div>
  );
}

