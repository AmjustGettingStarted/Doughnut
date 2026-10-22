import {motion, useReducedMotion} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {brand} from '@/data/brand';
import {FLOW_OFFSET, useSectionProgress} from '@/hooks/useSectionProgress';
import {formatINR} from '@/lib/format';
import {Button} from '@/components/ui/Button';
import {ParallaxLayer} from '@/components/ui/ParallaxLayer';
import {Reveal} from '@/components/ui/Reveal';
import {SplitText} from '@/components/ui/SplitText';

export function Visit() {
  const {ref, progress} = useSectionProgress<HTMLElement>('visit', FLOW_OFFSET);
  const reduced = useReducedMotion();
  const mapTilt = useProgressTransform(progress, [0, 1], [reduced ? 0 : -4, reduced ? 0 : 4]);
  const pinY = useProgressTransform(progress, [0.2, 0.6], [reduced ? 0 : -40, 0]);

  return (
    <section id="visit" ref={ref} className="relative py-28 sm:py-36" aria-labelledby="visit-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal from="right" distance={24}>
            <p className="eyebrow mb-4">Visit · or let us come to you</p>
          </Reveal>
          <SplitText as="h2" lines={['Come early.', 'We sell out.']} accent={['out.']} className="text-display max-w-[14ch] font-medium" />
          <span id="visit-title" className="sr-only">
            Visit and delivery
          </span>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="space-y-6">
            <Reveal from="left" className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">The shop</h3>
              <address className="mt-3 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium not-italic leading-tight tracking-[-0.025em]">
                {brand.address.line1}, {brand.address.line2}
                <br />
                {brand.address.city} {brand.address.postcode}
              </address>
              <dl className="mt-6 divide-y divide-rule border-y border-rule text-[14.5px]">
                {brand.hours.days.map((d) => (
                  <div key={d.day} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-soft">{d.day}</dt>
                    <dd className="text-right">{d.time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={brand.address.mapsUrl} target="_blank" rel="noreferrer" variant="ink">
                  Get directions
                </Button>
                <Button href={`tel:${brand.phone.replace(/\s/g, '')}`} variant="outline">
                  {brand.phone}
                </Button>
              </div>
            </Reveal>

            <Reveal from="left" delay={0.1} className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">Delivery zones</h3>
                <p className="text-[12.5px] text-ink-soft">
                  {formatINR(brand.delivery.fee)} · free over <span className="text-berry">{formatINR(brand.delivery.freeAbove)}</span>
                </p>
              </div>
              <ul className="mt-4 divide-y divide-rule">
                {brand.delivery.zones.map((z, i) => (
                  <Reveal key={z.name} as="li" from={i % 2 ? 'right' : 'left'} distance={18} delay={i * 0.06} amount={0.5} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-[15px] font-medium tracking-[-0.01em]">{z.name}</p>
                      <p className="text-[12.5px] text-ink-faint">{z.areas}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-berry/10 px-2.5 py-1 text-[12px] text-berry-deep tabular-nums">{z.eta}</span>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal from="right" distance={40} className="relative min-h-[360px] lg:min-h-0">
            <motion.div
              style={{rotate: mapTilt}}
              className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] border border-ink/12 bg-cream-deep shadow-[0_40px_80px_-50px_rgba(13,12,11,.5)]"
              role="img"
              aria-label={`Map placeholder showing ${brand.address.line1}, ${brand.address.city}`}
            >
              <MapPlaceholder />
              <ParallaxLayer progress={progress} speed={0.3} direction="down" range={120} className="absolute inset-0">
                <span className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-berry/30" />
                <span className="absolute right-[14%] bottom-[18%] h-36 w-36 rounded-full border border-berry/20" />
              </ParallaxLayer>
              <motion.div style={{y: pinY}} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div className="flex flex-col items-center">
                  <span className="rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">{brand.name}</span>
                  <span className="mt-1 h-3 w-3 rounded-full bg-berry ring-4 ring-berry/25" />
                </div>
              </motion.div>
              <div className="absolute bottom-4 left-4 rounded-full bg-cream/85 px-3 py-1.5 text-[11.5px] text-ink-soft backdrop-blur">
                Map placeholder · replace with an embed
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MapPlaceholder() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(13,12,11,0.07)" />
        </pattern>
      </defs>
      <rect width="600" height="600" fill="url(#grid)" />
      <g fill="none" stroke="rgba(13,12,11,0.18)" strokeWidth="10" strokeLinecap="round">
        <path d="M-20 180C120 160 220 240 360 220S560 120 640 160" />
        <path d="M260-20C240 120 300 260 280 400s-40 180-20 240" />
        <path d="M-20 420C140 380 260 460 420 430s160-80 220-60" />
      </g>
      <g fill="none" stroke="rgba(13,12,11,0.1)" strokeWidth="4" strokeLinecap="round">
        <path d="M80-20v640M460-20v640M-20 300h640" />
      </g>
      <g fill="rgba(13,12,11,0.06)">
        <rect x="110" y="60" width="110" height="80" rx="8" />
        <rect x="330" y="330" width="90" height="120" rx="8" />
        <rect x="120" y="340" width="120" height="70" rx="8" />
        <rect x="480" y="80" width="80" height="60" rx="8" />
      </g>
      <text x="100" y="60" fontSize="12" fill="rgba(13,12,11,0.4)" fontFamily="inherit" letterSpacing="2">
        LAVELLE RD
      </text>
      <text x="470" y="470" fontSize="12" fill="rgba(13,12,11,0.4)" fontFamily="inherit" letterSpacing="2">
        MG RD
      </text>
    </svg>
  );
}
