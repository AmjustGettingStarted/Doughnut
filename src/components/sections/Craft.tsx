"use client";

import {motion, useReducedMotion, useTransform, type MotionValue} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {useEffect, useRef, useState} from 'react';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {ParallaxLayer} from '@/components/ui/ParallaxLayer';
import {SplitText} from '@/components/ui/SplitText';

const STEPS = [
  {
    n: '01',
    time: '4:00 am',
    title: 'Dough',
    body: 'Enriched brioche-style dough, mixed cold so the butter stays in sheets. We weigh every ring to 58 grams — a gram light and it fries hollow.',
    stat: '58 g',
    statLabel: 'per ring',
  },
  {
    n: '02',
    time: '4:40 am',
    title: 'Proof',
    body: 'Ninety minutes in a humid cabinet at 28 °C. Rushed proofing is why most doughnuts taste like bread with regrets.',
    stat: '90 min',
    statLabel: 'slow proof',
  },
  {
    n: '03',
    time: '6:10 am',
    title: 'Fry',
    body: 'Filtered rice-bran oil at 182 °C, fifty seconds a side. The pale ring around the middle is the proof we got it right.',
    stat: '182 °C',
    statLabel: 'to the degree',
  },
  {
    n: '04',
    time: '6:30 am',
    title: 'Glaze',
    body: 'Dipped by hand while still warm, so the glaze sets thin and cracks instead of coats. Then straight into the box.',
    stat: '7:00',
    statLabel: 'first box out',
  },
] as const;

const CRUMBS = [
  {x: '6%', y: '18%', s: 10},
  {x: '22%', y: '74%', s: 7},
  {x: '48%', y: '12%', s: 6},
  {x: '64%', y: '82%', s: 12},
  {x: '86%', y: '28%', s: 8},
  {x: '92%', y: '66%', s: 5},
] as const;

/**
 * Horizontal scroll-jacked strip: the section pins while the four process
 * cards slide sideways, driven by the same progress the background uses to
 * rewind into the dough close-up.
 */
export function Craft() {
  const {ref, progress} = useSectionProgress<HTMLElement>('craft');
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const parentWidth = el.parentElement?.clientWidth ?? window.innerWidth;
      setTravel(Math.max(el.scrollWidth - parentWidth, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const x = useProgressTransform(progress, [0.18, 0.92], [0, -travel]);
  const headOpacity = useProgressTransform(progress, [0.14, 0.24], [1, 0.18]);
  const headScale = useProgressTransform(progress, [0.14, 0.3], [1, 0.88]);
  const stripOpacity = useProgressTransform(progress, [0.1, 0.2, 0.94, 1], [0, 1, 1, 0]);
  const railWidth = useProgressTransform(progress, [0.18, 0.92], ['0%', '100%']);
  const counter = useTransform(progress, (p) => {
    const i = Math.min(STEPS.length, Math.max(1, Math.ceil(((p - 0.18) / 0.74) * STEPS.length)));
    return `0${i}`;
  });

  return (
    <section id="craft" ref={ref} className="relative h-[360vh]" aria-labelledby="craft-title">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <ParallaxLayer progress={progress} direction="right" speed={0.6} range={400} spin={30} className="absolute inset-0">
            {CRUMBS.slice(0, 3).map((c, i) => (
              <span key={i} className="absolute rounded-[40%] bg-caramel/70" style={{left: c.x, top: c.y, width: c.s, height: c.s * 0.8}} />
            ))}
          </ParallaxLayer>
          <ParallaxLayer progress={progress} direction="left" speed={1} range={400} spin={-45} className="absolute inset-0">
            {CRUMBS.slice(3).map((c, i) => (
              <span key={i} className="absolute rounded-[40%] bg-ink/50" style={{left: c.x, top: c.y, width: c.s, height: c.s * 0.8}} />
            ))}
          </ParallaxLayer>
        </div>

        <motion.div
          style={{opacity: headOpacity, scale: reduced ? 1 : headScale}}
          className="origin-top-left px-5 pt-28 sm:px-[clamp(16px,3.4vw,44px)] sm:pt-32"
        >
          <p className="eyebrow mb-4">The craft · every morning</p>
          <SplitText
            as="h2"
            lines={['Proofed slow.', 'Glazed by hand.']}
            accent={['hand.']}
            progress={progress}
            range={[0.0, 0.1]}
            lineStagger={0.03}
            className="text-display max-w-[12ch] font-medium"
          />
          <span id="craft-title" className="sr-only">
            How we make them
          </span>
        </motion.div>

        <motion.div style={{opacity: stripOpacity}} className="relative mt-auto mb-24 sm:mb-28">
          {/* Under reduced motion the strip is a plain swipeable row instead of scroll-jacked. */}
          <div className={reduced ? 'no-scrollbar overflow-x-auto' : 'overflow-hidden'}>
            <motion.div
              ref={trackRef}
              style={{x: reduced ? 0 : x}}
              className="flex w-max gap-4 px-5 will-change-transform sm:gap-6 sm:px-[clamp(16px,3.4vw,44px)]"
            >
              {STEPS.map((step, i) => (
                <StepCard key={step.n} step={step} index={i} progress={progress} />
              ))}
              <div className="w-[20vw] shrink-0" aria-hidden="true" />
            </motion.div>
          </div>

          <div className="mt-6 flex items-center gap-4 px-5 sm:px-[clamp(16px,3.4vw,44px)]">
            <motion.span className="text-[12px] tabular-nums tracking-[0.1em] text-ink-faint" aria-hidden="true">
              {counter}
            </motion.span>
            <div className="h-px flex-1 bg-rule">
              <motion.div className="h-px origin-left bg-berry" style={{width: railWidth}} />
            </div>
            <span className="text-[12px] tabular-nums tracking-[0.1em] text-ink-faint">0{STEPS.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  progress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  // Alternate a gentle vertical drift so cards don't move as one slab.
  const dir = index % 2 === 0 ? 1 : -1;
  const y = useProgressTransform(progress, [0.18, 0.92], [dir * 18, -dir * 18]);
  const rotate = useProgressTransform(progress, [0.18, 0.92], [dir * 1.5, 0]);

  return (
    <motion.article
      style={reduced ? undefined : {y, rotate}}
      className="glass flex w-[78vw] max-w-[380px] shrink-0 flex-col justify-between rounded-3xl p-6 sm:w-[44vw] sm:p-7 lg:w-[30vw]"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] tracking-[0.1em] text-ink-faint">{step.n}</span>
        <span className="text-[12px] tracking-[0.06em] text-berry">{step.time}</span>
      </div>
      <h3 className="mt-6 text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-none tracking-[-0.03em]">{step.title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">{step.body}</p>
      <div className="mt-6 flex items-end gap-2 border-t border-rule pt-4">
        <span className="text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-none tracking-[-0.03em]">{step.stat}</span>
        <span className="pb-0.5 text-[12px] text-ink-faint">{step.statLabel}</span>
      </div>
    </motion.article>
  );
}
