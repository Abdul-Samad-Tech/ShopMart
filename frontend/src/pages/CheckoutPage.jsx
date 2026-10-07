import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import FormField from '../components/ui/FormField';
import OrderSummary from '../components/cart/OrderSummary';
import MotionSection from '../components/ui/MotionSection';
import { apiEndpoints } from '../services/api';
import { clearCart } from '../store/cartSlice';
import { addLocalNotification } from '../store/notificationSlice';
import { selectCartItems, selectCartTotals } from '../store/cartSelectors';
import { formatPrice } from '../utils/helpers';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  paymentMethod: 'cod',
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (authUser) {
      const [firstName = '', ...rest] = (authUser.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName: rest.join(' '),
        email: authUser.email || prev.email,
      }));

      // Fetch loyalty card
      apiEndpoints.getMyLoyaltyCard()
        .then((res) => setLoyaltyCard(res.data))
        .catch(() => setLoyaltyCard(null));
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Show bank details for card/easypaisa/jazzcash/sadapay
    if (name === 'paymentMethod') {
      setShowBankDetails(['card', 'easypaisa', 'jazzcash', 'sadapay'].includes(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone?.trim()) {
      toast.error('Phone number is required');
      return;
    }

    // Check if using loyalty points
    if (useLoyaltyPoints) {
      if (!loyaltyCard || !loyaltyCard.isActive) {
        toast.error('Loyalty card is not active');
        return;
      }
      if (loyaltyCard.pointsBalance < totals.total) {
        toast.error('Insufficient loyalty points balance');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await apiEndpoints.createOrder({
        items: items.map((i) => ({
          product: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        shipping: formData,
        paymentMethod: useLoyaltyPoints ? 'loyalty_points' : formData.paymentMethod,
        promoCode: totals.promoCode,
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        shippingCost: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        useLoyaltyPoints,
        loyaltyPointsToRedeem: useLoyaltyPoints ? Math.floor(totals.total) : 0,
      });

      const order = response.data || response;
      
      if (!order) {
        toast.error('Failed to create order');
        return;
      }
      
      dispatch(clearCart());

      toast.success('Order placed successfully', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#146B45',
          color: '#F4F1EA',
          padding: '16px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '500',
        },
      });

      if (isAuthenticated) {
        dispatch(
          addLocalNotification({
            type: 'order',
            title: 'Order confirmed',
            message: `Total charged: PKR ${totals.total.toFixed(2)}`,
            link: '/dashboard',
          })
        );
      }

      // Navigate to order success page with order data
      const orderId = order.orderId || order._id || order.id;
      // Store order in localStorage for reliability
      localStorage.setItem('lastOrder', JSON.stringify(order));
      navigate(`/order/success/${orderId}`, { state: { order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate('/cart');
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="page-shell bg-surface">
      <PageHeader
        title="Checkout"
        subtitle="Secure, encrypted checkout"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/cart' }, { label: 'Checkout' }]}
      />

      <div className="container-premium py-12">
        {!isAuthenticated && (
          <div className="mb-8 p-4 rounded-xl border border-brand/30 bg-brand/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-ink dark:text-neutral-200">
              Checking out as guest — no account needed.{' '}
              <Link to="/login" className="text-brand font-semibold hover:underline">
                Sign in
              </Link>{' '}
              to save order history.
            </p>
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-10">
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-8"
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            <div className="card p-8 lg:p-10 border-l-4 border-l-brand">
              <h2 className="font-display text-2xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Contact
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="card p-8 lg:p-10 border-l-4 border-l-accent">
              <h2 className="font-display text-2xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Shipping
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  autoComplete="street-address"
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField label="City" name="city" value={formData.city} onChange={handleChange} required autoComplete="address-level2" />
                  <FormField label="State" name="state" value={formData.state} onChange={handleChange} autoComplete="address-level1" />
                  <FormField label="ZIP" name="zipCode" value={formData.zipCode} onChange={handleChange} autoComplete="postal-code" />
                </div>
                <FormField label="Country" name="country" value={formData.country} onChange={handleChange} required autoComplete="country-name" />
              </div>
            </div>

            <div className="card p-8 lg:p-10">
              <h2 className="font-display text-2xl mb-2">Payment</h2>
              <p className="text-xs text-ink-muted mb-4">Secure checkout — popular options in Pakistan</p>

              {/* Loyalty Points Option */}
              {isAuthenticated && loyaltyCard && loyaltyCard.isActive && (
                <div className="mb-6 p-4 bg-gradient-to-r from-brand to-brand dark:from-brand/20 dark:to-brand/20 rounded-xl border border-brand dark:border-brand">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="useLoyaltyPoints"
                        checked={useLoyaltyPoints}
                        onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                        className="w-5 h-5 text-brand rounded"
                      />
                      <label htmlFor="useLoyaltyPoints" className="font-semibold text-brand dark:text-brand">
                        Pay with Loyalty Points
                      </label>
                    </div>
                    <span className="text-sm font-bold text-brand dark:text-brand">
                      {loyaltyCard.pointsBalance} pts
                    </span>
                  </div>
                  <p className="text-xs text-brand dark:text-brand">
                    1 point = PKR 1. You need {Math.floor(totals.total)} points for this order.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { id: 'cod', label: 'Cash on Delivery', badge: 'COD' },
                  { id: 'card', label: 'Debit / Credit Card', badge: 'Visa' },
                  { id: 'easypaisa', label: 'Easypaisa', badge: 'EP' },
                  { id: 'jazzcash', label: 'JazzCash', badge: 'JC' },
                  { id: 'sadapay', label: 'SadaPay', badge: 'SP' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === m.id
                        ? 'border-brand bg-brand/10 ring-2 ring-brand dark:bg-brand/30'
                        : 'border-line hover:border-brand'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={formData.paymentMethod === m.id}
                      onChange={handleChange}
                      className="text-brand"
                    />
                    <span className="w-7 h-7 rounded-md bg-chrome text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {m.badge}
                    </span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
              
              {showBankDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-line space-y-4"
                >
                  <h3 className="font-semibold text-sm text-ink dark:text-white">
                    {formData.paymentMethod === 'card' ? 'Card Details' : 'Account Details'}
                  </h3>
                  
                  {formData.paymentMethod === 'card' ? (
                    <>
                      <FormField
                        label="Card Number"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber || ''}
                        onChange={handleChange}
                        required
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          label="Expiry Date"
                          name="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry || ''}
                          onChange={handleChange}
                          required
                        />
                        <FormField
                          label="CVV"
                          name="cardCvv"
                          type="text"
                          placeholder="123"
                          value={formData.cardCvv || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <FormField
                        label="Cardholder Name"
                        name="cardHolder"
                        type="text"
                        placeholder="Name on card"
                        value={formData.cardHolder || ''}
                        onChange={handleChange}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        label="Account Number"
                        name="accountNumber"
                        type="text"
                        placeholder="Enter your account number"
                        value={formData.accountNumber || ''}
                        onChange={handleChange}
                        required
                      />
                      <FormField
                        label="Account Holder Name"
                        name="accountHolder"
                        type="text"
                        placeholder="Account holder name"
                        value={formData.accountHolder || ''}
                        onChange={handleChange}
                        required
                      />
                    </>
                  )}
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                {['Visa', 'Mastercard', 'COD', 'Easypaisa', 'JazzCash'].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-surface-raised dark:bg-white/10 text-ink-muted"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full !py-4 text-base">
              {submitting ? 'Processing…' : `Place Order — ${formatPrice(totals.total)}`}
            </button>
          </motion.form>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-28 h-fit"
          >
            <MotionSection variant="scale" className="card p-6 lg:p-8">
              <h2 className="font-display text-xl mb-4">Your Order</h2>
              <div className="space-y-3 mb-6 max-h-52 overflow-y-auto text-sm pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} alt="" className="w-14 h-14 rounded-xl object-cover shadow-rest" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-ink-muted text-xs">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <OrderSummary showPromo />
              <Link to="/cart" className="text-sm text-brand block mt-4 hover:underline">
                ← Edit bag
              </Link>
            </MotionSection>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
