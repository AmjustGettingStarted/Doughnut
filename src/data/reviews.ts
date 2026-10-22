export interface Review {
  id: string;
  name: string;
  area: string;
  rating: 4 | 5;
  text: string;
  item: string;
}

export const reviews: readonly Review[] = [
  {
    id: 'r1',
    name: 'Ananya R.',
    area: 'Indiranagar',
    rating: 5,
    text: 'Ordered a box of six at 7:05. It was at my door at 7:38, still warm, and the caramel actually cracked.',
    item: 'Salted Caramel Crackle',
  },
  {
    id: 'r2',
    name: 'Karthik M.',
    area: 'Koramangala',
    rating: 5,
    text: 'The filter coffee one tastes like my grandmother’s kitchen if it were a doughnut. I don’t know how else to say it.',
    item: 'Filter Coffee Cream',
  },
  {
    id: 'r3',
    name: 'Priya & Dev',
    area: 'Richmond Town',
    rating: 5,
    text: 'We walk over every Saturday. The glazed is the benchmark now; everything else in the city tastes like bread.',
    item: 'Old Fashioned Glazed',
  },
  {
    id: 'r4',
    name: 'Sameer K.',
    area: 'HSR Layout',
    rating: 4,
    text: 'Vegan masala chai glaze is unreasonably good. Four stars only because it sold out before my second order.',
    item: 'Masala Chai Glaze',
  },
  {
    id: 'r5',
    name: 'Meera S.',
    area: 'Jayanagar',
    rating: 5,
    text: 'Got the twelve for an office thing. Zero left by 10am, and someone cried a little over the mango custard.',
    item: 'Mango Lassi Custard',
  },
  {
    id: 'r6',
    name: 'Rohan T.',
    area: 'MG Road',
    rating: 5,
    text: 'Pink doughnut, real strawberries, not a drop of syrup. Kids approved, adults finished theirs first.',
    item: 'Strawberry Milk',
  },
];

export const socialProof = {
  rating: 4.9,
  ratingCount: 2180,
  boxesThisYear: 38400,
  repeatRate: 71,
} as const;
