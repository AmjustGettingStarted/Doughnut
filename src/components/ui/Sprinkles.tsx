"use client";

import type {MotionValue} from 'motion/react';
import {ParallaxLayer} from './ParallaxLayer';

interface Sprinkle {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  c: 'berry' | 'caramel' | 'ink' | 'cream';
  shape?: 'pill' | 'dot' | 'ring' | 'drip';
}

const palette = {
  berry: 'bg-berry',
  caramel: 'bg-caramel',
  ink: 'bg-ink/80',
  cream: 'bg-white',
} as const;

const far: Sprinkle[] = [
  {x: 8, y: 18, w: 14, h: 5, r: -28, c: 'berry'},
  {x: 86, y: 14, w: 12, h: 5, r: 40, c: 'caramel'},
  {x: 72, y: 78, w: 16, h: 5, r: 12, c: 'berry'},
  {x: 18, y: 72, w: 10, h: 10, r: 0, c: 'caramel', shape: 'dot'},
  {x: 50, y: 92, w: 12, h: 4, r: -60, c: 'ink'},
];

const mid: Sprinkle[] = [
  {x: 14, y: 36, w: 22, h: 7, r: 24, c: 'caramel'},
  {x: 80, y: 42, w: 20, h: 7, r: -36, c: 'berry'},
  {x: 92, y: 68, w: 26, h: 26, r: 0, c: 'berry', shape: 'ring'},
  {x: 6, y: 86, w: 20, h: 20, r: 0, c: 'caramel', shape: 'ring'},
  {x: 40, y: 8, w: 18, h: 6, r: 70, c: 'ink'},
];

const near: Sprinkle[] = [
  {x: 22, y: 12, w: 32, h: 10, r: -18, c: 'berry'},
  {x: 70, y: 22, w: 28, h: 9, r: 48, c: 'caramel'},
  {x: 84, y: 88, w: 30, h: 10, r: -8, c: 'berry'},
  {x: 10, y: 60, w: 14, h: 14, r: 0, c: 'berry', shape: 'dot'},
  {x: 58, y: 70, w: 24, h: 42, r: 0, c: 'berry', shape: 'drip'},
];

function Piece({s}: {s: Sprinkle}) {
  const shape = s.shape ?? 'pill';
  const common = `absolute ${palette[s.c]}`;
  const style = {
    left: `${s.x}%`,
    top: `${s.y}%`,
    width: s.w,
    height: s.h,
    transform: `rotate(${s.r}deg)`,
  };
  if (shape === 'ring') {
    return (
      <span
        className={`absolute rounded-full border-[5px] ${s.c === 'berry' ? 'border-berry' : 'border-caramel'}`}
        style={{...style, background: 'transparent'}}
      />
    );
  }
  if (shape === 'drip') {
    return (
      <span className={`${common} rounded-b-full rounded-t-md`} style={{...style, opacity: 0.9}} />
    );
  }
  return <span className={`${common} rounded-full`} style={style} />;
}

interface SprinklesProps {
  progress?: MotionValue<number>;
  /** Scales the whole travel distance. */
  intensity?: number;
  className?: string;
}

/** Three depth layers of decor moving at different speeds and opposite directions. */
export function Sprinkles({progress, intensity = 1, className = ''}: SprinklesProps) {
  const sharedStyle = {position: 'absolute', inset: 0} as const;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <ParallaxLayer progress={progress} speed={0.25 * intensity} direction="down" spin={-8} style={sharedStyle} className="opacity-50 blur-[1px]">
        {far.map((s, i) => (
          <Piece key={i} s={s} />
        ))}
      </ParallaxLayer>
      <ParallaxLayer progress={progress} speed={0.55 * intensity} direction="up" spin={6} style={sharedStyle} className="opacity-80">
        {mid.map((s, i) => (
          <Piece key={i} s={s} />
        ))}
      </ParallaxLayer>
      <ParallaxLayer progress={progress} speed={0.95 * intensity} direction="down" spin={-14} style={sharedStyle}>
        {near.map((s, i) => (
          <Piece key={i} s={s} />
        ))}
      </ParallaxLayer>
    </div>
  );
}
