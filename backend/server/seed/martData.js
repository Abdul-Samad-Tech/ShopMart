/** Supermarket catalog — Metro / Imtiaz style departments */

export const martCategories = [
  {
    name: 'Groceries & Staples',
    slug: 'groceries',
    icon: 'cart',
    image: '/assets/CATEGORIES/grocery and staples.jpg',
    href: '/products?category=Groceries%20%26%20Staples',
    itemCount: '500+ items',
    order: 1,
    subCategories: [
      { name: 'Rice & Flour', slug: 'rice', href: '/products?category=Groceries%20%26%20Staples', icon: 'bag' },
      { name: 'Cooking Oil', slug: 'oil', href: '/products?category=Groceries%20%26%20Staples', icon: 'bottle' },
      { name: 'Spices', slug: 'spices', href: '/products?category=Groceries%20%26%20Staples', icon: 'jar' },
    ],
  },
  {
    name: 'Fruits & Vegetables',
    slug: 'produce',
    icon: 'apple',
    image: '/assets/CATEGORIES/fruits and vegetables.jpg',
    href: '/products?category=Fruits%20%26%20Vegetables',
    itemCount: '200+ items',
    order: 2,
    subCategories: [
      { name: 'Fresh Fruits', slug: 'fruits', href: '/products?category=Fruits%20%26%20Vegetables', icon: 'apple' },
      { name: 'Fresh Vegetables', slug: 'veg', href: '/products?category=Fruits%20%26%20Vegetables', icon: 'leaf' },
    ],
  },
  {
    name: 'Meat & Poultry',
    slug: 'meat',
    icon: 'meat',
    image: '/assets/CATEGORIES/meat and poultty.webp',
    href: '/products?category=Meat%20%26%20Poultry',
    itemCount: '80+ items',
    order: 3,
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy',
    icon: 'milk',
    image: '/assets/CATEGORIES/dariy and eggs.webp',
    href: '/products?category=Dairy%20%26%20Eggs',
    itemCount: '120+ items',
    order: 4,
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    icon: 'bread',
    image: '/assets/CATEGORIES/bakery items.jpg',
    href: '/products?category=Bakery',
    itemCount: '60+ items',
    order: 5,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    icon: 'drink',
    image: '/assets/CATEGORIES/beverages.jpg',
    href: '/products?category=Beverages',
    itemCount: '150+ items',
    order: 6,
  },
  {
    name: 'Snacks & Confectionery',
    slug: 'snacks',
    icon: 'snack',
    image: '/assets/CATEGORIES/snacks and confectionery.jpg',
    href: '/products?category=Snacks%20%26%20Confectionery',
    itemCount: '180+ items',
    order: 7,
  },
  {
    name: 'Frozen Food',
    slug: 'frozen',
    icon: 'snow',
    image: '/assets/CATEGORIES/frozen items.jpeg',
    href: '/products?category=Frozen%20Food',
    itemCount: '90+ items',
    order: 8,
  },
  {
    name: 'Household & Cleaning',
    slug: 'household',
    icon: 'clean',
    image: '/assets/CATEGORIES/Household and cleaning.jpg',
    href: '/products?category=Household%20%26%20Cleaning',
    itemCount: '140+ items',
    order: 9,
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    icon: 'care',
    image: '/assets/CATEGORIES/personal care.jpg',
    href: '/products?category=Personal%20Care',
    itemCount: '200+ items',
    order: 10,
  },
  {
    name: 'Baby Care',
    slug: 'baby',
    icon: 'baby',
    image: '/assets/CATEGORIES/baby care.jpg',
    href: '/products?category=Baby%20Care',
    itemCount: '70+ items',
    order: 11,
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'chip',
    image: '/assets/CATEGORIES/electronic items.jpg',
    href: '/products?category=Electronics',
    itemCount: '100+ items',
    order: 12,
  },
  {
    name: 'Fashion & Clothing',
    slug: 'fashion',
    icon: 'shirt',
    image: '/assets/CATEGORIES/Fashion items.webp',
    href: '/products?category=Fashion%20%26%20Clothing',
    itemCount: '250+ items',
    order: 13,
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'home',
    image: '/assets/CATEGORIES/kitchen appliances.jpg',
    href: '/products?category=Home%20%26%20Kitchen',
    itemCount: '110+ items',
    order: 14,
  },
];

