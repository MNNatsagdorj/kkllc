import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, MessageCircle, Phone } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
      {/* USP Banner */}
      <div className="bg-primary text-white text-center py-2 px-4 text-sm font-semibold">
        <span className="animate-pulse">🚚</span> {t('usp.freeDelivery')}
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-lg md:text-xl">KK</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-secondary text-lg">Kokorozashi Kibou</span>
                <span className="block text-xs text-gray-500">LLC</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-colors ${location.pathname === link.path
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary'
                    }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-gray transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">{i18n.language.toUpperCase()}</span>
              </button>

              {/* WhatsApp Button - Desktop */}
              <div className="hidden md:block">
                <Button
                  variant="whatsapp"
                  size="sm"
                  icon={MessageCircle}
                  href="https://wa.me/97688204057"
                >
                  WhatsApp
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-gray transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-neutral-gray'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 space-y-3">
                  <Button
                    variant="whatsapp"
                    icon={MessageCircle}
                    href="https://wa.me/97688204057"
                    className="w-full"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    icon={Phone}
                    href="tel:+97688204057"
                    className="w-full"
                  >
                    {t('cta.call')}
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

