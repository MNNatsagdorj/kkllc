import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';
import MapSection from '../components/contact/MapSection';

export default function Contact() {
  const { t, i18n } = useTranslation();

  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Page hero */}
      <section className="relative bg-ink text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-0 right-0 w-[35%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent" />

        <div className="relative container-enterprise py-16 lg:py-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="section-index text-white/50">{i18n.language === 'mn' ? 'ХОЛБОО БАРИХ' : 'CONTACT'}</span>
            <span className="flex-1 h-px bg-white/10" />
            <span className="section-index text-white/50 inline-flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              RESPONSE &lt; 24H
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
                {t('contact.title')}
                <span className="block serif-accent italic text-primary-light text-3xl md:text-4xl lg:text-5xl font-medium mt-3">
                  {t('contact.subtitle')}
                </span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-4"
            >
              <div className="h-px w-12 bg-primary mb-5" />
              <p className="text-[14px] text-white/65 leading-relaxed">
                {i18n.language === 'mn'
                  ? 'Бөөний үнэ, төсөлд зориулсан санал, хамтын ажиллагаа — бид 24 цагийн дотор хариу өгнө.'
                  : 'Wholesale pricing, project proposals, or partnerships — we respond within 24 hours.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="container-enterprise">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <MapSection />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
