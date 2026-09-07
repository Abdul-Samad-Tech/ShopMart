import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryImage } from '../../utils/imageMapping';

const CategoryShowcase = ({ categories = [] }) => {
  if (!categories.length) {
    return null;
  }

  return (
    <section className="section-compact bg-white dark:bg-mono-surface border-b border-luxury-line dark:border-mono-line">
      <div className="container-app">
        <div className="flex items-center justify-between gap-3 mb-4 md:mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-mart-orange font-bold mb-1">
              Shop
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-luxury-charcoal dark:text-white">
              Categories
            </h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-mart-green">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-3.5">
          {categories.map((category, index) => {
            const href = `/products?category=${encodeURIComponent(category.name || '')}`;
            const image =
              getCategoryImage(category.name) ||
              getCategoryImage(category.slug) ||
              category.image ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80';

            return (
              <motion.div
                key={category.id || category._id || category.slug || category.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
              >
                <Link to={href} className="group flex flex-col items-center" title={category.name}>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-mart-soft dark:bg-mono-elevated shadow-premium border border-luxury-line/80 dark:border-mono-line/80">
                    <img
                      src={image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                  </div>
                  <p className="mt-2 w-full text-xs sm:text-sm font-semibold text-center text-luxury-charcoal dark:text-white leading-snug line-clamp-2">
                    {category.name}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
