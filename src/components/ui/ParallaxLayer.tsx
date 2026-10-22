import {motion, useReducedMotion, useScroll, type MotionValue} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {useRef, type CSSProperties, type ReactNode} from 'react';
import {FLOW_OFFSET} from '@/hooks/useSectionProgress';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ParallaxLayerProps {
  children?: ReactNode;
  /** Fraction of `range` travelled across the full progress. 0.2 = subtle, 1 = fast. */
  speed?: number;
  direction?: Direction;
  /** Total travel in px at speed 1. */
  range?: number;
  /** Drive from a parent's progress instead of this element's own viewport crossing. */
  progress?: MotionValue<number>;
  /** Additional rotation over the travel, in degrees. */
  spin?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Translates its children along one axis as a scroll progress value runs 0..1.
 * Different `speed` / `direction` combinations stacked on top of each other
 * give the depth layers used for sprinkles, crumbs and glaze drips.
 */
export function ParallaxLayer({
  children,
  speed = 0.4,
  direction = 'up',
  range = 240,
  progress,
  spin = 0,
  className,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const own = useScroll({target: ref, offset: FLOW_OFFSET});
  const source = progress ?? own.scrollYProgress;

  const travel = reduced ? 0 : range * speed;
  const sign = direction === 'up' || direction === 'left' ? -1 : 1;
  const offset = useProgressTransform(source, [0, 1], [-sign * travel, sign * travel]);
  const rotate = useProgressTransform(source, [0, 1], [0, reduced ? 0 : spin]);
  const horizontal = direction === 'left' || direction === 'right';

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        x: horizontal ? offset : 0,
        y: horizontal ? 0 : offset,
        rotate,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}
