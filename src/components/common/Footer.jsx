import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
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
    <footer className="bg-ink text-white/70">
      {/* Top band — brand + CTA */}
      <div className="border-b border-white/10">
        <div className="container-enterprise py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="section-index block text-white/40 mb-4">
                01 &nbsp;/&nbsp; {t('footer.contactInfo')}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
                <span className="serif-accent text-primary">Kokorozashi</span>{' '}
                <span className="font-wide font-light text-white/90">Kibou</span>
              </h3>
              <p className="mt-4 text-white/60 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/97688204057"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary-dark transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} />
                <span>{t('cta.whatsapp')}</span>
              </a>
              <a
                href="tel:+97688204057"
                className="inline-flex items-center gap-2 h-11 px-5 border border-white/20 text-white text-sm font-medium rounded-sm hover:border-white/40 transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                <span>{t('cta.call')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-enterprise py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img src="/kk-icon.svg" alt="Kokorozashi Kibou LLC" className="w-11 h-11 rounded-sm" />
              <div className="leading-tight">
                <span className="block font-display font-semibold text-white text-[15px]">
                  Kokorozashi Kibou LLC
                </span>
                <span className="block text-[10.5px] font-wide font-medium uppercase tracking-[0.22em] text-white/40 mt-0.5">
                  Building Materials · Ulaanbaatar
                </span>
              </div>
            </div>
            <div className="h-px w-16 bg-primary mb-5" />
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center border border-white/15 hover:border-primary hover:text-primary transition-colors rounded-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" strokeWidth={2} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center border border-white/15 hover:border-primary hover:text-primary transition-colors rounded-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={2} />
              </a>
              <a
                href="https://wa.me/97688204057"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center border border-white/15 hover:border-[#25D366] hover:text-[#25D366] transition-colors rounded-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-white/40 mb-5">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5">
            <h4 className="text-[10.5px] font-wide font-semibold uppercase tracking-[0.22em] text-white/40 mb-5">
              {t('footer.contactInfo')}
            </h4>
            <ul className="space-y-4">
              {contactItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-white/70 hover:text-white transition-colors leading-relaxed"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm text-white/70 leading-relaxed">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-enterprise py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]">
            <p className="text-white/45">
              © {currentYear} Kokorozashi Kibou LLC. {t('footer.rights')}.
            </p>
            <div className="flex items-center gap-4 text-white/45 font-wide uppercase tracking-[0.2em] text-[10.5px]">
              <span>Ulaanbaatar · Mongolia</span>
              <span className="h-3 w-px bg-white/15" />
              <span>ISO-Ready</span>
              <span className="h-3 w-px bg-white/15" />
              <span>MNS Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
