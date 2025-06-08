
export const fruitTypes = {
  // Original fruits
  apple: { emoji: '🍎', points: 10, juiceColor: '#FF6B6B' },
  orange: { emoji: '🍊', points: 15, juiceColor: '#FFA500' },
  banana: { emoji: '🍌', points: 12, juiceColor: '#FFFF99' },
  watermelon: { emoji: '🍉', points: 20, juiceColor: '#FF69B4' },
  pineapple: { emoji: '🍍', points: 25, juiceColor: '#FFD700' },
  strawberry: { emoji: '🍓', points: 18, juiceColor: '#FF1493' },
  grape: { emoji: '🍇', points: 22, juiceColor: '#9370DB' },
  kiwi: { emoji: '🥝', points: 16, juiceColor: '#90EE90' },
  
  // Additional fruits
  peach: { emoji: '🍑', points: 14, juiceColor: '#FFCCCB' },
  mango: { emoji: '🥭', points: 19, juiceColor: '#FFB347' },
  coconut: { emoji: '🥥', points: 17, juiceColor: '#F5F5DC' },
  lemon: { emoji: '🍋', points: 13, juiceColor: '#FFFACD' },
  cherry: { emoji: '🍒', points: 21, juiceColor: '#DC143C' },
  blueberry: { emoji: '🫐', points: 23, juiceColor: '#4169E1' },
  
  // Vegetables
  carrot: { emoji: '🥕', points: 11, juiceColor: '#FFA500' },
  broccoli: { emoji: '🥦', points: 14, juiceColor: '#228B22' },
  tomato: { emoji: '🍅', points: 13, juiceColor: '#FF6347' },
  eggplant: { emoji: '🍆', points: 16, juiceColor: '#9370DB' },
  corn: { emoji: '🌽', points: 15, juiceColor: '#FFD700' },
  pepper: { emoji: '🫑', points: 12, juiceColor: '#32CD32' },
  onion: { emoji: '🧅', points: 10, juiceColor: '#DDBF94' },
  potato: { emoji: '🥔', points: 9, juiceColor: '#DEB887' },
  cucumber: { emoji: '🥒', points: 11, juiceColor: '#90EE90' },
  mushroom: { emoji: '🍄', points: 17, juiceColor: '#D2B48C' },
  
  // Special items (higher value)
  avocado: { emoji: '🥑', points: 30, juiceColor: '#6B8E23' },
  pumpkin: { emoji: '🎃', points: 35, juiceColor: '#FF7518' }
};

export const backgroundThemes = {
  dojo: {
    primary: '#2C1810',
    secondary: '#8B4513',
    accent: '#D2691E',
    pattern: 'bamboo'
  },
  sunset: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#FF8E53',
    pattern: 'clouds'
  },
  forest: {
    primary: '#2ECC71',
    secondary: '#27AE60',
    accent: '#58D68D',
    pattern: 'leaves'
  },
  ocean: {
    primary: '#3498DB',
    secondary: '#2980B9',
    accent: '#5DADE2',
    pattern: 'waves'
  },
  space: {
    primary: '#2C3E50',
    secondary: '#4A90E2',
    accent: '#7FB3D3',
    pattern: 'stars'
  },
  volcanic: {
    primary: '#8B0000',
    secondary: '#FF4500',
    accent: '#FF6347',
    pattern: 'lava'
  }
};

export const bladeTypes = {
  classic: {
    color: '#FFD700',
    width: 5,
    effect: 'none'
  },
  fire: {
    color: '#FF4500',
    width: 6,
    effect: 'glow'
  },
  ice: {
    color: '#00FFFF',
    width: 4,
    effect: 'freeze'
  },
  lightning: {
    color: '#FFFF00',
    width: 8,
    effect: 'electric'
  },
  rainbow: {
    color: '#FF69B4',
    width: 7,
    effect: 'rainbow'
  }
};
