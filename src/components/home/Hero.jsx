import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const popular = [
    t('categories.puttyWhite'),
    'Knauf',
    t('categories.tileAdhesive'),
  ];

  return (
    <section className="relative bg-gradient-to-b from-surface-muted to-white">
      <div className="container-enterprise pt-16 pb-14 lg:pt-20 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white border border-line text-fg rounded-full px-4 py-2 text-[13px] font-semibold shadow-[0_2px_8px_rgba(16,30,54,0.04)] mb-7">
            <span className="w-[7px] h-[7px] rounded-full bg-success" />
            {t('hero.badge')}
          </div>

          {/* Headline */}
          <h1 className="font-display text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.06] tracking-[-0.03em] text-fg-strong max-w-[820px]">
            {t('hero.headlineLead')}{' '}
            <span className="text-accent">{t('hero.headlineAccent')}</span>
            {t('hero.headlineTail')}
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] lg:text-[18px] leading-relaxed text-fg-muted max-w-[560px] mt-5">
            {t('hero.subheadline')}
          </p>

          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="flex items-center w-full max-w-[620px] mt-8 bg-white border-[1.5px] border-line-strong rounded-full pl-5 pr-[7px] py-[7px] shadow-[0_14px_34px_rgba(16,30,54,0.08)]"
          >
            <Search className="w-5 h-5 text-fg-subtle flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 min-w-0 bg-transparent outline-none px-3 text-[15px] text-fg-strong placeholder:text-fg-subtle"
            />
            <button
              type="submit"
              className="flex-shrink-0 h-12 px-6 sm:px-7 rounded-full bg-accent text-white font-bold text-[15px] hover:bg-accent-dark transition-colors"
            >
              {t('search.button')}
            </button>
          </form>

          {/* Popular tags */}
          <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
            <span className="text-[13.5px] text-fg-muted">{t('search.popular')}</span>
            {popular.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/products?q=${encodeURIComponent(tag)}`)}
                className="text-[13.5px] text-fg bg-surface-sunken hover:bg-line-strong px-3.5 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
