/**
 * Shared category/subcategory structure – same as Secondary Navbar and Navbar.
 * Use this for user-side nav and admin product filters so order and structure match.
 */
export const CATEGORIES = [
  {
    name: "MEN'S SHOES",
    path: '/category/shoes/mens-shoes',
    subcategories: [
      { name: 'Men Sports Shoes', path: '/category/shoes/mens-shoes/Men-sports-shoes' },
      { name: 'Men Casual Shoes', path: '/category/shoes/mens-shoes/Men-casual-shoes' },
      { name: 'Men Formal Shoes', path: '/category/shoes/mens-shoes/Men-formal-shoes' },
      { name: 'Men Sneakers', path: '/category/shoes/mens-shoes/Men-sneakers' },
      { name: 'Men Boots', path: '/category/shoes/mens-shoes/Men-boots' },
      { name: 'Men Sandals', path: '/category/shoes/mens-shoes/Men-sandals' },
    ],
  },
  {
    name: "WOMEN'S SHOES",
    path: '/category/shoes/womens-shoes',
    subcategories: [
      { name: 'Women Heels', path: '/category/shoes/womens-shoes/Women-heels' },
      { name: 'Women Flats', path: '/category/shoes/womens-shoes/Women-flats' },
      { name: 'Women Sneakers', path: '/category/shoes/womens-shoes/Women-sneakers' },
      { name: 'Women Sports Shoes', path: '/category/shoes/womens-shoes/Women-sports-shoes' },
      { name: 'Women Chappals', path: '/category/shoes/womens-shoes/Women-chappals' },
      { name: 'Women Sandals', path: '/category/shoes/womens-shoes/Women-sandals' },
    ],
  },
  {
    name: "WOMEN WATCHES",
    path: '/category/watches/Women-watches',
    subcategories: [
      { name: 'Women Analog Watches', path: '/category/watches/Women-watches/Women-analog-watches' },
      { name: 'Women Digital Watches', path: '/category/watches/Women-watches/Women-digital-watches' },
      { name: 'Women Smart Watches', path: '/category/watches/Women-watches/Women-smart-watches' },
      { name: 'Women Fitness Trackers', path: '/category/watches/Women-watches/Women-fitness-trackers' },
      { name: 'Women Classic Watches', path: '/category/watches/Women-watches/Women-classic-watches' },
    ],
  },
  {
    name: "MEN WATCHES",
    path: '/category/watches/men-watches',
    subcategories: [
      { name: 'Men Analog Watches', path: '/category/watches/men-watches/Men-analog-watches' },
      { name: 'Men Digital Watches', path: '/category/watches/men-watches/Men-digital-watches' },
      { name: 'Men Smart Watches', path: '/category/watches/men-watches/Men-smart-watches' },
      { name: 'Men Sports Watches', path: '/category/watches/men-watches/Men-sports-watches' },
      { name: 'Men Luxury Watches', path: '/category/watches/men-watches/Men-luxury-watches' },
      { name: 'Men Chronograph Watches', path: '/category/watches/men-watches/Men-chronograph-watches' },
    ],
  },
  {
    name: "WOMEN ACCESSORIES",
    path: '/category/accessories/women-accessories',
    subcategories: [
      { name: 'Women Belts', path: '/category/accessories/women-accessories/women-belts' },
      { name: 'Women Goggles', path: '/category/accessories/women-accessories/women-goggles' },
      { name: 'Women Sunglasses', path: '/category/accessories/women-accessories/women-sunglasses' },
      { name: 'Women Handbags', path: '/category/accessories/women-accessories/women-handbags' },
      { name: 'Women Wallets', path: '/category/accessories/women-accessories/women-wallets' },
    ],
  },
  {
    name: "MEN ACCESSORIES",
    path: '/category/accessories/men-accessories',
    subcategories: [
      { name: 'Men Belts', path: '/category/accessories/men-accessories/men-belts' },
      { name: 'Men Goggles', path: '/category/accessories/men-accessories/men-goggles' },
      { name: 'Men Sunglasses', path: '/category/accessories/men-accessories/men-sunglasses' },
      { name: 'Men Wallets', path: '/category/accessories/men-accessories/men-wallets' },
      { name: 'Men Caps', path: '/category/accessories/men-accessories/men-caps' },
    ],
  },
];
