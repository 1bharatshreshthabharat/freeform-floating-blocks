
export const wordDatabase = {
  animals: [
    { word: 'DOG', riddle: "I'm a loyal pet that barks and wags my tail!", image: '🐕' },
    { word: 'CAT', riddle: "I purr and like to chase mice!", image: '🐱' },
    { word: 'BIRD', riddle: "I can fly and sing beautiful songs!", image: '🐦' },
    { word: 'FISH', riddle: "I swim in water and have fins!", image: '🐟' },
    { word: 'FROG', riddle: "I hop and say ribbit!", image: '🐸' }
  ],
  fruits: [
    { word: 'APPLE', riddle: "I'm red or green and keep doctors away!", image: '🍎' },
    { word: 'BANANA', riddle: "I'm yellow and monkeys love me!", image: '🍌' },
    { word: 'ORANGE', riddle: "I'm round, orange, and full of vitamin C!", image: '🍊' },
    { word: 'GRAPE', riddle: "I grow in bunches and can be purple or green!", image: '🍇' }
  ],
  verbs: [
    { word: 'RUN', sentence: "The boy likes to ___ in the park." },
    { word: 'JUMP', sentence: "The rabbit can ___ very high." },
    { word: 'WALK', sentence: "I ___ to school every day." },
    { word: 'SWIM', sentence: "Fish ___ in the water." },
    { word: 'FLY', sentence: "Birds ___ in the sky." }
  ],
  colors: [
    { word: 'RED', riddle: "I'm the color of strawberries and fire trucks!", image: '🔴' },
    { word: 'BLUE', riddle: "I'm the color of the sky and ocean!", image: '🔵' },
    { word: 'GREEN', riddle: "I'm the color of grass and leaves!", image: '🟢' },
    { word: 'YELLOW', riddle: "I'm the color of the sun and bananas!", image: '🟡' }
  ]
};

export const getRandomWord = (category?: keyof typeof wordDatabase) => {
  const categories = Object.keys(wordDatabase) as (keyof typeof wordDatabase)[];
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
  const words = wordDatabase[selectedCategory];
  return words[Math.floor(Math.random() * words.length)];
};

export const generateLetters = (word: string, extraCount: number = 6): string[] => {
  const wordLetters = word.split('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const extraLetters = [];
  
  for (let i = 0; i < extraCount; i++) {
    extraLetters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  
  return [...wordLetters, ...extraLetters].sort(() => Math.random() - 0.5);
};

export const getWordsByLetters = (letters: string[]): string[] => {
  const allWords = [
    'CAT', 'DOG', 'RUN', 'SUN', 'FUN', 'BIG', 'RED', 'BAT', 'HAT', 'RAT',
    'STAR', 'CART', 'ARTS', 'RATS', 'TARS', 'FAST', 'LAST', 'EAST', 'NEAT',
    'TEAM', 'MEAT', 'SEAT', 'HEAT', 'BEAT', 'TEAR', 'EARS', 'REAL', 'LEAN'
  ];
  
  return allWords.filter(word => {
    const wordLetters = word.split('');
    const availableLetters = [...letters];
    
    return wordLetters.every(letter => {
      const index = availableLetters.indexOf(letter);
      if (index !== -1) {
        availableLetters.splice(index, 1);
        return true;
      }
      return false;
    });
  });
};
