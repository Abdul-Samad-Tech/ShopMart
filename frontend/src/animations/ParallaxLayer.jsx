import { memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Subtle scroll parallax for hero / section backgrounds.
 */
const ParallaxLayer = memo(function ParallaxLayer({
  children,
  className = '',
  offset = 80,
  target,
}) {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: target || undefined,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
});

export default ParallaxLayer;
