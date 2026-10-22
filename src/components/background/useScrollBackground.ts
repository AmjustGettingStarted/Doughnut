import {useEffect, type RefObject} from 'react';
import {getRegisteredSections} from '@/hooks/useSectionProgress';
import {clamp, lerp, smoothstep} from '@/lib/format';
import {useUiStore} from '@/store/uiStore';
import {BEATS, IDLE_LOOK, type BackgroundLook, type SectionId} from './beats';

/**
 * 1920x1080, 10.04 s, 241 frames, all-intra. Every frame is a keyframe, which
 * is why a scroll scrub can land on an exact frame without inter-frame decode lag.
 */
const VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4';

const SEEK_EASE = 0.115; // easing factor from the original engine — do not change
const LOOK_EASE = 0.1;
const STALL_MS = 12000;
const FETCH_BAIL_MS = 15000;
const APPROX_BYTES = 11e6;

interface SectionRect {
  top: number;
  height: number;
}

interface Target {
  time: number;
  look: BackgroundLook;
}

function mixLook(a: BackgroundLook, b: BackgroundLook, t: number): BackgroundLook {
  return {
    scale: lerp(a.scale, b.scale, t),
    blur: lerp(a.blur, b.blur, t),
    dim: lerp(a.dim, b.dim, t),
    rotate: lerp(a.rotate, b.rotate, t),
  };
}

/**
 * Drives the fixed background <video> from window scroll.
 *
 * - Preloads the MP4 as a fully buffered Blob (seeking in memory is instant;
 *   HTTP range requests stutter under rapid scrubbing), reporting progress to
 *   the UI store so the loader can show "LOADING 42%".
 * - Every frame resolves which section beat the viewport is in (using the
 *   elements registered by `useSectionProgress`), maps section progress onto
 *   that beat's clip-time slice, then eases `currentTime` toward it.
 * - Between two pinned sections it cross-fades beats over the hand-off
 *   distance, so clip time never jumps.
 * - Writes `--bg-scale / --bg-rotate / --bg-blur / --bg-dim` custom properties
 *   on the stage element; the video and dim layer consume them in CSS.
 */
