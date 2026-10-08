import { memo } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './variants';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Scroll-reactive reveal — memoized to avoid re-renders when parent state changes.
 */
const ScrollReveal = memo(function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Component = motion.div,
  once = true,
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px', amount: 0.2 }}
      transition={{ delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </Component>
  );
});

export const StaggerGrid = memo(function StaggerGrid({ children, className = '' }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.07 } },
      }}
    >
      {children}
    </motion.div>
  );
});

export const StaggerItem = memo(function StaggerItem({ children, className = '' }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
});

export default ScrollReveal;
