import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import HeroVideo from '../components/common/HeroVideo';
import { apiEndpoints } from '../services/api';

const GiftCards = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('gift-cards');
        setPageContent(res.data);
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container-premium py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const amounts = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : ['500', '1000', '2000', '5000', '10000'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = selectedAmount || customAmount;
    try {
      await apiEndpoints.purchaseGiftCard({
        amount: Number(amount),
        recipientEmail,
        recipientName: senderName,
        message
      });
      setShowThankYou(true);
      setSelectedAmount('');
      setCustomAmount('');
      setRecipientEmail('');
      setSenderName('');
      setMessage('');
    } catch (err) {
      console.error('Failed to purchase gift card:', err);
      alert('Failed to purchase gift card. Please try again.');
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Gift Cards'}
        subtitle={pageContent?.subtitle || 'The Perfect Gift for Every Occasion'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gift Cards' }]}
      />

      {/* Hero Section */}
      <section className="section-premium relative overflow-hidden text-white">
        <HeroVideo />
        <div className="container-premium relative z-10 text-center py-16">
          <h2 className="text-4xl font-display mb-4">ShopMart Gift Cards</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Give the gift of choice with ShopMart gift cards. Perfect for birthdays, holidays, or any special occasion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Expiry</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Use Online & In-Store</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Card Options */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-8 text-center">Choose Your Amount</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`card p-6 text-center transition-all ${
                  selectedAmount === amount ? 'border-2 border-brand bg-brand/10 dark:bg-brand/30' : ''
                }`}
              >
                <p className="text-2xl font-display font-semibold text-ink dark:text-white">PKR {amount}</p>
              </motion.button>
            ))}
          </div>

          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium mb-2">Or enter custom amount (PKR 500 - 50,000)</label>
            <input
              type="number"
              min="500"
              max="50000"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount('');
              }}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand outline-none"
            />
          </div>
        </div>
      </section>

      {/* Purchase Form */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium max-w-2xl">
          <h2 className="text-3xl font-display mb-8 text-center">Send Gift Card</h2>
          <form onSubmit={handleSubmit} className="card p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Recipient Email *</label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@email.com"
                className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand outline-none resize-none"
              />
            </div>

            <div className="mb-6 p-4 bg-surface-raised dark:bg-white/5 rounded-xl">
              <p className="text-sm text-ink-muted">
                <strong>Selected Amount:</strong> PKR {selectedAmount || customAmount || '0'}
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              Purchase Gift Card
            </button>
          </form>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Select Amount', description: 'Choose from preset amounts or enter a custom value.' },
              { step: '2', title: 'Add Details', description: 'Enter recipient email and add a personal message.' },
              { step: '3', title: 'Pay Securely', description: 'Complete payment using your preferred method.' },
              { step: '4', title: 'Instant Delivery', description: 'Gift card is sent instantly to recipient.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl font-display font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium max-w-3xl">
          <h2 className="text-3xl font-display mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Do gift cards expire?', a: 'No, ShopMart gift cards do not have an expiration date.' },
              { q: 'Can I use gift cards online?', a: 'Yes, gift cards can be used both online and in all ShopMart stores.' },
              { q: 'What if I lose my gift card?', a: 'Please contact customer service immediately. We may be able to replace lost gift cards with proof of purchase.' },
              { q: 'Can I return a gift card?', a: 'Gift cards cannot be returned or refunded except where required by law.' },
              { q: 'How do I check my balance?', a: 'You can check your gift card balance online or at any ShopMart store.' }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <h3 className="font-display text-lg mb-2">{faq.q}</h3>
                <p className="text-ink-muted text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Popup */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThankYou(false)}
            className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your gift card has been purchased successfully and will be sent to the recipient's email address.
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Note:</strong> Gift cards are delivered instantly. The recipient can use this gift card for purchases on ShopMart.
                </p>
              </div>
              <button
                onClick={() => setShowThankYou(false)}
                className="w-full bg-brand hover:bg-brand-strong text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftCards;
