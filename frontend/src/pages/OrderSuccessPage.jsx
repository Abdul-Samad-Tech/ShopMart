import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';
import Loader from '../components/common/Loader';
import RippleButton from '../animations/RippleButton';
import {
  downloadOrderInvoicePdf,
  formatMoney,
  formatOrderDate,
  formatOrderId,
  formatPaymentMethod,
  printOrderInvoice,
} from '../utils/order-invoice';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const email = location.state?.email || searchParams.get('email') || '';

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder && !order) {
      try {
        const parsedOrder = JSON.parse(lastOrder);
        setOrder(parsedOrder);
        setLoading(false);
        localStorage.removeItem('lastOrder');
        return;
      } catch {
        setError('Could not restore order details');
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

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      printOrderInvoice(order);
    } finally {
      setTimeout(() => setIsPrinting(false), 400);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadOrderInvoicePdf(order);
      toast.success('Invoice downloaded');
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <Loader label="Loading your order" fullScreen />;

  if (error || !order) {
    return (
      <div className="page-shell">
        <PageHeader
          title="Order"
          subtitle="Confirmation"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Order' }]}
        />
        <div className="container-premium py-20 text-center">
          <p className="text-luxury-muted dark:text-neutral-400 mb-6">{error || 'Order not found'}</p>
          <Link to="/products" className="btn-premium">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderId = formatOrderId(order);
  const shipping = order.shipping || {};
  const customerEmail = order.guestEmail || shipping.email || email;
  const whatsappText = encodeURIComponent(
    `Hi ShopMart, I placed order ${orderId}. Total: ${formatMoney(order.total)}. Please confirm delivery time.`
  );

  return (
    <div className="page-shell bg-gradient-subtle">
      <div className="print:hidden">
        <PageHeader
          title="Payment successful"
          subtitle="Thank you — your order is confirmed"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Order confirmed' }]}
        />
      </div>

      <div className="container-premium py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 lg:p-10 text-center mb-8 print:hidden"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mart-green/15 flex items-center justify-center text-3xl text-mart-green">
            ✓
          </div>
          <h2 className="font-display text-3xl mb-2 text-luxury-charcoal dark:text-white">
            You&apos;re all set!
          </h2>
          <p className="text-luxury-muted dark:text-neutral-400 text-sm mb-1">
            Order {orderId} · Confirmation sent to{' '}
            <span className="font-medium text-luxury-charcoal dark:text-white">
              {customerEmail}
            </span>
          </p>
          <p className="text-2xl font-display font-semibold text-mart-green mt-4">
            {formatMoney(order.total)}
          </p>
          <p className="text-xs uppercase tracking-wide text-luxury-muted dark:text-neutral-500 mt-1">
            {formatPaymentMethod(order.paymentMethod)}
          </p>
        </motion.div>

        <div className="card-premium p-6 lg:p-8 mb-8 print:hidden">
          <h3 className="font-display text-lg mb-6 text-luxury-charcoal dark:text-white">Order status</h3>
          <OrderStatusStepper status={order.status || 'processing'} />
        </div>

        <div
          id="order-invoice-print"
          className="card-premium p-6 lg:p-8 mb-8 invoice-print-surface"
        >
          <div className="flex items-start justify-between gap-4 border-b border-mart-green/20 pb-4 mb-5">
            <div>
              <p className="text-mart-green font-display text-2xl font-bold">ShopMart</p>
              <p className="text-xs text-luxury-muted mt-1">Invoice / Payment Receipt</p>
            </div>
            <div className="text-right text-sm text-luxury-muted">
              <p className="font-semibold text-luxury-charcoal dark:text-white">Invoice {orderId}</p>
              <p>{formatOrderDate(order)}</p>
              <p className="capitalize">{order.status || 'processing'}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="rounded-xl bg-mart-soft/80 p-4">
              <p className="text-[11px] uppercase tracking-wider text-mart-green font-bold mb-2">Bill to</p>
              <p className="font-medium text-luxury-charcoal dark:text-white">
                {[shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || 'Customer'}
              </p>
              <p className="text-luxury-muted">{customerEmail}</p>
              {shipping.phone ? <p className="text-luxury-muted">{shipping.phone}</p> : null}
              <p className="text-luxury-muted mt-1">
                {[shipping.address, shipping.city, shipping.state, shipping.zipCode, shipping.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-[11px] uppercase tracking-wider text-mart-orange font-bold mb-2">Payment</p>
              <p className="text-luxury-charcoal dark:text-white">{formatPaymentMethod(order.paymentMethod)}</p>
              <p className="text-luxury-muted mt-2">Subtotal: {formatMoney(order.subtotal ?? order.total)}</p>
              <p className="text-luxury-muted">Discount: {formatMoney(order.discount)}</p>
              <p className="text-luxury-muted">Shipping: {formatMoney(order.shippingCost)}</p>
              <p className="text-luxury-muted">Tax: {formatMoney(order.tax)}</p>
              <p className="text-lg font-display font-semibold text-mart-green mt-2">
                Total: {formatMoney(order.total)}
              </p>
            </div>
          </div>

          <h3 className="font-display text-lg mb-3 text-luxury-charcoal dark:text-white">Items</h3>
          <ul className="space-y-3">
            {(order.items || []).map((item, i) => (
              <li key={item.product || i} className="flex gap-3 items-center text-sm border-b border-luxury-line/60 pb-3 last:border-0">
                {item.image ? (
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 print:hidden" />
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-luxury-charcoal dark:text-white">{item.name}</p>
                  <p className="text-luxury-muted dark:text-neutral-400 text-xs">
                    Qty {item.quantity} · {formatMoney(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-luxury-charcoal dark:text-white">
                  {formatMoney((item.price || 0) * (item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 bg-mart-green hover:bg-mart-green-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download Invoice'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="inline-flex items-center justify-center gap-2 bg-white border border-luxury-line hover:border-mart-green/40 text-luxury-charcoal font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Printer className="w-5 h-5" />
            {isPrinting ? 'Printing...' : 'Print Invoice'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mart text-center"
          >
            WhatsApp support
          </a>
          <Link to="/products">
            <RippleButton magnetic variantClass="btn-outline w-full sm:w-auto dark:text-white dark:border-white/20">
              Continue shopping
            </RippleButton>
          </Link>
          {!order.user && (
            <Link to="/register" className="btn-premium text-center">
              Create free account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
