import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer, CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { apiEndpoints } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';

const formatOrderId = (order) => {
  const id = order?.orderId || order?.id || order?._id;
  return id ? `#${String(id)}` : '#------';
};

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

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create a simple receipt content for PDF
      const receiptContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #146B45; text-align: center;">Order Receipt</h1>
          <div style="margin: 20px 0; padding: 15px; background: #F6F3EC; border-radius: 8px;">
            <p><strong>Order Number:</strong> ${formatOrderId(order)}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt || order.date).toLocaleDateString()}</p>
            <p><strong>Total:</strong> PKR ${Number(order.total).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.replace('_', ' ')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <h2 style="color: #1C1917; margin-top: 20px;">Order Items</h2>
          ${(order.items || []).map((item, index) => `
            <div style="margin: 10px 0; padding: 10px; border-bottom: 1px solid #E4DDD2;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: PKR ${Number(item.price).toFixed(2)}</p>
            </div>
          `).join('') || '<p>No items</p>'}
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #146B45;">
            <p style="text-align: center; color: #5C564E;">Thank you for shopping with ShopMart!</p>
          </div>
        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = receiptContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const opt = {
        margin: 10,
        filename: `Order_Receipt_${formatOrderId(order).replace('#', '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(element);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
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
          <p className="text-ink-muted dark:text-neutral-400 mb-6">{error || 'Order not found'}</p>
          <Link to="/products" className="btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderId = formatOrderId(order);
  const whatsappText = encodeURIComponent(
    `Hi ShopMart, I placed order ${orderId}. Total: ${formatPrice(order.total)}. Please confirm delivery time.`
  );

  return (
    <div className="page-shell bg-surface">
      <PageHeader
        title="Order confirmed"
        subtitle="Thank you — we're preparing your bag"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Order confirmed' }]}
      />

      <div className="container-premium py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 lg:p-10 text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/15 flex items-center justify-center text-brand">
            <CheckCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl mb-2 text-ink dark:text-white">
            You're all set!
          </h2>
          <p className="text-ink-muted dark:text-neutral-400 text-sm mb-1">
            Order {orderId} · Confirmation sent to{' '}
            <span className="font-medium text-ink dark:text-white">
              {order.guestEmail || order.shipping?.email}
            </span>
          </p>
          <p className="text-2xl font-display font-semibold text-brand mt-4">
            {formatPrice(order.total)}
          </p>
          <p className="text-xs uppercase tracking-wide text-ink-muted dark:text-neutral-500 mt-1">
            {order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}
          </p>
        </motion.div>

        <div className="card p-6 lg:p-8 mb-8">
          <h3 className="font-display text-lg mb-6 text-ink dark:text-white">Order status</h3>
          <OrderStatusStepper status={order.status || 'processing'} />
        </div>

        <div className="card p-6 lg:p-8 mb-8">
          <h3 className="font-display text-lg mb-4 text-ink dark:text-white">Items</h3>
          <ul className="space-y-3">
            {(order.items || []).map((item, i) => (
              <li key={item.product || i} className="flex gap-3 items-center text-sm">
                {item.image && (
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-ink dark:text-white">{item.name}</p>
                  <p className="text-ink-muted dark:text-neutral-400 text-xs">Qty {item.quantity}</p>
                </div>
                <span className="font-semibold text-ink dark:text-white">
                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-strong text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            <Printer className="w-5 h-5" />
            {isPrinting ? 'Printing...' : 'Print Receipt'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center"
          >
            WhatsApp support
          </a>
          <Link to="/products">
            <RippleButton magnetic variantClass="btn-secondary w-full sm:w-auto dark:text-white dark:border-white/20">
              Continue shopping
            </RippleButton>
          </Link>
          {!order.user && (
            <Link to="/register" className="btn-primary text-center">
              Create free account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
