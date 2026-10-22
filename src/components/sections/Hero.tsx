"use client";

import {motion, useReducedMotion} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {brand} from '@/data/brand';
import {scrollToId} from '@/hooks/useLenis';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {Button} from '@/components/ui/Button';
import {SplitText} from '@/components/ui/SplitText';
import {Sprinkles} from '@/components/ui/Sprinkles';

export function Hero() {
  const {ref, progress} = useSectionProgress<HTMLElement>('hero');
  const reduced = useReducedMotion();

  // Lagging layer: subtext + CTAs sit on a slower curve than the headline.
  const lagOpacity = useProgressTransform(progress, [0, 0.08, 0.55, 0.75], [1, 1, 1, 0]);
  const lagY = useProgressTransform(progress, [0.15, 0.8], [0, reduced ? 0 : -70]);
  const eyebrowY = useProgressTransform(progress, [0, 0.8], [0, reduced ? 0 : -40]);
  const eyebrowOpacity = useProgressTransform(progress, [0.4, 0.65], [1, 0]);
  const hintOpacity = useProgressTransform(progress, [0, 0.12], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative h-[220vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center">
        <Sprinkles progress={progress} intensity={1.2} />

        <motion.p className="eyebrow mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1" style={{y: eyebrowY, opacity: eyebrowOpacity}}>
          <span>Small-batch doughnuts</span>
          <span aria-hidden="true">·</span>
          <span>
            {brand.address.line1}, {brand.address.city}
          </span>
        </motion.p>

        <SplitText
          as="h1"
          lines={['Baked at four.', 'Boxed by seven.']}
          accent={['seven']}
          progress={progress}
          enter="mount"
          leave={[0.55, 0.85]}
          distance={90}
          className="text-display max-w-[14ch] font-medium text-balance"
        />
        <span id="hero-title" className="sr-only">
          {brand.tagline}
        </span>

        <motion.div style={{y: lagY, opacity: lagOpacity}} className="flex flex-col items-center">
          <motion.p
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5, duration: 0.9}}
            className="mt-7 max-w-[44ch] text-[15px] leading-relaxed tracking-[-0.008em] text-ink-soft text-pretty sm:text-lg"
          >
            Fried at four, glazed at six. Twelve flavours, three box sizes, delivered still warm across Bengaluru.
          </motion.p>

          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.7, duration: 0.9}}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button variant="berry" size="lg" onClick={() => scrollToId('menu')} className="w-full max-w-[280px] sm:w-auto">
              Order now
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollToId('menu')} className="w-full max-w-[280px] sm:w-auto">
              See the menu
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{opacity: hintOpacity}}
          className="absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint"
        >
          <span>Scroll</span>
          <motion.span
            className="block h-8 w-px bg-ink/40"
            animate={reduced ? undefined : {scaleY: [0, 1, 1, 0], originY: [0, 0, 1, 1]}}
            transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
          />
        </motion.div>
      </div>
    </section>
  );
}
