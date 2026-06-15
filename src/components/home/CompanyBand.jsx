import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function CompanyBand() {
  const { t } = useTranslation();

  const stats = [
    { value: '10+', label: t('stats.years') },
    { value: '500+', label: t('stats.clients') },
    { value: '50+', label: t('stats.products') },
  ];

  return (
    <section className="bg-white">
      <div className="container-enterprise py-4 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-ink rounded-[24px] overflow-hidden grid md:grid-cols-2"
        >
          {/* Left — copy */}
          <div className="p-9 lg:p-12 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-accent tracking-[0.06em] uppercase mb-3">
              {t('company.eyebrow')}
            </span>
            <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-white leading-[1.15]">
              {t('company.title')}
            </h2>
            <p className="text-[15.5px] leading-relaxed text-white/65 mt-4 max-w-[440px]">
              {t('company.text')}
            </p>
            <div className="flex gap-8 mt-7">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-display text-[26px] font-extrabold text-white">{s.value}</div>
                  <div className="text-[12.5px] text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — placeholder */}
          <div className="bg-placeholder-dark min-h-[260px] md:min-h-0 flex items-center justify-center">
            <span className="text-[#36486A] font-bold tracking-[0.18em] text-[13px]">
              {t('company.imageLabel')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
