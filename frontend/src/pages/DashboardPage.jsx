import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDashboard } from '../store/userSlice';
import { signOut } from '../store/authSlice';
import { apiEndpoints } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Loader from '../components/common/Loader';
import ProductCard from '../components/common/ProductCard';
import EditProfilePanel from '../components/dashboard/EditProfilePanel';
import MotionSection from '../components/ui/MotionSection';
import { listItemReveal } from '../animations/motionPresets';
import { formatPrice } from '../utils/helpers';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { orders, activity, wishlist, dashboardLoading } = useSelector((state) => state.user);
  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [giftCards, setGiftCards] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);

  const toggleLoyaltyCard = async (cardId, newStatus) => {
    try {
      await apiEndpoints.updateMyLoyaltyCard(cardId, { isActive: newStatus });
      setLoyaltyCard(prev => ({ ...prev, isActive: newStatus }));
    } catch (err) {
      console.error('Failed to toggle loyalty card:', err);
      alert('Failed to update loyalty card status');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchDashboard());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingReviews(true);
      apiEndpoints.getMyReviews()
        .then((res) => setMyReviews(res.data))
        .catch(() => setMyReviews([]))
        .finally(() => setLoadingReviews(false));
      
      // Fetch loyalty card, gift cards, and promo codes
      setLoadingRewards(true);
      Promise.all([
        apiEndpoints.getMyLoyaltyCard().catch(() => null),
        apiEndpoints.getMyGiftCards().catch(() => []),
        apiEndpoints.getPromoCodes().catch(() => [])
      ]).then(([loyaltyRes, giftCardsRes, promoCodesRes]) => {
        if (loyaltyRes?.data) setLoyaltyCard(loyaltyRes.data);
        if (giftCardsRes?.data) setGiftCards(giftCardsRes.data);
        if (promoCodesRes?.data) setPromoCodes(promoCodesRes.data);
      }).finally(() => setLoadingRewards(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  if (dashboardLoading) return <Loader label="Loading your dashboard" />;

  const stats = [
    { label: 'Orders', value: orders.length },
    { label: 'Wishlist', value: wishlist.length },
    { label: 'Reviews', value: myReviews.length },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Member'}`}
        subtitle="Your ShopMart account"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]}
      />

      <div className="container-premium py-12 space-y-12">
        <MotionSection variant="fadeUp">
          <EditProfilePanel />
        </MotionSection>

        {/* Rewards Section */}
        <MotionSection variant="fadeUp">
          <h2 className="font-display text-2xl mb-6">Rewards & Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Loyalty Card */}
            {loyaltyCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card p-6 bg-gradient-to-br from-brand to-brand text-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70 mb-1">Loyalty Card</p>
                    <p className="text-lg font-display font-semibold">{loyaltyCard.cardNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {loyaltyCard.tier}
                    </span>
                    <button
                      onClick={() => toggleLoyaltyCard(loyaltyCard._id, !loyaltyCard.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        loyaltyCard.isActive 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {loyaltyCard.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Points Balance</span>
                    <span className="font-semibold">{loyaltyCard.pointsBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Earned</span>
                    <span className="font-semibold">{loyaltyCard.totalEarned}</span>
                  </div>
                  {loyaltyCard.tierProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">Progress to {loyaltyCard.tierProgress.nextTier}</span>
                        <span>{loyaltyCard.tierProgress.currentTierPoints}/{loyaltyCard.tierProgress.nextTierPoints}</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${(loyaltyCard.tierProgress.currentTierPoints / loyaltyCard.tierProgress.nextTierPoints) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Gift Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">Gift Cards</p>
              <p className="text-3xl font-display font-semibold mb-2">{giftCards.length}</p>
              <p className="text-sm text-ink-muted">
                Total Balance: PKR {giftCards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
              </p>
              {giftCards.length > 0 && (
                <Link to="/gift-cards" className="text-brand text-sm mt-2 inline-block hover:underline">
                  View all →
                </Link>
              )}
            </motion.div>

            {/* Promo Codes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">Available Promo Codes</p>
              <p className="text-3xl font-display font-semibold mb-2">{promoCodes.length}</p>
              <p className="text-sm text-ink-muted">
                Active codes you can use
              </p>
              {promoCodes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {promoCodes.slice(0, 2).map(code => (
                    <div key={code._id} className="text-xs bg-surface-raised dark:bg-white/10 px-2 py-1 rounded">
                      {code.code} - {code.discountType === 'percentage' ? code.discountValue + '%' : 'PKR ' + code.discountValue} off
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </MotionSection>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
              className="card p-6 hover:shadow-raised transition-shadow"
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">{s.label}</p>
              <p className="text-3xl font-display font-semibold truncate">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {wishlist.length > 0 && (
          <MotionSection variant="slideLeft">
            <h2 className="font-display text-2xl mb-6">Saved Items</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </MotionSection>
        )}

        <section className="grid lg:grid-cols-2 gap-8">
          <MotionSection variant="slideLeft" className="card p-6 lg:p-8">
            <h2 className="font-display text-xl mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No orders yet.{' '}
                <Link to="/products" className="text-brand underline">
                  Start shopping
                </Link>
              </p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order, i) => (
                  <motion.li
                    key={order.id}
                    custom={i}
                    variants={listItemReveal}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-line pb-4 text-sm"
                  >
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="font-medium">#{order.orderId || order.id?.slice(-6).toUpperCase()}</span>
                      <span className="capitalize text-ink-muted text-xs">{order.status}</span>
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                    </div>
                    <OrderStatusStepper status={order.status} />
                  </motion.li>
                ))}
              </ul>
            )}
          </MotionSection>

          <MotionSection variant="slideRight" className="card p-6 lg:p-8">
            <h2 className="font-display text-xl mb-4">Activity Log</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-ink-muted">No recent activity</p>
            ) : (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {activity.map((log, i) => (
                  <motion.li
                    key={log.id || log._id}
                    custom={i}
                    variants={listItemReveal}
                    initial="hidden"
                    animate="visible"
                    className="text-sm"
                  >
                    <span className="font-medium capitalize">{log.action?.replace(/_/g, ' ')}</span>
                    <span className="text-ink-muted block text-xs">{new Date(log.at).toLocaleString()}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </MotionSection>
        </section>

        {myReviews.length > 0 && (
          <MotionSection variant="fadeUp" className="card p-6 lg:p-8">
            <h2 className="font-display text-xl mb-4">My Reviews</h2>
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div key={review._id} className="border-b border-line pb-4 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link to={`/product/${review.product?._id}`} className="font-medium text-ink dark:text-white hover:text-brand">
                        {review.product?.name || 'Product'}
                      </Link>
                      <div className="flex text-accent mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'fill-line dark:fill-white/20'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-ink-muted mt-2">{review.text}</p>
                    </div>
                    <span className="text-xs text-ink-muted whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </MotionSection>
        )}

        <button
          type="button"
          onClick={() => {
            dispatch(signOut());
            navigate('/');
          }}
          className="btn-secondary"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
