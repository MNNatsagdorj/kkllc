import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function MapSection() {
  const { t, i18n } = useTranslation();

  const contactInfo = [
    { icon: MapPin, label: t('contact.address'), value: t('contact.addressText'), href: 'https://maps.app.goo.gl/o2TLeRyaNxHZnQKF9' },
    { icon: Phone, label: i18n.language === 'mn' ? 'Утас' : 'Phone', value: '+976 8820 4057', href: 'tel:+97688204057' },
    { icon: Mail, label: t('contact.email'), value: 'info@kkllc.mn', href: 'mailto:info@kkllc.mn' },
    { icon: Clock, label: t('contact.workingHours'), value: t('contact.workingHoursText'), href: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      {/* Info cards */}
      {contactInfo.map((item, idx) => {
        const Inner = (
          <div className="flex items-start gap-4 border border-line rounded-2xl p-5 hover:border-line-strong transition-colors">
            <span className="inline-flex w-11 h-11 rounded-xl bg-primary-soft text-primary items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-fg-strong">{item.label}</p>
              <p className="text-[14px] text-fg-muted mt-1 leading-relaxed break-words">{item.value}</p>
            </div>
          </div>
        );
        return item.href ? (
          <a
            key={idx}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block"
          >
            {Inner}
          </a>
        ) : (
          <div key={idx}>{Inner}</div>
        );
      })}

      {/* WhatsApp */}
      <a
        href="https://wa.me/97688204057"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 h-[52px] rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#1EB955] transition-colors"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2} />
        {t('cta.whatsapp')}
      </a>

      {/* Map */}
      <div className="border border-line rounded-2xl overflow-hidden">
        <div className="aspect-video bg-surface-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1001.4914800896232!2d106.81592376229223!3d47.923586451680826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96ed8466551407%3A0xd930925513242d15!2sKokorozashi%20Kibou%20LLC!5e0!3m2!1sen!2sus!4v1768355159953!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kokorozashi Kibou LLC Location"
          />
        </div>
      </div>
    </motion.div>
  );
}
