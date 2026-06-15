import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, CheckCircle2, Target, Heart, Zap } from 'lucide-react';

export default function About() {
  const { t, i18n } = useTranslation();

  const timeline = [
    { year: '2014', titleMN: 'Компани үүсгэн байгуулагдав', titleEN: 'Company Founded', descMN: 'Kokorozashi Kibou LLC Улаанбаатар хотод үүсгэн байгуулагдав.', descEN: 'Kokorozashi Kibou LLC was founded in Ulaanbaatar.' },
    { year: '2016', titleMN: 'Үйлдвэрлэл эхлүүлэв', titleEN: 'Started Manufacturing', descMN: 'Өөрийн үйлдвэрлэлийн шугам байгуулж, замаск үйлдвэрлэж эхлэв.', descEN: 'Established our own production line and started manufacturing putty.' },
    { year: '2018', titleMN: 'Түгээлтийн сүлжээ өргөжив', titleEN: 'Expanded Distribution', descMN: '50 гаруй жижиглэнгийн цэгтэй хамтран ажиллаж эхлэв.', descEN: 'Started partnering with over 50 retail points.' },
    { year: '2020', titleMN: 'Кнауф бүтээгдэхүүн нэмэгдэв', titleEN: 'Added Knauf Products', descMN: 'Кнауф брэндийн албан ёсны борлуулагч болов.', descEN: 'Became an official distributor of Knauf brand.' },
    { year: '2024', titleMN: '10 жилийн ойн баяр', titleEN: '10th Anniversary', descMN: '10+ жилийн амжилттай үйл ажиллагаа, 500+ сэтгэл ханамжтай үйлчлүүлэгч.', descEN: '10+ years of successful operation with 500+ satisfied clients.' },
  ];

  const values = [
    { icon: Target, titleMN: 'Чанар', titleEN: 'Quality', descMN: 'Бүх бүтээгдэхүүн MNS стандартын шаардлага хангасан.', descEN: 'All products meet MNS standard requirements.' },
    { icon: Heart, titleMN: 'Итгэл', titleEN: 'Trust', descMN: 'Жиндээ бүрэн хүрдэг, шударга бизнес.', descEN: 'Weight guaranteed, honest business.' },
    { icon: Zap, titleMN: 'Үйлчилгээ', titleEN: 'Service', descMN: 'Мэргэжлийн зөвлөгөө, хурдан хүргэлт.', descEN: 'Professional advice, fast delivery.' },
  ];

  const distributionStats = [
    { icon: Building2, value: '50+', labelMN: 'Жижиглэнгийн цэг', labelEN: 'Retail Points' },
    { icon: Users, value: '100+', labelMN: 'Томоохон төсөл', labelEN: 'Major Projects' },
    { icon: TrendingUp, value: '500+', labelMN: 'Үйлчлүүлэгч', labelEN: 'Clients' },
  ];

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-b from-surface-muted to-white border-b border-line">
        <div className="container-enterprise py-12 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow block mb-2">{t('about.title')}</span>
            <h1 className="font-display text-[30px] lg:text-[40px] font-extrabold text-fg-strong tracking-[-0.02em]">
              {t('about.subtitle')}
            </h1>
            <p className="text-[15px] lg:text-base text-fg-muted mt-3 max-w-[640px] leading-relaxed">
              {t('about.story')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story — navy split band */}
      <section className="container-enterprise py-12 lg:py-16">
        <div className="bg-ink rounded-[24px] overflow-hidden grid md:grid-cols-2">
          <div className="p-9 lg:p-12 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-accent tracking-[0.06em] uppercase mb-3">
              {t('company.eyebrow')}
            </span>
            <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-white leading-[1.15]">
              {t('company.title')}
            </h2>
            <p className="text-[15.5px] leading-relaxed text-white/65 mt-4 max-w-[440px]">
              {t('about.missionText')}
            </p>
            <ul className="space-y-2.5 mt-6">
              {[
                i18n.language === 'mn' ? 'MNS стандартын бүтээгдэхүүн' : 'MNS standard products',
                i18n.language === 'mn' ? 'Мэргэжлийн баг' : 'Professional team',
                i18n.language === 'mn' ? 'Найдвартай түнш' : 'Reliable partner',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={2} />
                  <span className="text-[14px] text-white/85 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-placeholder-dark min-h-[280px] md:min-h-0 flex items-center justify-center">
            <span className="text-[#36486A] font-bold tracking-[0.18em] text-[13px]">EST. 2014 · ULAANBAATAR</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-muted">
        <div className="container-enterprise py-12 lg:py-16">
          <span className="eyebrow block mb-2">{t('about.values')}</span>
          <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong mb-8">
            {i18n.language === 'mn' ? 'Үндсэн үнэт зүйлс' : 'Core values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-line rounded-[18px] p-7"
              >
                <span className="inline-flex w-[52px] h-[52px] rounded-2xl bg-primary-soft text-primary items-center justify-center mb-4">
                  <v.icon className="w-[26px] h-[26px]" strokeWidth={1.75} />
                </span>
                <h3 className="font-bold text-[18px] text-fg-strong">{i18n.language === 'mn' ? v.titleMN : v.titleEN}</h3>
                <p className="text-[14px] text-fg-muted leading-relaxed mt-2">{i18n.language === 'mn' ? v.descMN : v.descEN}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-enterprise py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow block mb-2">{i18n.language === 'mn' ? 'Замнал' : 'Milestones'}</span>
            <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong">
              {i18n.language === 'mn' ? 'Бидний түүх' : 'Our journey'}
            </h2>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-line" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative"
                >
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-white" />
                  <div className="font-display text-[20px] font-extrabold text-primary">{item.year}</div>
                  <h3 className="font-bold text-[16px] text-fg-strong mt-1">{i18n.language === 'mn' ? item.titleMN : item.titleEN}</h3>
                  <p className="text-[14px] text-fg-muted leading-relaxed mt-1">{i18n.language === 'mn' ? item.descMN : item.descEN}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section className="bg-surface-muted">
        <div className="container-enterprise py-12 lg:py-16">
          <span className="eyebrow block mb-2">{t('distribution.title')}</span>
          <h2 className="font-display text-[26px] lg:text-[30px] font-extrabold text-fg-strong mb-8">
            {t('distribution.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {distributionStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-line rounded-[18px] p-7"
              >
                <span className="inline-flex w-12 h-12 rounded-2xl bg-primary-soft text-primary items-center justify-center mb-4">
                  <s.icon className="w-6 h-6" strokeWidth={1.75} />
                </span>
                <div className="font-display text-[40px] font-extrabold text-primary leading-none">{s.value}</div>
                <p className="text-[14px] text-fg-muted mt-2">{i18n.language === 'mn' ? s.labelMN : s.labelEN}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
