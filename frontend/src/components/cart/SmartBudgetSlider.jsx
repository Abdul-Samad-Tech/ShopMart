import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setBudgetLimit } from '../../store/uiSlice';
import { removeFromCart, addToCart } from '../../store/cartSlice';
import { selectCartItems, selectCartTotals } from '../../store/cartSelectors';
import { apiEndpoints } from '../../services/api';

const FREE_SHIPPING = 50;

const SmartBudgetSlider = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const { subtotal } = useSelector(selectCartTotals);
  const budget = useSelector((state) => state.ui.budgetLimit);
  const [alternatives, setAlternatives] = useState([]);

  const maxBudget = useMemo(() => Math.max(100, Math.ceil(subtotal * 1.5)), [subtotal]);

  useEffect(() => {
    if (budget == null) dispatch(setBudgetLimit(Math.ceil(subtotal) || 50));
  }, [subtotal, budget, dispatch]);

  useEffect(() => {
    if (!items.length || budget == null || subtotal <= budget) {
      setAlternatives([]);
      return;
    }
    const top = [...items].sort((a, b) => b.price * b.quantity - a.price * a.quantity)[0];
    if (!top?.category) return;

    apiEndpoints
      .getProducts({ category: top.category, sort: 'price-low', limit: 6 })
      .then((res) => {
        const alts = (res.data.data || []).filter(
          (p) => p.id !== top.id && p.price < top.price
        );
        setAlternatives(alts.slice(0, 2).map((p) => ({ remove: top, add: p })));
      })
      .catch(() => setAlternatives([]));
  }, [items, budget, subtotal]);

  if (!items.length || budget == null) return null;

  const over = subtotal > budget;
  const savingsIfSwap = alternatives[0]
    ? alternatives[0].remove.price * alternatives[0].remove.quantity -
      alternatives[0].add.price * alternatives[0].remove.quantity
    : 0;
  const newTotalIfSwap = subtotal - savingsIfSwap;
  const getsFreeShipping = newTotalIfSwap >= FREE_SHIPPING;

  const applySwap = (remove, add) => {
    dispatch(removeFromCart(remove.id));
    dispatch(addToCart({ ...add, quantity: remove.quantity }));
  };

  return (
    <div className="rounded-xl border border-mart-orange/30 bg-mart-orange/5 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold uppercase tracking-wide text-mart-orange">Smart budget</p>
        <span className="text-sm font-semibold text-luxury-charcoal dark:text-white">${subtotal.toFixed(2)} / ${budget}</span>
      </div>
      <input
        type="range"
        min={10}
        max={maxBudget}
        step={5}
        value={budget}
        onChange={(e) => dispatch(setBudgetLimit(Number(e.target.value)))}
        className="w-full accent-mart-orange"
      />
      <AnimatePresence mode="wait">
        {over ? (
          <motion.div
            key="over"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 text-xs text-luxury-muted dark:text-mono-muted"
          >
            <p>
              You are <strong className="text-mart-orange">${(subtotal - budget).toFixed(2)}</strong> over budget.
            </p>
            {alternatives.map(({ remove, add }) => (
              <button
                key={add.id}
                type="button"
                onClick={() => applySwap(remove, add)}
                className="w-full text-left p-3 rounded-lg border border-luxury-line dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                <span className="text-luxury-charcoal dark:text-white font-medium block">
                  Swap {remove.name} → {add.name}
                </span>
                <span className="text-[10px] text-mart-green">
                  Save ${(remove.price - add.price).toFixed(2)}
                  {getsFreeShipping && ' · unlocks free delivery'}
                </span>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-mart-green font-medium"
          >
            Within budget{subtotal >= FREE_SHIPPING ? ' · free delivery unlocked' : ''}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBudgetSlider;
