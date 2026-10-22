import type {Transition, Variants} from 'motion/react';

export const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const SPRING_SOFT: Transition = {type: 'spring', stiffness: 170, damping: 26, mass: 0.9};
export const SPRING_SNAPPY: Transition = {type: 'spring', stiffness: 420, damping: 32, mass: 0.7};
export const SPRING_BOUNCY: Transition = {type: 'spring', stiffness: 520, damping: 22, mass: 0.6};

export const drawerVariants: Variants = {
  hidden: {x: '100%'},
  show: {x: 0, transition: {type: 'spring', stiffness: 320, damping: 36}},
  exit: {x: '100%', transition: {duration: 0.3, ease: EASE_SOFT}},
};

export const modalVariants: Variants = {
  hidden: {opacity: 0, y: 24, scale: 0.98},
  show: {opacity: 1, y: 0, scale: 1, transition: SPRING_SOFT},
  exit: {opacity: 0, y: 12, scale: 0.98, transition: {duration: 0.35, ease: EASE_SOFT}},
};

export const backdropVariants: Variants = {
  hidden: {opacity: 0},
  show: {opacity: 1, transition: {duration: 0.3}},
  exit: {opacity: 0, transition: {duration: 0.25}},
};
