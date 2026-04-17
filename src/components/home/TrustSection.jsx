import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Truck, Award, CheckCircle2, Scale } from 'lucide-react';

export default function TrustSection() {
  const { t, i18n } = useTranslation();

  const trustItems = [
    {
      icon: Shield,
      titleMN: 'Стандарт найрлага',
      titleEN: 'Standard Formulation',
      descriptionMN: 'MNS стандартын шаардлагыг бүрэн хангасан чанартай түүхий эд ашигладаг.',
      descriptionEN: 'Uses quality raw materials that fully meet MNS standard requirements.',
    },
    {
      icon: Scale,
      titleMN: 'Жиндээ бүрэн',
      titleEN: 'Weight Guarantee',
      descriptionMN: 'Бүх бүтээгдэхүүний жин үйлдвэрийн стандартыг бүрэн хангадаг.',
      descriptionEN: 'All products fully meet factory-specified weight standards.',
    },
    {
      icon: Truck,
      titleMN: 'Үнэгүй хүргэлт',
      titleEN: 'Free Delivery',
      descriptionMN: '100-аас дээш бараа захиалсан тохиолдолд Улаанбаатар хот дотор үнэгүй хүргэлт.',
      descriptionEN: 'Free delivery within Ulaanbaatar for orders of 100+ items.',
    },
    {
      icon: Award,
      titleMN: '10+ жилийн туршлага',
      titleEN: '10+ Years Experience',
      descriptionMN: 'Монголын барилгын зах зээлд 10 гаруй жил үйл ажиллагаа явуулж байна.',
      descriptionEN: 'Operating in Mongolia\'s construction market for over 10 years.',
    },
  ];

  const bullets = [
    i18n.language === 'mn' ? 'MNS стандартын бүтээгдэхүүн' : 'MNS standard products',
    i18n.language === 'mn' ? 'Мэргэжлийн зөвлөгөө' : 'Professional consultation',
    i18n.language === 'mn' ? 'Бөөний үнэ' : 'Wholesale pricing',
    i18n.language === 'mn' ? 'Хурдан хүргэлт' : 'Fast delivery',
  ];

  return (
    <section className="bg-white border-t border-line">
      <div className="container-enterprise py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-28 self-start"
          >
            <span className="section-index block mb-4">04 &nbsp;/&nbsp; WHY CHOOSE US</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em] leading-tight">
              {i18n.language === 'mn' ? 'Чанар · Итгэл · ' : 'Quality · Trust · '}
              <span className="serif-accent italic text-primary font-medium">
                {i18n.language === 'mn' ? 'Үйлчилгээ' : 'Service'}
              </span>
            </h2>

            <div className="h-px w-12 bg-primary mt-8 mb-8" />

            <p className="text-[15px] text-fg-muted leading-relaxed mb-10 max-w-md">
              {i18n.language === 'mn'
                ? 'Kokorozashi Kibou LLC нь Монголын барилгын материалын зах зээлд чанартай бүтээгдэхүүн, найдвартай үйлчилгээгээр тэргүүлдэг.'
                : 'Kokorozashi Kibou LLC leads Mongolia\'s building materials market with quality products and reliable service.'}
            </p>

            <ul className="space-y-3">
              {bullets.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-fg-strong font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right — cards grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white p-8 lg:p-10 min-h-[220px] flex flex-col justify-between hover:bg-surface-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-10">
                    <span className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-subtle">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg lg:text-xl font-semibold text-fg-strong mb-2 tracking-tight">
                      {i18n.language === 'mn' ? item.titleMN : item.titleEN}
                    </h3>
                    <p className="text-[13px] text-fg-muted leading-relaxed">
                      {i18n.language === 'mn' ? item.descriptionMN : item.descriptionEN}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
