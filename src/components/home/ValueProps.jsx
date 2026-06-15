import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Tag, Headset } from 'lucide-react';

export default function ValueProps() {
  const { t } = useTranslation();

  const values = [
    { icon: ShieldCheck, title: t('values.qualityTitle'), text: t('values.qualityText') },
    { icon: Truck, title: t('values.deliveryTitle'), text: t('values.deliveryText') },
    { icon: Tag, title: t('values.priceTitle'), text: t('values.priceText') },
    { icon: Headset, title: t('values.supportTitle'), text: t('values.supportText') },
  ];

  return (
    <section className="bg-white">
      <div className="container-enterprise py-14 lg:py-16">
        <span className="eyebrow block mb-2">{t('values.eyebrow')}</span>
        <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong mb-8">
          {t('values.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="inline-flex w-[52px] h-[52px] rounded-2xl bg-primary-soft text-primary items-center justify-center mb-4">
                <v.icon className="w-[26px] h-[26px]" strokeWidth={1.75} />
              </span>
              <h3 className="font-bold text-[16.5px] text-fg-strong">{v.title}</h3>
              <p className="text-[14px] text-fg-muted leading-relaxed mt-1.5">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
