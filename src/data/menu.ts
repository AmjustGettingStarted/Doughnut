export const CATEGORIES = ['Classic', 'Filled', 'Glazed', 'Vegan', 'Seasonal'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Topping = 'none' | 'sprinkles' | 'drizzle' | 'sugar' | 'nuts' | 'crackle';

export interface DoughnutImage {
  /** Glaze colour. */
  glaze: string;
  /** Secondary colour used by drizzle / sprinkles / nuts. */
  accent: string;
  topping: Topping;
  alt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in INR, whole rupees. */
  price: number;
  category: Category;
  tags: readonly string[];
  image: DoughnutImage;
  /** Shown in the pinned Flavors story. */
  signature?: boolean;
}

export const menu: readonly MenuItem[] = [
  {
    id: 'old-fashioned-glazed',
    name: 'Old Fashioned Glazed',
    description: 'The one that started it. Yeasted ring, thin vanilla-bean glaze, still warm when it leaves.',
    price: 89,
    category: 'Classic',
    tags: ['bestseller', 'vegetarian'],
    image: {glaze: '#f3e4c8', accent: '#e2c597', topping: 'none', alt: 'A classic glazed ring doughnut'},
    signature: true,
  },
  {
    id: 'cinnamon-sugar',
    name: 'Cinnamon Sugar',
    description: 'Rolled in Kerala cinnamon and raw sugar the second it comes out of the fryer.',
    price: 89,
    category: 'Classic',
    tags: ['vegetarian'],
    image: {glaze: '#d8a86b', accent: '#fff5e4', topping: 'sugar', alt: 'A cinnamon sugar doughnut'},
  },
  {
    id: 'chocolate-sprinkle',
    name: 'Chocolate Sprinkle',
    description: 'Dark cocoa glaze, a blizzard of rainbow sprinkles. The birthday one.',
    price: 99,
    category: 'Classic',
    tags: ['kids love it', 'vegetarian'],
    image: {glaze: '#4a2c22', accent: '#e5456e', topping: 'sprinkles', alt: 'A chocolate doughnut with sprinkles'},
  },
  {
    id: 'strawberry-milk',
    name: 'Strawberry Milk',
    description: 'Freeze-dried Mahabaleshwar strawberries folded into a milk glaze. Pink for a reason.',
    price: 119,
    category: 'Glazed',
    tags: ['bestseller', 'vegetarian'],
    image: {glaze: '#f5a3bb', accent: '#e5456e', topping: 'crackle', alt: 'A pink strawberry milk glazed doughnut'},
    signature: true,
  },
  {
    id: 'salted-caramel-crackle',
    name: 'Salted Caramel Crackle',
    description: 'Burnt-sugar caramel that sets into a shell. Cracks when you bite, like it should.',
    price: 129,
    category: 'Glazed',
    tags: ['bestseller', 'vegetarian'],
    image: {glaze: '#c98a3a', accent: '#f7f1e7', topping: 'crackle', alt: 'A salted caramel glazed doughnut with a cracked shell'},
    signature: true,
  },
  {
    id: 'pistachio-rose',
    name: 'Pistachio Rose',
    description: 'White chocolate and rose glaze, a heavy hand of toasted Iranian pistachio.',
    price: 139,
    category: 'Glazed',
    tags: ['vegetarian', 'contains nuts'],
    image: {glaze: '#f4e6ea', accent: '#8fb27a', topping: 'nuts', alt: 'A rose glazed doughnut topped with pistachio'},
  },
  {
    id: 'filter-coffee-cream',
    name: 'Filter Coffee Cream',
    description: 'Filled with a Kumbakonam degree-coffee pastry cream. Our love letter to the morning tumbler.',
    price: 139,
    category: 'Filled',
    tags: ['vegetarian', 'caffeinated'],
    image: {glaze: '#8a5a3c', accent: '#f7f1e7', topping: 'drizzle', alt: 'A filled doughnut with coffee cream and a white drizzle'},
    signature: true,
  },
  {
    id: 'lemon-curd-pillow',
    name: 'Lemon Curd Pillow',
    description: 'Sugar-dusted pillow, overfilled with sharp lemon curd. Napkin recommended.',
    price: 129,
    category: 'Filled',
    tags: ['vegetarian'],
    image: {glaze: '#f5de8a', accent: '#fff9e6', topping: 'sugar', alt: 'A sugar-dusted doughnut filled with lemon curd'},
  },
  {
    id: 'dark-chocolate-ganache',
    name: 'Dark Chocolate Ganache',
    description: '70% single-origin ganache, piped till it bulges. Not a breakfast doughnut.',
    price: 139,
    category: 'Filled',
    tags: ['vegetarian'],
    image: {glaze: '#2f1b15', accent: '#c98a3a', topping: 'drizzle', alt: 'A dark chocolate ganache filled doughnut'},
  },
  {
    id: 'coconut-jaggery',
    name: 'Coconut Jaggery',
    description: 'Vegan dough, palm-jaggery glaze, toasted coconut. Tastes like a Sunday in Udupi.',
    price: 119,
    category: 'Vegan',
    tags: ['vegan', 'dairy-free'],
    image: {glaze: '#a56b3e', accent: '#fff5e4', topping: 'nuts', alt: 'A vegan jaggery glazed doughnut with toasted coconut'},
  },
  {
    id: 'masala-chai-glaze',
    name: 'Masala Chai Glaze',
    description: 'Cardamom, ginger and black-tea glaze on our oat-milk dough. Dunk optional.',
    price: 119,
    category: 'Vegan',
    tags: ['vegan', 'dairy-free'],
    image: {glaze: '#d2b48c', accent: '#6b4a2e', topping: 'sprinkles', alt: 'A vegan masala chai glazed doughnut'},
  },
  {
    id: 'mango-lassi-custard',
    name: 'Mango Lassi Custard',
    description: 'Alphonso custard with a saffron-yoghurt glaze. Summer only, gone by noon.',
    price: 149,
    category: 'Seasonal',
    tags: ['limited', 'vegetarian'],
    image: {glaze: '#f7b53b', accent: '#fff3d6', topping: 'drizzle', alt: 'A mango lassi custard filled doughnut with saffron glaze'},
    signature: true,
  },
];

export const signatureFlavors = menu.filter((m) => m.signature);

export function getMenuItem(id: string): MenuItem | undefined {
  return menu.find((m) => m.id === id);
}
