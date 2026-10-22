# Ring Theory — doughnut shop landing page

A scroll-driven landing page with online ordering for a small-batch doughnut
shop. The scroll-scrubbed doughnut clip is the hero of the whole site; every
section owns one "beat" of the clip and animates in sync with it.

Vite + React 19 + TypeScript (strict) + Tailwind v4 + Motion + Lenis + Zustand.

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/
```

No environment variables are required.

## File map

```
src/
  App.tsx                      composes the page in scroll order
  index.css                    Tailwind v4 theme tokens + base styles
  components/
    background/
      beats.ts                 section → clip-time slice + look (scale/blur/dim)
      useScrollBackground.ts   the scroll-scrub engine (blob preload, eased seek)
      DoughnutBackground.tsx   fixed <video> stage
    layout/                    Navbar, Loader, ScrollProgress, InfoBar
    sections/                  one component per scroll beat
    ui/                        Button, Reveal, ParallaxLayer, SplitText, Sprinkles
  hooks/
    useLenis.ts                smooth scrolling + scrollToId / lockScroll helpers
    useSectionProgress.ts      per-section 0..1 progress + background registry
  store/uiStore.ts             loader / drawer / modal UI state
  data/brand.ts                single source of truth for brand copy
  lib/motion.ts, lib/format.ts shared easings & variants, INR formatting
```
