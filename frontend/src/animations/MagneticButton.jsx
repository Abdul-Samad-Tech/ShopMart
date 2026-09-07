import { useRef, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const MagneticButton = memo(function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  onClick,
  type = 'button',
  disabled,
  ...props
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 350, damping: 22, mass: 0.4 });

  const onMove = useCallback(
    (e) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [reduced, strength, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Component = Tag === 'button' ? motion.button : motion.span;

  return (
    <Component
      ref={ref}
      type={Tag === 'button' ? type : undefined}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduced ? undefined : { x: springX, y: springY }}
      whileTap={reduced ? {} : { scale: 0.97 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default MagneticButton;
