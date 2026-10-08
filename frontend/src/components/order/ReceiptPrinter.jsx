import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Download, Printer, X, RotateCcw } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import './receipt-printer.css';

const paymentLabels = {
  cod: 'Cash on delivery',
  card: 'Card',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
  loyalty_points: 'Loyalty points',
};

const statusLabels = {
  pending: 'Order received',
  processing: 'Order confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const buildReceipt = (order) => {
  const shipping = order.shipping || {};
  const created = order.createdAt || order.date ? new Date(order.createdAt || order.date) : new Date();
  const validDate = Number.isNaN(created.getTime()) ? new Date() : created;
  const name = [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || shipping.name || 'Customer';
  const address = [shipping.address, shipping.city, shipping.state, shipping.zipCode, shipping.country]
    .filter(Boolean)
    .join(', ');
  const method = order.paymentMethod || '';
  const paid = method && method !== 'cod' && order.status !== 'cancelled';

  return {
    orderNumber: order.orderId || order.id || order._id || '------',
    date: validDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: validDate.toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit' }),
    customer: {
      name,
      email: order.guestEmail || shipping.email || '',
      phone: shipping.phone || '',
      address,
    },
    items: (order.items || []).map((item) => ({
      name: item.name || 'Item',
      quantity: item.quantity || 1,
      total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
    })),
    subtotal: order.subtotal,
    shipping: order.shippingCost,
    discount: order.discount,
    tax: order.tax,
    grandTotal: order.total,
    paymentMethod: paymentLabels[method] || method || 'Not recorded',
    paymentStatus: order.status === 'cancelled' ? 'Cancelled' : paid ? 'Paid' : 'Due on delivery',
    orderStatus: statusLabels[order.status] || 'Order confirmed',
  };
};

const ReceiptPrinter = ({ order, branding, onClose }) => {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(reduced ? 'complete' : 'opening');
  const [replay, setReplay] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const receipt = useMemo(() => buildReceipt(order), [order]);
  const siteName = branding?.siteName || 'ShopMart';
  const tagline = branding?.tagline || 'Your Neighborhood Superstore';

  useEffect(() => {
    if (reduced) {
      setPhase('complete');
      return undefined;
    }
    setPhase('opening');
    const printing = window.setTimeout(() => setPhase('printing'), 700);
    const done = window.setTimeout(() => setPhase('complete'), 5200);
    return () => {
      window.clearTimeout(printing);
      window.clearTimeout(done);
    };
  }, [reduced, replay]);

  const handlePrint = () => {
    setPhase('complete');
    window.setTimeout(() => window.print(), 50);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const source = document.getElementById('receipt-pdf-source');
      if (!source) throw new Error('Receipt is not ready');
      await html2pdf()
        .set({
          margin: 12,
          filename: `ShopMart-receipt-${receipt.orderNumber}.pdf`,
          html2canvas: { scale: 2, backgroundColor: '#FFFCF7' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(source)
        .save();
    } catch (err) {
      console.error(err);
      window.alert('Could not create the PDF. Try print instead.');
    } finally {
      setDownloading(false);
    }
  };

  const phaseClass = phase === 'complete' ? 'is-complete' : phase === 'printing' ? 'is-printing' : 'is-opening';

  return createPortal(
    <section className={`receipt-scene ${phaseClass}`} aria-label="Order receipt">
      {phase !== 'complete' && (
        <button type="button" className="receipt-skip no-print" onClick={() => setPhase('complete')}>
          Skip
        </button>
      )}

      <div className="receipt-stage">
        <div className="printer no-print" aria-hidden="true">
          <div className="printer-body">
            <div className="printer-top" />
            <div className="printer-slot" />
          </div>
        </div>

        <div className="paper-rail">
          <article className="receipt-sheet" id="receipt-pdf-source" aria-live="polite">
            <div className="receipt-sheet-inner">
              <header className="receipt-brand">
                <strong>{siteName}</strong>
                <span>{tagline}</span>
              </header>
              <p className="receipt-thanks">ORDER RECEIPT</p>
              <hr className="receipt-rule" />
              <p>Order #{receipt.orderNumber}</p>
              <p>{receipt.date} · {receipt.time}</p>
              <p>Customer: {receipt.customer.name}</p>
              {receipt.customer.email && <p className="receipt-muted">{receipt.customer.email}</p>}
              {receipt.customer.phone && <p className="receipt-muted">{receipt.customer.phone}</p>}
              {receipt.customer.address && <p className="receipt-muted">{receipt.customer.address}</p>}
              <p>Payment: {receipt.paymentStatus}</p>
              <p>Status: {receipt.orderStatus}</p>
              <hr className="receipt-rule" />
              <div className="receipt-row receipt-muted">
                <span>Qty</span>
                <span>Item</span>
                <span>Price</span>
              </div>
              {receipt.items.map((item, index) => (
                <div className="receipt-item" key={`${item.name}-${index}`}>
                  <span>{item.quantity}</span>
                  <span>{item.name}</span>
                  <span>{formatPrice(item.total)}</span>
                </div>
              ))}
              <hr className="receipt-rule" />
              <p className="receipt-total"><span>Subtotal</span><span>{formatPrice(receipt.subtotal)}</span></p>
              <p className="receipt-total"><span>Shipping</span><span>{formatPrice(receipt.shipping)}</span></p>
              {Number(receipt.discount) > 0 && (
                <p className="receipt-total"><span>Discount</span><span>-{formatPrice(receipt.discount)}</span></p>
              )}
              {Number(receipt.tax) > 0 && (
                <p className="receipt-total"><span>Tax</span><span>{formatPrice(receipt.tax)}</span></p>
              )}
              <p className="receipt-total is-grand"><span>Total</span><span>{formatPrice(receipt.grandTotal)}</span></p>
              <hr className="receipt-rule" />
              <p>Payment method</p>
              <p>{receipt.paymentMethod}</p>
              <p className="receipt-thanks">Thank you for your order</p>
            </div>
          </article>
        </div>
      </div>

      <div className="receipt-toolbar no-print" role="toolbar" aria-label="Receipt actions" inert={phase !== 'complete'}>
        <button type="button" className="receipt-action is-primary" onClick={handlePrint}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print receipt
        </button>
        <button type="button" className="receipt-action" onClick={handleDownload} disabled={downloading}>
          <Download className="w-4 h-4" aria-hidden="true" />
          {downloading ? 'Saving…' : 'Download PDF'}
        </button>
        {import.meta.env.DEV && (
          <button type="button" className="receipt-action" onClick={() => setReplay((n) => n + 1)}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Replay
          </button>
        )}
        <button type="button" className="receipt-action" onClick={onClose}>
          <X className="w-4 h-4" aria-hidden="true" />
          Close
        </button>
      </div>
      <div className="receipt-links no-print">
        <Link to="/products">Continue shopping</Link>
        <Link to="/dashboard">View orders</Link>
      </div>
    </section>,
    document.body
  );
};

export default ReceiptPrinter;
