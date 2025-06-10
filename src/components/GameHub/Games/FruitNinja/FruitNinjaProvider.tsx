import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const GRAVITY = 0.6;

interface FruitNinjaState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';
  score: number;
  highScore: number;
  level: number;
  combo: number;
  lives: number;
  fruits: any[];
  particles: any[];
  mistakeMessages: any[];
  sliceTrail: {
    points: Array<{x: number, y: number, time: number}>;
    width: number;
  };
  customization: {
    difficulty: 'beginner' | 'medium' | 'expert';
    backgroundTheme: string;
    bladeType: string;
    bladeColor: string;
    enableParticles: boolean;
    enableTrails: boolean;
    fruitSpawnRate: number;
    gameSpeed: number;
  };
}

interface FruitNinjaActions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setGameState: React.Dispatch<React.SetStateAction<'menu' | 'playing' | 'paused' | 'gameOver'>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setFruits: React.Dispatch<React.SetStateAction<any[]>>;
  setParticles: React.Dispatch<React.SetStateAction<any[]>>;
  setMistakeMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setSliceTrail: React.Dispatch<React.SetStateAction<{points: Array<{x: number, y: number, time: number}>, width: number}>>;
  setCustomization: React.Dispatch<React.SetStateAction<any>>;
  initializeGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  onStatsUpdate: (stats: any) => void;
  handleInteractionStart: (x: number, y: number) => void;
  handleInteractionMove: (x: number, y: number) => void;
  handleInteractionEnd: () => void;
}

const FruitNinjaContext = createContext<(FruitNinjaState & FruitNinjaActions) | null>(null);

export const FruitNinjaProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [fruits, setFruits] = useState<any[]>([]);
  const [particles, setParticles] = useState<any[]>([]);
  const [mistakeMessages, setMistakeMessages] = useState<any[]>([]);
  const [sliceTrail, setSliceTrail] = useState({
    points: [] as Array<{x: number, y: number, time: number}>,
    width: 5
  });

  const [customization, setCustomization] = useState({
    difficulty: 'medium' as 'beginner' | 'medium' | 'expert',
    backgroundTheme: 'dojo',
    bladeType: 'classic',
    bladeColor: '#FFD700',
    enableParticles: true,
    enableTrails: true,
    fruitSpawnRate: 1.0,
    gameSpeed: 1.0
  });

  const initializeGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setCombo(0);
    setLives(3);
    setFruits([]);
    setParticles([]);
    setMistakeMessages([]);
    setSliceTrail({ points: [], width: 5 });
  }, []);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState('menu');
    setScore(0);
    setLevel(1);
    setCombo(0);
    setLives(3);
    setFruits([]);
    setParticles([]);
    setMistakeMessages([]);
    setSliceTrail({ points: [], width: 5 });
  }, []);

  const handleInteractionStart = useCallback((x: number, y: number) => {
    setSliceTrail(prev => ({
      ...prev,
      points: [{ x, y, time: 30 }]
    }));
  }, []);

  const handleInteractionMove = useCallback((x: number, y: number) => {
    setSliceTrail(prev => ({
      ...prev,
      points: [...prev.points.slice(-10), { x, y, time: 30 }]
    }));
  }, []);

  const handleInteractionEnd = useCallback(() => {
    // Trail will fade naturally
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
    mistakeMessages,
    sliceTrail,
    customization,
    canvasRef,
    setGameState,
    setScore,
    setHighScore,
    setLevel,
    setCombo,
    setLives,
    setFruits,
    setParticles,
    setMistakeMessages,
    setSliceTrail,
    setCustomization,
    initializeGame,
    pauseGame,
    resumeGame,
    resetGame,
    onStatsUpdate,
    handleInteractionStart,
    handleInteractionMove,
    handleInteractionEnd
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
