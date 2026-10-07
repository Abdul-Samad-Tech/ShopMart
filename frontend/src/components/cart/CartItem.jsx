import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { removeItem, setQuantity } = useOptimisticCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex gap-4 md:gap-6 py-6 border-b border-line last:border-0"
    >
      <div className="w-24 h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-surface-raised shrink-0">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg text-ink dark:text-white truncate">{item.name}</h3>
          <p className="text-sm text-ink-muted dark:text-neutral-400 mt-0.5">{formatPrice(item.price)} each</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="inline-flex items-center rounded-xl border border-line dark:border-white/15 bg-surface dark:bg-white/5">
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-l-xl transition-colors text-ink dark:text-white"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-ink dark:text-white">{item.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-r-xl transition-colors text-ink dark:text-white"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-display text-lg font-semibold text-ink dark:text-white">{formatPrice(item.totalPrice)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-xs text-ink-muted hover:text-red-600 mt-1 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  function handleQuantityChange(newQuantity) {
    if (newQuantity >= 1) {
      setQuantity(item.id, newQuantity);
    }
  }
};

export default CartItem;
