import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="container-premium relative z-10 py-16 md:py-20">
        {breadcrumbs && (
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/60 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/30">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-gold-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold-400 text-xs font-semibold uppercase tracking-luxury mb-3">
            ShopHub
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white text-shadow-lg mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-white/75 max-w-xl font-light">{subtitle}</p>
          )}
        </motion.div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
    </section>
  );
};

export default PageHeader;
