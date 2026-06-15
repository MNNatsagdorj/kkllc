import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { reviews } from '../../data/products';

export default function Reviews() {
  const { t, i18n } = useTranslation();

  return (
    <section className="bg-surface-muted">
      <div className="container-enterprise py-14 lg:py-16">
        <span className="eyebrow block mb-2">{t('reviews.eyebrow')}</span>
        <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong mb-6">
          {t('reviews.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-line rounded-2xl p-6"
            >
              <div className="text-accent text-[15px] tracking-[2px] mb-2.5">
                {'★'.repeat(r.stars)}
              </div>
              <p className="text-[15px] leading-relaxed text-fg">
                «{i18n.language === 'mn' ? r.textMN : r.textEN}»
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="w-[38px] h-[38px] rounded-full bg-primary text-white inline-flex items-center justify-center font-bold text-[14px]">
                  {r.ini}
                </span>
                <div>
                  <span className="block font-semibold text-[14px] text-fg-strong">
                    {i18n.language === 'mn' ? r.nameMN : r.nameEN}
                  </span>
                  <span className="block text-[12.5px] text-fg-subtle">
                    {i18n.language === 'mn' ? r.roleMN : r.roleEN}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
