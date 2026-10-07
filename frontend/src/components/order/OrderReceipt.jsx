import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, X, ShoppingBag, Calendar, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

const OrderReceipt = ({ order, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log('OrderReceipt component rendering');
  console.log('Order prop:', order);

  if (!order) {
    console.error('OrderReceipt: No order data provided');
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
      
      const element = document.getElementById('receipt-content');
      const opt = {
        margin: 0,
        filename: `Order_Receipt_${order.orderId || order._id?.slice(-6)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-display font-bold mb-1">Order Confirmed!</h2>
              <p className="text-white/80 text-sm">Thank you for your purchase</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div id="receipt-content" className="bg-white dark:bg-slate-800">
              {/* Order Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Order Number</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                      {order.orderId || (order._id || order.id)?.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.createdAt || order.date)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 dark:text-gray-400 w-20">Name:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {order.shipping?.firstName || order.firstName || 'N/A'} {order.shipping?.lastName || order.lastName || ''}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 dark:text-gray-400 w-20">Email:</span>
                    <span className="text-gray-900 dark:text-white">{order.shipping?.email || order.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 dark:text-gray-400 w-20">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{order.shipping?.phone || order.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-900 dark:text-white">
                  <p>{order.shipping?.address}</p>
                  <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zipCode}</p>
                  <p>{order.shipping?.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
                <div className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 ${
                        index !== order.items.length - 1 ? 'border-b border-gray-200 dark:border-slate-600' : ''
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shippingCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax || 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-slate-600">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-600">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       order.paymentMethod === 'loyalty_points' ? 'Loyalty Points' :
                       order.paymentMethod?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-slate-600">
                <p>This receipt was generated on {formatDate(new Date())}</p>
                <p className="mt-1">Thank you for shopping with ShopMart!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-600 flex gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <Printer className="w-5 h-5" />
              {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderReceipt;
