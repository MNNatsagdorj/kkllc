import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ContactForm from '../components/contact/ContactForm';
import MapSection from '../components/contact/MapSection';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-b from-surface-muted to-white border-b border-line">
        <div className="container-enterprise py-12 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow block mb-2">{t('nav.contact')}</span>
            <h1 className="font-display text-[30px] lg:text-[40px] font-extrabold text-fg-strong tracking-[-0.02em]">
              {t('contact.title')}
            </h1>
            <p className="text-[15px] lg:text-base text-fg-muted mt-3 max-w-[600px] leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container-enterprise py-12 lg:py-14">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-7 items-start">
          <ContactForm />
          <MapSection />
        </div>
      </section>
    </main>
  );
}
