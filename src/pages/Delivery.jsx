import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, PackageCheck, ClipboardList, Send } from 'lucide-react';
import { deliveryZones } from '../data/products';

export default function Delivery() {
  const { t, i18n } = useTranslation();

  const steps = [
    { icon: ClipboardList, title: t('delivery.step1Title'), text: t('delivery.step1Text') },
    { icon: Send, title: t('delivery.step2Title'), text: t('delivery.step2Text') },
    { icon: PackageCheck, title: t('delivery.step3Title'), text: t('delivery.step3Text') },
  ];

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-b from-surface-muted to-white border-b border-line">
        <div className="container-enterprise py-12 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow block mb-2">{t('nav.delivery')}</span>
            <h1 className="font-display text-[30px] lg:text-[40px] font-extrabold text-fg-strong tracking-[-0.02em]">
              {t('delivery.title')}
            </h1>
            <p className="text-[15px] lg:text-base text-fg-muted mt-3 max-w-[600px] leading-relaxed">
              {t('delivery.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Zones */}
      <section className="container-enterprise py-12 lg:py-14">
        <span className="eyebrow block mb-2">{t('delivery.zonesEyebrow')}</span>
        <h2 className="font-display text-[24px] lg:text-[28px] font-extrabold text-fg-strong mb-7">
          {t('delivery.zonesTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {deliveryZones.map((z, i) => (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-line rounded-[18px] p-6"
            >
              <span className="inline-flex w-12 h-12 rounded-2xl bg-primary-soft text-primary items-center justify-center mb-4">
                <MapPin className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <h3 className="font-bold text-[16.5px] text-fg-strong">
                {i18n.language === 'mn' ? z.nameMN : z.nameEN}
              </h3>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-fg-muted inline-flex items-center gap-2">
                    <Truck className="w-4 h-4 text-fg-subtle" strokeWidth={2} />
                    {t('delivery.price')}
                  </span>
                  <span className="font-semibold text-fg-strong">
                    {i18n.language === 'mn' ? z.priceMN : z.priceEN}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-fg-muted inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-fg-subtle" strokeWidth={2} />
                    {t('delivery.eta')}
                  </span>
                  <span className="font-semibold text-fg-strong">
                    {i18n.language === 'mn' ? z.etaMN : z.etaEN}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Free note */}
        <div className="mt-6 flex items-center gap-3 bg-accent-soft border border-accent/20 rounded-2xl px-5 py-4">
          <Truck className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={2} />
          <p className="text-[14.5px] text-fg-strong font-medium">{t('delivery.freeNote')}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-surface-muted">
        <div className="container-enterprise py-12 lg:py-14">
          <span className="eyebrow block mb-2">{t('delivery.stepsEyebrow')}</span>
          <h2 className="font-display text-[24px] lg:text-[28px] font-extrabold text-fg-strong mb-7">
            {t('delivery.stepsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-line rounded-[18px] p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full bg-primary text-white font-bold inline-flex items-center justify-center text-[15px]">
                    {i + 1}
                  </span>
                  <s.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-[16px] text-fg-strong">{s.title}</h3>
                <p className="text-[14px] text-fg-muted leading-relaxed mt-1.5">{s.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-white font-semibold text-[15px] hover:bg-primary-dark transition-colors"
            >
              {t('delivery.cta')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
