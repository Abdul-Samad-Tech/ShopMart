import { useState } from 'react';
import { Download, Printer, CheckCircle } from 'lucide-react';

const OrderThankYou = ({ order, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log('OrderThankYou rendering, order:', order);

  if (!order) {
    console.error('OrderThankYou: No order provided');
    return null;
  }

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
          <h1 style="color: #667eea; text-align: center;">Order Receipt</h1>
          <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
            <p><strong>Order Number:</strong> ${order.orderId || (order._id || order.id)?.slice(-6).toUpperCase()}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt || order.date).toLocaleDateString()}</p>
            <p><strong>Total:</strong> PKR ${Number(order.total).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.replace('_', ' ')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <h2 style="color: #333; margin-top: 20px;">Order Items</h2>
          ${order.items?.map((item, index) => `
            <div style="margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: PKR ${Number(item.price).toFixed(2)}</p>
            </div>
          `).join('') || '<p>No items</p>'}
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea;">
            <p style="text-align: center; color: #666;">Thank you for shopping with ShopMart!</p>
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
        filename: `Order_Receipt_${order.orderId || order._id?.slice(-6)}.pdf`,
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Thank You Message */}
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Thank You!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Order #{order.orderId || (order._id || order.id)?.slice(-6).toUpperCase()}
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
            <span className="font-bold text-gray-900 dark:text-white">
              PKR {Number(order.total).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
            <span className="text-gray-900 dark:text-white capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
               order.paymentMethod === 'loyalty_points' ? 'Loyalty Points' :
               order.paymentMethod?.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
              {order.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <Printer className="w-5 h-5" />
            {isPrinting ? 'Printing...' : 'Print'}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderThankYou;
