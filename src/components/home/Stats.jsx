import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Package, Users, Building2 } from 'lucide-react';

export default function Stats() {
  const { t, i18n } = useTranslation();

  const stats = [
    { icon: Calendar, value: '10+', label: t('stats.years') },
    { icon: Package, value: '50+', label: t('stats.products') },
    { icon: Users, value: '500+', label: t('stats.clients') },
    { icon: Building2, value: '100+', label: t('stats.projects') },
  ];

  return (
    <section className="bg-white">
      <div className="container-enterprise py-16 lg:py-20">
        <div className="flex items-end justify-between mb-10 lg:mb-14">
          <div>
            <span className="section-index block mb-3">02 &nbsp;/&nbsp; PERFORMANCE</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg-strong tracking-tight max-w-xl">
              {i18n.language === 'mn'
                ? 'Тоон үзүүлэлтүүдээр нотлогдсон'
                : 'Backed by numbers'}
            </h2>
          </div>
          <div className="hidden md:block text-[11px] font-wide uppercase tracking-[0.22em] text-fg-muted max-w-xs text-right leading-relaxed">
            {i18n.language === 'mn'
              ? 'Үйл ажиллагааны үндсэн үзүүлэлтүүд'
              : 'Operational KPIs as of 2024'}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative border-b border-r border-line p-6 lg:p-8 hover:bg-surface-muted transition-colors group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-subtle">
                  0{i + 1}
                </span>
                <stat.icon className="w-4 h-4 text-fg-muted group-hover:text-primary transition-colors" strokeWidth={1.75} />
              </div>
              <div className="font-display text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em]">
                {stat.value}
              </div>
              <p className="mt-3 text-[11.5px] font-wide font-medium uppercase tracking-[0.18em] text-fg-muted">
                {stat.label}
              </p>
              <div className="absolute top-0 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
