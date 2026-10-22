# Ring Theory — doughnut shop landing page

A scroll-driven landing page with online ordering for a small-batch doughnut
shop. The scroll-scrubbed doughnut clip is the hero of the whole site: every
section owns one "beat" of the clip and its content animates in sync with it.

Next.js (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Motion ·
Lenis · Zustand · react-hook-form · zod. No backend; payments are mocked.

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint      # generate route types, then tsc --noEmit
```

No environment variables are required. See `.env.example`. The background clip
streams from a CDN and is buffered as a Blob before the loader dismisses.

## How the scroll story works

- `useLenis` drives native window scroll with smoothing. Everything — the
  background engine, `useScroll`, section progress — reads the same
  `window.scrollY`, so text and background can never drift apart.
- Each section calls `useSectionProgress(id)` to get a 0..1 MotionValue of its
  own progress (pinned sections: from pin start to pin end) and registers its
  element in a registry.
- `useScrollBackground` runs a rAF loop: it resolves which section the
  viewport is in, maps that section's progress onto its beat's slice of clip
  time (`background/beats.ts`), cross-fades beats across section hand-offs,
  eases `video.currentTime` toward the target and writes `--bg-scale`,
  `--bg-rotate`, `--bg-filter`, `--bg-dim` custom properties for the look.
- Scroll-driven styles go through `useProgressTransform`, which pads input
  ranges to 0..1. Motion offloads these to a native `ScrollTimeline`, and
  WAAPI would otherwise invent implicit keyframes from the inline style.

Beat map (clip time as a fraction of the 10 s shot):

| Section  | Clip         | Doughnut state                     |
| -------- | ------------ | ---------------------------------- |
| Hero     | 0.44 → 0.30  | whole, flat → tilting              |
| Craft    | 0.30 → 0.00  | rewinds into the hole / dough macro |
| Flavors  | 0.42 → 0.64  | glaze crackles, starts to burst    |
| Menu     | 0.64 → 0.76  | burst (blurred, dimmed)            |
| Box      | 0.76 → 0.90  | pieces re-pile into a doughnut     |
| Reviews  | 0.90 → 0.95  | whole again                        |
| Visit    | 0.95 → 0.98  | whole (blurred behind cards)       |
| Final    | 0.98 → 1.00  | whole, resting                     |

## Motion & accessibility

- Only `transform`, `opacity` and (sparingly, on headlines) `filter` animate.
- `prefers-reduced-motion`: Lenis is disabled, every primitive falls back to
  fades, the Craft strip becomes a plain swipeable row, parallax travel is 0.
- Cart drawer and checkout are `role="dialog"` with a focus trap, Escape to
  close, scroll lock and restored focus. Form errors are `role="alert"` and
  linked via `aria-describedby`. A skip link jumps straight to the menu.

## Ordering

- `store/cartStore.ts` — Zustand store persisted to `localStorage`
  (`ring-theory-cart`): singles and boxes, quantities, subtotal, clear.
  Hydration is skipped on the server and restored in `AppEffects` after mount
  so a saved cart does not mismatch the server HTML.
- `lib/order.ts` — `submitOrder()` is a mocked promise. The `TODO(payments)`
  comment marks where the real order API + payment gateway go; the UI only
  depends on the resolved `{orderId, eta}` shape.
- Checkout is code-split (`CheckoutLoader`) and prefetched when the cart opens.

## File map

```
app/
  layout.tsx                      fonts, metadata, html/body, global css
  page.tsx                        composes the page in scroll order
  globals.css                     Tailwind v4 theme tokens, base styles, utilities
  icon.svg                        favicon
src/
  components/
    background/
      beats.ts                    section → clip-time slice + look
      useScrollBackground.ts      scroll-scrub engine (blob preload, eased seek)
      DoughnutBackground.tsx      fixed <video> stage, veil, grain
      DoughnutBackgroundClient.tsx  client-only dynamic import (ssr: false)
    layout/
      Navbar.tsx  Footer.tsx  InfoBar.tsx  ScrollProgress.tsx  Loader.tsx
      AppEffects.tsx              Lenis + cart rehydrate (client)
    sections/
      Hero.tsx                    pinned; mount-in headline, lagging CTA layer
      Craft.tsx                   pinned; horizontal scroll-jacked process strip
      Flavors.tsx                 pinned; flavours swap in sync with the bg
      MenuSection.tsx             filterable grid, alternating card entrances
      BoxBuilder.tsx              4 / 6 / 12 box, picks fly into slots
      Reviews.tsx                 rows drifting in opposite directions
      Visit.tsx                   hours, delivery zones, tilting map placeholder
      FinalCta.tsx                pinned closing beat
    cart/
      CartButton.tsx  CartDrawer.tsx  CheckoutModal.tsx  CheckoutLoader.tsx
    ui/
      Button.tsx  Reveal.tsx  ParallaxLayer.tsx  SplitText.tsx
      Sprinkles.tsx  SprinkleBurst.tsx  DoughnutArt.tsx
  hooks/
    useLenis.ts                   smooth scroll + scrollToId / lockScroll
    useSectionProgress.ts         per-section progress + background registry
    useProgressTransform.ts       0..1-padded useTransform for scroll values
    useFocusTrap.ts               dialog focus management
  store/
    cartStore.ts  uiStore.ts
  data/
    brand.ts                      name, tagline, address, hours, delivery, nav
    menu.ts                       12 doughnuts (INR), categories, tags
    reviews.ts                    reviews + social proof numbers
  lib/
    motion.ts                     shared easings, springs, dialog variants
    format.ts                     INR formatting, clamp / lerp / smoothstep
    order.ts                      mocked submitOrder() + payment TODO
    zodResolver.ts                tiny zod → react-hook-form resolver
```
