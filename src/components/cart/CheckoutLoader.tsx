import {lazy, Suspense, useEffect, useState} from 'react';
import {useUiStore} from '@/store/uiStore';

const load = () => import('./CheckoutModal');
const LazyCheckoutModal = lazy(() => load().then((m) => ({default: m.CheckoutModal})));

/** Warm the checkout chunk (react-hook-form + zod) before the user needs it. */
export function preloadCheckout(): void {
  void load();
}

/**
 * Mounts the checkout modal only after it is first requested, then keeps it
 * mounted so AnimatePresence can still play its exit animation.
 */
export function CheckoutLoader() {
  const open = useUiStore((s) => s.checkoutOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <LazyCheckoutModal />
    </Suspense>
  );
}
