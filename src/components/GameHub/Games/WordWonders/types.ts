
export type GameMode = 
  | 'complete-verb'
  | 'make-words' 
  | 'fix-word'
  | 'word-riddle'
  | 'guess-word'
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
  isPaused: boolean;
  foundWords: string[];
  currentInput: string;
  possibleWords?: string[];
  hintText?: string;
  soundEnabled: boolean;
}

export interface WordData {
  word: string;
  definition?: string;
  image?: string;
  riddle?: string;
  sentence?: string;
}

export interface WordWondersContextType {
  state: GameState;
  dispatch: React.Dispatch<any>;
  startGame: (mode: GameMode) => void;
  pauseGame: () => void;
  resetGame: () => void;
  speakText: (text: string) => void;
  playSound: (type: 'correct' | 'wrong' | 'hint' | 'complete') => void;
  placeLetterInBox: (letterId: string, boxIndex: number) => void;
  removeLetterFromBox: (boxIndex: number) => void;
}
