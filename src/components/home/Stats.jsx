import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Package, Users, Building2 } from 'lucide-react';

export default function Stats() {
  const { t } = useTranslation();

  const stats = [
    { 
      icon: Calendar, 
      value: '10+', 
      label: t('stats.years'),
      color: 'from-primary to-primary-dark'
    },
    { 
      icon: Package, 
      value: '50+', 
      label: t('stats.products'),
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Users, 
      value: '500+', 
      label: t('stats.clients'),
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      icon: Building2, 
      value: '100+', 
      label: t('stats.projects'),
      color: 'from-amber-500 to-amber-600'
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-concrete rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20">
                {/* Icon */}
                <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                
                {/* Value */}
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <p className="text-gray-600 font-medium text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

