import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';

const FeaturedProductGrid = ({ products = [], loading = false }) => {
  return (
    <section className="section-compact bg-mart-soft dark:bg-mono-elevated">
      <div className="container-app">
        <div className="flex items-end justify-between gap-3 mb-5 md:mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-mart-green font-bold mb-1">
              Bestsellers
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-luxury-charcoal dark:text-white font-bold">
              Popular picks
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-mart-green"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && !products.length ? (
          <ProductGridSkeleton count={8} />
        ) : products.length ? (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id || product._id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-12 text-center border border-luxury-line dark:border-mono-line rounded-2xl bg-white dark:bg-mono-surface">
            <p className="text-luxury-muted dark:text-mono-muted mb-4">No products available yet.</p>
            <Link to="/products" className="btn-outline">
              Visit shop
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductGrid;
