import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { getCategoryImage } from '../../utils/imageMapping';

const CategoryAisle3D = ({ categories }) => {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4"
      style={{ perspective: '1200px' }}
    >
      {categories.map((cat, i) => {
        const localImage = getCategoryImage(cat.name);
        return (
          <motion.div
            key={cat.id || cat.slug}
            initial={reduced ? {} : { opacity: 0, rotateX: 12, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.04, duration: 0.45 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link
              to={cat.href || `/products?category=${encodeURIComponent(cat.name)}`}
              className="category-aisle-card group block"
            >
              <div className="category-aisle-inner">
                <img 
                  src={localImage || cat.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80'} 
                  alt={cat.name} 
                  className="w-full h-24 object-cover" 
                  loading="lazy" 
                />
                <div className="p-3 text-center">
                  <p className="text-[11px] font-bold text-mart-green leading-tight line-clamp-2">{cat.name}</p>
                  {cat.itemCount && (
                    <p className="text-[9px] text-luxury-muted mt-1 uppercase tracking-wide">{cat.itemCount}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryAisle3D;
