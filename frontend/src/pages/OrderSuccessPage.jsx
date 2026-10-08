import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiEndpoints } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Loader from '../components/common/Loader';
import ReceiptPrinter from '../components/order/ReceiptPrinter';
import { formatPrice } from '../utils/helpers';

const formatOrderId = (order) => {
  const id = order?.orderId || order?.id || order?._id;
  return id ? `#${String(id)}` : '#------';
};

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const branding = useSelector((state) => state.site.site?.branding);
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);
  const [showReceipt, setShowReceipt] = useState(true);

  const email = location.state?.email || searchParams.get('email') || order?.guestEmail || order?.shipping?.email || '';

  useEffect(() => {
    // First try to get order from localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder && !order) {
      try {
        const parsedOrder = JSON.parse(lastOrder);
        setOrder(parsedOrder);
        setLoading(false);
        localStorage.removeItem('lastOrder');
        return;
      } catch (err) {
        console.error('Failed to parse order from localStorage:', err);
      }
    }

    if (order || !id || !email) {
      if (!order && !email) setError('Order details unavailable. Check your confirmation email.');
      setLoading(false);
      return;
    }

    apiEndpoints
      .trackOrder(id, email)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load order'))
      .finally(() => setLoading(false));
  }, [id, email, order]);

  if (loading) return <Loader label="Generating your receipt" fullScreen />;

  if (error || !order) {
    return (
      <div className="page-shell">
        <PageHeader
          title="Order"
          subtitle="Confirmation"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Order' }]}
        />
        <div className="container-premium py-20 text-center">
          <p className="text-ink-muted mb-6">{error || 'Unable to load your receipt.'}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
              Try again
            </button>
            <Link to="/dashboard" className="btn-secondary">View orders</Link>
            <Link to="/products" className="btn-primary">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (showReceipt) {
    return <ReceiptPrinter order={order} branding={branding} onClose={() => setShowReceipt(false)} />;
  }

  return (
    <div className="page-shell bg-surface">
      <PageHeader
        title="Order confirmed"
        subtitle="Your receipt is saved with this order"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Order confirmed' }]}
      />
      <div className="container-premium py-12 max-w-xl text-center">
        <p className="font-display text-3xl mb-2">{formatOrderId(order)}</p>
        <p className="text-2xl font-semibold text-brand mb-6">{formatPrice(order.total)}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn-primary" onClick={() => setShowReceipt(true)}>
            View receipt
          </button>
          <Link to="/products" className="btn-secondary">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
