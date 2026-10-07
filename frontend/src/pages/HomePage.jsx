import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiEndpoints } from '../services/api';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import HeroBackground from '../components/common/HeroBackground';
import CategoryAisle3D from '../components/home/CategoryAisle3D';
import MatrixModeBanner from '../components/home/MatrixModeBanner';
import { IconShipping, IconReturns, IconSecure, IconSupport } from '../components/ui/TrustIcons';
import ScrollReveal, { StaggerGrid, StaggerItem } from '../animations/ScrollReveal';
import ParallaxLayer from '../animations/ParallaxLayer';
import RippleButton from '../animations/RippleButton';
import { heroText } from '../animations/variants';
import { ArrowRight } from 'lucide-react';

const iconMap = {
  shipping: IconShipping,
  returns: IconReturns,
  secure: IconSecure,
  support: IconSupport,
};

const ctaClass = {
  gold: 'btn-mart',
  primary: 'btn-premium',
  outline: 'btn-outline',
  ghost: 'btn-ghost-light',
};

const HomePage = () => {
  const { site, categories } = useSelector((state) => state.site);
  const { filteredProducts } = useSelector((state) => state.products);
  const hero = site?.hero || {};
  const trustBar = site?.trustBar || [];
  const about = site?.about || {};
  const featuredProducts = filteredProducts.slice(0, 8);
  
  const [pageContent, setPageContent] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch page content for various sections
    const fetchPageContent = async () => {
      try {
        const pages = ['about', 'contact', 'csr', 'careers', 'gift-cards', 'loyalty', 'brands', 'store-locator', 'events', 'return-policy', 'supplier'];
        const content = {};
        
        for (const page of pages) {
          try {
            const res = await apiEndpoints.getPageContent(page);
            content[page] = res.data;
          } catch (err) {
            content[page] = null;
          }
        }
        
        setPageContent(content);
      } catch (err) {
        console.error('Error fetching page content:', err);
      }
    };

    // Fetch blog posts if endpoint exists
    const fetchBlogPosts = async () => {
      try {
        const res = await api.get('/blog/posts?limit=3');
        setBlogPosts(res.data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      }
    };

    // Fetch events if endpoint exists
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events?limit=2');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    // Fetch brands if endpoint exists
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands?limit=4');
        setBrands(res.data);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };

    // Fetch stores if endpoint exists
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores?limit=1');
        setStores(res.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    fetchPageContent();
    fetchBlogPosts();
    fetchEvents();
    fetchBrands();
    fetchStores();
  }, []);

  return (
    <div className="page-shell">
      <MatrixModeBanner />
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Cinematic background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djBoLTJ2LTJoMnptMC0xdjNoLTJ2LTNoMnptMC0xdjNoLTJ2LTNoMnptLTIgMHYzaC0ydi0zaDJ6bTAtMXYzaC0ydi0zaDJ6bTAtMXYzaC0ydi0zaDJ6bS0yIDB2MmgtMnYtMmgyem0wLTF2MmgtMnYtMmgyem0wLTF2MmgtMnYtMmgyem0tMiAwdjJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20"></div>
        </div>
        
        {/* Animated floating elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        <HeroBackground hero={hero} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60"></div>
        
        <div className="container-premium relative z-10 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial="hidden" 
              animate="visible"
              className="text-center space-y-10"
            >
              {hero.eyebrow && (
                <motion.div
                  custom={0}
                  variants={heroText}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/30"
                >
                  <motion.span 
                    className="w-3 h-3 rounded-full bg-emerald-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <motion.p className="text-emerald-400 text-sm font-bold tracking-widest uppercase">
                    {hero.eyebrow}
                  </motion.p>
                </motion.div>
              )}
              
              <motion.h1
                custom={1}
                variants={heroText}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-white leading-tight mb-8 tracking-tight"
              >
                <motion.span
                  className="block"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: "linear-gradient(90deg, #ffffff 0%, #94a3b8 50%, #ffffff 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  {hero.title}
                </motion.span>
                {hero.titleAccent && (
                  <motion.span 
                    className="block mt-4"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: "linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #10b981 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {hero.titleAccent}
                  </motion.span>
                )}
              </motion.h1>
              
              {hero.subtitle && (
                <motion.p 
                  custom={2} 
                  variants={heroText} 
                  className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
                >
                  {hero.subtitle}
                </motion.p>
              )}
              
              <motion.div 
                custom={3} 
                variants={heroText} 
                className="flex flex-wrap gap-6 justify-center items-center pt-4"
              >
                {hero.ctas?.map((cta, index) => (
                  <motion.div
                    key={cta.href + cta.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.15) }}
                  >
                    <Link 
                      to={cta.href} 
                      className={`
                        group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 overflow-hidden
                        ${cta.variant === 'primary' 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-110' 
                          : 'bg-white/5 backdrop-blur-xl text-white border border-white/20 hover:bg-white/10 hover:scale-110'
                        }
                      `}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      />
                      {cta.label}
                      <motion.div
                        className="relative"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Cinematic trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap justify-center gap-10 pt-12 border-t border-white/10"
              >
                {trustBar.slice(0, 4).map((item, index) => {
                  const Icon = iconMap[item.icon] || IconShipping;
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3 text-slate-400"
                      whileHover={{ scale: 1.1, color: "#10b981" }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.5
                        }}
                      >
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                      <span className="text-sm font-semibold tracking-wide">{item.title}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic decorative elements */}
        <motion.div 
          className="absolute top-32 right-32 w-4 h-4 bg-emerald-400 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-40 w-3 h-3 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1
          }}
        />
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-white/50 rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </section>

      {trustBar.length > 0 && (
        <section className="border-y border-luxury-line bg-white dark:bg-luxury-slate">
          <div className="container-premium py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trustBar.map((item) => {
                const Icon = iconMap[item.icon] || IconShipping;
                return (
                  <div key={item.title} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-mart-green/10 flex items-center justify-center text-mart-green shrink-0">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-luxury-muted">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section-premium bg-luxury-cream dark:bg-luxury-charcoal/30">
          <div className="container-premium">
            <ScrollReveal className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green">Shop by Department</h2>
              <p className="text-luxury-muted text-sm mt-2">14 aisles — groceries, fresh food, home, fashion & more</p>
            </ScrollReveal>
            <CategoryAisle3D categories={categories} />
          </div>
        </section>
      )}

      <section className="section-premium">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Weekly Best Sellers</h2>
              <p className="text-luxury-muted text-sm mt-1">Top picks across all departments</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-mart-green hover:underline">
              View all products →
            </Link>
          </ScrollReveal>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <TestimonialsSection />

      {/* About Us Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">About Us</h2>
              <p className="text-luxury-muted mb-6">{pageContent['about']?.description || 'Discover our story, mission, and values that drive us to serve you better every day.'}</p>
              <Link to="/about" className="btn-premium inline-flex items-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1">
              <Link to="/about" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['about']?.image ? (
                  <img src={pageContent['about'].image} alt="About Us" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconSupport className="w-16 h-16 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {about.stats && about.stats.length > 0 ? (
                      about.stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <p className="text-3xl font-bold text-mart-green">{stat.value}</p>
                          <p className="text-xs text-luxury-muted">{stat.label}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-mart-green">10+</p>
                          <p className="text-xs text-luxury-muted">Years Experience</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-mart-green">50K+</p>
                          <p className="text-xs text-luxury-muted">Happy Customers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-mart-green">100+</p>
                          <p className="text-xs text-luxury-muted">Products</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-mart-green">24/7</p>
                          <p className="text-xs text-luxury-muted">Support</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="section-premium bg-luxury-cream dark:bg-luxury-charcoal/30">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Get in Touch</h2>
            <p className="text-luxury-muted mb-8">{pageContent['contact']?.description || 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/contact" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['contact']?.image ? (
                  <img src={pageContent['contact'].image} alt="Contact" className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-32 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconSupport className="w-12 h-12 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green">
                    <IconSupport />
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-luxury-muted">{pageContent['contact']?.phone || '+92 123 456 7890'}</p>
                </div>
              </Link>
              <Link to="/contact" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['contact']?.image ? (
                  <img src={pageContent['contact'].image} alt="Contact" className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-32 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconShipping className="w-12 h-12 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green">
                    <IconShipping />
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-luxury-muted">{pageContent['contact']?.email || 'support@shophub.com'}</p>
                </div>
              </Link>
              <Link to="/contact" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['contact']?.image ? (
                  <img src={pageContent['contact'].image} alt="Contact" className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-32 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconSecure className="w-12 h-12 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green">
                    <IconSecure />
                  </div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-luxury-muted">{pageContent['contact']?.address || '123 Main Street, City'}</p>
                </div>
              </Link>
            </div>
            <div className="mt-8 text-center">
              <Link to="/contact" className="btn-premium inline-flex items-center gap-2">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green">Latest from Blog</h2>
              <p className="text-luxury-muted text-sm mt-1">Stay updated with our latest news and articles</p>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-mart-green hover:underline">
              View all posts →
            </Link>
          </ScrollReveal>
          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.map((post, index) => (
                <StaggerItem key={index}>
                  <Link to="/blog" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    {post.image && (
                      <div className="aspect-video bg-luxury-cream mb-4">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs font-semibold text-mart-green">{post.category || 'Blog'}</span>
                      <h3 className="font-semibold mt-2 mb-2">{post.title}</h3>
                      <p className="text-xs text-luxury-muted">{new Date(post.createdAt || post.date).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))
            ) : (
              [
                { title: 'Summer Collection 2024', category: 'Fashion', date: 'Jun 15, 2024' },
                { title: 'New Store Opening', category: 'News', date: 'Jun 10, 2024' },
                { title: 'Customer Success Stories', category: 'Community', date: 'Jun 5, 2024' }
              ].map((post, index) => (
                <StaggerItem key={index}>
                  <Link to="/blog" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center mb-4">
                      <IconSupport className="w-12 h-12 text-mart-green/40" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-mart-green">{post.category}</span>
                      <h3 className="font-semibold mt-2 mb-2">{post.title}</h3>
                      <p className="text-xs text-luxury-muted">{post.date}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))
            )}
          </StaggerGrid>
        </div>
      </section>

      {/* CSR Section */}
      <section className="section-premium bg-luxury-cream dark:bg-luxury-charcoal/30">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Corporate Social Responsibility</h2>
            <p className="text-luxury-muted mb-8">{pageContent['csr']?.description || 'We\'re committed to making a positive impact on society and the environment through our CSR initiatives.'}</p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {pageContent['csr']?.initiatives && pageContent['csr'].initiatives.length > 0 ? (
                pageContent['csr'].initiatives.map((initiative, index) => (
                  <Link key={index} to="/csr" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    {initiative.image ? (
                      <img src={initiative.image} alt={initiative.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                        <IconSupport className="w-16 h-16 text-mart-green/40" />
                      </div>
                    )}
                    <div className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-mart-green/10 flex items-center justify-center">
                        <IconSupport className="w-7 h-7 text-mart-green" />
                      </div>
                      <h3 className="font-semibold mb-2">{initiative.title}</h3>
                      <p className="text-sm text-luxury-muted">{initiative.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/csr" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconSupport className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Community Support</h3>
                      <p className="text-sm text-luxury-muted">Supporting local communities</p>
                    </div>
                  </Link>
                  <Link to="/csr" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconSecure className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Environmental Care</h3>
                      <p className="text-sm text-luxury-muted">Sustainable practices</p>
                    </div>
                  </Link>
                  <Link to="/csr" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconShipping className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Education</h3>
                      <p className="text-sm text-luxury-muted">Empowering through education</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
            <div className="text-center">
              <Link to="/csr" className="btn-premium inline-flex items-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Our Brands</h2>
            <p className="text-luxury-muted mb-8">{pageContent['brands']?.description || 'Discover our exclusive brand partnerships and premium product offerings.'}</p>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <Link key={index} to="/brands" className="card-premium p-6 text-center hover:shadow-lg transition-shadow overflow-hidden">
                    {brand.logo ? (
                      <div className="aspect-square bg-luxury-cream rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-4" />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-mart-green/10 to-primary-600/10 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-mart-green/30">{brand.name?.charAt(0) || 'B'}</span>
                      </div>
                    )}
                    <h3 className="font-semibold">{brand.name}</h3>
                  </Link>
                ))
              ) : (
                ['Brand A', 'Brand B', 'Brand C', 'Brand D'].map((brand, index) => (
                  <Link key={index} to="/brands" className="card-premium p-6 text-center hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-mart-green/10 to-primary-600/10 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-mart-green/30">{brand.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold">{brand}</h3>
                  </Link>
                ))
              )}
            </div>
            <div className="text-center">
              <Link to="/brands" className="btn-premium inline-flex items-center gap-2">
                View All Brands
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Careers Section */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Join Our Team</h2>
              <p className="text-white/80">{pageContent['careers']?.description || 'We\'re always looking for talented people to join our team. Check out our open positions.'}</p>
            </div>
            <div className="flex-1">
              <Link to="/careers" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['careers']?.image ? (
                  <img src={pageContent['careers'].image} alt="Careers" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <IconSupport className="w-16 h-16 text-white/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Open Positions</h3>
                  <p className="text-sm text-white/70">Build your career with us</p>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gift Cards Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Gift Cards</h2>
              <p className="text-luxury-muted mb-6">{pageContent['gift-cards']?.description || 'The perfect gift for any occasion. Our gift cards can be used online and in-store.'}</p>
              <div className="flex gap-4">
                <Link to="/gift-cards" className="btn-premium">Buy Gift Card</Link>
                <Link to="/gift-cards" className="btn-outline">Check Balance</Link>
              </div>
            </div>
            <div className="flex-1">
              <Link to="/gift-cards" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['gift-cards']?.image ? (
                  <img src={pageContent['gift-cards'].image} alt="Gift Card" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-mart-green to-primary-600 flex items-center justify-center">
                    <IconShipping className="w-16 h-16 text-white/40" />
                  </div>
                )}
                <div className="p-8 bg-gradient-to-br from-mart-green to-primary-600 text-white">
                  <p className="text-6xl font-bold mb-2">{pageContent['gift-cards']?.defaultAmount || '$50'}</p>
                  <p className="text-sm opacity-80 mb-4">Gift Card Value</p>
                  <p className="text-xs opacity-60">{pageContent['gift-cards']?.validity || 'Valid at all locations'}</p>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="section-premium bg-luxury-cream dark:bg-luxury-charcoal/30">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Loyalty Rewards</h2>
            <p className="text-luxury-muted mb-8">{pageContent['loyalty']?.description || 'Earn points on every purchase and redeem them for exclusive rewards and discounts.'}</p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {pageContent['loyalty']?.benefits && pageContent['loyalty'].benefits.length > 0 ? (
                pageContent['loyalty'].benefits.map((benefit, index) => (
                  <Link key={index} to="/loyalty" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    {benefit.image ? (
                      <img src={benefit.image} alt={benefit.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green text-3xl font-bold">{index + 1}</div>
                      </div>
                    )}
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-luxury-muted">{benefit.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/loyalty" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green text-3xl font-bold">1</div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Earn Points</h3>
                      <p className="text-sm text-luxury-muted">Get 1 point for every $1 spent</p>
                    </div>
                  </Link>
                  <Link to="/loyalty" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green text-3xl font-bold">2</div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Redeem Rewards</h3>
                      <p className="text-sm text-luxury-muted">Use points for discounts</p>
                    </div>
                  </Link>
                  <Link to="/loyalty" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-mart-green/10 flex items-center justify-center text-mart-green text-3xl font-bold">3</div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Exclusive Benefits</h3>
                      <p className="text-sm text-luxury-muted">Get member-only deals</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
            <div className="text-center">
              <Link to="/loyalty" className="btn-premium inline-flex items-center gap-2">
                Join Loyalty Program
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Find a Store</h2>
              <p className="text-luxury-muted mb-6">{pageContent['store-locator']?.description || 'Visit one of our many locations for an in-person shopping experience.'}</p>
              <Link to="/stores" className="btn-premium inline-flex items-center gap-2">
                Locate Store
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1">
              <Link to="/stores" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['store-locator']?.image ? (
                  <img src={pageContent['store-locator'].image} alt="Store Locator" className="w-full h-48 object-cover" />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconShipping className="w-16 h-16 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <p className="font-semibold">{pageContent['store-locator']?.storeCount || '50+'} Locations</p>
                  <p className="text-sm text-luxury-muted">{pageContent['store-locator']?.coverage || 'Nationwide'}</p>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Events Section */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Upcoming Events</h2>
            <p className="text-white/80 mb-8">{pageContent['events']?.description || 'Join us for exciting events, workshops, and special promotions.'}</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Link key={index} to="/events" className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-mart-orange/20 to-mart-green/20 flex items-center justify-center">
                        <IconSupport className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-sm font-semibold text-mart-orange mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-white/70">{event.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/events" className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    <div className="h-40 bg-gradient-to-br from-mart-orange/20 to-mart-green/20 flex items-center justify-center">
                      <IconSupport className="w-16 h-16 text-white/40" />
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-semibold text-mart-orange mb-2">JUL 20, 2024</p>
                      <h3 className="font-semibold text-lg mb-2">Summer Sale Event</h3>
                      <p className="text-sm text-white/70">Up to 50% off on selected items</p>
                    </div>
                  </Link>
                  <Link to="/events" className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    <div className="h-40 bg-gradient-to-br from-mart-orange/20 to-mart-green/20 flex items-center justify-center">
                      <IconShipping className="w-16 h-16 text-white/40" />
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-semibold text-mart-orange mb-2">AUG 15, 2024</p>
                      <h3 className="font-semibold text-lg mb-2">New Product Launch</h3>
                      <p className="text-sm text-white/70">Be the first to see our new collection</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
            <div className="text-center">
              <Link to="/events" className="btn-mart-outline inline-flex items-center gap-2">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Return Policy Section */}
      <section className="section-premium bg-white dark:bg-luxury-slate/50">
        <div className="container-premium">
          <ScrollReveal className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Easy Returns</h2>
              <p className="text-luxury-muted mb-6">{pageContent['return-policy']?.description || 'Not satisfied with your purchase? No problem. We offer hassle-free returns within 30 days.'}</p>
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <IconReturns className="w-5 h-5 text-mart-green" />
                  <span className="text-sm">{pageContent['return-policy']?.returnPeriod || '30 Days'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconSecure className="w-5 h-5 text-mart-green" />
                  <span className="text-sm">{pageContent['return-policy']?.returnCost || 'Free Returns'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconSupport className="w-5 h-5 text-mart-green" />
                  <span className="text-sm">{pageContent['return-policy']?.processType || 'Easy Process'}</span>
                </div>
              </div>
              <Link to="/return-policy" className="btn-premium inline-flex items-center gap-2">
                Read Policy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1">
              <Link to="/return-policy" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                {pageContent['return-policy']?.image ? (
                  <img src={pageContent['return-policy'].image} alt="Return Policy" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                    <IconReturns className="w-16 h-16 text-mart-green/40" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Return Policy</h3>
                  <p className="text-sm text-luxury-muted">{pageContent['return-policy']?.summary || 'Simple and straightforward'}</p>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Supplier Section */}
      <section className="section-premium bg-luxury-cream dark:bg-luxury-charcoal/30">
        <div className="container-premium">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-mart-green mb-4">Become a Supplier</h2>
            <p className="text-luxury-muted mb-8">{pageContent['supplier']?.description || 'Partner with us and reach millions of customers. We\'re always looking for quality suppliers.'}</p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {pageContent['supplier']?.benefits && pageContent['supplier'].benefits.length > 0 ? (
                pageContent['supplier'].benefits.map((benefit, index) => (
                  <Link key={index} to="/supplier-form" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    {benefit.image ? (
                      <img src={benefit.image} alt={benefit.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                        <IconSecure className="w-16 h-16 text-mart-green/40" />
                      </div>
                    )}
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-luxury-muted">{benefit.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/supplier-form" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconSecure className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Quality Products</h3>
                      <p className="text-sm text-luxury-muted">We only work with the best</p>
                    </div>
                  </Link>
                  <Link to="/supplier-form" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconShipping className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Fair Pricing</h3>
                      <p className="text-sm text-luxury-muted">Competitive rates for suppliers</p>
                    </div>
                  </Link>
                  <Link to="/supplier-form" className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-mart-green/20 to-primary-600/20 flex items-center justify-center">
                      <IconSupport className="w-16 h-16 text-mart-green/40" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Wide Reach</h3>
                      <p className="text-sm text-luxury-muted">Access to millions of customers</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
            <div className="text-center">
              <Link to="/supplier-form" className="btn-premium inline-flex items-center gap-2">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Create a free account</h2>
            <p className="text-white/80 text-sm">Track orders, save favorites, and get member deals.</p>
          </div>
          <Link to="/register" className="shrink-0">
            <RippleButton magnetic variantClass="btn-mart-outline">
              Sign up free
            </RippleButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

const TestimonialsSection = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    apiEndpoints.getTestimonials({ featured: 'true' }).then((res) => setItems(res.data)).catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section className="section-premium bg-white dark:bg-luxury-slate/50">
      <div className="container-premium">
        <h2 className="text-3xl font-display font-bold text-center mb-10">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.id} className="card-premium p-6">
              <div className="flex text-mart-orange mb-3">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-luxury-muted text-sm mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
