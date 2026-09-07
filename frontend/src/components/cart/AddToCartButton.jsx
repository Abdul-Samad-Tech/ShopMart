import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import useOptimisticCart from '../../hooks/useOptimisticCart';

const AddToCartButton = ({
  product,
  className = '',
  size = 'sm',
  showToast = true,
  label,
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
      if (pending) return;
      setPending(true);
      addItem(product, { quantity: 1, showToast })
        .then((ok) => {
          if (!ok) return;
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        })
        .finally(() => setPending(false));
    },
    [addItem, pending, product, showToast]
  );

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={pending || added}
      whileTap={{ scale: 0.97 }}
      animate={added ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-colors disabled:cursor-wait ${sizeClass} ${
        added
          ? 'bg-mart-green text-white'
          : pending
            ? 'bg-mart-green/80 text-white'
            : 'bg-white/95 text-mart-ink border border-white/30 hover:bg-white shadow-lg'
      } ${className}`}
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Adding...
        </>
      ) : added ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Added
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" />
          {label || 'Add to Cart'}
        </>
      )}
    </motion.button>
  );
};

export default AddToCartButton;
