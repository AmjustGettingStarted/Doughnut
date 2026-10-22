import type {Metadata, Viewport} from 'next';
import {Inter_Tight} from 'next/font/google';
import type {ReactNode} from 'react';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'Ring Theory — Doughnuts, baked at four, boxed by seven',
  description:
    'Ring Theory is a small-batch doughnut shop in Bengaluru. Hand-glazed every morning, boxed by seven, delivered warm.',
  openGraph: {
    title: 'Ring Theory — Doughnuts',
    description: 'Hand-glazed every morning. Boxes of 4, 6 and 12, delivered warm across Bengaluru.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f2f0ec',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        <link rel="preconnect" href="https://d2ol7oe51mr4n9.cloudfront.net" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
