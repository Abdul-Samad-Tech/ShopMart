import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const OurBrands = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('brands');
        setPageContent(res.data);
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const categories = pageContent?.sections?.[0]?.content ? 
    JSON.parse(pageContent.sections[0].content) : [
    {
      name: 'Private Labels',
      description: 'Our exclusive range of high-quality products developed under our own brand names, ensuring premium quality at competitive prices.',
      brands: ['ShopMart Select', 'Fresh Choice', 'Home Essentials', 'Daily Needs', 'Premium Collection']
    },
    {
      name: 'International Brands',
      description: 'World-renowned international brands that we proudly carry, bringing global quality to your doorstep.',
      brands: ['Nestlé', 'Unilever', 'P&G', 'Kelloggs', 'Coca-Cola', 'Pepsi', 'Heinz', 'Campbells']
    },
    {
      name: 'Local Brands',
      description: 'Supporting Pakistani businesses by featuring top local brands that represent the best of our country.',
      brands: ['Engro', 'Mitchells', 'National Foods', 'Shan Foods', 'Murree Brewery', 'Gourmet']
    },
    {
      name: 'Organic & Natural',
      description: 'A curated selection of organic and natural products for health-conscious consumers.',
      brands: ['Organic Valley', 'Natures Best', 'Pure Harvest', 'Green Earth', 'Natural Choice']
    },
    {
      name: 'Personal Care',
      description: 'Leading personal care and beauty brands to help you look and feel your best.',
      brands: ['LOreal', 'Gillette', 'Dove', 'Nivea', 'Pantene', 'Olay']
    },
    {
      name: 'Home & Lifestyle',
      description: 'Quality home and lifestyle products to enhance your living space.',
      brands: ['IKEA', 'Home Essentials', 'Lifestyle Co.', 'Decor Plus', 'Living Smart']
    }
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container-premium py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Our Brands'}
        subtitle={pageContent?.subtitle || 'Discover the Quality Brands We Carry'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Our Brands' }]}
      />

      {/* Hero Section */}
      <section className="section-premium">
        <div className="container-premium text-center max-w-3xl">
          <h2 className="text-3xl font-display mb-6">{pageContent?.description || 'Trusted Brands, Quality Assured'}</h2>
          <p className="text-luxury-muted leading-relaxed">
            At ShopMart, we partner with the world's leading brands and develop our own private labels to bring you the best products at the most competitive prices. Every brand in our stores is carefully selected to meet our strict quality standards.
          </p>
        </div>
      </section>

      {/* Brand Categories */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-8 hover:shadow-premium-lg transition-shadow"
              >
                <h3 className="font-display text-xl mb-3 text-gold-600">{category.name}</h3>
                <p className="text-sm text-luxury-muted mb-6 leading-relaxed">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.brands.map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-luxury-ivory dark:bg-white/10 text-luxury-charcoal dark:text-white"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Partner With Us</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Are you a brand owner or supplier? Join our network of trusted partners and reach millions of customers across Pakistan.
          </p>
          <a href="/supplier-form" className="inline-block btn-mart-outline">
            Become a Supplier
          </a>
        </div>
      </section>
    </div>
  );
};

export default OurBrands;
