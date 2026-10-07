import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import { closeCartDrawer, clearCart } from '../../store/cartSlice';
import { selectCartDrawerOpen, selectCartItems } from '../../store/cartSelectors';
import SmartBudgetSlider from './SmartBudgetSlider';
import GhostCartShare from './GhostCartShare';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartDrawerOpen);
  const items = useSelector(selectCartItems);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') dispatch(closeCartDrawer());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md glass-panel glass-panel-drawer border-l border-white/10 shadow-rest-lg z-[70] flex flex-col min-h-0"
            role="dialog"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between p-6 border-b border-line dark:border-white/10 shrink-0">
              <div>
                <p className="text-xs uppercase tracking-wide text-accent dark:text-accent font-semibold">
                  Your bag
                </p>
                <h2 className="font-display text-xl text-ink dark:text-white">
                  {items.length} products
                </h2>
              </div>
              <button
                type="button"
                onClick={() => dispatch(closeCartDrawer())}
                className="p-2.5 rounded-full hover:bg-surface-raised dark:hover:bg-white/10 text-ink dark:text-white"
                aria-label="Close bag"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 min-h-[40vh]">
                    <p className="font-display text-xl mb-2 text-ink dark:text-white">Your bag is empty</p>
                    <p className="text-sm text-ink-muted dark:text-neutral-400 mb-6">
                      Discover pieces crafted for you.
                    </p>
                    <Link to="/products" onClick={() => dispatch(closeCartDrawer())} className="btn-primary">
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  items.map((item) => <CartItem key={item.id} item={item} />)
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-line dark:border-white/10 p-6 space-y-4 bg-white/50 dark:bg-surface-raised/80">
                  <SmartBudgetSlider />
                  <GhostCartShare items={items} />
                  <OrderSummary
                    compact
                    onCheckout={() => {
                      dispatch(closeCartDrawer());
                      navigate('/checkout');
                    }}
                  />
                  <div className="flex gap-2 pb-2">
                    <Link
                      to="/cart"
                      onClick={() => dispatch(closeCartDrawer())}
                      className="btn-secondary flex-1 text-center !text-xs dark:text-white dark:border-white/20 dark:bg-white/5"
                    >
                      View bag
                    </Link>
                    <button
                      type="button"
                      onClick={() => dispatch(clearCart())}
                      className="btn-secondary flex-1 !text-xs dark:text-white dark:border-white/20 dark:bg-white/5"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
