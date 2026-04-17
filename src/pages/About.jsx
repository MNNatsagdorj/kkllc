import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  Target,
  Heart,
  Zap,
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
    },
    {
      icon: Heart,
      titleMN: 'Итгэл',
      titleEN: 'Trust',
      descriptionMN: 'Жиндээ бүрэн хүрдэг, шударга бизнес.',
      descriptionEN: 'Weight guaranteed, honest business.',
    },
    {
      icon: Zap,
      titleMN: 'Үйлчилгээ',
      titleEN: 'Service',
      descriptionMN: 'Мэргэжлийн зөвлөгөө, хурдан хүргэлт.',
      descriptionEN: 'Professional advice, fast delivery.',
    },
  ];

  const distributionStats = [
    { icon: Building2, valueMN: '50+', valueEN: '50+', labelMN: 'Жижиглэнгийн цэг', labelEN: 'Retail Points' },
    { icon: Users, valueMN: '100+', valueEN: '100+', labelMN: 'Томоохон төсөл', labelEN: 'Major Projects' },
    { icon: TrendingUp, valueMN: '500+', valueEN: '500+', labelMN: 'Үйлчлүүлэгч', labelEN: 'Clients' },
  ];

  return (
    <main>
      {/* Page Hero */}
      <section className="relative bg-ink text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent" />

        <div className="relative container-enterprise py-20 lg:py-28">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-index text-white/50">
              {i18n.language === 'mn' ? 'КОМПАНИЙН ТУХАЙ' : 'ABOUT'}
            </span>
            <span className="flex-1 h-px bg-white/10" />
            <span className="section-index text-white/50 inline-flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              10+ {t('stats.years').toUpperCase()}
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
                {t('about.title')}
                <span className="block serif-accent italic text-primary-light text-3xl md:text-4xl lg:text-5xl font-medium mt-3">
                  {t('about.subtitle')}
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
              <p className="text-[15px] text-white/65 leading-relaxed">
                {t('about.story')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white border-b border-line">
        <div className="container-enterprise py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <span className="section-index block mb-4">01 &nbsp;/&nbsp; OUR STORY</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em] leading-tight mb-8">
                {i18n.language === 'mn' ? 'Бидний' : 'Our'}{' '}
                <span className="serif-accent italic text-primary font-medium">
                  {i18n.language === 'mn' ? 'түүх' : 'journey'}
                </span>
              </h2>

              <p className="text-[15px] text-fg leading-relaxed mb-5 max-w-xl">{t('about.story')}</p>
              <p className="text-sm text-fg-muted leading-relaxed mb-10 max-w-xl">{t('about.missionText')}</p>

              <ul className="space-y-3">
                {[
                  i18n.language === 'mn' ? 'MNS стандартын бүтээгдэхүүн' : 'MNS standard products',
                  i18n.language === 'mn' ? 'Мэргэжлийн баг' : 'Professional team',
                  i18n.language === 'mn' ? 'Найдвартай түнш' : 'Reliable partner',
                ].map((item, idx) => (
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

            {/* Brand panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="relative bg-surface-muted border border-line rounded-sm p-10 lg:p-12 text-center">
                <div className="absolute top-6 left-6 section-index text-fg-subtle">EST. 2014</div>
                <div className="absolute top-6 right-6 section-index text-fg-subtle">ULAANBAATAR · MN</div>

                <img
                  src="/kk-icon.svg"
                  alt="Kokorozashi Kibou LLC"
                  className="w-28 h-28 rounded-sm mx-auto mb-8 mt-8"
                />
                <p className="font-display font-semibold text-fg-strong text-xl tracking-tight">
                  Kokorozashi Kibou
                </p>
                <p className="serif-accent italic text-primary text-lg mt-1">Limited Liability Company</p>

                <div className="mt-8 pt-6 border-t border-line grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-fg-strong">10+</p>
                    <p className="text-[10px] font-wide uppercase tracking-[0.2em] text-fg-muted mt-1">Years</p>
                  </div>
                  <div className="border-l border-r border-line">
                    <p className="font-display text-2xl font-semibold text-fg-strong">500+</p>
                    <p className="text-[10px] font-wide uppercase tracking-[0.2em] text-fg-muted mt-1">Clients</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-semibold text-fg-strong">50+</p>
                    <p className="text-[10px] font-wide uppercase tracking-[0.2em] text-fg-muted mt-1">Products</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-muted border-b border-line">
        <div className="container-enterprise py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-8">
              <span className="section-index block mb-4">02 &nbsp;/&nbsp; {t('about.values').toUpperCase()}</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em] leading-tight">
                {i18n.language === 'mn' ? 'Үндсэн ' : 'Core '}
                <span className="serif-accent italic text-primary font-medium">
                  {i18n.language === 'mn' ? 'үнэт зүйлс' : 'values'}
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white p-10 lg:p-12 hover:bg-ink transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-12">
                  <span className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-fg-subtle group-hover:text-white/50 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <value.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-semibold text-fg-strong group-hover:text-white transition-colors mb-3 tracking-tight">
                  {i18n.language === 'mn' ? value.titleMN : value.titleEN}
                </h3>
                <p className="text-[14px] text-fg-muted group-hover:text-white/65 transition-colors leading-relaxed">
                  {i18n.language === 'mn' ? value.descriptionMN : value.descriptionEN}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border-b border-line">
        <div className="container-enterprise py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <span className="section-index block mb-4">03 &nbsp;/&nbsp; MILESTONES</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-fg-strong tracking-[-0.03em] leading-tight">
                {i18n.language === 'mn' ? 'Бидний ' : 'Our '}
                <span className="serif-accent italic text-primary font-medium">
                  {i18n.language === 'mn' ? 'замнал' : 'journey'}
                </span>
              </h2>
            </div>

            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-line md:-translate-x-1/2" />

              <div className="space-y-14">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                      i % 2 === 0 ? '' : 'md:[&>:first-child]:order-2'
                    }`}
                  >
                    {/* dot */}
                    <div className="absolute left-0 md:left-1/2 top-1 w-3 h-3 bg-primary rounded-full md:-translate-x-1/2 ring-4 ring-white z-10" />

                    <div className={i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}>
                      <div className="inline-flex items-center gap-2 mb-3">
                        <span className="font-display text-2xl font-semibold text-primary tracking-tight">
                          {item.year}
                        </span>
                        <span className="h-px w-8 bg-line" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-fg-strong mb-2 tracking-tight">
                        {i18n.language === 'mn' ? item.titleMN : item.titleEN}
                      </h3>
                      <p className="text-[14px] text-fg-muted leading-relaxed">
                        {i18n.language === 'mn' ? item.descriptionMN : item.descriptionEN}
                      </p>
                    </div>
                    <div />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section className="relative overflow-hidden bg-ink text-white border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent" />

        <div className="relative container-enterprise py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-8">
              <span className="section-index block text-white/50 mb-4">04 &nbsp;/&nbsp; {t('distribution.title').toUpperCase()}</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-tight text-white">
                {t('distribution.title')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
            {distributionStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative border-b border-r border-white/10 p-8 lg:p-10 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-white/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <stat.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="font-display text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-white">
                  {i18n.language === 'mn' ? stat.valueMN : stat.valueEN}
                </div>
                <p className="mt-4 text-[11.5px] font-wide font-medium uppercase tracking-[0.2em] text-white/50">
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
