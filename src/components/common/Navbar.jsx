import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, MessageCircle, Phone, Truck, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'mn' ? 'en' : 'mn');
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-ink text-white/80 text-[12px]">
        <div className="container-enterprise flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="tracking-tight">{t('usp.freeDelivery')}</span>
            </span>
            <span className="h-3 w-px bg-white/15" />
            <a
              href="tel:+97688204057"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              <span>+976 8820 4057</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <span className="tracking-[0.18em] uppercase text-[10.5px] font-wide">
              {t('contact.workingHoursText')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden bg-ink text-white text-[11.5px] tracking-tight">
        <div className="container-enterprise flex items-center justify-center h-8 gap-2">
          <Truck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
          <span className="text-white/80">{t('usp.freeDelivery')}</span>
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 bg-white border-b transition-all duration-200 ${
          isScrolled ? 'border-line shadow-[0_1px_0_rgba(15,16,18,0.04)]' : 'border-transparent'
        }`}
      >
        <nav className="container-enterprise">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/kk-icon.svg"
                alt="Kokorozashi Kibou LLC"
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-sm"
              />
              <div className="hidden sm:block leading-tight">
                <span className="block font-display font-semibold text-fg-strong text-[15px] tracking-tight">
                  Kokorozashi Kibou
                </span>
                <span className="block text-[10.5px] font-wide font-medium uppercase tracking-[0.22em] text-fg-muted mt-0.5">
                  LLC · Since 2014
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-primary' : 'text-fg hover:text-fg-strong'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute left-4 right-4 -bottom-[22px] h-[2px] bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-wide font-medium uppercase tracking-[0.14em] text-fg-muted hover:text-fg-strong border border-transparent hover:border-line rounded-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{i18n.language}</span>
              </button>

              <div className="hidden md:block h-6 w-px bg-line mx-1" />

              <div className="hidden md:block">
                <Button variant="primary" size="sm" icon={ChevronRight} iconPosition="right" href="/contact">
                  {t('nav.getQuote')}
                </Button>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-sm hover:bg-surface-sunken transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-line overflow-hidden"
            >
              <div className="container-enterprise py-4">
                <div className="space-y-px">
                  {navLinks.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium border-l-2 transition-colors ${
                          active
                            ? 'border-primary text-primary bg-primary-soft'
                            : 'border-transparent text-fg hover:text-fg-strong hover:bg-surface-muted'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4" strokeWidth={2} />
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-5 mt-5 border-t border-line space-y-3">
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-fg hover:bg-surface-muted rounded-sm transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Globe className="w-4 h-4" strokeWidth={2} />
                      Language
                    </span>
                    <span className="font-wide uppercase tracking-[0.14em] text-[12px] text-fg-muted">
                      {i18n.language}
                    </span>
                  </button>
                  <Button variant="primary" icon={ChevronRight} iconPosition="right" href="/contact" className="w-full">
                    {t('nav.getQuote')}
                  </Button>
                  <Button variant="whatsapp" icon={MessageCircle} href="https://wa.me/97688204057" className="w-full">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
