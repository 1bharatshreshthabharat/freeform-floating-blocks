
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Food {
  position: Position;
  type: string;
  color: string;
  points: number;
  powerUp?: string;
}

interface SnakeGameState {
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';
  direction: 'up' | 'right' | 'down' | 'left';
  nextDirection: 'up' | 'right' | 'down' | 'left';
  snake: Position[];
  food: Food;
  score: number;
  highScore: number;
  level: number;
  speed: number;
  gridSize: number;
  boardTheme: string;
  snakeType: string;
  snakeColor: string;
  lastMovementTime: number;
  powerUp: string | null;
  powerUpTime: number;
  showCustomization: boolean;
  showHowToPlay: boolean;
  soundEnabled: boolean;
  isFirstGame: boolean;
}

interface SnakeGameActions {
  setGameState: React.Dispatch<React.SetStateAction<'menu' | 'playing' | 'paused' | 'gameOver'>>;
  setDirection: React.Dispatch<React.SetStateAction<'up' | 'right' | 'down' | 'left'>>;
  setNextDirection: React.Dispatch<React.SetStateAction<'up' | 'right' | 'down' | 'left'>>;
  setSnake: React.Dispatch<React.SetStateAction<Position[]>>;
  setFood: React.Dispatch<React.SetStateAction<Food>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setGridSize: React.Dispatch<React.SetStateAction<number>>;
  setBoardTheme: React.Dispatch<React.SetStateAction<string>>;
  setSnakeType: React.Dispatch<React.SetStateAction<string>>;
  setSnakeColor: React.Dispatch<React.SetStateAction<string>>;
  setLastMovementTime: React.Dispatch<React.SetStateAction<number>>;
  setPowerUp: React.Dispatch<React.SetStateAction<string | null>>;
  setPowerUpTime: React.Dispatch<React.SetStateAction<number>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFirstGame: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameLoopRef: React.RefObject<number>;
  initializeGame: () => void;
  startGame: () => void;
  onStatsUpdate: (stats: any) => void;
  isCollision: (position: Position) => boolean;
  generateFood: () => Food;
}

const SnakeGameContext = createContext<(SnakeGameState & SnakeGameActions) | null>(null);

export const SnakeGameProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [direction, setDirection] = useState<'up' | 'right' | 'down' | 'left'>('right');
  const [nextDirection, setNextDirection] = useState<'up' | 'right' | 'down' | 'left'>('right');
  const [snake, setSnake] = useState<Position[]>([
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 }
  ]);
  const [food, setFood] = useState<Food>({
    position: { x: 15, y: 10 },
    type: 'apple',
    color: '#FF0000',
    points: 10
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(150);
  const [gridSize, setGridSize] = useState(20);
  const [boardTheme, setBoardTheme] = useState('classic');
  const [snakeType, setSnakeType] = useState('classic');
  const [snakeColor, setSnakeColor] = useState('#4CAF50');
  const [lastMovementTime, setLastMovementTime] = useState(0);
  const [powerUp, setPowerUp] = useState<string | null>(null);
  const [powerUpTime, setPowerUpTime] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFirstGame, setIsFirstGame] = useState(true);

  const isCollision = useCallback((position: Position): boolean => {
    // Check if position is out of bounds
    if (position.x < 0 || position.x >= gridSize || position.y < 0 || position.y >= gridSize) {
      return true;
    }
    
    // Check if position overlaps with the snake's body
    return snake.some((segment, index) => {
      // Skip checking the tail during movement as it will be removed
      if (index === snake.length - 1) return false;
      return segment.x === position.x && segment.y === position.y;
    });
  }, [gridSize, snake]);

  const generateFood = useCallback((): Food => {
    const foodTypes = [
      { type: 'apple', color: '#FF0000', points: 10 },
      { type: 'banana', color: '#FFD700', points: 15 },
      { type: 'cherry', color: '#FF1493', points: 20 },
      { type: 'special', color: '#7B68EE', points: 30, powerUp: 'speed' },
      { type: 'special', color: '#7FFF00', points: 25, powerUp: 'slowMotion' },
      { type: 'special', color: '#FF8C00', points: 50, powerUp: 'doublePoints' }
    ];

    // Higher chance of special food with increasing levels
    const specialChance = 0.1 + (level * 0.02);
    const isSpecial = Math.random() < specialChance;
    
    // Filter food types based on special status
    const availableFoods = foodTypes.filter(f => {
      if (isSpecial) return f.powerUp;
      return !f.powerUp;
    });
    
    const selectedFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
    
    // Generate position not occupied by snake
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    
    return {
      position,
      ...selectedFood
    };
  }, [gridSize, snake, level]);

  const initializeGame = useCallback(() => {
    setSnake([
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ]);
    setDirection('right');
    setNextDirection('right');
    setFood(generateFood());
    setScore(0);
    setLevel(1);
    setSpeed(150);
    setPowerUp(null);
    setPowerUpTime(0);
    setLastMovementTime(Date.now());
    setIsFirstGame(false);
  }, [generateFood]);

  const startGame = useCallback(() => {
    if (gameState === 'menu' || gameState === 'gameOver') {
      initializeGame();
    }
    setGameState('playing');
  }, [gameState, initializeGame]);

  const value = {
    gameState,
    direction,
    nextDirection,
    snake,
    food,
    score,
    highScore,
    level,
    speed,
    gridSize,
    boardTheme,
    snakeType,
    snakeColor,
    lastMovementTime,
    powerUp,
    powerUpTime,
    showCustomization,
    showHowToPlay,
    soundEnabled,
    isFirstGame,
    setGameState,
    setDirection,
    setNextDirection,
    setSnake,
    setFood,
    setScore,
    setHighScore,
    setLevel,
    setSpeed,
    setGridSize,
    setBoardTheme,
    setSnakeType,
    setSnakeColor,
    setLastMovementTime,
    setPowerUp,
    setPowerUpTime,
    setShowCustomization,
    setShowHowToPlay,
    setSoundEnabled,
    setIsFirstGame,
    canvasRef,
    gameLoopRef,
    initializeGame,
    startGame,
    onStatsUpdate,
    isCollision,
    generateFood
  };

  return (
    <SnakeGameContext.Provider value={value}>
      {children}
    </SnakeGameContext.Provider>
  );
};

export const useSnakeGame = () => {
  const context = useContext(SnakeGameContext);
  if (!context) {
    throw new Error('useSnakeGame must be used within SnakeGameProvider');
  }
  return context;
};
