import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Grip, Building2, Home, Paintbrush } from 'lucide-react';
import { categories } from '../../data/products';

const iconMap = {
  Layers,
  Grip,
  Building2,
  Home,
  Paintbrush,
};

export default function CategorySection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-concrete">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Layers;
            const name = i18n.language === 'mn' ? category.nameMN : category.nameEN;
            const description = i18n.language === 'mn' ? category.descriptionMN : category.descriptionEN;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className="group block bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-secondary mb-1 group-hover:text-primary transition-colors">
                    {name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-3">
                    {description}
                  </p>

                  {/* Arrow */}
                  <span className="inline-flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            {t('hero.viewProducts')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

