import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function MapSection() {
  const { t, i18n } = useTranslation();

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: t('contact.addressText'),
      href: 'https://maps.app.goo.gl/o2TLeRyaNxHZnQKF9',
    },
    {
      icon: Phone,
      label: i18n.language === 'mn' ? 'Утас' : 'Phone',
      value: '+976 8820 4057',
      href: 'tel:+97688204057',
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: 'info@kkllc.mn',
      href: 'mailto:info@kkllc.mn',
    },
    {
      icon: Clock,
      label: t('contact.workingHours'),
      value: t('contact.workingHoursText'),
      href: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Info */}
      <div className="bg-white border border-line rounded-sm">
        <div className="p-6 md:p-8 border-b border-line">
          <span className="section-index block text-fg-subtle mb-3">02 &nbsp;/&nbsp; DIRECT CHANNELS</span>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-fg-strong tracking-[-0.02em]">
            {t('contact.title')}
          </h3>
        </div>

        <ul className="divide-y divide-line">
          {contactInfo.map((item, idx) => {
            const Inner = (
              <div className="flex items-start gap-4 p-5 md:p-6 group">
                <div className="w-10 h-10 border border-line flex items-center justify-center flex-shrink-0 rounded-sm group-hover:border-primary group-hover:bg-primary-soft transition-colors">
                  <item.icon className="w-4 h-4 text-fg-strong group-hover:text-primary transition-colors" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.2em] text-fg-subtle mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-fg-strong font-medium leading-relaxed">
                    {item.value}
                  </p>
                </div>
                {item.href && (
                  <ArrowUpRight
                    className="w-4 h-4 text-fg-subtle group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-1"
                    strokeWidth={2}
                  />
                )}
              </div>
            );

            return (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block hover:bg-surface-muted transition-colors"
                  >
                    {Inner}
                  </a>
                ) : (
                  Inner
                )}
              </motion.li>
            );
          })}
        </ul>

        <div className="p-5 md:p-6 border-t border-line bg-surface-muted">
          <a
            href="https://wa.me/97688204057"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between h-12 px-5 bg-[#25D366] text-white rounded-sm hover:bg-[#1EB955] transition-colors"
          >
            <span className="inline-flex items-center gap-2.5 text-sm font-medium">
              <MessageCircle className="w-4 h-4" strokeWidth={2} />
              {t('cta.whatsapp')}
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <span className="section-index text-fg-subtle">03 &nbsp;/&nbsp; LOCATION</span>
          <a
            href="https://maps.app.goo.gl/o2TLeRyaNxHZnQKF9"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[11px] font-wide font-semibold uppercase tracking-[0.18em] text-fg-strong hover:text-primary transition-colors"
          >
            <span>Open in maps</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </div>
        <div className="aspect-video relative bg-surface-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1001.4914800896232!2d106.81592376229223!3d47.923586451680826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96ed8466551407%3A0xd930925513242d15!2sKokorozashi%20Kibou%20LLC!5e0!3m2!1sen!2sus!4v1768355159953!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kokorozashi Kibou LLC Location"
            className="absolute inset-0"
          />
        </div>
      </div>
    </motion.div>
  );
}
