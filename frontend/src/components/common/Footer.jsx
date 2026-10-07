import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Footer = () => {
  const { footer, site } = useSelector((state) => state.site);
  const branding = site?.branding || { siteName: 'ShopHub' };

  if (!footer?.columns?.length) {
    return (
      <footer className="bg-luxury-charcoal text-white py-12 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {branding.siteName}
      </footer>
    );
  }

  return (
    <footer className="bg-luxury-charcoal text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <div className="container-premium relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <h3 className="text-3xl font-display font-semibold mb-2">{branding.siteName}</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">{footer.description}</p>
            <div className="flex gap-3">
              {footer.socials?.map((s) => (
                <motion.a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/70 hover:border-gold-500/50 hover:text-gold-400"
                  aria-label={s.label || s.platform}
                >
                  {(s.label || s.platform)?.[0]}
                </motion.a>
              ))}
            </div>
          </div>

          {footer.columns?.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-luxury text-gold-400 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links?.map((link) => (
                  <li key={link.href + link.label}>
                    {link.external ? (
                      <a href={link.href} className="text-sm text-white/60 hover:text-white" target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/60 hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {footer.newsletter?.enabled && (
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-luxury text-gold-400 mb-5">
                {footer.newsletter.title || 'Newsletter'}
              </h4>
              <p className="text-sm text-white/60 mb-4">{footer.newsletter.description}</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm"
                />
                <button type="submit" className="btn-gold !px-5 !py-3 !text-xs shrink-0">
                  Join
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {footer.copyright || branding.siteName}
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            {footer.paymentBadges?.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
