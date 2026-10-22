export const brand = {
  name: 'Ring Theory',
  tagline: 'Baked at four. Boxed by seven.',
  description:
    'Small-batch doughnuts, hand-glazed every morning in a tiny kitchen off Lavelle Road. We fry at four, glaze at six and the first boxes leave at seven.',
  since: 2021,
  address: {
    line1: '14 Lavelle Road',
    line2: 'Ashok Nagar',
    city: 'Bengaluru',
    postcode: '560001',
    mapsUrl: 'https://maps.google.com/?q=14+Lavelle+Road+Bengaluru',
  },
  hours: {
    short: 'Tue–Sun · 7am till sold out',
    days: [
      {day: 'Monday', time: 'Closed (dough rests, so do we)'},
      {day: 'Tuesday – Friday', time: '7:00am – 3:00pm'},
      {day: 'Saturday – Sunday', time: '7:00am – 5:00pm'},
    ],
  },
  phone: '+91 80 4123 4567',
  email: 'hello@ringtheory.in',
  social: {
    instagram: 'https://instagram.com/ringtheory.in',
  },
  delivery: {
    freeAbove: 799,
    fee: 49,
    zones: [
      {name: 'Central', areas: 'MG Road, Lavelle Rd, Richmond Town, Shanthala Nagar', eta: '25–35 min'},
      {name: 'Indiranagar & Domlur', areas: '100ft Rd, Defence Colony, HAL 2nd Stage', eta: '35–45 min'},
      {name: 'Koramangala & HSR', areas: 'All blocks, Sector 1–7', eta: '40–55 min'},
      {name: 'Jayanagar & JP Nagar', areas: 'Blocks 1–9, Phases 1–6', eta: '40–55 min'},
    ],
  },
  nav: [
    {label: 'Craft', href: '#craft'},
    {label: 'Menu', href: '#menu'},
    {label: 'Box', href: '#box'},
    {label: 'Visit', href: '#visit'},
  ],
} as const;
