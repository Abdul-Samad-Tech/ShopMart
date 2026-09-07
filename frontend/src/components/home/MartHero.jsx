import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MART_HERO } from './home.constant';

const MartHero = ({ branding, hero }) => {
  const brandName = branding?.siteName || MART_HERO.brand;
  const headline = hero?.title || MART_HERO.headline;
  const support = hero?.subtitle || MART_HERO.support;
  const image = hero?.image || MART_HERO.image;

  return (
    <section className="relative min-h-[68vh] sm:min-h-[75vh] md:min-h-[85vh] overflow-hidden bg-mart-green-dark">
      <motion.img
        src={image}
        alt={MART_HERO.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      <div className="container-app relative z-10 flex min-h-[68vh] sm:min-h-[75vh] md:min-h-[85vh] items-end sm:items-center py-14 sm:py-20">
        <div className="max-w-2xl w-full">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-none mb-4 sm:mb-6"
          >
            {brandName?.includes('Mart') ? (
              <>
                <span className="text-white">Shop</span>
                <span className="text-mart-orange">Mart</span>
              </>
            ) : (
              <span className="text-white">{brandName}</span>
            )}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-3 sm:mb-5"
          >
            {headline}
            {hero?.titleAccent ? (
              <span className="block text-mart-accent mt-2">{hero.titleAccent}</span>
            ) : null}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg mb-6 sm:mb-9"
          >
            {support}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto"
          >
            <Link to={MART_HERO.primaryCta.href} className="btn-mart justify-center w-full sm:w-auto">
              {MART_HERO.primaryCta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={MART_HERO.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/35 hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              {MART_HERO.secondaryCta.label}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MartHero;
