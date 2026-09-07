import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import useOptimisticCart from '../hooks/useOptimisticCart';
import { fetchProductById, fetchProducts } from '../store/productSlice';
import { fetchDashboard } from '../store/userSlice';
import { apiEndpoints } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import CinematicProductStory from '../components/product/CinematicProductStory';
import PageHeader from '../components/ui/PageHeader';
import PremiumSpinner from '../components/common/PremiumSpinner';
import Skeleton from '../components/ui/Skeleton';
import TiltCard from '../animations/TiltCard';
import useOptimisticWishlist from '../hooks/useOptimisticWishlist';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [cinematic, setCinematic] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const { currentProduct: product, detailLoading, filteredProducts } = useSelector((state) => state.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { inWishlist, toggle: toggleWishlist } = useOptimisticWishlist(id);
  const { addItem } = useOptimisticCart();

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchDashboard());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchProducts({ category: product.category, limit: 4 }));
    }
  }, [product?.category, dispatch]);

  useEffect(() => {
    if (id) {
      setLoadingReviews(true);
      apiEndpoints.getProductReviews(id)
        .then((res) => setReviews(res.data))
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    }
  }, [id]);

  const relatedProducts = filteredProducts.filter((p) => p.id !== product?.id).slice(0, 3);
  const showCinematic = cinematic && (product?.isFeatured || product?.isLuxury);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ ...product, selectedSize, selectedColor }, { quantity, showToast: true });
  };

  const handleSubmitReview = async () => {
    if (!userRating || !reviewText.trim()) {
      toast.error('Please provide both rating and review');
      return;
    }

    try {
      const { data } = await apiEndpoints.submitReview({
        product: id,
        rating: userRating,
        text: reviewText.trim(),
      });
      setReviews([data, ...reviews]);
      setUserRating(0);
      setReviewText('');
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
      
      // Refresh product to update rating
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (detailLoading || !product) {
    return (
      <div className="page-shell container-premium py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <PremiumSpinner label="Loading product" size="sm" />
      </div>
    );
  }

  if (showCinematic) {
    return (
      <div className="page-shell bg-black min-h-screen">
        <CinematicProductStory product={product} onClassicView={() => setCinematic(false)} />
        {relatedProducts.length > 0 && (
          <section className="py-20 bg-mono-black border-t border-white/10">
            <div className="container-premium">
              <h2 className="text-3xl font-display mb-10 text-center text-white">You May Also Like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  const OptionButton = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[3rem] px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
        active ? 'border-luxury-charcoal bg-luxury-charcoal text-white dark:border-white dark:bg-white dark:text-mono-black' : 'border-luxury-line hover:border-primary-400 dark:border-mono-line dark:hover:border-primary-400'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="page-shell">
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collection', to: '/products' },
          { label: product.name },
        ]}
      />

      <div className="container-premium py-12 md:py-16">
        {(product.isFeatured || product.isLuxury) && (
          <button
            type="button"
            onClick={() => setCinematic(true)}
            className="mb-6 text-sm text-mart-green font-semibold hover:underline"
          >
            ✦ Cinematic story mode
          </button>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-12">
          <TiltCard maxTilt={8} className="rounded-2xl group product-image-wrap">
            <div className="relative rounded-2xl overflow-hidden bg-luxury-ivory dark:bg-mono-elevated aspect-square">
              <img src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'} alt={product.name} loading="lazy" className="w-full h-full object-cover product-image group-hover:opacity-0 transition-opacity duration-500" />
              {product.hoverImage && (
                <img src={product.hoverImage} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 product-image" />
              )}
              {product.discount > 0 && <span className="absolute top-6 left-6 badge-premium z-10">{product.discount}% Off</span>}
            </div>
          </TiltCard>

          <div>
            <p className="text-xs uppercase tracking-luxury text-gold-600 dark:text-gold-400 font-semibold mb-2">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-display mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-luxury-line dark:border-mono-line">
              <span className="text-3xl font-display font-semibold">${product.price?.toFixed(2)}</span>
              {product.originalPrice && <span className="text-lg text-luxury-muted dark:text-mono-muted line-through">${product.originalPrice}</span>}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-gold-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    disabled={!isAuthenticated}
                  >
                    <svg
                      className={`w-6 h-6 ${star <= (hoverRating || userRating) ? 'fill-current' : 'fill-luxury-line dark:fill-white/20'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-sm text-luxury-muted dark:text-mono-muted">
                {product.rating?.toFixed(1) || '4.5'} ({product.reviews || 0} reviews)
              </span>
              {!isAuthenticated && <span className="text-xs text-luxury-muted dark:text-mono-muted">(Login to rate)</span>}
            </div>
            <p className="text-luxury-muted dark:text-mono-muted leading-relaxed mb-6">{product.description}</p>

            {product.specifications?.length > 0 && (
              <dl className="grid grid-cols-2 gap-3 mb-6 text-sm">
                {product.specifications.map((s) => (
                  <div key={s.label} className="bg-luxury-ivory dark:bg-white/5 rounded-lg p-3">
                    <dt className="text-luxury-muted dark:text-mono-muted text-xs">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="label-premium">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <OptionButton key={size} active={selectedSize === size} onClick={() => setSelectedSize(size)}>
                      {size}
                    </OptionButton>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="label-premium">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <OptionButton key={color} active={selectedColor === color} onClick={() => setSelectedColor(color)}>
                      {color}
                    </OptionButton>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="label-premium">Quantity</h3>
              <div className="inline-flex items-center rounded-xl border border-luxury-line dark:border-mono-line">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 hover:bg-luxury-ivory dark:hover:bg-white/10">
                  −
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 hover:bg-luxury-ivory dark:hover:bg-white/10">
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} onClick={handleAddToCart} className="btn-premium flex-1">
                Add to Bag
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                animate={inWishlist ? { scale: [1, 1.2, 1] } : {}}
                onClick={toggleWishlist}
                className="btn-outline !px-4 text-lg"
                aria-label="Wishlist"
              >
                {inWishlist ? '♥' : '♡'}
              </motion.button>
            </div>

            {product.features?.map((f) => (
              <p key={f} className="text-sm text-luxury-muted dark:text-mono-muted flex items-center gap-2 mt-2">
                <span className="text-gold-500">✓</span> {f}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Specifications Section */}
        <section className="mt-16 pt-12 border-t border-luxury-line dark:border-mono-line">
          <h2 className="text-2xl font-display mb-8">Specifications</h2>
          <div className="card-premium p-8">
            {product.specifications?.length > 0 ? (
              <dl className="grid md:grid-cols-2 gap-6">
                {product.specifications.map((s) => (
                  <div key={s.label} className="flex justify-between py-3 border-b border-luxury-line dark:border-mono-line last:border-0">
                    <dt className="text-luxury-muted dark:text-mono-muted">{s.label}</dt>
                    <dd className="font-medium text-luxury-charcoal dark:text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-luxury-muted dark:text-mono-muted">No specifications available for this product.</p>
            )}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mt-16 pt-12 border-t border-luxury-line dark:border-mono-line">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display">Customer Reviews</h2>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-outline text-sm"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="card-premium p-6 mb-8">
              <div className="mb-4">
                <label className="label-premium">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-gold-500 hover:scale-110 transition-transform"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= userRating ? 'fill-current' : 'fill-luxury-line dark:fill-white/20'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="label-premium">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-luxury-line dark:border-mono-line focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>
              <button type="button" onClick={handleSubmitReview} className="btn-premium">Submit Review</button>
            </div>
          )}

          {loadingReviews ? (
            <p className="text-luxury-muted dark:text-mono-muted text-center py-8">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-luxury-muted dark:text-mono-muted text-center py-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="card-premium p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-luxury-charcoal dark:text-white">{review.userName}</p>
                      <p className="text-xs text-luxury-muted dark:text-mono-muted">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex text-gold-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'fill-luxury-line dark:fill-white/20'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="font-medium text-luxury-charcoal dark:text-white mb-2">{review.title}</p>}
                  <p className="text-luxury-muted dark:text-mono-muted leading-relaxed">{review.text}</p>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 mt-3 text-xs text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Purchase
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-luxury-line dark:border-mono-line">
            <h2 className="text-3xl font-display mb-10 text-center">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
