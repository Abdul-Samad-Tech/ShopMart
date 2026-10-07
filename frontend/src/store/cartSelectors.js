import { createSelector } from '@reduxjs/toolkit';

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 9.99;
const TAX_RATE = 0.1;

const selectCart = (state) => state.cart;

export const selectCartItems = createSelector(selectCart, (cart) => cart.items);

export const selectCartDrawerOpen = createSelector(selectCart, (cart) => cart.isDrawerOpen);

export const selectCartTotals = createSelector(selectCart, (cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (cart.promoCode && cart.promoDiscount > 0) {
    if (cart.promoType === 'percent') {
      discountAmount = (subtotal * cart.promoDiscount) / 100;
    } else {
      discountAmount = cart.promoDiscount;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = afterDiscount === 0 ? 0 : afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + shipping + tax;
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

  return {
    subtotal,
    quantity,
    discountAmount,
    afterDiscount,
    shipping,
    tax,
    total,
    freeShipping: shipping === 0 && afterDiscount > 0,
    amountUntilFreeShipping,
    promoCode: cart.promoCode,
    promoError: cart.promoError,
  };
});
