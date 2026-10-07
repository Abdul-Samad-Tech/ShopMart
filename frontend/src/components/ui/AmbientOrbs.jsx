import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const AmbientOrbs = () => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
      <motion.div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default AmbientOrbs;
