import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Eye, Heart, Star } from 'lucide-react';
import { openQuickView } from '../../store/uiSlice';
import useOptimisticWishlist from '../../hooks/useOptimisticWishlist';
import AddToCartButton from '../cart/AddToCartButton';
import { getProductImage } from '../../utils/imageMapping';

const ProductCard = memo(function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { inWishlist, toggle: handleWishlist } = useOptimisticWishlist(product.id);
  const localImage = getProductImage(product.name);
  const rating = Number(product.rating || 4);
  const reviewCount = product.reviews || 0;

  const handleQuickView = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(openQuickView(product));
    },
    [dispatch, product]
  );

  const handleWishlistClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleWishlist(e);
    },
    [handleWishlist]
  );

  return (
    <motion.div
      className="h-full group"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className="product-card-premium h-full flex flex-col">
        <Link to={`/product/${product.id}`} className="flex flex-col h-full">
          <div className="product-card-premium__media relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#f3f8f5_45%,#e8f1ec_100%)] dark:bg-[radial-gradient(circle_at_30%_20%,#1a1a1a_0%,#1e1e1e_45%,#262626_100%)]" />
            <div className="absolute inset-x-6 bottom-4 h-16 rounded-[100%] bg-black/[0.04] dark:bg-white/[0.04] blur-xl z-[1]" />
            <img
              src={
                localImage ||
                product.image ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85'
              }
              alt={product.name}
              loading="lazy"
              className="relative z-[2] w-full h-full object-contain object-center p-5 sm:p-6 transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 z-[2] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

            {product.discount > 0 ? (
              <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-mart-orange text-white text-[10px] font-bold tracking-wide px-2.5 py-1 shadow-md">
                -{product.discount}%
              </span>
            ) : null}

            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`product-card-premium__icon ${
                  inWishlist ? 'text-mart-orange bg-white dark:bg-mono-surface' : 'text-luxury-charcoal dark:text-white'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleQuickView}
                className="product-card-premium__icon text-luxury-charcoal dark:text-white opacity-100 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300"
                aria-label="Quick view"
                title="Quick view"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col px-3.5 pt-3.5 pb-3.5 sm:px-4 sm:pt-4 sm:pb-4">
            {product.category ? (
              <p className="text-[10px] uppercase tracking-[0.16em] text-mart-green font-semibold mb-1.5">
                {product.category}
              </p>
            ) : null}

            <h3 className="font-display text-[0.95rem] sm:text-lg font-semibold text-luxury-charcoal dark:text-white leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-mart-green transition-colors">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-luxury-muted dark:text-mono-muted">
              <div className="flex items-center gap-0.5 text-mart-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      star <= Math.round(rating) ? 'fill-current' : 'fill-luxury-line text-luxury-line dark:fill-mono-line dark:text-mono-line'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs">
                {rating.toFixed(1)}
                <span className="text-luxury-muted/80 dark:text-mono-muted/80"> ({reviewCount})</span>
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-display font-bold text-luxury-charcoal dark:text-white">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice ? (
                <span className="text-xs sm:text-sm text-luxury-muted dark:text-mono-muted line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              ) : null}
            </div>

            <div className="mt-auto pt-3.5">
              <AddToCartButton
                product={product}
                className="w-full !rounded-full !py-2.5 sm:!py-3 !text-[11px] sm:!text-xs !font-bold !tracking-wide !bg-mart-green !text-white !border-0 hover:!bg-mart-green-dark"
                label="Add to Cart"
              />
            </div>
          </div>
        </Link>
      </article>
    </motion.div>
  );
});

export default ProductCard;
