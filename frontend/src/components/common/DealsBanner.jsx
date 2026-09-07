import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const deals = [
  {
    id: 1,
    text: 'Free delivery on orders over $50',
    link: '/products',
  },
  {
    id: 2,
    text: 'Weekly deals — save up to 40% in-store & online',
    link: '/products?sale=true',
  },
  {
    id: 3,
    text: 'Fresh produce restocked daily — shop now',
    link: '/products',
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
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden bg-mart-green text-white"
        >
          <div className="container-premium relative flex items-center justify-center min-h-[36px] py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDeal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center pr-8"
              >
                <Link
                  to={currentDeal.link}
                  className="text-[11px] md:text-xs font-semibold tracking-wide hover:text-mart-accent transition-colors"
                >
                  {currentDeal.text}
                </Link>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute right-2 md:right-4 p-1 text-white/70 hover:text-white"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DealsBanner;
