"use client";

import type {MouseEvent} from 'react';
import {brand} from '@/data/brand';
import {scrollToId} from '@/hooks/useLenis';
import {DoughnutMark} from './Navbar';

function onAnchor(e: MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  scrollToId(href.slice(1));
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-rule bg-cream pb-16 pt-12 sm:pb-12" aria-label="Footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a href="#hero" onClick={(e) => onAnchor(e, '#hero')} className="inline-flex items-center gap-2 text-[15px] font-medium">
            <DoughnutMark />
            {brand.name}
          </a>
          <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-ink-soft">{brand.description}</p>
        </div>
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">Explore</h3>
          <ul className="mt-3 space-y-2 text-[14.5px]">
            {brand.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => onAnchor(e, n.href)} className="hover:text-berry">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#reviews" onClick={(e) => onAnchor(e, '#reviews')} className="hover:text-berry">
                Reviews
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">Find us</h3>
          <address className="mt-3 space-y-2 text-[14.5px] not-italic text-ink-soft">
            <p>
              {brand.address.line1}, {brand.address.city} {brand.address.postcode}
            </p>
            <p>{brand.hours.short}</p>
            <p>
              <a href={`mailto:${brand.email}`} className="text-ink hover:text-berry">
                {brand.email}
              </a>
            </p>
            <p>
              <a href={brand.social.instagram} target="_blank" rel="noreferrer" className="text-ink hover:text-berry">
                Instagram
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 px-5 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} {brand.name}. Fried fresh, never frozen.
        </p>
        <p>Prices include GST. Demo storefront — payments are mocked.</p>
      </div>
    </footer>
  );
}
