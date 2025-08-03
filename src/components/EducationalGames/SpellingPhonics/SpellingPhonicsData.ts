// SpellingGameData.ts

export interface Word {
  word: string;
  phonics: string[];
  category: string;
  difficulty: number;
  definition: string;
  example: string;
  image?: string;
  rhymes?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// 📚 Word list
export const wordDatabase: Word[] = [
  { word: 'cat', phonics: ['c', 'a', 't'], category: 'Animals', difficulty: 1, definition: 'A small furry pet animal', example: 'The cat is sleeping.' },
  { word: 'dog', phonics: ['d', 'o', 'g'], category: 'Animals', difficulty: 1, definition: 'A loyal pet animal', example: 'The dog barks loudly.' },
  { word: 'sun', phonics: ['s', 'u', 'n'], category: 'Nature', difficulty: 1, definition: 'The bright star in our sky', example: 'The sun is shining today.' },
  { word: 'red', phonics: ['r', 'e', 'd'], category: 'Colors', difficulty: 1, definition: 'A warm color like fire', example: 'The apple is red.' },
  { word: 'big', phonics: ['b', 'i', 'g'], category: 'Adjectives', difficulty: 1, definition: 'Large in size', example: 'The elephant is big.' },

  { word: 'house', phonics: ['h', 'ou', 's', 'e'], category: 'Objects', difficulty: 2, definition: 'A building where people live', example: 'We live in a house.' },
  { word: 'chair', phonics: ['ch', 'ai', 'r'], category: 'Furniture', difficulty: 2, definition: 'Something to sit on', example: 'Please sit on the chair.' },
  { word: 'phone', phonics: ['ph', 'o', 'n', 'e'], category: 'Technology', difficulty: 2, definition: 'Device for talking to people', example: 'Answer the phone please.' },
  { word: 'snake', phonics: ['s', 'n', 'a', 'k', 'e'], category: 'Animals', difficulty: 2, definition: 'A long reptile without legs', example: 'The snake slithers on the ground.' },
  { word: 'smile', phonics: ['s', 'm', 'i', 'l', 'e'], category: 'Actions', difficulty: 2, definition: 'Happy expression on face', example: 'She has a beautiful smile.' },

  { word: 'elephant', phonics: ['e', 'l', 'e', 'ph', 'a', 'n', 't'], category: 'Animals', difficulty: 3, definition: 'Large gray mammal with trunk', example: 'The elephant has big ears.' },
  { word: 'beautiful', phonics: ['b', 'eau', 't', 'i', 'f', 'u', 'l'], category: 'Adjectives', difficulty: 3, definition: 'Very pretty or attractive', example: 'The flower is beautiful.' },
  { word: 'butterfly', phonics: ['b', 'u', 'tt', 'er', 'f', 'l', 'y'], category: 'Insects', difficulty: 3, definition: 'Colorful flying insect', example: 'The butterfly landed on the flower.' },
  { word: 'playground', phonics: ['p', 'l', 'ay', 'g', 'r', 'ou', 'n', 'd'], category: 'Places', difficulty: 3, definition: 'Place where children play', example: 'We go to the playground.' },
  { word: 'adventure', phonics: ['a', 'd', 'v', 'e', 'n', 't', 'u', 'r', 'e'], category: 'Activities', difficulty: 3, definition: 'Exciting journey or experience', example: 'We had a great adventure.' },
    { word: 'rain', phonics: ['r', 'ai', 'n'], category: 'Weather', difficulty: 1, definition: 'Water falling from clouds', example: 'Rain is falling from the sky.' },
  { word: 'car', phonics: ['c', 'a', 'r'], category: 'Transport', difficulty: 1, definition: 'A vehicle for driving', example: 'The car is fast.' },
  { word: 'hat', phonics: ['h', 'a', 't'], category: 'Clothing', difficulty: 1, definition: 'Something worn on the head', example: 'He wears a hat.' },
  { word: 'cup', phonics: ['c', 'u', 'p'], category: 'Objects', difficulty: 1, definition: 'Used to drink from', example: 'She drank tea from a cup.' },
  { word: 'map', phonics: ['m', 'a', 'p'], category: 'Objects', difficulty: 1, definition: 'Shows places or directions', example: 'Use a map to find the way.' },

  { word: 'train', phonics: ['t', 'r', 'ai', 'n'], category: 'Transport', difficulty: 2, definition: 'A vehicle that runs on tracks', example: 'The train is coming.' },
  { word: 'plant', phonics: ['p', 'l', 'a', 'n', 't'], category: 'Nature', difficulty: 2, definition: 'A living thing that grows', example: 'The plant needs water.' },
  { word: 'music', phonics: ['m', 'u', 's', 'i', 'c'], category: 'Art', difficulty: 2, definition: 'Pleasing sounds', example: 'I love listening to music.' },
  { word: 'shoes', phonics: ['sh', 'oe', 's'], category: 'Clothing', difficulty: 2, definition: 'Worn on the feet', example: 'She bought new shoes.' },
  { word: 'glass', phonics: ['g', 'l', 'a', 'ss'], category: 'Objects', difficulty: 2, definition: 'Transparent material or cup', example: 'The glass is full.' },

  { word: 'mountain', phonics: ['m', 'ou', 'n', 't', 'ai', 'n'], category: 'Nature', difficulty: 3, definition: 'A very tall hill', example: 'We climbed the mountain.' },
  { word: 'computer', phonics: ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r'], category: 'Technology', difficulty: 3, definition: 'A machine for work and play', example: 'The computer is fast.' },
  { word: 'rainbow', phonics: ['r', 'ai', 'n', 'b', 'ow'], category: 'Nature', difficulty: 3, definition: 'Colored arc in the sky', example: 'We saw a rainbow after the rain.' },
  { word: 'pencil', phonics: ['p', 'e', 'n', 'c', 'i', 'l'], category: 'Objects', difficulty: 3, definition: 'Used to write or draw', example: 'Write with a pencil.' },
  { word: 'balloon', phonics: ['b', 'a', 'll', 'oo', 'n'], category: 'Objects', difficulty: 3, definition: 'Air-filled rubber toy', example: 'He popped the balloon.' },

  { word: 'jungle', phonics: ['j', 'u', 'n', 'g', 'l', 'e'], category: 'Places', difficulty: 3, definition: 'A thick forest', example: 'The jungle is full of animals.' },
  { word: 'giraffe', phonics: ['g', 'i', 'r', 'a', 'ff', 'e'], category: 'Animals', difficulty: 3, definition: 'Tall animal with long neck', example: 'The giraffe eats from trees.' },
  { word: 'ocean', phonics: ['o', 'c', 'e', 'a', 'n'], category: 'Nature', difficulty: 3, definition: 'Large body of saltwater', example: 'The ocean is deep and wide.' },
  { word: 'rocket', phonics: ['r', 'o', 'ck', 'e', 't'], category: 'Space', difficulty: 3, definition: 'A vehicle that flies into space', example: 'The rocket launched successfully.' },
  { word: 'bicycle', phonics: ['b', 'i', 'c', 'y', 'c', 'l', 'e'], category: 'Transport', difficulty: 3, definition: 'A two-wheeled vehicle', example: 'She rode her bicycle to school.' },

    { word: 'book', phonics: ['b', 'oo', 'k'], category: 'Objects', difficulty: 1, definition: 'Pages bound together with writing', example: 'She reads a book every night.' },
  { word: 'fish', phonics: ['f', 'i', 'sh'], category: 'Animals', difficulty: 1, definition: 'An animal that swims in water', example: 'The fish swims in the tank.' },
  { word: 'milk', phonics: ['m', 'i', 'l', 'k'], category: 'Food', difficulty: 1, definition: 'White drink from cows', example: 'He drank a glass of milk.' },
  { word: 'tree', phonics: ['t', 'r', 'ee'], category: 'Nature', difficulty: 1, definition: 'Tall plant with leaves and branches', example: 'The tree gives shade.' },
  { word: 'ball', phonics: ['b', 'a', 'll'], category: 'Toys', difficulty: 1, definition: 'Round object used in games', example: 'Kick the ball.' },

  { word: 'bread', phonics: ['b', 'r', 'ea', 'd'], category: 'Food', difficulty: 2, definition: 'Baked food made from flour', example: 'I ate toast with bread.' },
  { word: 'cloud', phonics: ['c', 'l', 'ou', 'd'], category: 'Weather', difficulty: 2, definition: 'White thing floating in the sky', example: 'That cloud looks like a dog!' },
  { word: 'water', phonics: ['w', 'a', 't', 'e', 'r'], category: 'Nature', difficulty: 2, definition: 'Liquid needed for life', example: 'Drink water every day.' },
  { word: 'tiger', phonics: ['t', 'i', 'g', 'e', 'r'], category: 'Animals', difficulty: 2, definition: 'A big wild cat with stripes', example: 'The tiger is sleeping.' },
  { word: 'dress', phonics: ['d', 'r', 'e', 'ss'], category: 'Clothing', difficulty: 2, definition: 'A one-piece outfit', example: 'She wore a red dress.' },

  { word: 'umbrella', phonics: ['u', 'm', 'b', 'r', 'e', 'll', 'a'], category: 'Objects', difficulty: 3, definition: 'Used to protect from rain', example: 'Carry your umbrella when it rains.' },
  { word: 'penguin', phonics: ['p', 'e', 'n', 'g', 'u', 'i', 'n'], category: 'Animals', difficulty: 3, definition: 'A black and white bird that can’t fly', example: 'The penguin waddles on ice.' },
  { word: 'castle', phonics: ['c', 'a', 's', 't', 'l', 'e'], category: 'Places', difficulty: 3, definition: 'A large building where kings lived', example: 'The princess lived in a castle.' },
  { word: 'pirate', phonics: ['p', 'i', 'r', 'a', 't', 'e'], category: 'People', difficulty: 3, definition: 'A sea robber', example: 'The pirate found treasure.' },
  { word: 'garden', phonics: ['g', 'a', 'r', 'd', 'e', 'n'], category: 'Places', difficulty: 3, definition: 'Place with flowers and plants', example: 'We planted seeds in the garden.' },

  { word: 'rocketship', phonics: ['r', 'o', 'ck', 'e', 't', 'sh', 'i', 'p'], category: 'Space', difficulty: 3, definition: 'A ship that travels in space', example: 'The rocketship launched into space.' },
  { word: 'kangaroo', phonics: ['k', 'a', 'ng', 'a', 'r', 'oo'], category: 'Animals', difficulty: 3, definition: 'An animal that hops and has a pouch', example: 'The kangaroo jumps high.' },
  { word: 'monster', phonics: ['m', 'o', 'n', 's', 't', 'e', 'r'], category: 'Fantasy', difficulty: 3, definition: 'A scary imaginary creature', example: 'The monster lives under the bed.' },
  { word: 'lighthouse', phonics: ['l', 'igh', 't', 'h', 'ou', 's', 'e'], category: 'Places', difficulty: 3, definition: 'Tower with light to guide ships', example: 'The lighthouse shines at night.' },
  { word: 'volcano', phonics: ['v', 'o', 'l', 'c', 'a', 'n', 'o'], category: 'Nature', difficulty: 3, definition: 'A mountain that erupts', example: 'The volcano exploded with lava.' },


];

// 🏆 Achievements
export const initialAchievements: Achievement[] = [
  { id: 'first_word', name: 'First Word', description: 'Spell your first word correctly', icon: '🌟', unlocked: false },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Get 100% on any level', icon: '🏆', unlocked: false },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a word in under 5 seconds', icon: '⚡', unlocked: false },
  { id: 'phonics_master', name: 'Phonics Master', description: 'Master all phonics sounds', icon: '🎓', unlocked: false },
  { id: 'streak_master', name: 'Streak Master', description: 'Get 10 words correct in a row', icon: '🔥', unlocked: false }
];
