import {AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useTransform} from 'motion/react';
import {useState} from 'react';
import {signatureFlavors} from '@/data/menu';
import {scrollToId} from '@/hooks/useLenis';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {formatINR} from '@/lib/format';
import {EASE_EXPO, SPRING_SOFT} from '@/lib/motion';
import {Button} from '@/components/ui/Button';
import {DoughnutArt} from '@/components/ui/DoughnutArt';
import {SplitText} from '@/components/ui/SplitText';
import {Sprinkles} from '@/components/ui/Sprinkles';

const STORY_START = 0.16;
const STORY_END = 0.96;
const COUNT = signatureFlavors.length;

function indexFor(p: number): number {
  const t = (p - STORY_START) / (STORY_END - STORY_START);
  return Math.min(COUNT - 1, Math.max(0, Math.floor(t * COUNT)));
}

/**
 * Pinned flavour story. As the doughnut behind crackles and bursts, the
 * signature flavour swaps in lock-step with the same scroll progress.
 */
export function Flavors() {
  const {ref, progress} = useSectionProgress<HTMLElement>('flavors');
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    const next = indexFor(p);
    if (next !== index) setIndex(next);
  });

  const stageOpacity = useTransform(progress, [0.12, 0.2, 0.96, 1], [0, 1, 1, 0]);
  const stageY = useTransform(progress, [0.12, 0.2], [reduced ? 0 : 40, 0]);
  const flavor = signatureFlavors[index] ?? signatureFlavors[0]!;
  const dir = index % 2 === 0 ? -1 : 1;

  return (
    <section id="flavors" ref={ref} className="relative h-[460vh]" aria-labelledby="flavors-title">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <Sprinkles progress={progress} intensity={0.7} className="opacity-70" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center">
          <SplitText
            as="h2"
            lines={['Twelve ways', 'to crack.']}
            accent={['crack.']}
            progress={progress}
            range={[0.0, 0.08]}
            leave={[0.1, 0.17]}
            lineStagger={0.02}
            className="text-display max-w-[12ch] font-medium"
          />
          <span id="flavors-title" className="sr-only">
            Signature flavours
          </span>
        </div>

        <motion.div
          style={{opacity: stageOpacity, y: stageY}}
          className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-24 sm:px-8"
        >
          <AnimatePresence>
            <motion.div
              key={flavor.id}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{background: `radial-gradient(circle, ${flavor.image.glaze} 0%, transparent 68%)`}}
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 0.45, scale: 1}}
              exit={{opacity: 0, scale: 1.15}}
              transition={{duration: 0.9, ease: EASE_EXPO}}
            />
          </AnimatePresence>

          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr] md:gap-12">
            <div className="relative mx-auto aspect-square w-[min(58vw,320px)] md:w-full md:max-w-[420px]">
              <motion.div
                className="absolute inset-0"
                animate={{rotate: reduced ? 0 : index * 72}}
                transition={SPRING_SOFT}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={flavor.id}
                    className="absolute inset-0 drop-shadow-[0_30px_40px_rgba(13,12,11,0.18)]"
                    initial={{opacity: 0, scale: reduced ? 1 : 0.7, rotate: reduced ? 0 : dir * 30}}
                    animate={{opacity: 1, scale: 1, rotate: 0}}
                    exit={{opacity: 0, scale: reduced ? 1 : 1.2, rotate: reduced ? 0 : -dir * 20}}
                    transition={{duration: 0.7, ease: EASE_EXPO}}
                  >
                    <DoughnutArt image={flavor.image} className="h-full w-full" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="relative text-center md:text-left">
              <div className="mb-3 flex items-center justify-center gap-3 md:justify-start">
                <span className="eyebrow">Signature {String(index + 1).padStart(2, '0')}</span>
                <span className="h-px w-8 bg-rule" aria-hidden="true" />
                <span className="eyebrow text-berry">{flavor.category}</span>
              </div>

              <div className="relative min-h-[2.2em] text-title font-medium">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.h3
                    key={flavor.id}
                    className="text-balance"
                    initial={{opacity: 0, x: reduced ? 0 : dir * 80, filter: reduced ? 'blur(0px)' : 'blur(10px)'}}
                    animate={{opacity: 1, x: 0, filter: 'blur(0px)'}}
                    exit={{opacity: 0, x: reduced ? 0 : -dir * 50, filter: reduced ? 'blur(0px)' : 'blur(8px)'}}
                    transition={{duration: 0.6, ease: EASE_EXPO}}
                  >
                    {flavor.name}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <div className="relative mt-4 min-h-[4.5em] text-[15px] leading-relaxed text-ink-soft sm:text-base">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={flavor.id}
                    className="mx-auto max-w-[40ch] md:mx-0"
                    initial={{opacity: 0, x: reduced ? 0 : -dir * 40}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: reduced ? 0 : dir * 24}}
                    transition={{duration: 0.7, delay: 0.08, ease: EASE_EXPO}}
                  >
                    {flavor.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.div
                key={`${flavor.id}-cta`}
                initial={{opacity: 0, y: reduced ? 0 : 16}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, delay: 0.16, ease: EASE_EXPO}}
                className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start"
              >
                <span className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium tracking-[-0.03em] text-berry tabular-nums">
                  {formatINR(flavor.price)}
                </span>
                <Button variant="ink" onClick={() => scrollToId('menu')}>
                  Order this one
                </Button>
              </motion.div>
            </div>
          </div>

          <ol className="mt-10 flex items-center justify-center gap-2 md:absolute md:right-8 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:flex-col md:items-end md:gap-3">
            {signatureFlavors.map((f, i) => (
              <li key={f.id} className="flex items-center gap-3">
                <span
                  className={`hidden text-[12px] tracking-[0.04em] transition-colors duration-300 md:block ${
                    i === index ? 'text-ink' : 'text-ink-faint'
                  }`}
                >
                  {f.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? 'w-6 bg-berry' : 'w-1.5 bg-ink/25'
                  }`}
                />
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
