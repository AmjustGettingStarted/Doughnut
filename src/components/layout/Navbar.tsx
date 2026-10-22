import type {MouseEvent} from 'react';
import {brand} from '@/data/brand';
import {scrollToId} from '@/hooks/useLenis';
import {Button} from '@/components/ui/Button';

function handleAnchor(e: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  scrollToId(href.slice(1));
  history.replaceState(null, '', href);
}

export function DoughnutMark({className = 'h-5 w-5'}: {className?: string}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="currentColor" />
      <circle cx="16" cy="16" r="4.5" fill="var(--color-cream)" />
      <path
        d="M6 13c3-4 7-5 10-4s6 1 9-2"
        fill="none"
        stroke="var(--color-berry)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pb-3.5 safe-top sm:px-[clamp(16px,3.4vw,44px)]"
      style={{
        background:
          'linear-gradient(to bottom, rgba(242,240,236,.94) 0%, rgba(242,240,236,.78) 72%, rgba(242,240,236,0) 100%)',
      }}
    >
      <a
        href="#hero"
        onClick={(e) => handleAnchor(e, '#hero')}
        className="flex min-w-0 items-center gap-2 text-[15px] tracking-[-0.012em] text-ink"
        aria-label={`${brand.name} — back to top`}
      >
        <DoughnutMark />
        <span className="truncate font-medium">{brand.name}</span>
      </a>

      <nav aria-label="Primary" className="flex items-center gap-[clamp(14px,2.4vw,32px)]">
        <ul className="hidden items-center gap-[clamp(14px,2.4vw,28px)] md:flex">
          {brand.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleAnchor(e, item.href)}
                className="text-[14.5px] tracking-[-0.008em] text-ink/85 transition-opacity hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Button href="#menu" size="sm" onClick={(e) => handleAnchor(e, '#menu')} className="sm:h-10 sm:px-5">
          Order now
        </Button>
      </nav>
    </header>
  );
}
