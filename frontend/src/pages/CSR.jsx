import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Leaf, BarChart3 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const CSR = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('csr');
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

  const initiatives = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      title: 'Heatwave Relief Camps',
      description: 'During extreme heat waves, we set up relief camps across major cities providing free cold water, shade, and medical assistance to those in need.',
      image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
      impact: '50,000+ people served'
    },
    {
      title: 'Food Distribution',
      description: 'Regular food drives to support underprivileged communities, distributing essential food items to families in need.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      impact: '10,000+ families supported'
    },
    {
      title: 'Education Support',
      description: 'Providing scholarships and educational supplies to deserving students, helping them pursue their dreams.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      impact: '500+ students sponsored'
    },
    {
      title: 'Healthcare Initiatives',
      description: 'Free medical camps and health awareness programs in underserved areas, providing basic healthcare services.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      impact: '25+ medical camps conducted'
    },
    {
      title: 'Environmental Sustainability',
      description: 'Tree plantation drives and recycling programs to reduce our environmental footprint and promote green practices.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      impact: '10,000+ trees planted'
    },
    {
      title: 'Disaster Relief',
      description: 'Emergency relief support during natural disasters, providing essential supplies to affected communities.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
      impact: '15+ relief operations'
    }
  ];

  const stats = [
    { label: 'Total Investment', value: 'PKR 50M+' },
    { label: 'Communities Served', value: '100+' },
    { label: 'Volunteers Engaged', value: '2,000+' },
    { label: 'Years of CSR', value: '10' }
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Corporate Social Responsibility'}
        subtitle={pageContent?.subtitle || 'Making a Difference in Our Communities'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'CSR' }]}
      />

      {/* Hero Section */}
      <section className="section-premium bg-gradient-to-br from-accent to-accent text-white">
        <div className="container-premium text-center py-16">
          <h2 className="text-4xl font-display mb-4">Giving Back to Society</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            At ShopMart, we believe in the power of community. Our CSR initiatives focus on education, healthcare, 
            environmental sustainability, and disaster relief to create lasting positive impact.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <p className="text-3xl font-display text-accent mb-2">{stat.value}</p>
                <p className="text-sm text-ink-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Initiatives */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Our Initiatives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-raised transition-shadow"
              >
                <img
                  src={initiative.image}
                  alt={initiative.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl mb-3">{initiative.title}</h3>
                  <p className="text-sm text-ink-muted mb-4 leading-relaxed">{initiative.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-accent">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {initiative.impact}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Handshake,
                title: 'Community First',
                description: 'We work closely with local communities to understand their needs and develop targeted solutions.'
              },
              {
                icon: Leaf,
                title: 'Sustainable Impact',
                description: 'Our initiatives are designed to create long-term, sustainable change rather than temporary fixes.'
              },
              {
                icon: BarChart3,
                title: 'Transparent Reporting',
                description: 'We regularly report on our CSR activities and their impact to ensure accountability.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="flex justify-center mb-4 text-brand">
                  <item.icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="section-premium bg-brand text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Get Involved</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join us in making a difference. You can volunteer, donate, or partner with us on our CSR initiatives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary bg-white text-brand hover:bg-white/90">
              Volunteer
            </button>
            <button className="btn-primary bg-white/10 text-white hover:bg-white/20">
              Donate
            </button>
            <button className="btn-primary bg-white/10 text-white hover:bg-white/20">
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-premium">
        <div className="container-premium max-w-3xl text-center">
          <h2 className="text-3xl font-display mb-8">CSR Inquiries</h2>
          <p className="text-ink-muted mb-8">
            For more information about our CSR initiatives or to discuss partnership opportunities, please contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:csr@shopmart.pk" className="flex items-center gap-2 text-brand hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              csr@shopmart.pk
            </a>
            <a href="tel:021111468429" className="flex items-center gap-2 text-brand hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              021-111-468-429
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CSR;
