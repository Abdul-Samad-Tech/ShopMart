import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const ReturnPolicy = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('return-policy');
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

  const policies = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      title: 'Return Eligibility',
      items: [
        'Items can be returned within 7 days of purchase',
        'Original receipt or proof of purchase is required',
        'Items must be unused, unworn, and in original packaging',
        'Personal care items, food products, and perishables cannot be returned',
        'Sale items are final sale and cannot be returned'
      ]
    },
    {
      title: 'Exchange Policy',
      items: [
        'Exchanges are allowed within 14 days of purchase',
        'Item must be in original condition with tags attached',
        'Exchange can be made for same item in different size/color',
        'Price difference will be charged or refunded accordingly',
        'One-time exchange per item only'
      ]
    },
    {
      title: 'Refund Process',
      items: [
        'Refunds are processed within 5-7 business days',
        'Refund will be issued to original payment method',
        'Cash refunds available for cash purchases',
        'Store credit available for all returns',
        'Gift cards cannot be refunded but can be exchanged'
      ]
    },
    {
      title: 'Damaged or Defective Items',
      items: [
        'Full refund or replacement for damaged items',
        'Report damage within 48 hours of delivery',
        'Photos may be required for verification',
        'Free replacement shipping for defective items',
        'No return fee for manufacturer defects'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Can I return items purchased online?',
      answer: 'Yes, online purchases can be returned to any ShopMart store or by mail. Please include your order number and contact information.'
    },
    {
      question: 'What if I lost my receipt?',
      answer: 'Without a receipt, we can offer store credit at the current selling price. Valid ID is required for all returns without receipt.'
    },
    {
      question: 'Can I return sale items?',
      answer: 'Sale items marked as "Final Sale" cannot be returned or exchanged. Regular sale items can be returned within 7 days.'
    },
    {
      question: 'How do I return an item by mail?',
      answer: 'Contact our customer service at 021-111-468-429 to initiate a mail return. We will provide a return shipping label and instructions.'
    },
    {
      question: 'What items cannot be returned?',
      answer: 'Personal care items, food products, perishables, undergarments, and items marked as "Final Sale" cannot be returned.'
    }
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Return & Exchange Policy'}
        subtitle={pageContent?.subtitle || 'Our Hassle-Free Return Process'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Return Policy' }]}
      />

      {/* Overview */}
      <section className="section-premium">
        <div className="container-premium max-w-3xl text-center">
          <h2 className="text-3xl font-display mb-6">Our Return Promise</h2>
          <p className="text-ink-muted leading-relaxed mb-8">
            At ShopMart, we want you to be completely satisfied with your purchase. If you're not happy with your purchase, 
            we offer a hassle-free return and exchange policy. Our goal is to make the return process as simple and convenient as possible.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <p className="text-3xl font-display text-brand mb-2">7 Days</p>
              <p className="text-sm text-ink-muted">Return Window</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-display text-brand mb-2">14 Days</p>
              <p className="text-sm text-ink-muted">Exchange Window</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-display text-brand mb-2">5-7 Days</p>
              <p className="text-sm text-ink-muted">Refund Processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                <h3 className="font-display text-xl mb-4 text-accent">{policy.title}</h3>
                <ul className="space-y-3">
                  {policy.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                      <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">How to Return or Exchange</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Prepare Item', description: 'Ensure item is in original condition with all tags and packaging.' },
              { step: '2', title: 'Bring Receipt', description: 'Bring original receipt or proof of purchase to the store.' },
              { step: '3', title: 'Visit Store', description: 'Visit any ShopMart store with your item and receipt.' },
              { step: '4', title: 'Get Refund', description: 'Receive refund or exchange immediately upon verification.' }
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

      {/* Contact */}
      <section className="section-premium bg-brand text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Need Help?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            If you have any questions about our return policy, please contact our customer service team.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:021111468429" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              021-111-468-429
            </a>
            <a href="mailto:support@shopmart.pk" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@shopmart.pk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicy;
