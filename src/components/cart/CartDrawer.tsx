import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {useEffect, useRef} from 'react';
import {brand} from '@/data/brand';
import {getMenuItem} from '@/data/menu';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {lockScroll, scrollToId} from '@/hooks/useLenis';
import {formatINR} from '@/lib/format';
import {backdropVariants, drawerVariants, EASE_SOFT} from '@/lib/motion';
import {selectCount, selectSubtotal, useCartStore, type CartLine} from '@/store/cartStore';
import {useUiStore} from '@/store/uiStore';
import {Button} from '@/components/ui/Button';
import {DoughnutArt} from '@/components/ui/DoughnutArt';

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);
  const clear = useCartStore((s) => s.clear);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useFocusTrap(panelRef, open, closeCart);
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const remaining = brand.delivery.freeAbove - subtotal;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={closeCart}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-[-20px_0_60px_-30px_rgba(13,12,11,.4)]"
            variants={reduced ? backdropVariants : drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <header className="flex items-center justify-between border-b border-rule px-5 py-4 safe-top sm:px-6">
              <h2 id="cart-title" className="text-lg font-medium tracking-[-0.02em]">
                Your box <span className="text-ink-faint">({count})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                data-autofocus
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 hover:border-ink/35"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <DoughnutArt
                    image={{glaze: '#f3e4c8', accent: '#e2c597', topping: 'none', alt: ''}}
                    decorative
                    className="h-24 w-24 opacity-70"
                  />
                  <p className="text-ink-soft">Nothing in the box yet.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeCart();
                      scrollToId('menu');
                    }}
                  >
                    Browse the menu
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-rule">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartRow key={line.key} line={line} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-rule px-5 pb-5 pt-4 safe-bottom sm:px-6">
                <div className="mb-3 overflow-hidden rounded-full bg-ink/8">
                  <motion.div
                    className="h-1 rounded-full bg-berry"
                    animate={{width: `${Math.min(100, (subtotal / brand.delivery.freeAbove) * 100)}%`}}
                    transition={{duration: 0.5, ease: EASE_SOFT}}
                  />
                </div>
                <p className="mb-4 text-[12.5px] text-ink-soft">
                  {remaining > 0 ? (
                    <>
                      Add <span className="text-ink">{formatINR(remaining)}</span> more for free delivery.
                    </>
                  ) : (
                    <span className="text-berry">Free delivery unlocked.</span>
                  )}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-ink-soft">Subtotal</span>
                  <span className="text-xl font-medium tabular-nums tracking-[-0.02em]">{formatINR(subtotal)}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="ghost" size="md" onClick={clear} className="px-3 text-ink-soft">
                    Clear
                  </Button>
                  <Button variant="berry" size="lg" onClick={openCheckout} className="flex-1">
                    Checkout
                  </Button>
                </div>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CartRow({line}: {line: CartLine}) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const reduced = useReducedMotion();
  const contents = line.contents?.map((id) => getMenuItem(id)?.name ?? id);

  return (
    <motion.li
      layout={!reduced}
      initial={{opacity: 0, x: reduced ? 0 : 24}}
      animate={{opacity: 1, x: 0}}
      exit={{opacity: 0, x: reduced ? 0 : 24, height: 0, paddingTop: 0, paddingBottom: 0}}
      transition={{duration: 0.3, ease: EASE_SOFT}}
      className="flex gap-4 py-4"
    >
      <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/60 p-1.5">
        <DoughnutArt image={line.image} decorative className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium tracking-[-0.01em]">{line.name}</p>
            {contents && (
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-faint">{contents.join(', ')}</p>
            )}
          </div>
          <span className="shrink-0 text-[15px] tabular-nums">{formatINR(line.unitPrice * line.qty)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-ink/12">
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty - 1)}
              aria-label={`Decrease quantity of ${line.name}`}
              className="h-8 w-8 rounded-full text-lg leading-none hover:bg-ink/6"
            >
              −
            </button>
            <span className="w-6 text-center text-[14px] tabular-nums" aria-live="polite">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty + 1)}
              aria-label={`Increase quantity of ${line.name}`}
              className="h-8 w-8 rounded-full text-lg leading-none hover:bg-ink/6"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="text-[12.5px] text-ink-faint underline-offset-2 hover:text-ink hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}
