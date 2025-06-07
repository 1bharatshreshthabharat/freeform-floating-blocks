
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface Bird {
  x: number;
  y: number;
  velocity: number;
  size: number;
  rotation: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'pipe' | 'moving' | 'laser' | 'spike' | 'swinging' | 'paired';
  passed: boolean;
  swingPhase?: number;
  movingDirection?: number;
  pairId?: number;
}

interface GameCustomization {
  birdType: string;
  birdColor: string;
  backgroundTheme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gameSpeed: number;
  obstacleSpacing: number;
  enablePowerUps: boolean;
  soundVolume: number;
}

interface FlappyGameState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';
  bird: Bird;
  obstacles: Obstacle[];
  score: number;
  highScore: number;
  level: number;
  lives: number;
  soundEnabled: boolean;
  showCustomization: boolean;
  showHowToPlay: boolean;
  customization: GameCustomization;
}

interface FlappyGameActions {
  setBird: React.Dispatch<React.SetStateAction<Bird>>;
  setObstacles: React.Dispatch<React.SetStateAction<Obstacle[]>>;
  setGameState: React.Dispatch<React.SetStateAction<'menu' | 'playing' | 'paused' | 'gameOver'>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomization: React.Dispatch<React.SetStateAction<GameCustomization>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameLoopRef: React.RefObject<number>;
  initializeGame: () => void;
  handleJump: () => void;
  onStatsUpdate: (stats: any) => void;
}

const FlappyGameContext = createContext<(FlappyGameState & FlappyGameActions) | null>(null);

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;

export const FlappyGameProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [bird, setBird] = useState<Bird>({
    x: 100,
    y: CANVAS_HEIGHT / 2,
    velocity: 0,
    size: 30,
    rotation: 0
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    birdType: 'classic',
    birdColor: '#FFD700',
    backgroundTheme: 'day',
    difficulty: 'medium',
    gameSpeed: 1.0,
    obstacleSpacing: 200,
    enablePowerUps: true,
    soundVolume: 0.7
  });

  const initializeGame = useCallback(() => {
    setBird({
      x: 100,
      y: CANVAS_HEIGHT / 2,
      velocity: 0,
      size: 30,
      rotation: 0
    });
    setObstacles([]);
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === 'menu') {
      initializeGame();
      return;
    }
    
    if (gameState === 'gameOver') {
      initializeGame();
      return;
    }
    
    if (gameState === 'playing') {
      setBird(prev => ({
        ...prev,
        velocity: JUMP_FORCE,
        rotation: -0.3
      }));
    }
  }, [gameState, initializeGame]);

  const value = {
    gameState,
    bird,
    obstacles,
    score,
    highScore,
    level,
    lives,
    soundEnabled,
    showCustomization,
    showHowToPlay,
    customization,
    setBird,
    setObstacles,
    setGameState,
    setScore,
    setHighScore,
    setLevel,
    setLives,
    setSoundEnabled,
    setShowCustomization,
    setShowHowToPlay,
    setCustomization,
    canvasRef,
    gameLoopRef,
    initializeGame,
    handleJump,
    onStatsUpdate
  };

  return (
    <FlappyGameContext.Provider value={value}>
      {children}
    </FlappyGameContext.Provider>
  );
};

export const useFlappyGame = () => {
  const context = useContext(FlappyGameContext);
  if (!context) {
    throw new Error('useFlappyGame must be used within FlappyGameProvider');
  }
  return context;
};

export { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY, JUMP_FORCE };
export type { Obstacle };
