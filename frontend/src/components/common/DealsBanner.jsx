import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const deals = [
  {
    id: 1,
    text: 'Free shipping on orders over Rs. 50',
    link: '/products',
  },
  {
    id: 2,
    text: 'Flash sale: up to 40% off selected items',
    link: '/products?sale=true',
  },
  {
    id: 3,
    text: 'New arrivals: shop the latest collection',
    link: '/products?new=true',
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
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
        >
          <div className="bg-brand text-white py-3 px-4">
            <div className="container-premium flex items-center justify-center gap-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm font-semibold text-center"
                >
                  {currentDeal.text}
                </motion.p>
              </AnimatePresence>
              <Link
                to={currentDeal.link}
                className="inline-flex items-center min-h-11 text-xs font-bold uppercase tracking-wide bg-white/15 hover:bg-white/25 px-4 rounded-md transition-colors"
              >
                Shop Now
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-11 min-h-11 inline-flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
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
