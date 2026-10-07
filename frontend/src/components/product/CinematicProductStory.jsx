import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { formatPrice } from '../../utils/helpers';

const STORY_SECTIONS = (product) => [
  {
    id: 'hero',
    title: product.name,
    subtitle: product.brand || product.category,
    body: product.description,
    image: product.image,
  },
  {
    id: 'craft',
    title: 'Craft & Quality',
    subtitle: 'Materials',
    body:
      product.features?.join(' · ') ||
      'Every detail is selected for freshness, durability, and everyday value.',
    image: product.hoverImage || product.image,
  },
  {
    id: 'value',
    title: 'Everyday Value',
    subtitle: formatPrice(product.price),
    body: `Rated ${product.rating || 4.5} stars by ${product.reviews || 0} shoppers.`,
    image: product.gallery?.[0] || product.image,
  },
];

const CinematicProductStory = ({ product, onClassicView }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const sections = STORY_SECTIONS(product);

  return (
    <div ref={containerRef} className="relative">
      <div className="fixed top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
        <motion.div className="h-full bg-accent origin-left" style={{ width: progressWidth }} />
      </div>

      <div className="fixed top-24 right-4 z-40 flex gap-2">
        <button type="button" onClick={onClassicView} className="glass-panel px-4 py-2 text-xs rounded-full text-white/80">
          Classic view
        </button>
      </div>

      {sections.map((section, i) => (
        <section
          key={section.id}
          className="min-h-screen flex items-center justify-center relative overflow-hidden snap-start"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 0.35, scale: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={section.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'} alt="" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-10 container-premium max-w-2xl text-center px-6"
            style={{ perspective: 1000 }}
          >
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4">{section.subtitle}</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{section.title}</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">{section.body}</p>
            {i === sections.length - 1 && (
              <div className="flex justify-center gap-3">
                <AddToCartButton product={product} size="lg" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 text-xs uppercase tracking-widest"
          >
            Scroll — {i + 1} / {sections.length}
          </motion.div>
        </section>
      ))}
    </div>
  );
};

export default CinematicProductStory;
