import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers, Grip, Building2, Home, Paintbrush } from 'lucide-react';
import { categories } from '../../data/products';

const iconMap = { Layers, Grip, Building2, Home, Paintbrush };

export default function CategorySection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="bg-surface-muted border-t border-line">
      <div className="container-enterprise py-20 lg:py-28">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12 lg:mb-16">
          <div className="lg:col-span-8">
            <span className="section-index block mb-4">03 &nbsp;/&nbsp; {t('categories.title').toUpperCase()}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em] leading-tight">
              {t('categories.title')}
              <span className="block serif-accent text-primary text-2xl md:text-3xl italic font-medium mt-3">
                {t('categories.subtitle')}
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-6">
            <div className="h-px w-12 bg-primary mb-5" />
            <p className="text-sm text-fg-muted leading-relaxed">
              {i18n.language === 'mn'
                ? 'Бид таны төслийн бүх үе шатад тохирох барилгын материалын иж бүрэн шийдлийг санал болгодог.'
                : 'We provide a complete portfolio of building materials for every stage of your project.'}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Layers;
            const name = i18n.language === 'mn' ? category.nameMN : category.nameEN;
            const description = i18n.language === 'mn' ? category.descriptionMN : category.descriptionEN;

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
                  className="group relative block bg-white p-8 lg:p-10 h-full transition-all duration-300 hover:bg-ink"
                >
                  <div className="flex items-start justify-between mb-10">
                    <span className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-subtle group-hover:text-white/50 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-fg-strong group-hover:text-white transition-colors mb-3 tracking-tight">
                    {name}
                  </h3>
                  <p className="text-[13px] text-fg-muted group-hover:text-white/60 transition-colors leading-relaxed mb-8">
                    {description}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-wide font-semibold uppercase tracking-[0.2em] text-primary">
                    <span>Explore</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                  </div>

                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom link */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-wide font-semibold uppercase tracking-[0.18em] text-fg-strong hover:text-primary transition-colors"
          >
            <span>{t('hero.viewProducts')}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
