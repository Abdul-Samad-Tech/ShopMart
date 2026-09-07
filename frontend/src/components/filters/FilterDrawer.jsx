import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductFilters from '../filters/ProductFilters';

const FilterDrawer = ({ open, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed left-0 top-0 h-[100dvh] w-full max-w-sm glass-panel glass-panel-drawer border-r border-white/10 z-[70] flex flex-col min-h-0 lg:hidden"
            role="dialog"
            aria-label="Product filters"
          >
            <div className="flex items-center justify-between p-5 border-b border-luxury-line dark:border-white/10 shrink-0">
              <div>
                <p className="text-xs uppercase tracking-luxury text-gold-600 dark:text-gold-400 font-semibold">
                  Refine
                </p>
                <h2 className="font-display text-lg text-luxury-charcoal dark:text-white">Filters</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full hover:bg-luxury-ivory dark:hover:bg-white/10 text-luxury-charcoal dark:text-white"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5">
              <ProductFilters compact onFilterChange={onClose} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
