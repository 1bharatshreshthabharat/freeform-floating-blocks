// SupermarketSortData.ts
export interface GameLevel {
  level: number;
  timeLimit: number;
  itemCount: number;
  categories: string[];
  theme: string;
}

export const levels: GameLevel[] = [
  { level: 1, timeLimit: 120, itemCount: 12, categories: ['produce', 'dairy', 'pantry'], theme: 'Quick Shopping' },
  { level: 2, timeLimit: 100, itemCount: 16, categories: ['produce', 'dairy', 'meat', 'bakery'], theme: 'Family Groceries' },
  { level: 3, timeLimit: 80, itemCount: 20, categories: ['produce', 'dairy', 'meat', 'bakery', 'frozen'], theme: 'Weekly Shop' },
  { level: 4, timeLimit: 70, itemCount: 24, categories: ['produce', 'dairy', 'meat', 'bakery', 'pantry', 'frozen', 'household'], theme: 'Mega Shopping' },
  { level: 5, timeLimit: 90, itemCount: 18, categories: ['beverages', 'snacks', 'cleaning', 'household'], theme: 'Essentials Run' },
  { level: 6, timeLimit: 60, itemCount: 24, categories: ['produce', 'dairy', 'meat', 'bakery', 'pantry', 'frozen'], theme: 'Speed Shopping' },
];

export const itemDatabase = {
  produce: [
    { name: 'Apples', emoji: '🍎', price: 3.99 },
    { name: 'Bananas', emoji: '🍌', price: 2.49 },
    { name: 'Carrots', emoji: '🥕', price: 1.99 },
    { name: 'Lettuce', emoji: '🥬', price: 2.79 },
    { name: 'Tomatoes', emoji: '🍅', price: 3.49 },
    { name: 'Onions', emoji: '🧅', price: 1.89 },
    { name: 'Grapes', emoji: '🍇', price: 4.99 },
    { name: 'Strawberries', emoji: '🍓', price: 5.49 },
    { name: 'Avocado', emoji: '🥑', price: 2.99 },
    { name: 'Cucumber', emoji: '🥒', price: 1.49 },
  ],
  dairy: [
    { name: 'Milk', emoji: '🥛', price: 4.99 },
    { name: 'Cheese', emoji: '🧀', price: 6.49 },
    { name: 'Eggs', emoji: '🥚', price: 3.99 },
    { name: 'Butter', emoji: '🧈', price: 5.99 },
    { name: 'Yogurt', emoji: '🍶', price: 4.49 },
    { name: 'Cream', emoji: '🍦', price: 3.99 },
    { name: 'Sour Cream', emoji: '🥛', price: 2.99 },
    { name: 'Cottage Cheese', emoji: '🧀', price: 3.49 },
  ],
  meat: [
    { name: 'Chicken', emoji: '🍗', price: 8.99 },
    { name: 'Beef', emoji: '🥩', price: 12.99 },
    { name: 'Fish', emoji: '🐟', price: 9.99 },
    { name: 'Bacon', emoji: '🥓', price: 7.49 },
    { name: 'Sausage', emoji: '🌭', price: 6.99 },
    { name: 'Turkey', emoji: '🦃', price: 10.99 },
    { name: 'Ham', emoji: '🍖', price: 8.49 },
  ],
  bakery: [
    { name: 'Bread', emoji: '🍞', price: 2.99 },
    { name: 'Croissant', emoji: '🥐', price: 1.99 },
    { name: 'Bagel', emoji: '🥯', price: 4.99 },
    { name: 'Cake', emoji: '🎂', price: 12.99 },
    { name: 'Donut', emoji: '🍩', price: 1.49 },
    { name: 'Muffin', emoji: '🧁', price: 2.99 },
    { name: 'Baguette', emoji: '🥖', price: 3.49 },
  ],
  pantry: [
    { name: 'Rice', emoji: '🍚', price: 3.49 },
    { name: 'Pasta', emoji: '🍝', price: 2.99 },
    { name: 'Cereal', emoji: '🥣', price: 5.99 },
    { name: 'Olive Oil', emoji: '🫒', price: 8.99 },
    { name: 'Flour', emoji: '🌾', price: 4.49 },
    { name: 'Sugar', emoji: '🍚', price: 3.99 },
    { name: 'Salt', emoji: '🧂', price: 2.49 },
  ],
  frozen: [
    { name: 'Ice Cream', emoji: '🍦', price: 6.99 },
    { name: 'Pizza', emoji: '🍕', price: 4.99 },
    { name: 'Vegetables', emoji: '🥦', price: 3.99 },
    { name: 'Waffles', emoji: '🧇', price: 4.49 },
    { name: 'Frozen Berries', emoji: '🫐', price: 5.99 },
    { name: 'Frozen Dinner', emoji: '🍱', price: 6.49 },
  ],
  household: [
    { name: 'Soap', emoji: '🧼', price: 3.99 },
    { name: 'Shampoo', emoji: '🧴', price: 7.99 },
    { name: 'Tissues', emoji: '🧻', price: 4.99 },
    { name: 'Detergent', emoji: '🧽', price: 9.99 },
    { name: 'Sponges', emoji: '🧽', price: 2.99 },
    { name: 'Toothpaste', emoji: '🪥', price: 3.49 },
  ],
  beverages: [
    { name: 'Orange Juice', emoji: '🧃', price: 3.49 },
    { name: 'Coffee', emoji: '☕', price: 5.99 },
    { name: 'Tea', emoji: '🫖', price: 4.29 },
    { name: 'Soda', emoji: '🥤', price: 2.99 },
    { name: 'Water Bottle', emoji: '💧', price: 1.49 },
    { name: 'Energy Drink', emoji: '⚡', price: 3.99 },
    { name: 'Beer', emoji: '🍺', price: 8.99 },
  ],
  snacks: [
    { name: 'Chips', emoji: '🍟', price: 2.99 },
    { name: 'Popcorn', emoji: '🍿', price: 3.49 },
    { name: 'Chocolate', emoji: '🍫', price: 2.79 },
    { name: 'Cookies', emoji: '🍪', price: 4.29 },
    { name: 'Nuts', emoji: '🥜', price: 5.99 },
    { name: 'Candy', emoji: '🍬', price: 3.99 },
  ],
  cleaning: [
    { name: 'Glass Cleaner', emoji: '🪟', price: 6.49 },
    { name: 'Mop', emoji: '🧹', price: 12.99 },
    { name: 'Trash Bags', emoji: '🗑️', price: 5.99 },
    { name: 'Bleach', emoji: '🧴', price: 4.99 },
    { name: 'Dish Soap', emoji: '🧼', price: 3.49 },
    { name: 'Air Freshener', emoji: '🌸', price: 4.99 },
  ]
};

