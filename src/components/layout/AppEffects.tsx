'use client';

import {useEffect} from 'react';
import {useLenis} from '@/hooks/useLenis';
import {useCartStore} from '@/store/cartStore';

/** Boots smooth scroll and restores the persisted cart after hydration. */
export function AppEffects() {
  useLenis();

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
