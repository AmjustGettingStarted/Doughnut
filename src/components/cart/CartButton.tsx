"use client";

import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {useEffect, useState} from 'react';
import {selectCount, useCartStore} from '@/store/cartStore';
import {useUiStore} from '@/store/uiStore';
import {SPRING_BOUNCY} from '@/lib/motion';

export function CartButton() {
  const count = useCartStore(selectCount);
  const pulse = useCartStore((s) => s.pulse);
  const openCart = useUiStore((s) => s.openCart);
  const reduced = useReducedMotion();
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (pulse > 0) setBump((b) => b + 1);
  }, [pulse]);

  return (
    <motion.button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 bg-cream/70 text-ink backdrop-blur transition-colors hover:border-ink/35"
      key={reduced ? 'static' : bump}
      initial={bump > 0 && !reduced ? {scale: 0.86} : false}
      animate={{scale: 1}}
      transition={SPRING_BOUNCY}
      whileTap={{scale: 0.94}}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{scale: 0, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0, opacity: 0}}
            transition={SPRING_BOUNCY}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-[11px] font-medium leading-none text-white tabular-nums"
            aria-hidden="true"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{y: reduced ? 0 : 8, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: reduced ? 0 : -8, opacity: 0}}
                transition={{duration: 0.25}}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
