import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import HeroVideo from '../components/common/HeroVideo';
import { apiEndpoints } from '../services/api';

const LoyaltyProgram = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('loyalty');
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

  const tiers = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      name: 'Silver',
      points: '0 - 999',
      color: 'from-gray-400 to-gray-500',
      benefits: [
        '1 point per PKR 100 spent',
        'Birthday surprise',
        'Exclusive member offers',
        'Early access to sales'
      ]
    },
    {
      name: 'Gold',
      points: '1,000 - 4,999',
      color: 'from-yellow-400 to-yellow-500',
      benefits: [
        '1.5 points per PKR 100 spent',
        'Free delivery on orders above PKR 1500',
        'Priority customer support',
        'Birthday surprise + discount',
        'Exclusive member events'
      ]
    },
    {
      name: 'Platinum',
      points: '5,000+',
      color: 'from-brand to-brand-strong',
      benefits: [
        '2 points per PKR 100 spent',
        'Free delivery on all orders',
        'Dedicated account manager',
        'VIP access to new products',
        'Exclusive member events',
        'Birthday surprise + premium gift',
        'Double points on special days'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I earn points?',
      answer: 'You earn 1 point for every PKR 100 spent on eligible purchases. Points are automatically credited to your account within 24 hours of purchase.'
    },
    {
      question: 'How do I redeem my points?',
      answer: 'You can redeem your points during checkout. 100 points = PKR 50 discount. Simply select "Use Points" option when placing your order.'
    },
    {
      question: 'Do points expire?',
      answer: 'Points are valid for 12 months from the date of earning. We will send you a reminder before your points expire.'
    },
    {
      question: 'Can I transfer points to another member?',
      answer: 'No, points are non-transferable and can only be used by the account holder who earned them.'
    },
    {
      question: 'How do I upgrade my tier?',
      answer: 'Your tier is automatically upgraded based on your total points earned in the last 12 months. No additional action is required.'
    }
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Loyalty Program'}
        subtitle={pageContent?.subtitle || 'Earn Rewards With Every Purchase'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Loyalty Program' }]}
      />

      {/* Hero Section */}
      <section className="section-premium relative overflow-hidden text-white">
        <HeroVideo />
        <div className="container-premium relative z-10 text-center py-16">
          <h2 className="text-4xl font-display mb-4">ShopMart Rewards</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our loyalty program and earn points on every purchase. Redeem points for discounts, exclusive offers, and special rewards.
          </p>
          <button className="btn-primary bg-white text-brand hover:bg-white/90">
            Join Now - It's Free
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free ShopMart account to start earning points immediately.' },
              { step: '2', title: 'Shop & Earn', description: 'Earn 1 point for every PKR 100 spent on eligible purchases.' },
              { step: '3', title: 'Redeem Rewards', description: 'Use your points to get discounts on future purchases.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center text-2xl font-display font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl mb-2">{item.title}</h3>
                <p className="text-ink-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Membership Tiers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 hover:shadow-raised transition-shadow relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />
                <h3 className="font-display text-2xl mb-2">{tier.name}</h3>
                <p className="text-sm text-ink-muted mb-6">{tier.points} points</p>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-ink-muted">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Point Value */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="card p-12 text-center">
            <h2 className="text-3xl font-display mb-4">Point Value</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <p className="text-4xl font-display text-brand mb-2">100</p>
                <p className="text-ink-muted">Points = PKR 50</p>
              </div>
              <div>
                <p className="text-4xl font-display text-brand mb-2">500</p>
                <p className="text-ink-muted">Points = PKR 250</p>
              </div>
              <div>
                <p className="text-4xl font-display text-brand mb-2">1000</p>
                <p className="text-ink-muted">Points = PKR 500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-premium">
        <div className="container-premium max-w-3xl">
          <h2 className="text-3xl font-display mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <h3 className="font-display text-lg mb-2">{faq.question}</h3>
                <p className="text-ink-muted text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-premium bg-brand text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Start Earning Today</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join ShopMart Rewards now and start earning points on your very first purchase. The more you shop, the more you save!
          </p>
          <button className="btn-primary bg-white text-brand hover:bg-white/90">
            Join Rewards Program
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoyaltyProgram;
