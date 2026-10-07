/** Multiple animation styles for sections, cards, and micro-interactions */

export const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.88, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

export const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const shimmerLine = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardHoverLift = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(26,24,22,0.06)' },
  hover: {
    y: -6,
    boxShadow: '0 16px 48px rgba(26,24,22,0.12)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export const listItemReveal = {
  hidden: { opacity: 0, x: -12 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};
