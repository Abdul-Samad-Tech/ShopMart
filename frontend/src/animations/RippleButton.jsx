import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const RippleButton = memo(function RippleButton({
  children,
  className = '',
  variantClass = 'btn-premium',
  onClick,
  type = 'button',
  magnetic = true,
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const reduced = usePrefersReducedMotion();

  const handleClick = useCallback(
    (e) => {
      if (!reduced) {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = Date.now();
        setRipples((prev) => [
          ...prev,
          {
            id,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        ]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 650);
      }
      onClick?.(e);
    },
    [reduced, onClick]
  );

  const Wrapper = magnetic ? MagneticButton : motion.button;
  const wrapperProps = magnetic
    ? { className: `relative overflow-hidden ${variantClass} ${className}`, onClick: handleClick, type, ...props }
    : {
        type,
        onClick: handleClick,
        whileTap: { scale: 0.98 },
        className: `relative overflow-hidden ${variantClass} ${className}`,
        ...props,
      };

  return (
    <Wrapper {...wrapperProps}>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/35 pointer-events-none"
            style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 24, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </Wrapper>
  );
});

export default RippleButton;
