import {create} from 'zustand';

interface UiState {
  loadProgress: number;
  backgroundReady: boolean;
  cartOpen: boolean;
  checkoutOpen: boolean;
  setLoadProgress: (value: number) => void;
  setBackgroundReady: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  loadProgress: 0,
  backgroundReady: false,
  cartOpen: false,
  checkoutOpen: false,
  setLoadProgress: (value) => set({loadProgress: value}),
  setBackgroundReady: () => set({backgroundReady: true, loadProgress: 1}),
  openCart: () => set({cartOpen: true}),
  closeCart: () => set({cartOpen: false}),
  openCheckout: () => set({checkoutOpen: true, cartOpen: false}),
  closeCheckout: () => set({checkoutOpen: false}),
}));
