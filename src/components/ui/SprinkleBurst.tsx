import {motion, useReducedMotion} from 'motion/react';
import {useMemo} from 'react';

const COLORS = ['#e5456e', '#c98a3a', '#0d0c0b', '#f7b53b', '#8fb27a', '#ffffff'];

interface Piece {
  x: number;
  y: number;
  rotate: number;
  color: string;
  w: number;
  h: number;
  delay: number;
}

/** One-shot sprinkle confetti, transform + opacity only. */
export function SprinkleBurst({count = 42}: {count?: number}) {
  const reduced = useReducedMotion();
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({length: count}, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 120 + Math.random() * 180;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.7 + 160,
          rotate: Math.random() * 720 - 360,
          color: COLORS[i % COLORS.length]!,
          w: 10 + Math.random() * 10,
          h: 3 + Math.random() * 3,
          delay: Math.random() * 0.12,
        };
      }),
    [count],
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/3 rounded-full"
          style={{width: p.w, height: p.h, background: p.color}}
          initial={{x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6}}
          animate={{x: p.x, y: p.y, rotate: p.rotate, opacity: [1, 1, 0], scale: 1}}
          transition={{duration: 1.6 + Math.random() * 0.4, delay: p.delay, ease: [0.16, 1, 0.3, 1], opacity: {times: [0, 0.7, 1]}}}
        />
      ))}
    </div>
  );
}
