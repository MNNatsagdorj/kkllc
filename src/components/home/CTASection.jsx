import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white">
      <div className="container-enterprise py-14 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[24px] bg-primary text-center px-6 py-12 lg:py-14"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 20%, rgba(242,108,27,0.22), transparent 45%)',
          }}
        >
          <h2 className="font-display text-[26px] lg:text-[32px] font-extrabold text-white tracking-[-0.02em] max-w-[640px] mx-auto">
            {t('homeCta.title')}
          </h2>
          <p className="text-[16px] lg:text-[16.5px] text-[#C6D2E5] mt-3 max-w-[560px] mx-auto">
            {t('homeCta.text')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-accent text-white font-bold text-[16px] hover:bg-accent-dark transition-colors shadow-[0_10px_24px_rgba(242,108,27,0.3)]"
            >
              {t('homeCta.primary')}
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border-[1.5px] border-white/25 text-white font-semibold text-[16px] hover:bg-white/10 transition-colors"
            >
              {t('homeCta.secondary')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
