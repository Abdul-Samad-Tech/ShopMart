import { useCallback } from 'react';
import { useDispatch, useStore } from 'react-redux';
import toast from 'react-hot-toast';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  revertCartSnapshot,
} from '../store/cartSlice';
import { apiEndpoints } from '../services/api';

const captureSnapshot = (cart) => ({
  items: cart.items.map((i) => ({ ...i })),
  totalQuantity: cart.totalQuantity,
  totalAmount: cart.totalAmount,
});

const validateStock = async (productId, requestedQty) => {
  const { data } = await apiEndpoints.getProduct(productId);
  const product = data.data ?? data;
  if (product.stock != null && requestedQty > product.stock) {
    return { ok: false, stock: product.stock };
  }
  return { ok: true, stock: product.stock };
};

export const useOptimisticCart = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const addItem = useCallback(
    async (product, options = {}) => {
      const { quantity = 1, showToast = true } = options;
      const payload = { ...product, quantity };
      const snapshot = captureSnapshot(store.getState().cart);

      dispatch(addToCart({ ...payload, quantity }));

      const cartItem = store.getState().cart.items.find((i) => i.id === product.id);
      const newQty = cartItem?.quantity ?? quantity;

      try {
        const result = await validateStock(product.id, newQty);
        if (!result.ok) {
          dispatch(revertCartSnapshot(snapshot));
          toast.error(
            result.stock === 0
              ? `${product.name} is out of stock`
              : `Only ${result.stock} left in stock`
          );
          return false;
        }
        if (showToast) toast.success(`${product.name} added to cart`);
        return true;
      } catch {
        if (showToast) toast.success(`${product.name} added to cart`);
        return true;
      }
    },
    [dispatch, store]
  );

  const removeItem = useCallback(
    async (id, options = {}) => {
      const { showToast = false } = options;
      const snapshot = captureSnapshot(store.getState().cart);
      const removed = snapshot.items.find((i) => i.id === id);

      dispatch(removeFromCart(id));

      if (!removed) return true;

      try {
        await validateStock(id, 0);
        if (showToast) toast.success('Removed from cart');
        return true;
      } catch {
        if (showToast) toast.success('Removed from cart');
        return true;
      }
    },
    [dispatch, store]
  );

  const setQuantity = useCallback(
    async (id, quantity, options = {}) => {
      if (quantity < 1) return removeItem(id, options);

      const snapshot = captureSnapshot(store.getState().cart);
      const item = snapshot.items.find((i) => i.id === id);

      dispatch(updateQuantity({ id, quantity }));

      if (!item) return true;

      try {
        const result = await validateStock(id, quantity);
        if (!result.ok) {
          dispatch(revertCartSnapshot(snapshot));
          toast.error(
            result.stock === 0 ? 'Item is out of stock' : `Only ${result.stock} available`
          );
          return false;
        }
        return true;
      } catch {
        return true;
      }
    },
    [dispatch, store, removeItem]
  );

  return { addItem, removeItem, setQuantity };
};

export default useOptimisticCart;
