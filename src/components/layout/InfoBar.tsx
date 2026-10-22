"use client";

import {motion, useScroll} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {brand} from '@/data/brand';

/** Fixed bottom strip: address and hours, always one glance away. Fades out as the footer arrives. */
export function InfoBar() {
  const {scrollYProgress} = useScroll();
  const opacity = useProgressTransform(scrollYProgress, [0.94, 0.985], [1, 0]);

  return (
    <motion.div
      style={{opacity}}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pt-3.5 text-center text-[11px] leading-snug tracking-[0.02em] text-ink-faint safe-bottom sm:text-xs"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(242,240,236,.92) 0%, rgba(242,240,236,.72) 72%, rgba(242,240,236,0) 100%)',
        }}
      />
      <p className="max-w-[34ch] sm:max-w-none">
        {brand.address.line1}, {brand.address.city}
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        {brand.hours.short}
      </p>
    </motion.div>
  );
}
