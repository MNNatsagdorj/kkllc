import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, ArrowRight, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  const { t, i18n } = useTranslation();

  const quoteFeatures = [
    {
      icon: ShieldCheck,
      label: i18n.language === 'mn' ? 'MNS Стандарт бүтээгдэхүүн' : 'MNS Standard Products',
    },
    {
      icon: CheckCircle2,
      label: i18n.language === 'mn' ? '10+ жилийн туршлага' : '10+ Years Experience',
    },
    {
      icon: Truck,
      label: i18n.language === 'mn' ? 'Хурдан хүргэлт' : 'Fast Delivery',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-ink text-white border-t border-white/10">
      {/* Grid & accent */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent" />

      <div className="relative container-enterprise py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="section-index block text-white/50 mb-4">
              05 &nbsp;/&nbsp; {i18n.language === 'mn' ? 'ҮНИЙН САНАЛ' : 'REQUEST A QUOTE'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-tight text-white">
              {i18n.language === 'mn' ? 'Бөөний үнийн санал ' : 'Need a '}
              <span className="serif-accent italic text-primary-light font-medium">
                {i18n.language === 'mn' ? 'авах уу?' : 'wholesale quote?'}
              </span>
            </h2>

            <div className="h-px w-12 bg-primary mt-8 mb-8" />

            <p className="text-[15px] md:text-base text-white/65 leading-relaxed max-w-xl mb-10">
              {i18n.language === 'mn'
                ? 'Манай мэргэжилтнүүдтэй холбогдож, таны төсөлд тохирсон бүтээгдэхүүний үнийн саналыг аваарай.'
                : 'Connect with our specialists and get a product quote tailored to your project.'}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={MessageCircle}
                href="https://wa.me/97688204057"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Phone}
                href="tel:+97688204057"
                className="border-white/25 text-white hover:bg-white hover:text-ink hover:border-white"
              >
                +976 8820 4057
              </Button>
            </div>

            {/* Meta row */}
            <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="section-index text-white/40 mb-2">RESPONSE</p>
                <p className="font-display text-xl font-semibold text-white tracking-tight">&lt; 24h</p>
              </div>
              <div>
                <p className="section-index text-white/40 mb-2">MIN. ORDER</p>
                <p className="font-display text-xl font-semibold text-white tracking-tight">100+</p>
              </div>
              <div>
                <p className="section-index text-white/40 mb-2">COVERAGE</p>
                <p className="font-display text-xl font-semibold text-white tracking-tight">UB-wide</p>
              </div>
            </div>
          </motion.div>

          {/* Right — credential panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="relative bg-white text-fg-strong p-8 lg:p-10 rounded-sm border-l-2 border-primary">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-line">
                <img src="/kk-icon.svg" alt="Kokorozashi Kibou LLC" className="w-14 h-14 rounded-sm" />
                <div className="leading-tight">
                  <p className="font-display font-semibold text-fg-strong text-[15px]">
                    Kokorozashi Kibou
                  </p>
                  <p className="text-[10.5px] font-wide font-medium uppercase tracking-[0.22em] text-fg-muted mt-0.5">
                    LLC · Since 2014
                  </p>
                </div>
              </div>

              <p className="section-index text-fg-subtle mb-5">CREDENTIALS</p>
              <ul className="space-y-4 mb-8">
                {quoteFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <f.icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                    <span className="text-sm text-fg-strong font-medium">{f.label}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/contact"
                className="group flex items-center justify-between w-full h-12 px-5 bg-ink text-white rounded-sm hover:bg-primary transition-colors"
              >
                <span className="text-sm font-medium">{t('cta.quote')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
