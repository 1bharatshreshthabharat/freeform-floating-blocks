
export type GameMode = 
  | 'complete-verb'
  | 'make-words' 
  | 'fix-word'
  | 'word-riddle'
  | 'magic-trays'
  | 'sentence-picker'
  | 'hidden-word'
  | 'random';

export type GameTheme = 'forest' | 'sky' | 'candyland' | 'underwater';

export interface FloatingLetter {
  id: string;
  letter: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCorrect: boolean;
  isDragging: boolean;
  isPlaced: boolean;
}

export interface GameState {
  mode: GameMode;
  theme: GameTheme;
  score: number;
  stars: number;
  level: number;
  currentWord: string;
  targetWord: string;
  riddle?: string;
  sentence?: string;
  options?: string[];
  letters: FloatingLetter[];
  placedLetters: string[];
  isComplete: boolean;
  showHint: boolean;
  lives: number;
  timeLeft: number;
  isGameActive: boolean;
  foundWords: string[];
  currentInput: string;
}

export interface WordData {
  word: string;
  definition?: string;
  image?: string;
  riddle?: string;
  sentence?: string;
}
