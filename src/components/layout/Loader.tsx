"use client";

import {AnimatePresence, motion} from 'motion/react';
import {useUiStore} from '@/store/uiStore';
import {EASE_SOFT} from '@/lib/motion';

/** Preloader shown until the background clip is buffered. Mirrors the original "LOADING 6%" boot screen. */
export function Loader() {
  const progress = useUiStore((s) => s.loadProgress);
  const ready = useUiStore((s) => s.backgroundReady);
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-cream"
          initial={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 0.7, ease: EASE_SOFT}}}
        >
          <div className="h-px w-[150px] overflow-hidden bg-rule">
            <div
              className="h-full w-full origin-left bg-ink transition-transform duration-200 ease-linear"
              style={{transform: `scaleX(${progress})`}}
            />
          </div>
          <p className="text-[12.5px] tracking-[0.05em] text-ink-faint tabular-nums">LOADING {pct}%</p>
          <span className="sr-only">Loading the doughnut</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
