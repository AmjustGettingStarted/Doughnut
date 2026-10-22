"use client";

import {AnimatePresence, LayoutGroup, motion, useReducedMotion} from 'motion/react';
import {useState} from 'react';
import {CATEGORIES, menu, type Category, type MenuItem} from '@/data/menu';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {formatINR} from '@/lib/format';
import {EASE_EXPO, SPRING_SNAPPY} from '@/lib/motion';
import {selectQtyFor, useCartStore} from '@/store/cartStore';
import {Button} from '@/components/ui/Button';
import {DoughnutArt} from '@/components/ui/DoughnutArt';
import {Reveal} from '@/components/ui/Reveal';
import {SplitText} from '@/components/ui/SplitText';

type Filter = 'All' | Category;
const FILTERS: readonly Filter[] = ['All', ...CATEGORIES];

export function MenuSection() {
  const {ref} = useSectionProgress<HTMLElement>('menu');
  const [filter, setFilter] = useState<Filter>('All');
  const items = filter === 'All' ? menu : menu.filter((m) => m.category === filter);

  return (
    <section id="menu" ref={ref} className="relative min-h-screen py-28 sm:py-36" aria-labelledby="menu-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <Reveal from="left" distance={24}>
              <p className="eyebrow mb-4">The menu · {menu.length} doughnuts</p>
            </Reveal>
            <SplitText
              as="h2"
              lines={['Twelve doughnuts.', 'Zero regrets.']}
              accent={['regrets.']}
              className="text-display max-w-[16ch] font-medium"
            />
            <span id="menu-title" className="sr-only">
              Menu
            </span>
          </div>
          <Reveal from="right" delay={0.2} className="text-[15px] leading-relaxed text-ink-soft md:max-w-[36ch] md:justify-self-end">
            Everything is fried this morning. Singles below, or scroll down to build a box of four, six or twelve and save up to
            10%.
          </Reveal>
        </div>

        <LayoutGroup id="menu-filters">
          <div
            role="group"
            aria-label="Filter by category"
            className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-[13.5px] tracking-[-0.005em] transition-colors duration-300 ${
                    active ? 'text-white' : 'text-ink hover:bg-ink/6'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-chip"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={SPRING_SNAPPY}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <motion.ul layout className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function MenuCard({item, index}: {item: MenuItem; index: number}) {
  const reduced = useReducedMotion();
  // Odd cards arrive from the right, even cards from the left, with a tilt that settles to 0.
  const dir = index % 2 === 0 ? -1 : 1;
  const off = reduced ? 0 : 1;

  return (
    <motion.li
      layout={!reduced}
      initial={{opacity: 0, x: dir * 64 * off, rotate: dir * 4 * off, scale: 0.98}}
      whileInView={{opacity: 1, x: 0, rotate: 0, scale: 1}}
      exit={{opacity: 0, scale: 0.94, transition: {duration: 0.22}}}
      viewport={{once: true, amount: 0.25}}
      transition={{duration: 0.8, delay: (index % 3) * 0.08, ease: EASE_EXPO}}
      className="group glass flex flex-col overflow-hidden rounded-3xl will-change-transform"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
        style={{background: `radial-gradient(80% 80% at 50% 60%, ${item.image.glaze}33, transparent 70%)`}}
      >
        <DoughnutArt
          image={item.image}
          decorative
          className="h-[64%] w-auto drop-shadow-[0_18px_24px_rgba(13,12,11,0.16)] transition-transform duration-700 ease-(--ease-expo) group-hover:rotate-[-8deg] group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-soft backdrop-blur">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-medium leading-tight tracking-[-0.015em]">{item.name}</h3>
          <span className="shrink-0 text-[17px] font-medium tabular-nums tracking-[-0.02em] text-berry">{formatINR(item.price)}</span>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full border border-ink/10 px-2 py-0.5 text-[11px] text-ink-faint">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-rule pt-4">
          <span className="text-[12px] text-ink-faint">Single</span>
          <AddControl item={item} />
        </div>
      </div>
    </motion.li>
  );
}

export function AddControl({item, size = 'sm'}: {item: MenuItem; size?: 'sm' | 'md'}) {
  const qty = useCartStore(selectQtyFor(item.id));
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQty);
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {qty === 0 ? (
        <motion.div key="add" initial={{opacity: 0, scale: reduced ? 1 : 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} transition={{duration: 0.18}}>
          <Button size={size} onClick={() => add(item)} aria-label={`Add ${item.name} to cart`}>
            Add
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="stepper"
          initial={{opacity: 0, scale: reduced ? 1 : 0.9}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.18}}
          className="inline-flex items-center rounded-full bg-ink text-white"
        >
          <button
            type="button"
            onClick={() => setQty(item.id, qty - 1)}
            aria-label={`Remove one ${item.name}`}
            className="h-9 w-9 rounded-full text-lg leading-none hover:bg-white/10"
          >
            −
          </button>
          <span className="w-5 text-center text-[14px] tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => add(item)}
            aria-label={`Add one more ${item.name}`}
            className="h-9 w-9 rounded-full text-lg leading-none hover:bg-white/10"
          >
            +
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
