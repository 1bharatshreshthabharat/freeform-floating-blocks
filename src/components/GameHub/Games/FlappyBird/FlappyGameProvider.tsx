
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface Bird {
  y: number;
  velocity: number;
  flapState: number;
  isFlapping: boolean;
}

interface Obstacle {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
  type: 'pipe' | 'laser' | 'spike' | 'moving';
  width: number;
  color: string;
  velocity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface GameCustomization {
  birdType: string;
  backgroundTheme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  obstacleSpacing: number;
  birdSize: number;
  gravity: number;
  enableParticles: boolean;
  enableWeather: boolean;
  weatherType: string;
}

interface FlappyGameState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';
  bird: Bird;
  obstacles: Obstacle[];
  particles: Particle[];
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
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setGameState: React.Dispatch<React.SetStateAction<'menu' | 'playing' | 'paused' | 'gameOver'>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomization: React.Dispatch<React.SetStateAction<GameCustomization>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameLoopRef: React.RefObject<number>;
  initializeGame: () => void;
  flap: () => void;
  onStatsUpdate: (stats: any) => void;
}

const FlappyGameContext = createContext<(FlappyGameState & FlappyGameActions) | null>(null);

export const FlappyGameProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [bird, setBird] = useState<Bird>({ y: 300, velocity: 0, flapState: 0, isFlapping: false });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    birdType: 'classic',
    backgroundTheme: 'day',
    difficulty: 'medium',
    obstacleSpacing: 200,
    birdSize: 20,
    gravity: 0.5,
    enableParticles: true,
    enableWeather: false,
    weatherType: 'none'
  });

  const initializeGame = useCallback(() => {
    setBird({ y: 300, velocity: 0, flapState: 0, isFlapping: false });
    setObstacles([]);
    setParticles([]);
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
  }, []);

  const flap = useCallback(() => {
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
        velocity: -8, 
        isFlapping: true, 
        flapState: 0 
      }));
    }
  }, [gameState, initializeGame]);

  const value = {
    gameState,
    bird,
    obstacles,
    particles,
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
    setParticles,
    setScore,
    setHighScore,
    setLevel,
    setLives,
    setGameState,
    setSoundEnabled,
    setShowCustomization,
    setShowHowToPlay,
    setCustomization,
    canvasRef,
    gameLoopRef,
    initializeGame,
    flap,
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
