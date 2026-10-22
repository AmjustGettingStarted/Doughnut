import {motion, useReducedMotion, type MotionValue} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {reviews, socialProof, type Review} from '@/data/reviews';
import {FLOW_OFFSET, useSectionProgress} from '@/hooks/useSectionProgress';
import {Reveal} from '@/components/ui/Reveal';
import {SplitText} from '@/components/ui/SplitText';

const STATS = [
  {value: socialProof.rating.toFixed(1), label: `average from ${socialProof.ratingCount.toLocaleString('en-IN')} reviews`},
  {value: socialProof.boxesThisYear.toLocaleString('en-IN'), label: 'boxes out the door this year'},
  {value: `${socialProof.repeatRate}%`, label: 'come back within a month'},
] as const;

/**
 * Two review rows drift horizontally in opposite directions as the section
 * crosses the viewport, with the stats counting up from a lagging layer.
 */
export function Reviews() {
  const {ref, progress} = useSectionProgress<HTMLElement>('reviews', FLOW_OFFSET);
  const reduced = useReducedMotion();
  const drift = reduced ? 0 : 1;
  const rowA = useProgressTransform<number>(progress, [0, 1], [120 * drift, -260 * drift]);
  const rowB = useProgressTransform<number>(progress, [0, 1], [-260 * drift, 120 * drift]);
  const half = Math.ceil(reviews.length / 2);

  return (
    <section id="reviews" ref={ref} className="relative overflow-hidden py-28 sm:py-36" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal from="left" distance={24}>
              <p className="eyebrow mb-4">Reviews · mostly typed one-handed</p>
            </Reveal>
            <SplitText
              as="h2"
              lines={['People say nice things.', 'With their mouths full.']}
              accent={['full.']}
              className="text-display max-w-[16ch] font-medium"
            />
            <span id="reviews-title" className="sr-only">
              Reviews
            </span>
          </div>
          <dl className="grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-4 md:text-right">
            {STATS.map((s, i) => (
              <Reveal key={s.label} from={i % 2 ? 'left' : 'right'} delay={0.1 + i * 0.1} distance={20}>
                <dd className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.03em] text-berry tabular-nums">{s.value}</dd>
                <dt className="mt-1 text-[12px] leading-snug text-ink-faint">{s.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-14 space-y-4 sm:mt-16">
        <Row items={reviews.slice(0, half)} x={rowA} />
        <Row items={reviews.slice(half)} x={rowB} className="sm:pl-24" />
      </div>
    </section>
  );
}

function Row({items, x, className = ''}: {items: readonly Review[]; x: MotionValue<number>; className?: string}) {
  return (
    <motion.ul style={{x}} className={`flex w-max gap-4 px-5 will-change-transform sm:px-8 ${className}`}>
      {items.map((r, i) => (
        <li key={r.id}>
          <Reveal from="up" distance={24} delay={i * 0.08} amount={0.2} rotate={i % 2 ? 1.5 : -1.5}>
            <ReviewCard review={r} />
          </Reveal>
        </li>
      ))}
    </motion.ul>
  );
}

function ReviewCard({review}: {review: Review}) {
  return (
    <article className="glass flex h-full w-[82vw] max-w-[380px] flex-col justify-between rounded-3xl p-6 sm:w-[380px]">
      <div>
        <div className="flex items-center gap-1 text-berry" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({length: 5}, (_, i) => (
            <svg key={i} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'fill-ink/15'}`} aria-hidden="true">
              <path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z" />
            </svg>
          ))}
        </div>
        <p className="mt-4 text-[15.5px] leading-relaxed tracking-[-0.005em] text-ink">“{review.text}”</p>
      </div>
      <footer className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-[12.5px]">
        <span>
          <span className="font-medium text-ink">{review.name}</span>
          <span className="text-ink-faint"> · {review.area}</span>
        </span>
        <span className="text-ink-faint">{review.item}</span>
      </footer>
    </article>
  );
}
