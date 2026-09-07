const CART_KEY = 'shophub_cart_v1';

export const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCartToStorage = (cartState) => {
  try {
    const { items, promoCode, promoDiscount, promoType } = cartState;
    localStorage.setItem(
      CART_KEY,
      JSON.stringify({ items, promoCode, promoDiscount, promoType })
    );
  } catch {
    /* ignore quota errors */
  }
};

export const clearCartStorage = () => localStorage.removeItem(CART_KEY);
