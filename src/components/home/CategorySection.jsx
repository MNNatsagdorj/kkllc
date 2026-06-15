import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Grip, Building2, Home, Paintbrush } from 'lucide-react';
import { categories, getCategoryCount } from '../../data/products';

const iconMap = { Layers, Grip, Building2, Home, Paintbrush };

export default function CategorySection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="bg-white">
      <div className="container-enterprise py-14 lg:py-16">
        <span className="eyebrow block mb-2">{t('categories.eyebrow')}</span>
        <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong mb-7">
          {t('categories.title')}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Layers;
            const name = i18n.language === 'mn' ? category.nameMN : category.nameEN;
            const count = getCategoryCount(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className="group flex flex-col gap-3.5 h-full bg-surface-muted border border-line rounded-[18px] p-6 hover:border-primary/30 hover:shadow-[0_8px_28px_rgba(16,30,54,0.08)] transition-all"
                >
                  <span className="inline-flex w-14 h-14 rounded-2xl bg-white items-center justify-center shadow-[0_2px_10px_rgba(16,30,54,0.06)]">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-[16px] text-fg-strong">{name}</div>
                    <div className="text-[13px] text-fg-muted mt-1">
                      {count} {t('categories.itemsLabel')}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary mt-auto">
                    {count} {t('categories.itemsLabel')}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
