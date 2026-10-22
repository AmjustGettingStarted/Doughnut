import type {DoughnutImage} from '@/data/menu';

const SPRINKLES = [
  [34, 22, -30],
  [56, 18, 40],
  [72, 34, 10],
  [26, 40, 70],
  [78, 58, -50],
  [40, 70, 20],
  [62, 76, -20],
  [24, 60, -70],
  [52, 44, 55],
] as const;

const NUTS = [
  [30, 26],
  [52, 20],
  [70, 30],
  [78, 52],
  [66, 74],
  [36, 76],
  [24, 50],
] as const;

const CRACKS =
  'M30 32 l8 6 -3 8 M60 24 l6 9 8 -2 M70 60 l-7 5 2 8 M36 66 l6 -7 -8 -5 M50 78 l4 -6 M22 48 l9 2';

interface DoughnutArtProps {
  image: DoughnutImage;
  className?: string;
  /** Decorative when used next to the item name; keep alt for standalone uses. */
  decorative?: boolean;
}

/** Vector doughnut used for all product imagery — no raster assets to lazy-load. */
export function DoughnutArt({image, className, decorative = false}: DoughnutArtProps) {
  const {glaze, accent, topping} = image;
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : image.alt}
    >
      <defs>
        <radialGradient id={`dough-${glaze.slice(1)}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f3d9ad" />
          <stop offset="100%" stopColor="#d9a86e" />
        </radialGradient>
        <mask id={`hole-${glaze.slice(1)}-${topping}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="50" cy="50" r="14" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#hole-${glaze.slice(1)}-${topping})`}>
        <ellipse cx="50" cy="56" rx="43" ry="40" fill="rgba(13,12,11,0.12)" />
        <circle cx="50" cy="50" r="42" fill={`url(#dough-${glaze.slice(1)})`} />
        <path
          d="M50 10c22 0 40 17 40 38 0 6-3 8-6 12-3 4 2 9-4 13-5 3-9-3-13 1s-1 9-8 9-7-6-12-6-7 5-12 2-4-9-9-12-7-4-7-9c0-26 11-48 31-48z"
          fill={glaze}
        />
        <ellipse cx="38" cy="30" rx="12" ry="5" fill="#fff" opacity="0.28" transform="rotate(-25 38 30)" />
        {topping === 'sprinkles' &&
          SPRINKLES.map(([x, y, r], i) => (
            <rect
              key={i}
              x={x - 4}
              y={y - 1.4}
              width="8"
              height="2.8"
              rx="1.4"
              fill={i % 3 === 0 ? accent : i % 3 === 1 ? '#f7f1e7' : '#c98a3a'}
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}
        {topping === 'drizzle' && (
          <path
            d="M18 40c8-6 14 8 22 2s12-10 20-4 12 8 22 0M22 56c8-6 14 8 22 2s12-10 20-4 10 6 16 2"
            fill="none"
            stroke={accent}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
        {topping === 'sugar' &&
          SPRINKLES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 1.6 : 1.1} fill={accent} />)}
        {topping === 'nuts' &&
          NUTS.map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3.4" ry="2.2" fill={accent} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        {topping === 'crackle' && (
          <path d={CRACKS} fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        )}
      </g>
      <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(13,12,11,0.08)" strokeWidth="1" />
    </svg>
  );
}
