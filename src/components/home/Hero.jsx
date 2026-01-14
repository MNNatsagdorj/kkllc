import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Shield, Truck, Scale } from 'lucide-react';
import Button from '../common/Button';

export default function Hero() {
  const { t } = useTranslation();

  const features = [
    { icon: Shield, label: t('usp.standardFormula') },
    // { icon: Scale, label: t('usp.weightGuarantee') },
    { icon: Truck, label: t('usp.freeDelivery') },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Diagonal Orange Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 transform skew-x-12 origin-top-right" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-primary-light">10+ {t('stats.years')}</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
              {t('hero.subtitle')}
            </p>

            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                variant="whatsapp"
                size="lg"
                icon={MessageCircle}
                href="https://wa.me/97699999999"
              >
                {t('hero.cta')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                href="/products"
                className="border-white/30 text-white hover:bg-white hover:text-secondary"
              >
                {t('hero.viewProducts')}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl"
                >
                  <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-200">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl" />

              {/* Product showcase */}
              <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {/* Product 1 */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-4xl">🏗️</span>
                    </div>
                    <p className="text-xs font-semibold text-secondary text-center">Цагаан замаск</p>
                  </div>

                  {/* Product 2 */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl transform translate-y-6">
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-4xl">🧱</span>
                    </div>
                    <p className="text-xs font-semibold text-secondary text-center">Хар замаск</p>
                  </div>

                  {/* Product 3 */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl transform -translate-y-2">
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-4xl">🔨</span>
                    </div>
                    <p className="text-xs font-semibold text-secondary text-center">Плятаны цавуу</p>
                  </div>

                  {/* Product 4 */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl transform translate-y-4">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-4xl">🏠</span>
                    </div>
                    <p className="text-xs font-semibold text-secondary text-center">Кнауф</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                MNS ✓
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-white text-secondary px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                100+ 🚚 Free
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

