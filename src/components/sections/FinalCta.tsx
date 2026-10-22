"use client";

import {motion, useReducedMotion} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {brand} from '@/data/brand';
import {scrollToId} from '@/hooks/useLenis';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {useUiStore} from '@/store/uiStore';
import {selectCount, useCartStore} from '@/store/cartStore';
import {Button} from '@/components/ui/Button';
import {SplitText} from '@/components/ui/SplitText';
import {Sprinkles} from '@/components/ui/Sprinkles';

/** Final beat: the doughnut is whole again. Content scales up into place as the section pins. */
export function FinalCta() {
  const {ref, progress} = useSectionProgress<HTMLElement>('final');
  const reduced = useReducedMotion();
  const count = useCartStore(selectCount);
  const openCart = useUiStore((s) => s.openCart);

  const scale = useProgressTransform(progress, [0, 0.5], [reduced ? 1 : 0.86, 1]);
  const opacity = useProgressTransform(progress, [0, 0.35], [0, 1]);
  const ctaY = useProgressTransform(progress, [0.1, 0.6], [reduced ? 0 : 60, 0]);
  const ringRotate = useProgressTransform(progress, [0, 1], [0, reduced ? 0 : 180]);

  return (
    <section id="final" ref={ref} className="relative h-[180vh]" aria-labelledby="final-title">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
        <Sprinkles progress={progress} intensity={1.6} />

        <motion.div style={{rotate: ringRotate}} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="h-[min(90vw,520px)] w-[min(90vw,520px)] opacity-70">
            <defs>
              <path id="ring-path" d="M200 200m-160 0a160 160 0 1 1 320 0a160 160 0 1 1-320 0" />
            </defs>
            <text className="fill-ink/50" fontSize="13" letterSpacing="4">
              <textPath href="#ring-path">
                {`${brand.tagline.toUpperCase()} · ${brand.hours.short.toUpperCase()} · ${brand.address.city.toUpperCase()} · `}
              </textPath>
            </text>
          </svg>
        </motion.div>

        <motion.div style={{scale, opacity}} className="relative flex flex-col items-center">
          <p className="eyebrow mb-5">Since {brand.since} · {brand.address.city}</p>
          <SplitText
            as="h2"
            lines={['Still warm.', 'Still here.']}
            accent={['here.']}
            progress={progress}
            range={[0.02, 0.3]}
            lineStagger={0.06}
            distance={110}
            className="text-display max-w-[12ch] font-medium"
          />
          <span id="final-title" className="sr-only">
            Order now
          </span>
          <motion.div style={{y: ctaY}} className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            {count > 0 ? (
              <Button variant="berry" size="lg" onClick={openCart} className="w-full max-w-[280px] sm:w-auto">
                Checkout · {count} item{count === 1 ? '' : 's'}
              </Button>
            ) : (
              <Button variant="berry" size="lg" onClick={() => scrollToId('menu')} className="w-full max-w-[280px] sm:w-auto">
                Order now
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => scrollToId('box')} className="w-full max-w-[280px] sm:w-auto">
              Build a box
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
