import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const deals = [
  {
    id: 1,
    text: '🎉 FREE SHIPPING on orders over $50',
    link: '/products',
    bg: 'from-purple-600 to-pink-600',
  },
  {
    id: 2,
    text: '🔥 FLASH SALE: Up to 40% OFF on selected items',
    link: '/products?sale=true',
    bg: 'from-orange-500 to-red-600',
  },
  {
    id: 3,
    text: '💎 NEW ARRIVALS: Shop the latest collection',
    link: '/products?new=true',
    bg: 'from-blue-600 to-cyan-500',
  },
];

const DealsBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentDeal = deals[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${currentDeal.bg} text-white py-3 px-4`}>
            <div className="container-premium flex items-center justify-center gap-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-semibold text-center"
                >
                  {currentDeal.text}
                </motion.p>
              </AnimatePresence>
              <Link
                to={currentDeal.link}
                className="text-xs font-bold uppercase tracking-wide bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition-colors"
              >
                Shop Now
              </Link>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              key={currentIndex}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-white/60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DealsBanner;
