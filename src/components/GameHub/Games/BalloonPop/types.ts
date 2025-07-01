
export interface Balloon {
  id: string;
  x: number;
  y: number;
  speed: number;
  content: string;
  type: 'correct' | 'incorrect' | 'bonus';
  color: string;
  size: number;
  popped: boolean;
  popAnimation: boolean;
  trail?: boolean;
  special?: boolean;
  rotation: number;
  bobOffset: number;
}

export interface Question {
  instruction: string;
  correctAnswers: string[];
  category: LearningCategory;
  level: number;
  hint?: string;
  voiceInstruction?: string;
}

export type LearningCategory = 'random' | 'letters' | 'numbers' | 'math' | 'colors' | 'shapes' | 'animals' | 'words' | 'science' | 'geography';

export type GameTheme = 'space' | 'underwater' | 'forest';

export type GameMode = 'learning' | 'timeChallenge' | 'endless' | 'multiplayer' | 'story';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface GameStats {
  score: number;
  level: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  timeElapsed: number;
  balloonsPoppedTotal: number;
  powerUpsUsed: number;
  highScore: number;
  averageAccuracy: number;
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
  gameMode: GameMode;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  multiplayer: boolean;
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'correct' | 'incorrect' | 'encouragement' | 'powerup' | 'achievement';
  achievements: Achievement[];
  showAchievement: boolean;
  currentAchievement: Achievement | null;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  showHints: boolean;
  particles: boolean;
  showSettings: boolean;
  showAchievements: boolean;
  showLeaderboard: boolean;
}
