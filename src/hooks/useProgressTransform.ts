"use client";

import {useTransform, type MotionValue} from 'motion/react';

/**
 * `useTransform` for scroll progress values.
 *
 * Motion hands scroll-driven `opacity` / `filter` transforms to a native
 * ScrollTimeline animation and uses the input range as WAAPI keyframe offsets.
 * WAAPI fills offsets that don't start at 0 or end at 1 with *implicit*
 * keyframes taken from the element's inline style, which silently animates
 * values back to their initial state. Padding the range to span 0..1 keeps the
 * accelerated path and makes it agree with the JS fallback.
 */
export function useProgressTransform<T extends number | string>(
  progress: MotionValue<number>,
  inputs: readonly number[],
  outputs: readonly T[],
): MotionValue<T> {
  const i = [...inputs];
  const o = [...outputs];
  const first = i[0];
  const last = i[i.length - 1];
  if (first !== undefined && first > 0) {
    i.unshift(0);
    o.unshift(o[0] as T);
  }
  if (last !== undefined && last < 1) {
    i.push(1);
    o.push(o[o.length - 1] as T);
  }
  return useTransform(progress, i, o);
}