export const aisleData = {
  produce: { name: 'Produce', emoji: '🥬', color: 'from-green-400 to-green-600' },
  dairy: { name: 'Dairy', emoji: '🥛', color: 'from-blue-400 to-blue-600' },
  meat: { name: 'Meat & Seafood', emoji: '🥩', color: 'from-red-400 to-red-600' },
  bakery: { name: 'Bakery', emoji: '🍞', color: 'from-yellow-400 to-orange-600' },
  pantry: { name: 'Pantry', emoji: '🥫', color: 'from-brown-400 to-brown-600' },
  frozen: { name: 'Frozen', emoji: '🧊', color: 'from-cyan-400 to-blue-600' },
  household: { name: 'Household', emoji: '🧼', color: 'from-purple-400 to-purple-600' },
  beverages: { name: 'Beverages', emoji: '🧃', color: 'from-orange-400 to-orange-600' },
  snacks: { name: 'Snacks', emoji: '🍪', color: 'from-pink-400 to-pink-600' },
  cleaning: { name: 'Cleaning', emoji: '🧹', color: 'from-gray-400 to-gray-600' }
};

export const gameModes = {
  supermarket: { title: 'Supermarket Sort', emoji: '🛒', description: 'Sort grocery items into correct aisles' },
  office: { title: 'Office Sort', emoji: '📁', description: 'Organize office supplies and documents' },
  parking: { title: 'Parking Sort', emoji: '🚗', description: 'Park cars in correct spots by color and type' },
  eggs: { title: 'Egg Sort', emoji: '🥚', description: 'Sort different types of eggs into baskets' },
  electronics: { title: 'Electronics Sort', emoji: '💻', description: 'Organize gadgets, devices and accessories' },
  toyland: { title: 'Toy Sort', emoji: '🧸', description: 'Sort fun toys into the right bins' },
  bookshop: { title: 'Book Sort', emoji: '📚', description: 'Place books by genre and category' },
  wardrobe: { title: 'Clothing Sort', emoji: '👕', description: 'Organize clothes by type and color' },
  garden: { title: 'Garden Sort', emoji: '🌱', description: 'Sort plants, tools and garden items' }
};

export const themes = {
  default: {
    background: 'bg-gradient-to-br from-blue-100 to-green-100',
    card: 'bg-white',
    aisle: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    itemCard: 'bg-white hover:bg-blue-50'
  },
  dark: {
    background: 'bg-gradient-to-br from-gray-800 to-gray-900',
    card: 'bg-gray-700',
    aisle: 'bg-gradient-to-br from-gray-600 to-gray-800 text-white',
    itemCard: 'bg-gray-600 hover:bg-gray-500 text-white'
  },
  pastel: {
    background: 'bg-gradient-to-br from-pink-100 to-purple-100',
    card: 'bg-white',
    aisle: 'bg-gradient-to-br from-pink-300 to-purple-300 text-white',
    itemCard: 'bg-white hover:bg-pink-50'
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-100 to-pink-100',
    card: 'bg-white',
    aisle: 'bg-gradient-to-br from-orange-300 to-pink-300 text-white',
    itemCard: 'bg-white hover:bg-orange-50'
  }
};

