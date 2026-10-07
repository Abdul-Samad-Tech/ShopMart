import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { openQuickView } from '../../store/uiSlice';
import useOptimisticWishlist from '../../hooks/useOptimisticWishlist';
import TiltCard from '../../animations/TiltCard';
import AddToCartButton from '../cart/AddToCartButton';
import { Heart, Eye } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const ProductCard = memo(function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { inWishlist, toggle: handleWishlist } = useOptimisticWishlist(product.id);
  const localImage = getProductImage(product.name);

  const handleQuickView = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(openQuickView(product));
    },
    [dispatch, product]
  );

  return (
    <motion.div 
      className="h-full group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
    >
      <article className="card card-glow overflow-hidden h-full flex flex-col" style={{ minHeight: '420px' }}>
        <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col h-full">
          <div className="product-image-wrap relative w-full overflow-hidden bg-surface-raised bg-surface-raised" style={{ aspectRatio: '4/5', minHeight: '280px' }}>
            <motion.img
              src={localImage || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
              alt={product.name}
              loading="lazy"
              className="product-image w-full h-full object-contain object-center absolute inset-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            {product.hoverImage && (
              <motion.img
                src={product.hoverImage}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain object-center absolute inset-0 opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            )}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-chrome/50 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {product.discount > 0 && (
              <motion.span 
                className="absolute top-4 left-4 badge z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {product.discount}% Off
              </motion.span>
            )}
            <motion.button
              type="button"
              onClick={handleWishlist}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-ink"
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Wishlist"
            >
              <motion.span
                animate={inWishlist ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current text-danger' : ''}`} aria-hidden="true" />
              </motion.span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleQuickView}
              className="absolute top-16 right-4 z-10 w-11 h-11 rounded-full glass-panel flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Quick view"
              title="Quick view"
            >
              <Eye className="w-5 h-5" aria-hidden="true" />
            </motion.button>

            <motion.div 
              className="absolute bottom-4 left-4 right-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddToCartButton product={product} className="w-full" />
            </motion.div>
          </div>

          <div className="p-5 flex-1 flex flex-col" style={{ minHeight: '140px' }}>
            {product.category && (
              <p className="text-[10px] uppercase tracking-wide text-ink-muted dark:text-ink-muted mb-1" style={{ minHeight: '16px' }}>
                {product.category}
              </p>
            )}
            <motion.h3 
              className="font-display text-lg text-ink dark:text-white line-clamp-2 mb-2"
              style={{ minHeight: '3rem' }}
              whileHover={{ color: 'rgb(99 102 241)' }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            <div className="flex items-center gap-1 mb-3" style={{ minHeight: '20px' }}>
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? 'fill-current' : 'fill-line dark:fill-white/20'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-ink-muted dark:text-ink-muted">({product.reviews || 0})</span>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
              <motion.span 
                className="text-xl font-display font-semibold dark:text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(product.price)}
              </motion.span>
              {product.originalPrice && (
                <span className="text-sm text-ink-muted line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </Link>
      </article>
    </motion.div>
  );
});

export default ProductCard;
