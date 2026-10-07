import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import PageHeader from '../components/ui/PageHeader';

const AboutUs = () => {
  const about = useSelector((state) => state.site.site?.about) || {};
  const stats = about.stats || [];
  const values = about.values || [];
  const story = about.story || [];

  return (
    <div className="page-shell">
      <PageHeader
        title="About Us"
        subtitle="Our Journey, Vision & Mission"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      {/* Hero Section */}
      <section className="section-premium">
        <div className="container-premium grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-display mb-6">Our Story</h2>
            {story.length > 0 ? (
              story.map((para, i) => (
                <p key={i} className="text-ink-muted leading-relaxed mb-4">{para}</p>
              ))
            ) : (
              <>
                <p className="text-ink-muted leading-relaxed mb-4">
                  Founded with a passion for bringing quality products to every household, ShopMart has grown from a small local store to a trusted retail chain across Pakistan. Our journey began with a simple mission: to provide customers with the best products at competitive prices while maintaining the highest standards of quality and service.
                </p>
                <p className="text-ink-muted leading-relaxed mb-4">
                  Over the years, we have expanded our footprint, opened multiple stores in major cities, and built lasting relationships with millions of satisfied customers. Our commitment to excellence has made us a household name, trusted for quality, value, and reliability.
                </p>
                <p className="text-ink-muted leading-relaxed">
                  Today, we continue to innovate and adapt to the changing needs of our customers, embracing technology while staying true to our core values of integrity, customer satisfaction, and community service.
                </p>
              </>
            )}
          </div>
          {stats.length > 0 ? (
            <div className="card p-10 grid grid-cols-2 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-display text-gradient">{s.value}</p>
                  <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-10 grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-3xl font-display text-gradient">50+</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">Stores</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display text-gradient">1M+</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display text-gradient">500+</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">Brands</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display text-gradient">15+</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">Years</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-premium bg-surface-raised dark:bg-surface-raised/30">
        <div className="container-premium grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="card p-8"
          >
            <h2 className="text-2xl font-display mb-4 text-accent">Our Vision</h2>
            <p className="text-ink-muted leading-relaxed">
              To be Pakistan's most trusted and preferred retail destination, known for quality products, exceptional service, and unwavering commitment to customer satisfaction. We aim to transform the shopping experience by combining traditional values with modern convenience.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="card p-8"
          >
            <h2 className="text-2xl font-display mb-4 text-accent">Our Mission</h2>
            <p className="text-ink-muted leading-relaxed">
              To provide our customers with a wide range of quality products at competitive prices while maintaining the highest standards of service. We are committed to building long-term relationships with our customers, suppliers, and communities through trust, transparency, and mutual growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      {values.length > 0 ? (
        <section className="section-premium">
          <h2 className="text-3xl font-display mb-8 text-center container-premium">Our Core Values</h2>
          <div className="container-premium grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-8">
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-sm text-ink-muted">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-premium">
          <h2 className="text-3xl font-display mb-8 text-center container-premium">Our Core Values</h2>
          <div className="container-premium grid md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', description: 'We never compromise on quality. Every product in our stores meets our strict quality standards.' },
              { title: 'Customer Focus', description: 'Our customers are at the heart of everything we do. We listen, adapt, and deliver what matters most.' },
              { title: 'Integrity', description: 'We conduct business with honesty and transparency, building trust through our actions.' },
              { title: 'Innovation', description: 'We embrace change and continuously improve to serve our customers better.' },
              { title: 'Community', description: 'We are committed to giving back to the communities that support us.' },
              { title: 'Teamwork', description: 'We believe in the power of collaboration and respect every member of our team.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-8">
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-sm text-ink-muted">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutUs;
