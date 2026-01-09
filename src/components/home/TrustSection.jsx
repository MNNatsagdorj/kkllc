import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Scale, Truck, Award, CheckCircle } from 'lucide-react';

export default function TrustSection() {
  const { t, i18n } = useTranslation();

  const trustItems = [
    {
      icon: Scale,
      titleMN: 'Жиндээ бүрэн хүрдэг',
      titleEN: 'Weight Guaranteed',
      descriptionMN: 'Бүх бүтээгдэхүүн жинд бүрэн хүрдэг. Үйлдвэрлэлийн шат шатанд чанарын хяналт хийгддэг.',
      descriptionEN: 'All products are full weight guaranteed. Quality control at every stage of production.',
      color: 'bg-emerald-500',
    },
    {
      icon: Shield,
      titleMN: 'Стандарт найрлага',
      titleEN: 'Standard Formulation',
      descriptionMN: 'MNS стандартын шаардлагыг бүрэн хангасан чанартай түүхий эд ашигладаг.',
      descriptionEN: 'Uses quality raw materials that fully meet MNS standard requirements.',
      color: 'bg-blue-500',
    },
    {
      icon: Truck,
      titleMN: 'Үнэгүй хүргэлт',
      titleEN: 'Free Delivery',
      descriptionMN: '100-аас дээш бараа захиалсан тохиолдолд Улаанбаатар хот дотор үнэгүй хүргэлт.',
      descriptionEN: 'Free delivery within Ulaanbaatar for orders of 100+ items.',
      color: 'bg-primary',
    },
    {
      icon: Award,
      titleMN: '10+ жилийн туршлага',
      titleEN: '10+ Years Experience',
      descriptionMN: 'Монголын барилгын зах зээлд 10 гаруй жил үйл ажиллагаа явуулж байна.',
      descriptionEN: 'Operating in Mongolia\'s construction market for over 10 years.',
      color: 'bg-amber-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {i18n.language === 'mn' ? 'Яагаад биднийг сонгох вэ?' : 'Why Choose Us?'}
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-6">
              {i18n.language === 'mn' 
                ? 'Чанар, итгэлцэл, үйлчилгээ' 
                : 'Quality, Trust, Service'}
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              {i18n.language === 'mn'
                ? 'Kokorozashi Kibou LLC нь Монголын барилгын материалын зах зээлд чанартай бүтээгдэхүүн, найдвартай үйлчилгээгээр тэргүүлдэг.'
                : 'Kokorozashi Kibou LLC leads Mongolia\'s building materials market with quality products and reliable service.'}
            </p>

            {/* Features list */}
            <div className="space-y-4">
              {[
                i18n.language === 'mn' ? 'MNS стандартын бүтээгдэхүүн' : 'MNS standard products',
                i18n.language === 'mn' ? 'Мэргэжлийн зөвлөгөө' : 'Professional consultation',
                i18n.language === 'mn' ? 'Бөөний үнэ' : 'Wholesale pricing',
                i18n.language === 'mn' ? 'Хурдан хүргэлт' : 'Fast delivery',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-secondary font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-concrete rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${
                  index % 2 === 1 ? 'sm:translate-y-6' : ''
                }`}
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">
                  {i18n.language === 'mn' ? item.titleMN : item.titleEN}
                </h3>
                <p className="text-gray-600 text-sm">
                  {i18n.language === 'mn' ? item.descriptionMN : item.descriptionEN}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

