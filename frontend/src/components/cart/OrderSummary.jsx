import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { applyPromoCode, removePromo } from '../../store/cartSlice';
import { selectCartTotals } from '../../store/cartSelectors';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OrderSummary = ({ onCheckout, showPromo = true, compact = false }) => {
  const dispatch = useDispatch();
  const totals = useSelector(selectCartTotals);
  const { promoLoading, promoError } = useSelector((state) => state.cart);

  const handlePromo = (e) => {
    e.preventDefault();
    const code = e.target.promo?.value?.trim();
    if (!code) return;
    dispatch(applyPromoCode(code))
      .unwrap()
      .then((data) => toast.success(data.label || 'Promo applied'))
      .catch(() => {});
  };

  if (totals.quantity === 0) return null;

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {showPromo && (
        <form onSubmit={handlePromo} className="flex gap-2">
          <input
            name="promo"
            type="text"
            placeholder="Promo code"
            defaultValue={totals.promoCode}
            className="input !py-2.5 flex-1 text-sm uppercase"
          />
          <button type="submit" disabled={promoLoading} className="btn-secondary !px-4 !py-2.5 !text-xs shrink-0">
            {promoLoading ? '...' : 'Apply'}
          </button>
        </form>
      )}
      {promoError && <p className="text-xs text-red-600">{promoError}</p>}
      {totals.promoCode && !promoError && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-accent font-medium">{totals.promoCode} applied</span>
          <button type="button" onClick={() => dispatch(removePromo())} className="text-ink-muted hover:underline">
            Remove
          </button>
        </div>
      )}

      <div className={`space-y-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex justify-between">
          <span className="text-ink-muted dark:text-neutral-400">Subtotal ({totals.quantity})</span>
          <span className="text-ink dark:text-white">{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="flex justify-between text-accent">
            <span>Discount</span>
            <span>−{formatPrice(totals.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-ink-muted dark:text-neutral-400">Shipping</span>
          <span className={totals.freeShipping ? 'text-accent font-medium' : ''}>
            {totals.shipping === 0 ? 'Complimentary' : formatPrice(totals.shipping)}
          </span>
        </div>
        {!totals.freeShipping && totals.afterDiscount > 0 && (
          <p className="text-[10px] text-ink-muted">
            Add {formatPrice(totals.amountUntilFreeShipping)} more for free shipping
          </p>
        )}
        <div className="flex justify-between">
          <span className="text-ink-muted dark:text-neutral-400">Estimated tax</span>
          <span className="text-ink dark:text-white">{formatPrice(totals.tax)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-line dark:border-white/10">
          <span className="font-display text-lg text-ink dark:text-white">Total</span>
          <span className="font-display text-2xl font-semibold text-ink dark:text-white">{formatPrice(totals.total)}</span>
        </div>
      </div>

      {onCheckout ? (
        <button type="button" onClick={onCheckout} className="btn-primary w-full">
          Checkout — {formatPrice(totals.total)}
        </button>
      ) : (
        <Link to="/checkout" className="btn-primary w-full block text-center">
          Checkout
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;
