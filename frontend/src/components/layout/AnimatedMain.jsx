import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Routes } from 'react-router-dom';
import { pageTransition, reducedPageTransition } from '../../animations/variants';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

/**
 * Wraps <Routes> with cinematic page transitions (mode="wait" = no overlap).
 */
const AnimatedMain = ({ children }) => {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const variants = reduced ? reducedPageTransition : pageTransition;

  if (reduced) {
    return <Routes location={location}>{children}</Routes>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
        style={{ willChange: 'transform, opacity' }}
      >
        <Routes location={location}>{children}</Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedMain;
