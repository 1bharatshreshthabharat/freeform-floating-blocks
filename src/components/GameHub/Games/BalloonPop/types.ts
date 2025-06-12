
export interface Balloon {
  id: string;
  x: number;
  y: number;
  speed: number;
  content: string;
  type: 'correct' | 'incorrect';
  color: string;
  size: number;
  popped: boolean;
  popAnimation: boolean;
}

export interface Question {
  instruction: string;
  correctAnswers: string[];
  category: LearningCategory;
  level: number;
}

export type LearningCategory = 'letters' | 'numbers' | 'math' | 'colors' | 'shapes' | 'animals';

export type GameTheme = 'jungle' | 'space' | 'underwater' | 'rainbow';

export interface GameStats {
  score: number;
  level: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  timeElapsed: number;
}

export interface BalloonPopGameState {
  balloons: Balloon[];
  currentQuestion: Question | null;
  gameStats: GameStats;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  showInstructions: boolean;
  category: LearningCategory;
  theme: GameTheme;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  multiplayer: boolean;
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'correct' | 'incorrect' | 'encouragement';
}
