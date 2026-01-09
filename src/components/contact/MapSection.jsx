import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export default function MapSection() {
  const { t, i18n } = useTranslation();

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: t('contact.addressText'),
      href: 'https://maps.google.com/?q=Ulaanbaatar+Khan-Uul',
    },
    {
      icon: Phone,
      label: i18n.language === 'mn' ? 'Утас' : 'Phone',
      value: '+976 9999 9999',
      href: 'tel:+97699999999',
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Contact Info Cards */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
        <h3 className="font-display text-2xl font-bold text-secondary mb-6">
          {t('contact.title')}
        </h3>

        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-concrete transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-medium text-secondary group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-medium text-secondary">{item.value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 pt-6 border-t border-neutral-gray">
          <Button
            variant="whatsapp"
            icon={MessageCircle}
            href="https://wa.me/97699999999"
            className="w-full"
            size="lg"
          >
            {t('cta.whatsapp')}
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-video bg-neutral-gray relative">
          {/* Google Maps Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86088.54635255066!2d106.84686387632946!3d47.91869660261898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d969247c6d4ad29%3A0x71c23f8c0af42396!2sKhan-Uul%20District%2C%20Ulaanbaatar%2C%20Mongolia!5e0!3m2!1sen!2sus!4v1704800000000!5m2!1sen!2sus"
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

