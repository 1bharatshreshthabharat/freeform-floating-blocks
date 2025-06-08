import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  sliceTime: number;
  isBomb: boolean;
  isSpecial: boolean;
  points: number;
}

interface SliceTrail {
  points: Array<{x: number, y: number, time: number}>;
  color: string;
  width: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'juice' | 'spark' | 'explosion';
}

interface GameCustomization {
  bladeType: string;
  bladeColor: string;
  backgroundTheme: string;
  difficulty: 'beginner' | 'medium' | 'expert';
  gameSpeed: number;
  fruitSpawnRate: number;
  enableParticles: boolean;
  enableTrails: boolean;
  soundVolume: number;
}

interface FruitNinjaState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';
  score: number;
  highScore: number;
  level: number;
  combo: number;
  lives: number;
  fruits: Fruit[];
  particles: Particle[];
  sliceTrail: SliceTrail;
  soundEnabled: boolean;
  showCustomization: boolean;
  showHowToPlay: boolean;
  customization: GameCustomization;
  capturedAnimation: {show: boolean, piece: string, position: {x: number, y: number}};
}

interface FruitNinjaActions {
  setGameState: React.Dispatch<React.SetStateAction<'menu' | 'playing' | 'paused' | 'gameOver'>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setFruits: React.Dispatch<React.SetStateAction<Fruit[]>>;
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
  setSliceTrail: React.Dispatch<React.SetStateAction<SliceTrail>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomization: React.Dispatch<React.SetStateAction<GameCustomization>>;
  setCapturedAnimation: React.Dispatch<React.SetStateAction<{show: boolean, piece: string, position: {x: number, y: number}}>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameLoopRef: React.RefObject<number>;
  isSlicingRef: React.RefObject<boolean>;
  initializeGame: () => void;
  handleInteractionStart: (x: number, y: number) => void;
  handleInteractionMove: (x: number, y: number) => void;
  handleInteractionEnd: () => void;
  onStatsUpdate: (stats: any) => void;
}

const FruitNinjaContext = createContext<(FruitNinjaState & FruitNinjaActions) | null>(null);

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;

export const FruitNinjaProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const isSlicingRef = useRef(false);
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sliceTrail, setSliceTrail] = useState<SliceTrail>({ points: [], color: '#FFD700', width: 5 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [capturedAnimation, setCapturedAnimation] = useState<{show: boolean, piece: string, position: {x: number, y: number}}>({
    show: false, piece: '', position: {x: 0, y: 0}
  });

  const [customization, setCustomization] = useState<GameCustomization>({
    bladeType: 'classic',
    bladeColor: '#FFD700',
    backgroundTheme: 'dojo',
    difficulty: 'medium',
    gameSpeed: 1.0,
    fruitSpawnRate: 1.0,
    enableParticles: true,
    enableTrails: true,
    soundVolume: 0.7
  });

  const initializeGame = useCallback(() => {
    setFruits([]);
    setParticles([]);
    setSliceTrail({ points: [], color: customization.bladeColor, width: 5 });
    setScore(0);
    setLevel(1);
    setCombo(0);
    setLives(3);
    setGameState('playing');
  }, [customization.bladeColor]);

  const handleInteractionStart = useCallback((x: number, y: number) => {
    if (gameState === 'menu') {
      initializeGame();
      return;
    }
    
    if (gameState === 'gameOver') {
      initializeGame();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    isSlicingRef.current = true;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [{ x, y, time: 35 }]
    }));
  }, [gameState, initializeGame]);

  const handleInteractionMove = useCallback((x: number, y: number) => {
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [...prev.points, { x, y, time: 35 }].slice(-15) // Keep more points for smoother trail
    }));
  }, [gameState]);

  const handleInteractionEnd = useCallback(() => {
    isSlicingRef.current = false;
  }, []);

  const value = {
    gameState,
    score,
    highScore,
    level,
    combo,
    lives,
    fruits,
    particles,
    sliceTrail,
    soundEnabled,
    showCustomization,
    showHowToPlay,
    customization,
    capturedAnimation,
    setGameState,
    setScore,
    setHighScore,
    setLevel,
    setCombo,
    setLives,
    setFruits,
    setParticles,
    setSliceTrail,
    setSoundEnabled,
    setShowCustomization,
    setShowHowToPlay,
    setCustomization,
    setCapturedAnimation,
    canvasRef,
    gameLoopRef,
    isSlicingRef,
    initializeGame,
    handleInteractionStart,
    handleInteractionMove,
    handleInteractionEnd,
    onStatsUpdate
  };

  return (
    <FruitNinjaContext.Provider value={value}>
      {children}
    </FruitNinjaContext.Provider>
  );
};

export const useFruitNinja = () => {
  const context = useContext(FruitNinjaContext);
  if (!context) {
    throw new Error('useFruitNinja must be used within FruitNinjaProvider');
  }
  return context;
};

export { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY };
