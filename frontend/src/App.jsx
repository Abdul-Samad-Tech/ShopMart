import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import DealsBanner from './components/common/DealsBanner';
import CartDrawer from './components/cart/CartDrawer';
import AppBootstrap from './components/layout/AppBootstrap';
import AnimatedMain from './components/layout/AnimatedMain';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminPromoCodes from './pages/admin/AdminPromoCodes';
import AdminGiftCards from './pages/admin/AdminGiftCards';
import AdminLoyaltyCards from './pages/admin/AdminLoyaltyCards';
import AdminCareers from './pages/admin/AdminCareers';
import AdminPageContent from './pages/admin/AdminPageContent';
import AdminCategories from './pages/admin/AdminCategories';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import OurBrands from './pages/OurBrands';
import StoreLocator from './pages/StoreLocator';
import Blog from './pages/Blog';
import LoyaltyProgram from './pages/LoyaltyProgram';
import ReturnPolicy from './pages/ReturnPolicy';
import Careers from './pages/Careers';
import EventGallery from './pages/EventGallery';
import GiftCards from './pages/GiftCards';
import CSR from './pages/CSR';
import SupplierForm from './pages/SupplierForm';
import OrderThankYouPage from './pages/OrderThankYouPage';
import ChatWidget from './components/chat/ChatWidget';
import QuickViewModal from './components/product/QuickViewModal';
import CommandPalette from './components/command/CommandPalette';
import OrderSuccessPage from './pages/OrderSuccessPage';
import GhostCartPage from './pages/GhostCartPage';
import { restoreSession, logout } from './store/authSlice';
import { fetchDashboard } from './store/userSlice';
import { setWishlistIds } from './store/wishlistSlice';

const AppLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideChrome =
    ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'].includes(location.pathname) || location.pathname.startsWith('/admin');

  useEffect(() => {
    localStorage.removeItem('token');
    dispatch(restoreSession())
      .unwrap()
      .then(() => {
        dispatch(fetchDashboard()).then((result) => {
          if (result.payload?.wishlist) {
            dispatch(setWishlistIds(result.payload.wishlist));
          }
        });
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {!hideChrome && <DealsBanner />}
      {!hideChrome && <Navbar />}
      <AnimatedMain>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/shared/:token" element={<GhostCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/success/:id" element={<OrderSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/brands" element={<OurBrands />} />
        <Route path="/stores" element={<StoreLocator />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/loyalty" element={<LoyaltyProgram />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/events" element={<EventGallery />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/csr" element={<CSR />} />
        <Route path="/supplier-form" element={<SupplierForm />} />
        <Route path="/order/thank-you/:orderId" element={<OrderThankYouPage />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="promo-codes" element={<AdminPromoCodes />} />
            <Route path="gift-cards" element={<AdminGiftCards />} />
            <Route path="loyalty-cards" element={<AdminLoyaltyCards />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="page-content" element={<AdminPageContent />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Route>
      </AnimatedMain>
      {!hideChrome && <Footer />}
      {!hideChrome && <ChatWidget />}
      {!hideChrome && <QuickViewModal />}
      {!hideChrome && <CommandPalette />}
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppBootstrap>
        <AppLayout />
      </AppBootstrap>
    </Router>
  );
}

export default App;
