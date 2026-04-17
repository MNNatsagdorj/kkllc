import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Shield, Truck, CheckCircle2, Layers, Building2, Hammer, Home as HomeIcon } from 'lucide-react';
import Button from '../common/Button';

export default function Hero() {
  const { t, i18n } = useTranslation();

  const features = [
    { icon: Shield, label: t('usp.standardFormula') },
    { icon: Truck, label: t('usp.freeDelivery') },
    { icon: CheckCircle2, label: t('usp.mnsStandard') },
  ];

  const productTiles = [
    { icon: Layers, labelKey: 'categories.puttyWhite', tone: 'light' },
    { icon: Building2, labelKey: 'categories.puttyBlack', tone: 'dark' },
    { icon: Hammer, labelKey: 'categories.tileAdhesive', tone: 'accent' },
    { icon: HomeIcon, labelKey: 'categories.knauf', tone: 'muted' },
  ];

  const toneStyles = {
    light: 'bg-white/95 text-fg-strong',
    dark: 'bg-ink text-white border border-white/10',
    accent: 'bg-primary text-white',
    muted: 'bg-white/80 text-fg-strong',
  };

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Orange gradient accent */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent pointer-events-none" />

      {/* Vertical rules (enterprise frame) */}
      <div className="absolute inset-y-0 left-[calc((100vw-80rem)/2+1rem)] w-px bg-white/5 hidden xl:block" />
      <div className="absolute inset-y-0 right-[calc((100vw-80rem)/2+1rem)] w-px bg-white/5 hidden xl:block" />

      <div className="relative container-enterprise pt-14 md:pt-20 lg:pt-24 pb-20 md:pb-28">
        {/* Section index */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10 lg:mb-14"
        >
          <span className="section-index text-white/50">01 &nbsp;/&nbsp; ESTABLISHED 2014</span>
          <span className="flex-1 h-px bg-white/10" />
          <span className="section-index text-white/50">MNS · KNAUF · OEM</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <span className="eyebrow text-primary-light">
              {t('hero.subtitle')}
            </span>

            <h1 className="mt-5 font-display text-[2.25rem] leading-[1.05] md:text-[3.25rem] lg:text-[4.25rem] font-semibold tracking-[-0.03em] text-white">
              <span className="block">{t('hero.title')}</span>
              <span className="block serif-accent text-primary-light text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem] font-medium italic mt-2">
                {i18n.language === 'mn' ? 'Барилгын материалын найдвартай түнш' : 'Your trusted building materials partner'}
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-[15px] md:text-base text-white/65 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={MessageCircle}
                href="https://wa.me/97688204057"
              >
                {t('hero.cta')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                href="/products"
                className="border-white/25 text-white hover:bg-white hover:text-ink hover:border-white"
              >
                {t('hero.viewProducts')}
              </Button>
            </div>

            {/* Feature row */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <feature.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-[13px] text-white/70 leading-relaxed">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Meta label */}
              <div className="flex items-center justify-between mb-4">
                <span className="section-index text-white/40">PRODUCT CATEGORIES</span>
                <span className="text-[10.5px] font-wide uppercase tracking-[0.22em] text-white/40">
                  5+ Lines
                </span>
              </div>

              {/* Tile grid */}
              <div className="grid grid-cols-2 gap-3">
                {productTiles.map((tile, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                    className={`aspect-[4/5] p-5 rounded-sm flex flex-col justify-between ${toneStyles[tile.tone]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10.5px] font-wide font-semibold uppercase tracking-[0.18em] ${tile.tone === 'dark' ? 'text-white/50' : tile.tone === 'accent' ? 'text-white/80' : 'text-fg-muted'}`}>
                        0{i + 1}
                      </span>
                      <tile.icon className={`w-5 h-5 ${tile.tone === 'dark' || tile.tone === 'accent' ? 'text-white' : 'text-primary'}`} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className={`font-display font-semibold text-[15px] leading-tight tracking-tight ${tile.tone === 'dark' || tile.tone === 'accent' ? 'text-white' : 'text-fg-strong'}`}>
                        {t(tile.labelKey)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Compliance stamp */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-4 border border-white/10 bg-white/[0.03] rounded-sm px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-primary/40 rounded-sm flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-wide text-[10.5px] uppercase tracking-[0.22em] text-white/50">Certified</p>
                    <p className="text-sm text-white font-medium">{t('usp.mnsStandard')}</p>
                  </div>
                </div>
                <span className="serif-accent text-primary-light text-xl">✓</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 border-t border-white/10"
        >
          {[
            { value: '10+', label: t('stats.years') },
            { value: '500+', label: t('stats.clients') },
            { value: '50+', label: t('stats.products') },
            { value: '100+', label: t('stats.projects') },
          ].map((kpi, i, arr) => (
            <div
              key={i}
              className={`py-6 lg:py-8 pr-6 ${i < arr.length - 1 ? 'lg:border-r border-white/10' : ''} ${i % 2 === 0 ? 'border-r border-white/10 lg:border-r' : ''} ${i < 2 ? 'border-b border-white/10 lg:border-b-0' : ''}`}
            >
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                {kpi.value}
              </div>
              <p className="mt-2 text-[11px] font-wide font-medium uppercase tracking-[0.18em] text-white/50">
                {kpi.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
