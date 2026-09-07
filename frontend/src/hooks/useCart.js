import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import useOptimisticCart from './useOptimisticCart';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { addItem, removeItem, setQuantity } = useOptimisticCart();

  return {
    items,
    totalQuantity,
    totalAmount,
    addItem,
    removeItem,
    updateItemQuantity: setQuantity,
    clearCart: () => dispatch(clearCart()),
  };
};

export default useCart;
