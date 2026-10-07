import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeQuickView } from '../../store/uiSlice';
import AddToCartButton from '../cart/AddToCartButton';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.ui.quickViewProduct);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') dispatch(closeQuickView());
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, dispatch]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeQuickView())}
            className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Quick view"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-[1200px] max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
            <button
              type="button"
              onClick={() => dispatch(closeQuickView())}
              className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl backdrop-blur-md transition-all duration-300 hover:scale-110"
              aria-label="Close"
            >
              ×
            </button>
            <div className="grid md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 min-h-[400px] md:min-h-[500px] flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                  alt={product.name}
                  className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl"
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg"
                  >
                    {product.discount}% OFF
                  </motion.span>
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
                {product.category && (
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400 mb-4"
                  >
                    {product.category}
                  </motion.p>
                )}
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6"
                >
                  {product.name}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="flex text-yellow-400 text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 0.4 + i * 0.1 }}
                        className={i < Math.floor(product.rating || 4) ? '' : 'opacity-30'}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">
                    ({product.reviews || 0} reviews)
                  </span>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base text-slate-300 mb-8 flex-1 leading-relaxed"
                >
                  {product.description || 'Quality product available for fast delivery.'}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-baseline gap-4 mb-8"
                >
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 mt-auto"
                >
                  <AddToCartButton product={product} size="lg" className="flex-1 min-w-[180px] text-base py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30" />
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => dispatch(closeQuickView())}
                    className="flex-1 text-center border-2 border-slate-600 text-white rounded-xl min-w-[180px] py-4 hover:bg-slate-700 transition-all duration-300 font-semibold"
                  >
                    Full Details
                  </Link>
                </motion.div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
