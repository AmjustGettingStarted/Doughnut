"use client";

import {useRef, type CSSProperties} from 'react';
import {useScrollBackground} from './useScrollBackground';

const stageStyle = {
  '--bg-scale': '1.02',
  '--bg-rotate': '0deg',
  '--bg-filter': 'none',
  '--bg-dim': '0',
} as CSSProperties;

const videoStyle: CSSProperties = {
  transform: 'translate3d(-50%, -50%, 0) scale(var(--bg-scale)) rotate(var(--bg-rotate))',
  filter: 'var(--bg-filter)',
};

/** Fixed, scroll-scrubbed doughnut clip. The hero of the whole site. */
export function DoughnutBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollBackground(videoRef, stageRef);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-cream"
      style={stageStyle}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        className="absolute left-1/2 top-1/2 h-full w-full object-cover will-change-transform [contrast:1.02]"
        style={videoStyle}
      />
      <div className="veil" />
      <div className="absolute inset-0 bg-cream" style={{opacity: 'var(--bg-dim)'}} />
      <div className="grain" />
    </div>
  );
}
