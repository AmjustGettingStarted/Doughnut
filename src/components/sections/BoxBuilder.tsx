import {AnimatePresence, LayoutGroup, motion, useAnimate, useReducedMotion} from 'motion/react';
import {useLayoutEffect, useState, type MouseEvent} from 'react';
import {menu, getMenuItem} from '@/data/menu';
import {useSectionProgress} from '@/hooks/useSectionProgress';
import {formatINR} from '@/lib/format';
import {EASE_EXPO, SPRING_SNAPPY} from '@/lib/motion';
import {BOX_DISCOUNT, BOX_SIZES, boxPrice, useCartStore, type BoxSize} from '@/store/cartStore';
import {useUiStore} from '@/store/uiStore';
import {Button} from '@/components/ui/Button';
import {DoughnutArt} from '@/components/ui/DoughnutArt';
import {Reveal} from '@/components/ui/Reveal';
import {SplitText} from '@/components/ui/SplitText';

interface Pick {
  uid: number;
  id: string;
  /** Where the pick was clicked from, so it can fly into its slot. */
  from: {x: number; y: number} | null;
}

const COLS: Record<BoxSize, string> = {4: 'grid-cols-2', 6: 'grid-cols-3', 12: 'grid-cols-4'};

let uidCounter = 0;

export function BoxBuilder() {
  const {ref} = useSectionProgress<HTMLElement>('box');
  const [size, setSize] = useState<BoxSize>(6);
  const [picks, setPicks] = useState<Pick[]>([]);
  const addBox = useCartStore((s) => s.addBox);
  const openCart = useUiStore((s) => s.openCart);
  const reduced = useReducedMotion();

  const ids = picks.map((p) => p.id);
  const full = picks.length >= size;
  const remaining = size - picks.length;
  const total = boxPrice(size, ids);
  const undiscounted = ids.reduce((n, id) => n + (getMenuItem(id)?.price ?? 0), 0);

  const changeSize = (next: BoxSize) => {
    setSize(next);
    setPicks((p) => p.slice(0, next));
  };

  const pick = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    if (full) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPicks((p) => [...p, {uid: ++uidCounter, id, from: reduced ? null : {x: r.x + r.width / 2, y: r.y + r.height / 2}}]);
  };

  const surprise = () => {
    setPicks((p) => {
      const next = [...p];
      while (next.length < size) {
        const item = menu[Math.floor(Math.random() * menu.length)]!;
        next.push({uid: ++uidCounter, id: item.id, from: null});
      }
      return next;
    });
  };

  const commit = () => {
    if (!full) return;
    addBox(size, ids);
    setPicks([]);
    openCart();
  };

  return (
    <section id="box" ref={ref} className="relative min-h-screen py-28 sm:py-36" aria-labelledby="box-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal from="right" distance={24}>
            <p className="eyebrow mb-4">Box builder · save up to 10%</p>
          </Reveal>
          <SplitText
            as="h2"
            lines={['Build a box.', 'Share it, or don’t.']}
            accent={['don’t.']}
            className="text-display max-w-[16ch] font-medium"
          />
          <span id="box-title" className="sr-only">
            Build a box
          </span>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <LayoutGroup id="box-size">
              <div role="radiogroup" aria-label="Box size" className="inline-flex rounded-full border border-ink/12 bg-cream/70 p-1 backdrop-blur">
                {BOX_SIZES.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      role="radio"
                      type="button"
                      aria-checked={active}
                      onClick={() => changeSize(s)}
                      className={`relative rounded-full px-5 py-2 text-[14px] transition-colors ${active ? 'text-white' : 'text-ink'}`}
                    >
                      {active && <motion.span layoutId="box-size-pill" className="absolute inset-0 rounded-full bg-ink" transition={SPRING_SNAPPY} />}
                      <span className="relative">
                        Box of {s}
                        {BOX_DISCOUNT[s] > 0 && (
                          <span className={`ml-1.5 text-[11px] ${active ? 'text-white/70' : 'text-berry'}`}>−{BOX_DISCOUNT[s] * 100}%</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <p className="mt-6 text-[14px] text-ink-soft" aria-live="polite">
              {full ? 'Box is full. Looks good.' : `Pick ${remaining} more flavour${remaining === 1 ? '' : 's'} — repeats welcome.`}
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {menu.map((item, i) => {
                const inBox = ids.filter((id) => id === item.id).length;
                return (
                  <Reveal key={item.id} as="li" from={i % 2 ? 'right' : 'left'} distance={28} delay={(i % 3) * 0.06} amount={0.1}>
                    <button
                      type="button"
                      onClick={(e) => pick(item.id, e)}
                      disabled={full}
                      aria-label={`Add ${item.name} to box`}
                      className="group glass relative flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:border-ink/25 disabled:opacity-50"
                    >
                      <span className="relative h-12 w-12 shrink-0">
                        <DoughnutArt image={item.image} decorative className="h-full w-full transition-transform duration-500 group-hover:-rotate-12" />
                        {inBox > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-[11px] text-white tabular-nums">
                            {inBox}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium leading-tight tracking-[-0.01em]">{item.name}</span>
                        <span className="block text-[12px] text-ink-faint tabular-nums">{formatINR(item.price)}</span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal from="up" distance={40} className="rounded-[28px] border border-ink/12 bg-cream-deep/80 p-4 shadow-[0_40px_80px_-50px_rgba(13,12,11,.5)] backdrop-blur sm:p-5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">Ring Theory · Box of {size}</span>
                <span className="text-[12px] text-ink-faint tabular-nums">
                  {picks.length}/{size}
                </span>
              </div>
              <motion.div layout={!reduced} className={`mt-4 grid ${COLS[size]} gap-2 rounded-2xl bg-white/50 p-3 sm:gap-3`}>
                {Array.from({length: size}, (_, i) => {
                  const p = picks[i];
                  return (
                    <div key={i} className="relative aspect-square">
                      <span className="absolute inset-0 rounded-full border border-dashed border-ink/15" aria-hidden="true" />
                      <AnimatePresence>
                        {p && (
                          <Slot
                            key={p.uid}
                            pick={p}
                            index={i}
                            onRemove={() => setPicks((list) => list.filter((x) => x.uid !== p.uid))}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>

              <div className="mt-5 flex items-end justify-between px-1">
                <div>
                  <span className="block text-[12px] text-ink-faint">Live total</span>
                  <span className="text-2xl font-medium tabular-nums tracking-[-0.03em]">{formatINR(total)}</span>
                  {BOX_DISCOUNT[size] > 0 && undiscounted > total && (
                    <span className="ml-2 text-[13px] text-ink-faint line-through tabular-nums">{formatINR(undiscounted)}</span>
                  )}
                </div>
                <button type="button" onClick={surprise} disabled={full} className="text-[13px] text-ink-soft underline-offset-2 hover:underline disabled:opacity-40">
                  Surprise me
                </button>
              </div>
              <Button variant="berry" size="lg" onClick={commit} disabled={!full} className="mt-4 w-full">
                {full ? `Add box to cart · ${formatINR(total)}` : `Pick ${remaining} more`}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slot({pick, index, onRemove}: {pick: Pick; index: number; onRemove: () => void}) {
  const [scope, animate] = useAnimate<HTMLButtonElement>();
  const item = getMenuItem(pick.id);
  const reduced = useReducedMotion();

  // Fly from where the user clicked into the slot: transform-only, spring-settled.
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el || !pick.from || reduced) return;
    const r = el.getBoundingClientRect();
    const dx = pick.from.x - (r.x + r.width / 2);
    const dy = pick.from.y - (r.y + r.height / 2);
    const spin = index % 2 === 0 ? -140 : 140;
    animate(el, {x: [dx, 0], y: [dy, 0], scale: [0.5, 1], rotate: [spin, 0]}, {type: 'spring', stiffness: 220, damping: 24, mass: 0.9});
  }, [scope, animate, pick.from, index, reduced]);

  if (!item) return null;
  return (
    <motion.button
      ref={scope}
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${item.name} from slot ${index + 1}`}
      title="Remove"
      className="absolute inset-0 rounded-full will-change-transform"
      initial={pick.from ? false : {scale: 0, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      exit={{scale: 0, opacity: 0, transition: {duration: 0.2, ease: EASE_EXPO}}}
      transition={{type: 'spring', stiffness: 300, damping: 22}}
    >
      <DoughnutArt image={item.image} decorative className="h-full w-full drop-shadow-[0_10px_14px_rgba(13,12,11,0.2)]" />
    </motion.button>
  );
}
