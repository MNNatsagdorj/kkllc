import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Orange accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {i18n.language === 'mn' 
                ? 'Бөөний үнийн санал авах уу?' 
                : 'Need a Wholesale Quote?'}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              {i18n.language === 'mn'
                ? 'Манай мэргэжилтнүүдтэй холбогдож, таны төсөлд тохирсон бүтээгдэхүүний үнийн саналыг аваарай.'
                : 'Connect with our specialists and get a product quote tailored to your project.'}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                i18n.language === 'mn' ? '🚚 Үнэгүй хүргэлт (100+)' : '🚚 Free Delivery (100+)',
                i18n.language === 'mn' ? '⚖️ Жиндээ хүрдэг' : '⚖️ Weight Guaranteed',
                i18n.language === 'mn' ? '💰 Бөөний үнэ' : '💰 Wholesale Pricing',
              ].map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="whatsapp"
                size="lg"
                icon={MessageCircle}
                href="https://wa.me/97699999999"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Phone}
                href="tel:+97699999999"
                className="border-white/30 text-white hover:bg-white hover:text-secondary"
              >
                +976 9999 9999
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">KK</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-secondary text-lg">Kokorozashi Kibou</h3>
                    <p className="text-gray-500 text-sm">LLC</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span className="text-secondary">
                      {i18n.language === 'mn' ? 'MNS Стандарт бүтээгдэхүүн' : 'MNS Standard Products'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span className="text-secondary">
                      {i18n.language === 'mn' ? '10+ жилийн туршлага' : '10+ Years Experience'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span className="text-secondary">
                      {i18n.language === 'mn' ? 'Хурдан хүргэлт' : 'Fast Delivery'}
                    </span>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                >
                  {t('cta.quote')}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

