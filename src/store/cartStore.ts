"use client";

import {create} from 'zustand';
import {createJSONStorage, persist, type StateStorage} from 'zustand/middleware';
import {getMenuItem, type MenuItem} from '@/data/menu';

export const BOX_SIZES = [4, 6, 12] as const;
export type BoxSize = (typeof BOX_SIZES)[number];

/** Discount applied to the sum of the chosen doughnuts for each box size. */
export const BOX_DISCOUNT: Record<BoxSize, number> = {4: 0, 6: 0.05, 12: 0.1};

export interface CartLine {
  /** Stable key: the item id for singles, a generated id for boxes. */
  key: string;
  kind: 'item' | 'box';
  name: string;
  unitPrice: number;
  qty: number;
  /** Item ids inside a box, in slot order. */
  contents?: string[];
  image: MenuItem['image'];
}

interface CartState {
  lines: CartLine[];
  /** Bumps on every add so the nav badge can pulse. */
  pulse: number;
  add: (item: MenuItem, qty?: number) => void;
  addBox: (size: BoxSize, itemIds: string[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export function boxPrice(size: BoxSize, itemIds: readonly string[]): number {
  const sum = itemIds.reduce((acc, id) => acc + (getMenuItem(id)?.price ?? 0), 0);
  return Math.round(sum * (1 - BOX_DISCOUNT[size]));
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/** localStorage on the client, an inert store during SSR. */
function getCartStorage(): StateStorage {
  if (typeof window === 'undefined') return memoryStorage;
  return window.localStorage;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      pulse: 0,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.key === item.id);
          const lines = existing
            ? s.lines.map((l) => (l.key === item.id ? {...l, qty: l.qty + qty} : l))
            : [
                ...s.lines,
                {key: item.id, kind: 'item' as const, name: item.name, unitPrice: item.price, qty, image: item.image},
              ];
          return {lines, pulse: s.pulse + 1};
        }),
      addBox: (size, itemIds) =>
        set((s) => {
          const first = getMenuItem(itemIds[0] ?? '') ?? null;
          const line: CartLine = {
            key: `box-${size}-${Date.now().toString(36)}`,
            kind: 'box',
            name: `Box of ${size}`,
            unitPrice: boxPrice(size, itemIds),
            qty: 1,
            contents: [...itemIds],
            image: first?.image ?? {glaze: '#f3e4c8', accent: '#e2c597', topping: 'none', alt: 'A box of doughnuts'},
          };
          return {lines: [...s.lines, line], pulse: s.pulse + 1};
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? {...l, qty} : l)),
        })),
      remove: (key) => set((s) => ({lines: s.lines.filter((l) => l.key !== key)})),
      clear: () => set({lines: []}),
    }),
    {
      name: 'ring-theory-cart',
      version: 1,
      partialize: (s) => ({lines: s.lines}),
      // Don't read localStorage during SSR or the first client render. AppEffects
      // calls rehydrate() after mount so the server HTML and hydration match.
      skipHydration: true,
      storage: createJSONStorage(getCartStorage),
    },
  ),
);

export const selectCount = (s: CartState): number => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState): number => s.lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
export const selectQtyFor =
  (id: string) =>
  (s: CartState): number =>
    s.lines.find((l) => l.key === id)?.qty ?? 0;
