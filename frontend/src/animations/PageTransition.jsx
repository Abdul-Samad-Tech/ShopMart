import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransition, reducedPageTransition } from './variants';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Wraps route outlet — use once around <Routes> children via AnimatedRoutes.
 */
const PageTransition = ({ children }) => {
  const reduced = usePrefersReducedMotion();
  const variants = reduced ? reducedPageTransition : pageTransition;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
      style={{ willChange: reduced ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedRoutes = ({ children }) => {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div key={location.pathname}>{children}</div>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
