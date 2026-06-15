import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Stats() {
  const { t } = useTranslation();

  const stats = [
    { value: '10+', label: t('stats.years') },
    { value: '50+', label: t('stats.products') },
    { value: '500+', label: t('stats.clients') },
    { value: '100+', label: t('stats.projects') },
  ];

  return (
    <section className="bg-white">
      <div className="container-enterprise pt-4 pb-8 lg:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3.5 bg-surface-sunken rounded-[18px] p-2"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center py-5 lg:py-6 px-3">
              <div className="font-display text-[28px] lg:text-[30px] font-extrabold text-primary">
                {stat.value}
              </div>
              <div className="text-[13px] lg:text-[13.5px] text-fg-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
