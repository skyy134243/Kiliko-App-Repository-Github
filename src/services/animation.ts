import gsap from 'gsap';
import { Variants } from 'framer-motion';

// ===== GSAP ANIMATIONS =====

/**
 * Animates elements entering with staggered fade-in and slide-up
 */
export const gsapStaggerIn = (
  selector: string | Element | Element[],
  options?: { delay?: number; stagger?: number; y?: number; duration?: number }
) => {
  const { delay = 0.1, stagger = 0.08, y = 25, duration = 0.6 } = options || {};
  return gsap.fromTo(
    selector,
    { opacity: 0, y, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
    }
  );
};

/**
 * Floating bounce animation for decorative bubbles / badges
 */
export const gsapFloating = (target: string | Element) => {
  return gsap.to(target, {
    y: '-=12',
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

/**
 * Pulse effect for badges or important alerts
 */
export const gsapPulse = (target: string | Element) => {
  return gsap.to(target, {
    scale: 1.08,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  });
};

// ===== FRAMER MOTION VARIANTS =====

export const pageFadeVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const tabContentVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: 15, transition: { duration: 0.18 } },
};

export const cardHoverVariants: Variants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.015,
    boxShadow: '0 12px 24px -6px rgba(6, 182, 212, 0.18), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  tap: { scale: 0.98 },
};

export const buttonSpringVariants: Variants = {
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 500, damping: 20 } },
  tap: { scale: 0.96 },
};
