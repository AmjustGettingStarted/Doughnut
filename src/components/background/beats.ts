/**
 * The background clip is one continuous 10 s shot of a doughnut:
 *   0.00–0.10  macro of the dough surface
 *   0.10–0.22  ring / hole close-up pulling back
 *   0.22–0.40  whole doughnut, tilted, rotating
 *   0.40–0.48  whole doughnut, flat
 *   0.48–0.58  glaze crackles
 *   0.58–0.68  bursts apart
 *   0.68–0.80  pieces fall
 *   0.80–0.90  pieces re-pile into a doughnut
 *   0.90–1.00  whole doughnut, resting
 *
 * Each section owns one "beat": a slice of clip time plus a look (scale, blur,
 * dim). Scroll progress inside the section is mapped linearly onto `from..to`,
 * so the clip can run backwards for a beat (Craft rewinds into the hole).
 */
export type SectionId = 'hero' | 'craft' | 'flavors' | 'menu' | 'box' | 'reviews' | 'visit' | 'final';

export interface BackgroundLook {
  scale: number;
  blur: number;
  dim: number;
  rotate: number;
}

export interface Beat extends BackgroundLook {
  id: SectionId;
  /** Clip time as 0..1 fraction at section start. */
  from: number;
  /** Clip time as 0..1 fraction at section end. */
  to: number;
}

export const BEATS: readonly Beat[] = [
  {id: 'hero', from: 0.44, to: 0.3, scale: 1.02, blur: 0, dim: 0, rotate: 0},
  {id: 'craft', from: 0.3, to: 0.0, scale: 1.22, blur: 0, dim: 0.05, rotate: -3},
  {id: 'flavors', from: 0.42, to: 0.64, scale: 1.04, blur: 0, dim: 0, rotate: 0},
  {id: 'menu', from: 0.64, to: 0.76, scale: 1.12, blur: 10, dim: 0.42, rotate: 0},
  {id: 'box', from: 0.76, to: 0.9, scale: 1.08, blur: 6, dim: 0.34, rotate: 2},
  {id: 'reviews', from: 0.9, to: 0.95, scale: 1.04, blur: 3, dim: 0.22, rotate: 0},
  {id: 'visit', from: 0.95, to: 0.98, scale: 1.1, blur: 8, dim: 0.4, rotate: 0},
  {id: 'final', from: 0.98, to: 1.0, scale: 1.0, blur: 0, dim: 0.05, rotate: 0},
];

export const IDLE_LOOK: BackgroundLook = {scale: 1.02, blur: 0, dim: 0, rotate: 0};
