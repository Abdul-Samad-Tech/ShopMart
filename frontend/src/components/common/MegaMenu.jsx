import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { listItemReveal } from '../../animations/motionPresets';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';

const MegaMenu = ({ item, onClose }) => {
  const { categories, site } = useSelector((state) => state.site);

  if (!item?.mega) return null;

  const columns =
    item.columns?.length > 0
      ? item.columns
      : [
          {
            title: 'Shop by Category',
            links: (categories || []).slice(0, 5).map((c) => ({
              label: c.name,
              href: `/products?category=${encodeURIComponent(c.name)}`,
            })),
          },
          {
            title: 'Featured',
            links: [
              { label: 'Luxury Picks', href: '/products?luxury=true' },
              { label: 'Best Sellers', href: '/products?sort=popularity' },
              { label: 'New Arrivals', href: '/products?sort=newest' },
            ],
          },
        ];

  const children = item.children?.length
    ? item.children
    : [
        { label: 'All Products', href: '/products', description: 'Browse full collection' },
        { label: 'Luxury Selection', href: '/products?luxury=true', description: 'Premium selection' },
      ];

  const featuredImage = site?.hero?.sideImage || FEATURED_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 right-0 top-full z-[60]"
      onMouseLeave={onClose}
    >
      <div className="bg-gradient-mart border-t border-white/10 shadow-premium-xl">
        <div className="container-premium py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(220px,280px)] gap-8 lg:gap-10">
            {columns.map((col, colIdx) => (
              <div key={col.title || colIdx}>
                <p className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-4 border-b border-white/15 pb-2">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {(col.links || []).map((link, i) => (
                    <motion.li
                      key={link.href + link.label}
                      custom={colIdx * 4 + i}
                      variants={listItemReveal}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={link.href}
                        onClick={onClose}
                        className="text-sm text-white/90 hover:text-gold-300 transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-1 border-t sm:border-t-0 lg:border-l border-white/15 pt-6 sm:pt-0 lg:pl-8">
              <p className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-4 border-b border-white/15 pb-2">
                Quick links
              </p>
              <ul className="space-y-4">
                {children.map((child, i) => (
                  <motion.li
                    key={child.href + child.label}
                    custom={i}
                    variants={listItemReveal}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link to={child.href} onClick={onClose} className="block group">
                      <span className="text-sm font-medium text-white group-hover:text-gold-300 transition-colors">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="text-xs text-white/55 block mt-0.5">{child.description}</span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/products"
                onClick={onClose}
                className="inline-flex mt-6 text-xs font-semibold uppercase tracking-wide text-gold-300 hover:text-white hover:underline transition-colors"
              >
                View all collection →
              </Link>
            </div>

            <div className="hidden lg:block rounded-xl overflow-hidden border border-white/15 shadow-premium-lg min-h-[220px]">
              <img
                src={featuredImage}
                alt="Featured collection"
                className="w-full h-full min-h-[220px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
