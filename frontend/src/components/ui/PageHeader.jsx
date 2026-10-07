import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <section className="relative bg-chrome text-white overflow-hidden">
      <div className="container-premium relative z-10 py-16 md:py-20">
        {breadcrumbs && (
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/60 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/30">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-accent transition-colors">
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
          <p className="text-accent text-xs font-semibold uppercase tracking-wide mb-3">
            ShopMart
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-white/75 max-w-xl font-light">{subtitle}</p>
          )}
        </motion.div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </section>
  );
};

export default PageHeader;
