import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const PremiumSpinner = ({ label = 'Loading', size = 'md', fullScreen = false }) => {
  const reduced = usePrefersReducedMotion();
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';

  const ring = (
    <div className={`relative ${dim}`}>
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-luxury-line/80 dark:border-white/10`}
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 border-r-primary-600`}
        animate={reduced ? {} : { rotate: -360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[30%] rounded-full bg-gradient-gold opacity-80"
        animate={reduced ? {} : { scale: [0.85, 1, 0.85], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );

  const content = (
    <div className="flex flex-col items-center gap-5">
      {ring}
      {label && (
        <motion.p
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-luxury-muted"
          animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-cream/90 dark:bg-luxury-charcoal/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center min-h-[50vh] py-16">{content}</div>;
};

export default PremiumSpinner;
