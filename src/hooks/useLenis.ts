"use client";

import Lenis from 'lenis';
import {useEffect} from 'react';
import {useReducedMotion} from 'motion/react';

let instance: Lenis | null = null;

/** Scroll to an anchor id. Falls back to native scrolling when Lenis is disabled. */
export function scrollToId(id: string, offset = 0): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const target = document.getElementById(id);
  if (!target) return;
  if (instance) {
    instance.scrollTo(target, {offset, duration: 1.4});
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({top, behavior: 'smooth'});
  }
}

/** Pause/resume page scroll while a drawer or modal is open. */
export function lockScroll(locked: boolean): void {
  if (typeof document === 'undefined') return;
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  } else {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }
}

/**
 * Boots a single Lenis instance driving native window scroll. The background
 * engine and every `useScroll` consumer read `window.scrollY`, so they all see
 * the same smoothed value and never drift apart.
 */
export function useLenis(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      autoRaf: false,
    });
    instance = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
}
