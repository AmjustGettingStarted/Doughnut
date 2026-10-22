"use client";

import {useEffect, useRef} from 'react';
import {useScroll, type MotionValue} from 'motion/react';
import type {SectionId} from '@/components/background/beats';

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

const registry = new Map<SectionId, HTMLElement>();

/** Elements registered by `useSectionProgress`, read by the background engine every frame. */
export function getRegisteredSections(): ReadonlyMap<SectionId, HTMLElement> {
  return registry;
}

/** Full-height sticky sections: progress runs from the moment the section pins to the moment it unpins. */
export const PINNED_OFFSET: ScrollOffset = ['start start', 'end end'];
/** Flowing sections: progress runs while the section crosses the viewport. */
export const FLOW_OFFSET: ScrollOffset = ['start end', 'end start'];

/**
 * Returns a ref for the section root plus a 0..1 MotionValue of that
 * section's own scroll progress. Registering the element lets the background
 * resolve "which beat are we in" from the exact same DOM measurement.
 */
export function useSectionProgress<T extends HTMLElement = HTMLElement>(
  id: SectionId,
  offset: ScrollOffset = PINNED_OFFSET,
): {ref: React.RefObject<T | null>; progress: MotionValue<number>} {
  const ref = useRef<T>(null);
  const {scrollYProgress} = useScroll({target: ref, offset});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registry.set(id, el);
    return () => {
      if (registry.get(id) === el) registry.delete(id);
    };
  }, [id]);

  return {ref, progress: scrollYProgress};
}
