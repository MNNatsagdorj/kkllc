import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { categories } from '../../data/products';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/delivery', label: t('nav.delivery') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const contactItems = [
    { icon: MapPin, label: t('contact.addressText'), href: 'https://maps.app.goo.gl/o2TLeRyaNxHZnQKF9' },
    { icon: Phone, label: '+976 8820 4057', href: 'tel:+97688204057' },
    { icon: Mail, label: 'info@kkllc.mn', href: 'mailto:info@kkllc.mn' },
    { icon: Clock, label: t('contact.workingHoursText'), href: null },
  ];

  return (
    <footer className="bg-ink text-white/65">
      <div className="container-enterprise pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-[11px] bg-primary text-white font-display font-extrabold inline-flex items-center justify-center">
                KK
              </span>
              <span className="text-white font-bold text-[15px]">Kokorozashi Kibou</span>
            </div>
            <p className="text-sm leading-relaxed text-white/55 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 mt-6">
              {[
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: MessageCircle, href: 'https://wa.me/97688204057', label: 'WhatsApp' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-white/15 hover:border-accent hover:text-accent transition-colors"
                >
                  <s.icon className="w-4 h-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold text-[14.5px] mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/products?category=${c.id}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {i18n.language === 'mn' ? c.nameMN : c.nameEN}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-[14.5px] mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-3">
            <h4 className="text-white font-semibold text-[14.5px] mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3">
              {contactItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-white/60 hover:text-white transition-colors leading-relaxed"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm text-white/60 leading-relaxed">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/45">
          <p>© {currentYear} Kokorozashi Kibou LLC. {t('footer.rights')}.</p>
          <p>Ulaanbaatar · Mongolia · MNS Certified</p>
        </div>
      </div>
    </footer>
  );
}
