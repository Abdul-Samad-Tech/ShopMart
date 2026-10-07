import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useOptimisticCart from '../../hooks/useOptimisticCart';

const AddToCartButton = ({
  product,
  className = '',
  size = 'sm',
  showToast = true,
}) => {
  const { addItem } = useOptimisticCart();
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);

  const sizeClass =
    size === 'lg'
      ? 'py-3.5 px-6 text-sm'
      : 'py-3 px-4 text-xs';

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setAdded(true);
      setPending(true);
      addItem(product, { quantity: 1, showToast }).then((ok) => {
        if (!ok) setAdded(false);
        else setTimeout(() => setAdded(false), 1800);
      }).finally(() => setPending(false));
    },
    [addItem, product, showToast]
  );

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={pending}
      whileTap={{ scale: 0.95 }}
      animate={added ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      className={`rounded-full font-semibold uppercase tracking-wide transition-colors ${sizeClass} ${
        added
          ? 'bg-mart-green text-white'
          : 'bg-white/95 dark:bg-white/10 backdrop-blur text-luxury-charcoal dark:text-white border border-white/20 hover:bg-white dark:hover:bg-white/20'
      } ${className}`}
    >
      {added ? 'Added!' : 'Add to Cart'}
    </motion.button>
  );
};

export default AddToCartButton;
