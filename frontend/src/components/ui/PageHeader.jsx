import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroVideo from '../common/HeroVideo';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <section className="relative h-[200px] sm:h-[220px] md:h-[240px] text-white overflow-hidden">
      <HeroVideo fit="cover" />
      <div className="container-premium relative z-10 h-full flex flex-col justify-center py-5 md:py-6">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/60 mb-2 sm:mb-3">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/30" aria-hidden="true">/</span>}
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-accent transition-colors min-h-11 inline-flex items-center"
                    aria-label={crumb.label}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90" aria-current="page">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-accent text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1.5">
            ShopMart
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm sm:text-base text-white/75 max-w-xl font-light line-clamp-2">{subtitle}</p>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </section>
  );
};

export default PageHeader;
