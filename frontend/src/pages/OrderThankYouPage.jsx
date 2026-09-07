import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Download, Printer, CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { apiEndpoints } from '../services/api';

const OrderThankYouPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    console.log('OrderThankYouPage mounted');
    console.log('orderId from URL:', orderId);

    // First try to get order from localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      try {
        const parsedOrder = JSON.parse(lastOrder);
        console.log('Using order from localStorage:', parsedOrder);
        setOrder(parsedOrder);
        setLoading(false);
        // Clear localStorage after using
        localStorage.removeItem('lastOrder');
        return;
      } catch (err) {
        console.error('Failed to parse order from localStorage:', err);
      }
    }

    // If not in localStorage, try to fetch from API
    const fetchOrder = async () => {
      console.log('Fetching order from API...');
      try {
        const response = await apiEndpoints.trackOrder(orderId, localStorage.getItem('userEmail'));
        console.log('API response:', response);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-3 text-center">
            Thank You!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center text-lg">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            Order #{order.orderId || (order._id || order.id)?.slice(-6).toUpperCase()}
          </p>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  PKR {Number(order.total).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="text-gray-900 dark:text-white capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'loyalty_points' ? 'Loyalty Points' :
                   order.paymentMethod?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium capitalize">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity} × PKR {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    PKR {Number(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
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
              {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View Orders
            </button>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderThankYouPage;
