import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Award, 
  Users, 
  Building2, 
  TrendingUp,
  CheckCircle,
  Target,
  Heart,
  Zap
} from 'lucide-react';

export default function About() {
  const { t, i18n } = useTranslation();

  const timeline = [
    {
      year: '2014',
      titleMN: 'Компани үүсгэн байгуулагдав',
      titleEN: 'Company Founded',
      descriptionMN: 'Kokorozashi Kibou LLC Улаанбаатар хотод үүсгэн байгуулагдав.',
      descriptionEN: 'Kokorozashi Kibou LLC was founded in Ulaanbaatar.',
    },
    {
      year: '2016',
      titleMN: 'Үйлдвэрлэл эхлүүлэв',
      titleEN: 'Started Manufacturing',
      descriptionMN: 'Өөрийн үйлдвэрлэлийн шугам байгуулж, замаск үйлдвэрлэж эхлэв.',
      descriptionEN: 'Established our own production line and started manufacturing putty.',
    },
    {
      year: '2018',
      titleMN: 'Түгээлтийн сүлжээ өргөжив',
      titleEN: 'Expanded Distribution',
      descriptionMN: '50 гаруй жижиглэнгийн цэгтэй хамтран ажиллаж эхлэв.',
      descriptionEN: 'Started partnering with over 50 retail points.',
    },
    {
      year: '2020',
      titleMN: 'Кнауф бүтээгдэхүүн нэмэгдэв',
      titleEN: 'Added Knauf Products',
      descriptionMN: 'Кнауф брендийн албан ёсны борлуулагч болов.',
      descriptionEN: 'Became an official distributor of Knauf brand.',
    },
    {
      year: '2024',
      titleMN: '10 жилийн ойн баяр',
      titleEN: '10th Anniversary',
      descriptionMN: '10+ жилийн амжилттай үйл ажиллагаа, 500+ сэтгэл ханамжтай үйлчлүүлэгч.',
      descriptionEN: '10+ years of successful operation with 500+ satisfied clients.',
    },
  ];

  const values = [
    {
      icon: Target,
      titleMN: 'Чанар',
      titleEN: 'Quality',
      descriptionMN: 'Бүх бүтээгдэхүүн MNS стандартын шаардлага хангасан.',
      descriptionEN: 'All products meet MNS standard requirements.',
      color: 'bg-blue-500',
    },
    {
      icon: Heart,
      titleMN: 'Итгэл',
      titleEN: 'Trust',
      descriptionMN: 'Жиндээ бүрэн хүрдэг, шударга бизнес.',
      descriptionEN: 'Weight guaranteed, honest business.',
      color: 'bg-red-500',
    },
    {
      icon: Zap,
      titleMN: 'Үйлчилгээ',
      titleEN: 'Service',
      descriptionMN: 'Мэргэжлийн зөвлөгөө, хурдан хүргэлт.',
      descriptionEN: 'Professional advice, fast delivery.',
      color: 'bg-amber-500',
    },
  ];

  const distributionStats = [
    { 
      icon: Building2, 
      valueMN: '50+', 
      valueEN: '50+', 
      labelMN: 'Жижиглэнгийн цэг', 
      labelEN: 'Retail Points' 
    },
    { 
      icon: Users, 
      valueMN: '100+', 
      valueEN: '100+', 
      labelMN: 'Томоохон төсөл', 
      labelEN: 'Major Projects' 
    },
    { 
      icon: TrendingUp, 
      valueMN: '500+', 
      valueEN: '500+', 
      labelMN: 'Үйлчлүүлэгч', 
      labelEN: 'Clients' 
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B00' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">10+ {t('stats.years')}</span>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-6">
                {i18n.language === 'mn' ? 'Бидний түүх' : 'Our Story'}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {t('about.story')}
              </p>
              <p className="text-gray-600 mb-8">
                {t('about.missionText')}
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  i18n.language === 'mn' ? 'MNS стандартын бүтээгдэхүүн' : 'MNS standard products',
                  i18n.language === 'mn' ? 'Мэргэжлийн баг' : 'Professional team',
                  i18n.language === 'mn' ? 'Найдвартай түнш' : 'Reliable partner',
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

            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-concrete to-neutral-gray rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-display font-bold text-4xl">KK</span>
                  </div>
                  <p className="font-display font-bold text-secondary text-xl">Kokorozashi Kibou</p>
                  <p className="text-gray-500">LLC • Since 2014</p>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                10+ {i18n.language === 'mn' ? 'жил' : 'Years'}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-concrete">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              {t('about.values')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-secondary mb-3">
                  {i18n.language === 'mn' ? value.titleMN : value.titleEN}
                </h3>
                <p className="text-gray-600">
                  {i18n.language === 'mn' ? value.descriptionMN : value.descriptionEN}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              {i18n.language === 'mn' ? 'Бидний замнал' : 'Our Journey'}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-gray transform md:-translate-x-0.5" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-8 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 border-4 border-white shadow z-10" />

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
                    {item.year}
                  </span>
                  <h3 className="font-display text-xl font-bold text-secondary mb-2">
                    {i18n.language === 'mn' ? item.titleMN : item.titleEN}
                  </h3>
                  <p className="text-gray-600">
                    {i18n.language === 'mn' ? item.descriptionMN : item.descriptionEN}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution Network */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t('distribution.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {distributionStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {i18n.language === 'mn' ? stat.valueMN : stat.valueEN}
                </div>
                <p className="text-gray-300">
                  {i18n.language === 'mn' ? stat.labelMN : stat.labelEN}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

