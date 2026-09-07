import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const Blog = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('blog');
        setPageContent(res.data);
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const posts = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      id: 1,
      title: 'New Store Opening in DHA Lahore',
      category: 'Store Updates',
      date: 'June 15, 2026',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      excerpt: 'We are excited to announce the opening of our new flagship store in DHA Phase 3, Lahore. This state-of-the-art store features a wide range of products and exclusive offers.',
      content: 'The new store spans over 25,000 square feet and features dedicated sections for groceries, electronics, fashion, and home essentials. Customers can enjoy exclusive opening discounts and special promotions throughout the launch month.'
    },
    {
      id: 2,
      title: 'Ramadan Special Offers',
      category: 'Seasonal',
      date: 'March 20, 2026',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
      excerpt: 'Prepare for the holy month with our special Ramadan collection. Enjoy discounts on dates, groceries, and household essentials.',
      content: 'Our Ramadan collection includes premium dates from around the world, special grocery bundles, and exclusive household items. Visit any ShopMart store to take advantage of these limited-time offers.'
    },
    {
      id: 3,
      title: 'Winter Collection Drop',
      category: 'Fashion',
      date: 'December 10, 2025',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      excerpt: 'Stay warm and stylish with our new winter collection. Featuring cozy sweaters, jackets, and accessories for the whole family.',
      content: 'Our winter collection brings together comfort and style with premium quality fabrics and trendy designs. Available at all ShopMart stores and online with free delivery on orders above PKR 2000.'
    },
    {
      id: 4,
      title: 'Loyalty Program Launch',
      category: 'Customer Benefits',
      date: 'November 5, 2025',
      image: 'https://images.unsplash.com/photo-1556740758-6de464c8dd13?w=800&q=80',
      excerpt: 'Introducing our new loyalty program! Earn points on every purchase and redeem them for exclusive rewards and discounts.',
      content: 'Join ShopMart Rewards today and start earning 1 point for every PKR 100 spent. Accumulate points to unlock exclusive discounts, free products, and special member-only offers.'
    },
    {
      id: 5,
      title: 'Corporate Social Responsibility Initiative',
      category: 'Community',
      date: 'October 15, 2025',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      excerpt: 'ShopMart launches heatwave relief camps across major cities to provide water and shelter to those in need.',
      content: 'As part of our commitment to community welfare, ShopMart has set up heatwave relief camps in Karachi, Lahore, and Islamabad. These camps provide free cold water, shade, and medical assistance to those affected by extreme heat.'
    },
    {
      id: 6,
      title: 'Digital Payment Integration',
      category: 'Technology',
      date: 'September 1, 2025',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      excerpt: 'Now accepting all major digital payment methods including Easypaisa, JazzCash, SadaPay, and all major banks.',
      content: 'We have integrated multiple digital payment options to make your shopping experience more convenient. Pay securely using your preferred digital wallet or bank card at any of our stores.'
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

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Latest Updates'}
        subtitle={pageContent?.subtitle || 'News, Events & Announcements'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]}
      />

      {/* Featured Post */}
      <section className="section-premium">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="w-full h-full object-cover min-h-[400px]"
              />
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700 w-fit mb-4">
                  Featured
                </span>
                <span className="text-sm text-luxury-muted mb-2">{posts[0].category}</span>
                <h2 className="text-3xl font-display mb-4">{posts[0].title}</h2>
                <p className="text-luxury-muted mb-6 leading-relaxed">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-luxury-muted">
                  <span>{posts[0].date}</span>
                  <button className="text-primary-600 font-medium hover:underline">Read More</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-8">Recent Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden hover:shadow-premium-lg transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-luxury-ivory dark:bg-white/10 text-luxury-charcoal dark:text-white mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-display text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-luxury-muted mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-luxury-muted">{post.date}</span>
                    <button className="text-primary-600 font-medium hover:underline">Read More</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium text-center max-w-2xl">
          <h2 className="text-3xl font-display mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-8">
            Subscribe to our newsletter to receive the latest updates, special offers, and news directly in your inbox.
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

export default Blog;
