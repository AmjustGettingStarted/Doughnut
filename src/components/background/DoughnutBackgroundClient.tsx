'use client';

import dynamic from 'next/dynamic';

/**
 * The scroll-scrub engine reads window on every frame. Load it only in the
 * browser so the server never renders the video stage.
 */
export const DoughnutBackground = dynamic(
  () => import('./DoughnutBackground').then((mod) => mod.DoughnutBackground),
  {ssr: false},
);
