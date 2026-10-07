import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { toggleWishlistLocal, selectIsWishlisted } from '../store/wishlistSlice';
import { toggleWishlistItem } from '../store/userSlice';

export const useOptimisticWishlist = (productId) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const inWishlist = useSelector(selectIsWishlisted(productId));

  const toggle = useCallback(
    async (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      const wasIn = inWishlist;
      dispatch(toggleWishlistLocal(productId));

      if (!isAuthenticated) {
        toast.success(wasIn ? 'Removed from wishlist' : 'Saved to wishlist');
        return;
      }

      try {
        await dispatch(toggleWishlistItem(productId)).unwrap();
        toast.success(wasIn ? 'Removed from wishlist' : 'Saved to wishlist');
      } catch {
        dispatch(toggleWishlistLocal(productId));
        toast.error('Could not update wishlist');
      }
    },
    [dispatch, productId, isAuthenticated, inWishlist]
  );

  return { inWishlist, toggle };
};

export default useOptimisticWishlist;