const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const martProducts = [
  { name: 'Basmati Rice 5kg', category: 'Groceries & Staples', price: 12.99, brand: 'DailyMart', image: '/assets/ITEMS/Basmati Rice 5kg.jpg', rating: 4.6, reviews: 320, popularity: 98, isFeatured: true },
  { name: 'Sunflower Cooking Oil 1L', category: 'Groceries & Staples', price: 4.49, brand: 'PureGold', image: '/assets/ITEMS/Sunflower Cooking Oil 1L.jpg', rating: 4.4, reviews: 210, popularity: 92 },
  { name: 'All-Purpose Flour 2kg', category: 'Groceries & Staples', price: 3.29, brand: 'BakeWell', image: '/assets/ITEMS/All-Purpose Flour 2kg.jpg', rating: 4.5, reviews: 145, popularity: 85 },
  { name: 'Red Lentils 1kg', category: 'Groceries & Staples', price: 2.19, brand: 'DailyMart', image: '/assets/ITEMS/Red Lentils 1kg.webp', rating: 4.7, reviews: 98, popularity: 80 },
  { name: 'Mixed Spices Pack', category: 'Groceries & Staples', price: 5.99, brand: 'SpiceHouse', image: '/assets/ITEMS/Mixed Spices Pack.jpg', rating: 4.8, reviews: 176, popularity: 78 },

  { name: 'Fresh Bananas 1kg', category: 'Fruits & Vegetables', price: 1.49, brand: 'FarmFresh', image: '/assets/ITEMS/Fresh Bananas 1kg.jpg', rating: 4.5, reviews: 400, popularity: 95, isFeatured: true },
  { name: 'Tomatoes 1kg', category: 'Fruits & Vegetables', price: 1.29, brand: 'FarmFresh', image: '/assets/ITEMS/Tomatoes 1kg.webp', rating: 4.3, reviews: 280, popularity: 88 },
  { name: 'Potatoes 2kg', category: 'Fruits & Vegetables', price: 2.49, brand: 'FarmFresh', image: '/assets/ITEMS/Potatoes 2kg.jpg', rating: 4.6, reviews: 310, popularity: 90 },
  { name: 'Mixed Salad Pack', category: 'Fruits & Vegetables', price: 3.99, brand: 'GreenLeaf', image: '/assets/ITEMS/Mixed Salad Pack.jpg', rating: 4.4, reviews: 120, popularity: 72 },
  { name: 'Oranges 1kg', category: 'Fruits & Vegetables', price: 2.19, brand: 'FarmFresh', image: '/assets/ITEMS/Oranges 1kg.jpg', rating: 4.5, reviews: 190, popularity: 75 },

  { name: 'Chicken Breast 1kg', category: 'Meat & Poultry', price: 8.99, brand: 'ButcherSelect', image: '/assets/ITEMS/Chicken Breast 1kg.jpg', rating: 4.6, reviews: 240, popularity: 91, isFeatured: true },
  { name: 'Beef Mince 500g', category: 'Meat & Poultry', price: 6.49, brand: 'ButcherSelect', image: '/assets/ITEMS/Beef Mince 500g.webp', rating: 4.5, reviews: 180, popularity: 84 },
  { name: 'Frozen Chicken Nuggets 1kg', category: 'Meat & Poultry', price: 7.99, brand: 'QuickMeal', image: '/assets/ITEMS/Frozen Chicken Nuggets 1kg.png', rating: 4.2, reviews: 220, popularity: 79 },

  { name: 'Fresh Milk 1L', category: 'Dairy & Eggs', price: 1.89, brand: 'DairyPure', image: '/assets/ITEMS/Fresh Milk 1L.jpg', rating: 4.7, reviews: 500, popularity: 97, isFeatured: true },
  { name: 'Eggs 12 Pack', category: 'Dairy & Eggs', price: 3.49, brand: 'FarmFresh', image: '/assets/ITEMS/Eggs 12 Pack.jpg', rating: 4.8, reviews: 420, popularity: 94 },
  { name: 'Cheddar Cheese 200g', category: 'Dairy & Eggs', price: 4.29, brand: 'DairyPure', image: '/assets/ITEMS/Cheddar Cheese 200g.webp', rating: 4.5, reviews: 160, popularity: 82 },
  { name: 'Yogurt 500g', category: 'Dairy & Eggs', price: 2.49, brand: 'DairyPure', image: '/assets/ITEMS/Yogurt 500g.jpg', rating: 4.4, reviews: 200, popularity: 80 },

  { name: 'White Bread Loaf', category: 'Bakery', price: 1.29, brand: 'BakeWell', image: '/assets/ITEMS/White Bread Loaf.webp', rating: 4.3, reviews: 350, popularity: 90 },
  { name: 'Croissants 4 Pack', category: 'Bakery', price: 3.99, brand: 'BakeWell', image: '/assets/ITEMS/Croissants 4 Pack.jpg', rating: 4.6, reviews: 140, popularity: 76, isFeatured: true },
  { name: 'Whole Wheat Bread', category: 'Bakery', price: 1.79, brand: 'BakeWell', image: '/assets/ITEMS/Whole Wheat Bread.jpg', rating: 4.4, reviews: 180, popularity: 74 },

  { name: 'Cola 2L', category: 'Beverages', price: 1.99, brand: 'FizzUp', image: '/assets/ITEMS/Cola 2L.jpg', rating: 4.2, reviews: 600, popularity: 93 },
  { name: 'Orange Juice 1L', category: 'Beverages', price: 3.49, brand: 'SunSip', image: '/assets/ITEMS/Orange Juice 1L.jpg', rating: 4.5, reviews: 280, popularity: 86, isFeatured: true },
  { name: 'Mineral Water 6 Pack', category: 'Beverages', price: 4.99, brand: 'AquaLife', image: '/assets/ITEMS/Mineral Water 6 Pack.jpg', rating: 4.7, reviews: 410, popularity: 88 },
  { name: 'Black Tea 100 Bags', category: 'Beverages', price: 5.49, brand: 'TeaTime', image: '/assets/ITEMS/Black Tea 100 Bags.jpg', rating: 4.6, reviews: 190, popularity: 77 },

  { name: 'Potato Chips Family Pack', category: 'Snacks & Confectionery', price: 3.29, brand: 'Crunchy', image: '/assets/ITEMS/Potato Chips Family Pack.jpg', rating: 4.4, reviews: 520, popularity: 92 },
  { name: 'Chocolate Bar Multipack', category: 'Snacks & Confectionery', price: 4.99, brand: 'SweetTreat', image: '/assets/ITEMS/Chocolate Bar Multipack.jpg', rating: 4.7, reviews: 380, popularity: 89, isFeatured: true },
  { name: 'Biscuits Assorted 400g', category: 'Snacks & Confectionery', price: 2.99, brand: 'BakeWell', image: '/assets/ITEMS/Biscuits Assorted 400g.jpg', rating: 4.3, reviews: 260, popularity: 81 },

  { name: 'Frozen French Fries 1kg', category: 'Frozen Food', price: 3.99, brand: 'QuickMeal', image: '/assets/ITEMS/Frozen French Fries 1kg.png', rating: 4.3, reviews: 310, popularity: 85 },
  { name: 'Frozen Mixed Vegetables 500g', category: 'Frozen Food', price: 2.79, brand: 'FrostFresh', image: '/assets/ITEMS/Frozen Mixed Vegetables 500g.webp', rating: 4.4, reviews: 200, popularity: 78 },
  { name: 'Ice Cream 1L', category: 'Frozen Food', price: 5.49, brand: 'CreamDream', image: '/assets/ITEMS/Ice Cream 1L.jpg', rating: 4.8, reviews: 290, popularity: 87, isFeatured: true },

  { name: 'Laundry Detergent 3kg', category: 'Household & Cleaning', price: 11.99, brand: 'CleanHome', image: '/assets/ITEMS/Laundry Detergent 3kg.jpg', rating: 4.5, reviews: 340, popularity: 88 },
  { name: 'Dish Soap 750ml', category: 'Household & Cleaning', price: 2.49, brand: 'CleanHome', image: '/assets/ITEMS/Dish Soap 750ml.jpg', rating: 4.4, reviews: 220, popularity: 82 },
  { name: 'Toilet Paper 12 Rolls', category: 'Household & Cleaning', price: 8.99, brand: 'SoftTouch', image: '/assets/ITEMS/Toilet Paper 12 Rolls.webp', rating: 4.6, reviews: 450, popularity: 91 },

  { name: 'Shampoo 400ml', category: 'Personal Care', price: 5.99, brand: 'GlowCare', image: '/assets/ITEMS/Shampoo 400ml.webp', rating: 4.5, reviews: 280, popularity: 84 },
  { name: 'Toothpaste Twin Pack', category: 'Personal Care', price: 4.49, brand: 'SmileBright', image: '/assets/ITEMS/Toothpaste Twin Pack.png', rating: 4.6, reviews: 360, popularity: 86 },
  { name: 'Soap Bar 4 Pack', category: 'Personal Care', price: 3.29, brand: 'GlowCare', image: '/assets/ITEMS/Soap Bar 4 Pack.jpg', rating: 4.3, reviews: 190, popularity: 75 },

  { name: 'Baby Diapers Size 3 (48)', category: 'Baby Care', price: 14.99, brand: 'TinyCare', image: '/assets/ITEMS/Baby Diapers Size 3 (48).jpg', rating: 4.7, reviews: 410, popularity: 90, isFeatured: true },
  { name: 'Baby Wipes 3 Pack', category: 'Baby Care', price: 6.99, brand: 'TinyCare', image: '/assets/ITEMS/Baby Wipes 3 Pack.jpg', rating: 4.5, reviews: 240, popularity: 83 },

  { name: 'Bluetooth Speaker', category: 'Electronics', price: 29.99, originalPrice: 39.99, discount: 25, brand: 'TechMart', image: '/assets/ITEMS/Bluetooth Speaker.jpg', rating: 4.4, reviews: 120, popularity: 80 },
  { name: 'Electric Kettle 1.7L', category: 'Electronics', price: 24.99, brand: 'HomeTech', image: '/assets/ITEMS/Electric Kettle 1.7L.webp', rating: 4.5, reviews: 95, popularity: 76, isFeatured: true },
  { name: 'LED Bulb 4 Pack', category: 'Electronics', price: 8.99, brand: 'BrightLite', image: '/assets/ITEMS/LED Bulb 4 Pack.jpg', rating: 4.3, reviews: 88, popularity: 70 },

  { name: 'Men Cotton T-Shirt', category: 'Fashion & Clothing', price: 9.99, brand: 'StyleMart', image: '/assets/ITEMS/Men Cotton T-Shirt.jpg', rating: 4.2, reviews: 150, popularity: 74, sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Women Kurti', category: 'Fashion & Clothing', price: 19.99, brand: 'StyleMart', image: '/assets/ITEMS/Women Kurti.webp', rating: 4.5, reviews: 110, popularity: 78, isFeatured: true },
  { name: 'Kids School Shoes', category: 'Fashion & Clothing', price: 24.99, brand: 'StepUp', image: '/assets/ITEMS/Kids School Shoes.jpg', rating: 4.4, reviews: 85, popularity: 72, sizes: ['28', '30', '32', '34'] },

  { name: 'Non-Stick Frying Pan', category: 'Home & Kitchen', price: 18.99, brand: 'ChefPro', image: '/assets/ITEMS/Non-Stick Frying Pan.jpg', rating: 4.6, reviews: 200, popularity: 82 },
  { name: 'Dinner Plates Set of 6', category: 'Home & Kitchen', price: 22.99, brand: 'HomeStyle', image: '/assets/ITEMS/Dinner Plates Set of 6.jpg', rating: 4.4, reviews: 90, popularity: 71 },
  { name: 'Food Storage Containers 10pc', category: 'Home & Kitchen', price: 12.99, brand: 'StoreWell', image: '/assets/ITEMS/Food Storage Containers 10pc.jpg', rating: 4.5, reviews: 130, popularity: 77, isFeatured: true },
];

export const martSiteContent = {
  branding: { siteName: 'ShopMart', tagline: 'Your Neighborhood Superstore' },
  hero: {
    eyebrow: 'Weekly Deals',
    title: 'Everything Under',
    titleAccent: 'One Roof',
    subtitle: 'Groceries, fresh produce, household essentials, fashion, and electronics — delivered or pick up in store.',
    backgroundType: 'gradient',
    backgroundImage: '',
    backgroundVideo: '',
    lottieUrl: '',
    sideImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    sideCaption: 'Fresh deals every week',
    ctas: [
      { label: 'Shop All Aisles', href: '/products', variant: 'gold' },
      { label: "Today's Deals", href: '/products?sort=popularity', variant: 'ghost' },
    ],
  },
  theme: {
    defaultMode: 'light',
    allowToggle: true,
    accents: {
      primary: '#146B45',
      gold: '#9A4E24',
      charcoal: '#1C1917',
      cream: '#F6F3EC',
      midnight: '#121614',
      slate: '#5C564E',
    },
  },
  trustBar: [
    { title: 'Free delivery', description: 'Orders over Rs. 50', icon: 'shipping' },
    { title: 'Fresh guarantee', description: 'Quality checked daily', icon: 'returns' },
    { title: 'Secure checkout', description: 'Safe payments', icon: 'secure' },
    { title: 'Store support', description: '7 days a week', icon: 'support' },
  ],
};

export const martNavigation = {
  key: 'main',
  items: [
    { label: 'Home', href: '/', order: 0 },
    {
      label: 'Departments',
      href: '/products',
      mega: true,
      order: 1,
      columns: [
        {
          title: 'Food & Fresh',
          links: [
            { label: 'Groceries & Staples', href: '/products?category=Groceries%20%26%20Staples' },
            { label: 'Fruits & Vegetables', href: '/products?category=Fruits%20%26%20Vegetables' },
            { label: 'Meat & Poultry', href: '/products?category=Meat%20%26%20Poultry' },
            { label: 'Dairy & Eggs', href: '/products?category=Dairy%20%26%20Eggs' },
            { label: 'Bakery', href: '/products?category=Bakery' },
          ],
        },
        {
          title: 'Pantry & Frozen',
          links: [
            { label: 'Beverages', href: '/products?category=Beverages' },
            { label: 'Snacks', href: '/products?category=Snacks%20%26%20Confectionery' },
            { label: 'Frozen Food', href: '/products?category=Frozen%20Food' },
          ],
        },
        {
          title: 'Home & More',
          links: [
            { label: 'Household', href: '/products?category=Household%20%26%20Cleaning' },
            { label: 'Personal Care', href: '/products?category=Personal%20Care' },
            { label: 'Baby Care', href: '/products?category=Baby%20Care' },
            { label: 'Electronics', href: '/products?category=Electronics' },
            { label: 'Fashion', href: '/products?category=Fashion%20%26%20Clothing' },
            { label: 'Home & Kitchen', href: '/products?category=Home%20%26%20Kitchen' },
          ],
        },
        {
          title: 'Quick links',
          links: [
            { label: 'All products', href: '/products' },
            { label: 'Best sellers', href: '/products?sort=popularity' },
            { label: 'New arrivals', href: '/products?sort=newest' },
          ],
        },
      ],
      children: [
        { label: 'View all departments', href: '/products', description: 'Browse full store' },
        { label: 'Weekly deals', href: '/products?sort=popularity', description: 'Top offers' },
      ],
    },
    { label: 'Deals', href: '/products?sort=popularity', order: 2 },
    { label: 'Contact', href: '/contact', order: 3 },
  ],
};

export const martFooter = {
  description: 'ShopMart — everyday low prices on groceries, fresh food, and household essentials.',
  columns: [
    {
      title: 'Shop',
      links: [
        { label: 'All departments', href: '/products' },
        { label: 'Weekly deals', href: '/products?sort=popularity' },
        { label: 'Fresh produce', href: '/products?category=Fruits%20%26%20Vegetables' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Contact us', href: '/contact' },
        { label: 'Delivery info', href: '/contact' },
        { label: 'Returns', href: '/contact' },
      ],
    },
  ],
  newsletter: {
    enabled: true,
    title: 'Weekly deals',
    description: 'Get offers and new arrivals in your inbox.',
  },
  copyright: 'ShopMart. All rights reserved.',
};
