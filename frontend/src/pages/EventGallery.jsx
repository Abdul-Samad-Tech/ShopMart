import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const EventGallery = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('events');
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

  const events = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      id: 1,
      title: 'Grand Opening - DHA Lahore',
      category: 'Store Openings',
      date: 'June 2026',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      description: 'The grand opening of our flagship store in DHA Phase 3, Lahore.'
    },
    {
      id: 2,
      title: 'Ramadan Festival',
      category: 'Seasonal Events',
      date: 'March 2026',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
     description: 'Special Ramadan celebrations with exclusive offers and family activities.'
    },
    {
      id: 3,
      title: 'Lucky Draw Winners',
      category: 'Promotions',
      date: 'December 2025',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      description: 'Announcing the winners of our annual lucky draw.'
    },
    {
      id: 4,
      title: 'Customer Appreciation Day',
      category: 'Corporate Events',
      date: 'November 2025',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      description: 'A special day to celebrate and thank our loyal customers.'
    },
    {
      id: 5,
      title: 'New Store - Islamabad Blue Area',
      category: 'Store Openings',
      date: 'October 2025',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      description: 'Opening our new store in the heart of Islamabad.'
    },
    {
      id: 6,
      title: 'Winter Collection Launch',
      category: 'Product Launches',
      date: 'September 2025',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      description: 'Launch of our exclusive winter collection.'
    },
    {
      id: 7,
      title: 'Employee Recognition Ceremony',
      category: 'Corporate Events',
      date: 'August 2025',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      description: 'Recognizing and rewarding our outstanding employees.'
    },
    {
      id: 8,
      title: 'Summer Sale Kickoff',
      category: 'Promotions',
      date: 'July 2025',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      description: 'Starting our biggest summer sale with exciting discounts.'
    },
    {
      id: 9,
      title: 'Eid Celebrations',
      category: 'Seasonal Events',
      date: 'June 2025',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
      description: 'Eid festivities across all ShopMart stores.'
    }
  ];

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory);

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Event Gallery'}
        subtitle={pageContent?.subtitle || 'Our Celebrations & Milestones'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Event Gallery' }]}
      />

      {/* Category Filter */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-luxury-ivory dark:bg-white/10 text-luxury-charcoal dark:text-white hover:bg-primary-100'
                }`}
              >
                {category === 'all' ? 'All Events' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden hover:shadow-premium-lg transition-shadow group"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold-500 text-white mb-2">
                      {event.category}
                    </span>
                    <h3 className="text-white font-display text-lg">{event.title}</h3>
                    <p className="text-white/80 text-sm">{event.date}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-luxury-muted">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-premium bg-luxury-ivory dark:bg-luxury-slate/30">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Total Events', value: '50+' },
              { label: 'Store Openings', value: '15' },
              { label: 'Happy Customers', value: '10K+' },
              { label: 'Years of Celebrations', value: '5' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <p className="text-3xl font-display text-primary-600 mb-2">{stat.value}</p>
                <p className="text-sm text-luxury-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Join Our Next Event</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Stay updated with our upcoming events and celebrations. Subscribe to our newsletter to never miss an update.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:border-white/40"
            />
            <button className="btn-mart bg-white text-mart-green hover:bg-white/90">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventGallery;
