import {motion, useReducedMotion} from 'motion/react';
import type {ReactNode} from 'react';
import {EASE_EXPO} from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  from?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  rotate?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'span' | 'p';
}

const offsets: Record<Direction, (d: number) => {x: number; y: number}> = {
  up: (d) => ({x: 0, y: d}),
  down: (d) => ({x: 0, y: -d}),
  left: (d) => ({x: -d, y: 0}),
  right: (d) => ({x: d, y: 0}),
  none: () => ({x: 0, y: 0}),
};

/** Viewport-triggered entrance. Falls back to a plain fade under prefers-reduced-motion. */
export function Reveal({
  children,
  from = 'up',
  distance = 32,
  delay = 0,
  duration = 0.9,
  rotate = 0,
  blur = false,
  once = true,
  amount = 0.3,
  className,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const start = reduced ? {x: 0, y: 0} : offsets[from](distance);

  return (
    <Tag
      className={className}
      initial={{
        opacity: 0,
        x: start.x,
        y: start.y,
        rotate: reduced ? 0 : rotate,
        filter: blur && !reduced ? 'blur(8px)' : 'blur(0px)',
      }}
      whileInView={{opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)'}}
      viewport={{once, amount}}
      transition={{duration: reduced ? 0.4 : duration, delay, ease: EASE_EXPO}}
    >
      {children}
    </Tag>
  );
}
