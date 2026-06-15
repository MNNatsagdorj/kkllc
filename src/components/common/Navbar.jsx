import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Search, ShoppingCart, Phone, Truck, ChevronRight } from 'lucide-react';
import Button from './Button';
import { useCart } from '../../context/cartStore';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { totalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu on navigation (render-time adjustment, no effect).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (isOpen) setIsOpen(false);
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'mn' ? 'en' : 'mn');
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/delivery', label: t('nav.delivery') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const Logo = (
    <Link to="/" className="flex items-center gap-3 group">
      <span className="w-10 h-10 lg:w-[42px] lg:h-[42px] rounded-[11px] bg-primary text-white font-display font-extrabold text-[17px] inline-flex items-center justify-center tracking-tight">
        KK
      </span>
      <div className="hidden sm:block leading-tight">
        <span className="block font-display font-bold text-fg-strong text-[15px] tracking-tight">
          Kokorozashi Kibou
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-subtle mt-0.5">
          Барилгын материал
        </span>
      </div>
    </Link>
  );

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-ink text-white/65 text-[13px]">
        <div className="container-enterprise flex items-center justify-between h-9">
          <span className="inline-flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
            <span>{t('usp.freeDelivery')}</span>
          </span>
          <div className="flex items-center gap-4">
            <span>{t('contact.workingHoursText')}</span>
            <span className="h-3 w-px bg-white/15" />
            <a href="tel:+97688204057" className="hover:text-white transition-colors">
              +976 8820 4057
            </a>
          </div>
        </div>
      </div>

      {/* Mobile utility bar */}
      <div className="md:hidden bg-ink text-white text-[11.5px]">
        <div className="container-enterprise flex items-center justify-center h-8 gap-2">
          <Truck className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
          <span className="text-white/75">{t('usp.freeDelivery')}</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line">
        <nav className="container-enterprise">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4">
            {Logo}

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-[15px] font-medium transition-colors ${
                      active ? 'text-fg-strong' : 'text-fg hover:text-fg-strong'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute left-4 right-4 -bottom-[18px] h-[2.5px] bg-accent rounded-full"
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
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-fg-muted hover:text-fg-strong rounded-xl hover:bg-surface-sunken transition-all"
              >
                <Globe className="w-4 h-4" strokeWidth={2} />
                <span>{i18n.language}</span>
              </button>

              <Link
                to="/products"
                aria-label={t('nav.products')}
                className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-xl text-fg hover:text-fg-strong hover:bg-surface-sunken transition-colors"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={2} />
              </Link>

              <Link
                to="/cart"
                aria-label={t('cart.title')}
                className="relative inline-flex w-10 h-10 items-center justify-center rounded-xl text-fg hover:text-fg-strong hover:bg-surface-sunken transition-colors"
              >
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold inline-flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:block">
                <Button variant="primary" size="sm" icon={ChevronRight} iconPosition="right" href="/contact">
                  {t('nav.getQuote')}
                </Button>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-surface-sunken transition-colors"
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
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-colors ${
                          active
                            ? 'text-primary bg-primary-soft'
                            : 'text-fg hover:text-fg-strong hover:bg-surface-muted'
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
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-fg hover:bg-surface-muted rounded-xl transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Globe className="w-4 h-4" strokeWidth={2} />
                      Language
                    </span>
                    <span className="uppercase tracking-[0.1em] text-[12px] text-fg-muted">
                      {i18n.language}
                    </span>
                  </button>
                  <Button variant="primary" icon={ChevronRight} iconPosition="right" href="/contact" className="w-full">
                    {t('nav.getQuote')}
                  </Button>
                  <Button variant="whatsapp" icon={Phone} href="tel:+97688204057" className="w-full">
                    +976 8820 4057
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