export function useScrollBackground(
  videoRef: RefObject<HTMLVideoElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    const clipEl = videoRef.current;
    const stageEl = stageRef.current;
    if (!clipEl || !stageEl) return;
    const clip: HTMLVideoElement = clipEl;
    const stage: HTMLDivElement = stageEl;

    const {setLoadProgress, setBackgroundReady} = useUiStore.getState();

    let duration = 0;
    let seekTo = 0;
    let seekAt = 0;
    let ready = false;
    let started = false;
    let attached = false;
    let disposed = false;
    let objectUrl: string | null = null;
    let raf = 0;
    let stallTimer = 0;
    let bailTimer = 0;

    const look: BackgroundLook = {...IDLE_LOOK};
    const rects = new Map<SectionId, SectionRect>();
    let viewportH = window.innerHeight;
    let blurScale = 1;
    let lastBlur = -1;

    function measure(): void {
      viewportH = window.innerHeight;
      blurScale = window.innerWidth < 720 ? 0.6 : 1;
      rects.clear();
      const scrollY = window.scrollY;
      for (const [id, el] of getRegisteredSections()) {
        const r = el.getBoundingClientRect();
        rects.set(id, {top: r.top + scrollY, height: r.height});
      }
    }

    function resolve(): Target {
      const y = window.scrollY;
      const active = BEATS.filter((b) => rects.has(b.id));
      const first = active[0];
      if (!first) return {time: 0.44, look: IDLE_LOOK};

      for (let i = 0; i < active.length; i++) {
        const beat = active[i]!;
        const rect = rects.get(beat.id)!;
        const pinLength = Math.max(rect.height - viewportH, 1);
        const pinEnd = rect.top + pinLength;
        const next = active[i + 1];
        const nextRect = next ? rects.get(next.id) : undefined;

        if (y < rect.top && i === 0) {
          return {time: beat.from, look: beat};
        }
        if (y <= pinEnd) {
          const p = clamp((y - rect.top) / pinLength, 0, 1);
          return {time: lerp(beat.from, beat.to, p), look: beat};
        }
        if (next && nextRect && y < nextRect.top) {
          const t = smoothstep((y - pinEnd) / Math.max(nextRect.top - pinEnd, 1));
          return {time: lerp(beat.to, next.from, t), look: mixLook(beat, next, t)};
        }
        if (!next) {
          return {time: beat.to, look: beat};
        }
      }
      return {time: first.from, look: first};
    }

    function paint(target: BackgroundLook): void {
      look.scale += (target.scale - look.scale) * LOOK_EASE;
      look.rotate += (target.rotate - look.rotate) * LOOK_EASE;
      look.blur += (target.blur * blurScale - look.blur) * LOOK_EASE;
      look.dim += (target.dim - look.dim) * LOOK_EASE;

      stage.style.setProperty('--bg-scale', look.scale.toFixed(4));
      stage.style.setProperty('--bg-rotate', `${look.rotate.toFixed(3)}deg`);
      stage.style.setProperty('--bg-dim', look.dim.toFixed(3));
      const blur = look.blur < 0.08 ? 0 : look.blur;
      if (blur !== lastBlur) {
        stage.style.setProperty('--bg-filter', blur === 0 ? 'none' : `blur(${blur.toFixed(2)}px)`);
        lastBlur = blur;
      }
    }

    function frame(): void {
      if (disposed) return;
      if (rects.size !== getRegisteredSections().size) measure();

      const target = resolve();
      if (duration) seekTo = target.time * duration;

      if (ready && duration) {
        const gap = seekTo - seekAt;
        if (Math.abs(gap) > 0.0008) {
          seekAt += gap * SEEK_EASE;
          if (clip.readyState >= 2 && !clip.seeking) {
            try {
              clip.currentTime = seekAt;
            } catch {
              /* seeking before metadata is harmless */
            }
          }
        }
      }
      paint(target.look);
      raf = requestAnimationFrame(frame);
    }

    function snapToScroll(): void {
      const target = resolve();
      if (duration) {
        seekTo = target.time * duration;
        seekAt = seekTo;
        try {
          clip.currentTime = seekAt;
        } catch {
          /* ignore */
        }
      }
    }

    function start(): void {
      if (started || disposed) return;
      started = true;
      ready = true;
      measure();
      snapToScroll();
      setBackgroundReady();
    }

    function attach(src: string): void {
      if (attached || disposed) return;
      attached = true;
      clip.addEventListener('loadedmetadata', () => {
        duration = clip.duration || 0;
        clip.pause();
        measure();
        snapToScroll();
      });
      clip.addEventListener('loadeddata', start);
      clip.addEventListener('canplaythrough', start);
      clip.addEventListener('error', start);
      clip.src = src;
      clip.load();
      // Stall fallback so the page never strands behind the preloader.
      stallTimer = window.setTimeout(start, STALL_MS);
    }

    const controller = new AbortController();

    function preload(): void {
      bailTimer = window.setTimeout(() => {
        if (!attached) {
          controller.abort();
          setLoadProgress(1);
          attach(VIDEO_URL);
        }
      }, FETCH_BAIL_MS);

      fetch(VIDEO_URL, {signal: controller.signal})
        .then(async (res) => {
          if (!res.ok || !res.body) throw new Error('Fetch failed');
          const total = Number.parseInt(res.headers.get('content-length') ?? '0', 10);
          const reader = res.body.getReader();
          const chunks: Uint8Array[] = [];
          let got = 0;
          for (;;) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            got += value.byteLength;
            setLoadProgress(total ? got / total : Math.min(got / APPROX_BYTES, 0.95));
          }
          return new Blob(chunks as BlobPart[], {type: 'video/mp4'});
        })
        .then((blob) => {
          window.clearTimeout(bailTimer);
          if (disposed) return;
          setLoadProgress(1);
          objectUrl = URL.createObjectURL(blob);
          attach(objectUrl);
        })
        .catch(() => {
          // Covers CORS failure, abort, offline, or browser streaming limits.
          window.clearTimeout(bailTimer);
          if (disposed) return;
          setLoadProgress(1);
          attach(VIDEO_URL);
        });
    }

    // iOS will not paint a frame from a video that has never been played,
    // so nudge it once on the first user interaction and pause immediately.
    function unlock(): void {
      const p = clip.play();
      if (p && typeof p.then === 'function') {
        p.then(() => clip.pause()).catch(() => undefined);
      } else {
        clip.pause();
      }
    }
    const unlockEvents = ['touchstart', 'pointerdown', 'wheel', 'keydown'] as const;
    unlockEvents.forEach((ev) => window.addEventListener(ev, unlock, {once: true, passive: true}));

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure);

    measure();
    preload();
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(stallTimer);
      window.clearTimeout(bailTimer);
      controller.abort();
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlock));
      clip.removeAttribute('src');
      clip.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoRef, stageRef]);
}
