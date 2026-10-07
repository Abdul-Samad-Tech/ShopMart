import { useRef, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Premium 3D tilt on mouse move — GPU-friendly (rotateX/Y only).
 */
const TiltCard = memo(function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 180,
    damping: 22,
  });

  const onMove = useCallback(
    (e) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    },
    [reduced, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200,
        willChange: 'transform',
      }}
      whileHover={{ scale }}
      transition={{ scale: { duration: 0.35 } }}
      className={`relative ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 via-transparent to-transparent"
          aria-hidden
        />
      )}
      <div style={{ transform: 'translateZ(0)' }}>{children}</div>
    </motion.div>
  );
});

export default TiltCard;
