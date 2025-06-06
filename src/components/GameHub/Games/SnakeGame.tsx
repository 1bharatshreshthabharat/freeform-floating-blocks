
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Settings, Zap, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SnakeGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Food {
  position: Position;
  type: 'normal' | 'bonus' | 'special';
  points: number;
  color: string;
}

interface PowerUp {
  position: Position;
  type: 'slow' | 'shield' | 'double' | 'magnet';
  duration: number;
  collected: boolean;
}

interface GameCustomization {
  snakeType: string;
  snakeColor: string;
  backgroundTheme: string;
  gameSpeed: number;
  difficulty: 'beginner' | 'medium' | 'expert';
  gridSize: number;
  enablePowerUps: boolean;
  enableParticles: boolean;
  snakePattern: string;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [food, setFood] = useState<Food[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    snakeType: 'classic',
    snakeColor: '#4CAF50',
    backgroundTheme: 'grass',
    gameSpeed: 1.0,
    difficulty: 'medium',
    gridSize: 20,
    enablePowerUps: true,
    enableParticles: true,
    snakePattern: 'solid'
  });

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;

  const getDifficultyParams = () => {
    const baseSpeed = {
      beginner: 150,
      medium: 100,
      expert: 60
    }[customization.difficulty];
    
    return {
      speed: baseSpeed / customization.gameSpeed,
      gridSize: customization.gridSize,
      foodCount: customization.difficulty === 'expert' ? 3 : customization.difficulty === 'medium' ? 2 : 1
    };
  };

  const backgroundThemes = {
    grass: {
      background: '#228B22',
      pattern: '#32CD32',
      border: '#006400'
    },
    desert: {
      background: '#DEB887',
      pattern: '#F4A460',
      border: '#8B4513'
    },
    ocean: {
      background: '#006994',
      pattern: '#4682B4',
      border: '#191970'
    },
    space: {
      background: '#000000',
      pattern: '#191970',
      border: '#4B0082'
    },
    neon: {
      background: '#000000',
      pattern: '#FF00FF',
      border: '#00FFFF'
    }
  };

  const snakeTypes = {
    classic: { head: '⬢', body: '⬡' },
    dragon: { head: '🐲', body: '🟫' },
    robot: { head: '🤖', body: '⬜' },
    fire: { head: '🔥', body: '🟠' },
    ice: { head: '❄️', body: '🔷' }
  };

  const snakeColors = ['#4CAF50', '#FF5722', '#2196F3', '#9C27B0', '#FF9800', '#607D8B', '#E91E63'];

  const initializeGame = useCallback(() => {
    const startPos = { x: Math.floor(CANVAS_WIDTH / customization.gridSize / 2), y: Math.floor(CANVAS_HEIGHT / customization.gridSize / 2) };
    setSnake([startPos]);
    setDirection({ x: 0, y: 0 });
    setFood([]);
    setPowerUps([]);
    setActivePowerUps([]);
    setScore(0);
    setLevel(1);
    setGameState('playing');
    generateFood();
  }, [customization.gridSize]);

  const generateFood = useCallback(() => {
    const params = getDifficultyParams();
    const newFood: Food[] = [];
    
    for (let i = 0; i < params.foodCount; i++) {
      let position: Position;
      do {
        position = {
          x: Math.floor(Math.random() * (CANVAS_WIDTH / params.gridSize)),
          y: Math.floor(Math.random() * (CANVAS_HEIGHT / params.gridSize))
        };
      } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
      
      const foodType = Math.random() < 0.1 ? 'special' : Math.random() < 0.3 ? 'bonus' : 'normal';
      const foodColors = { normal: '#FF0000', bonus: '#FFD700', special: '#FF69B4' };
      
      newFood.push({
        position,
        type: foodType,
        points: foodType === 'special' ? 50 : foodType === 'bonus' ? 20 : 10,
        color: foodColors[foodType]
      });
    }
    
    setFood(newFood);
  }, [snake, customization.gridSize]);

  const generatePowerUp = useCallback(() => {
    if (!customization.enablePowerUps || Math.random() > 0.1) return;
    
    const params = getDifficultyParams();
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / params.gridSize)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / params.gridSize))
      };
    } while (
      snake.some(segment => segment.x === position.x && segment.y === position.y) ||
      food.some(f => f.position.x === position.x && f.position.y === position.y)
    );
    
    const types: PowerUp['type'][] = ['slow', 'shield', 'double', 'magnet'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setPowerUps(prev => [...prev, {
      position,
      type,
      duration: 5000, // 5 seconds
      collected: false
    }]);
  }, [snake, food, customization.enablePowerUps, customization.gridSize]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      // Move head
      head.x += direction.x;
      head.y += direction.y;
      
      const params = getDifficultyParams();
      
      // Check wall collision (unless shield is active)
      if (!activePowerUps.includes('shield')) {
        if (head.x < 0 || head.x >= CANVAS_WIDTH / params.gridSize || 
            head.y < 0 || head.y >= CANVAS_HEIGHT / params.gridSize) {
          setGameState('gameOver');
          return prevSnake;
        }
      } else {
        // Wrap around when shielded
        if (head.x < 0) head.x = Math.floor(CANVAS_WIDTH / params.gridSize) - 1;
        if (head.x >= CANVAS_WIDTH / params.gridSize) head.x = 0;
        if (head.y < 0) head.y = Math.floor(CANVAS_HEIGHT / params.gridSize) - 1;
        if (head.y >= CANVAS_HEIGHT / params.gridSize) head.y = 0;
      }
      
      // Check self collision (unless shield is active)
      if (!activePowerUps.includes('shield')) {
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameState('gameOver');
          return prevSnake;
        }
      }
      
      newSnake.unshift(head);
      
      // Check food collision
      let ateFood = false;
      setFood(prevFood => {
        const newFood = prevFood.filter(f => {
          if (f.position.x === head.x && f.position.y === head.y) {
            const points = activePowerUps.includes('double') ? f.points * 2 : f.points;
            setScore(prev => prev + points);
            ateFood = true;
            
            // Level up every 200 points
            if ((score + points) % 200 === 0) {
              setLevel(prev => prev + 1);
            }
            
            return false;
          }
          return true;
        });
        
        if (newFood.length !== prevFood.length) {
          setTimeout(generateFood, 100);
        }
        
        return newFood;
      });
      
      // Check power-up collision
      setPowerUps(prevPowerUps => {
        return prevPowerUps.filter(powerUp => {
          if (powerUp.position.x === head.x && powerUp.position.y === head.y && !powerUp.collected) {
            setActivePowerUps(prev => [...prev, powerUp.type]);
            
            // Remove power-up after duration
            setTimeout(() => {
              setActivePowerUps(prev => prev.filter(p => p !== powerUp.type));
            }, powerUp.duration);
            
            return false;
          }
          return true;
        });
      });
      
      // Remove tail if no food eaten
      if (!ateFood) {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [gameState, direction, food, score, activePowerUps, generateFood, customization.gridSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const params = getDifficultyParams();
    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear canvas
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid pattern
    if (customization.backgroundTheme !== 'space') {
      ctx.fillStyle = theme.pattern;
      for (let x = 0; x < CANVAS_WIDTH; x += params.gridSize * 2) {
        for (let y = 0; y < CANVAS_HEIGHT; y += params.gridSize * 2) {
          ctx.fillRect(x, y, params.gridSize, params.gridSize);
        }
      }
    } else {
      // Draw stars for space theme
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    if (gameState !== 'menu') {
      // Draw food
      food.forEach(f => {
        ctx.fillStyle = f.color;
        ctx.fillRect(
          f.position.x * params.gridSize,
          f.position.y * params.gridSize,
          params.gridSize - 2,
          params.gridSize - 2
        );
        
        // Add glow effect for special food
        if (f.type === 'special') {
          ctx.shadowColor = f.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(
            f.position.x * params.gridSize,
            f.position.y * params.gridSize,
            params.gridSize - 2,
            params.gridSize - 2
          );
          ctx.shadowBlur = 0;
        }
      });

      // Draw power-ups
      if (customization.enablePowerUps) {
        powerUps.forEach(powerUp => {
          const icons = {
            slow: '🐌',
            shield: '🛡️',
            double: '2️⃣',
            magnet: '🧲'
          };
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(
            powerUp.position.x * params.gridSize,
            powerUp.position.y * params.gridSize,
            params.gridSize,
            params.gridSize
          );
          
          ctx.font = `${params.gridSize * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(
            icons[powerUp.type],
            powerUp.position.x * params.gridSize + params.gridSize / 2,
            powerUp.position.y * params.gridSize + params.gridSize * 0.8
          );
        });
      }

      // Draw snake
      snake.forEach((segment, index) => {
        if (customization.snakePattern === 'gradient') {
          const gradient = ctx.createLinearGradient(
            segment.x * params.gridSize,
            segment.y * params.gridSize,
            (segment.x + 1) * params.gridSize,
            (segment.y + 1) * params.gridSize
          );
          gradient.addColorStop(0, customization.snakeColor);
          gradient.addColorStop(1, index === 0 ? '#FFD700' : '#90EE90');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = index === 0 ? '#FFD700' : customization.snakeColor;
        }
        
        // Shield effect
        if (activePowerUps.includes('shield')) {
          ctx.strokeStyle = '#00BFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            segment.x * params.gridSize - 2,
            segment.y * params.gridSize - 2,
            params.gridSize + 4,
            params.gridSize + 4
          );
        }
        
        if (customization.snakeType === 'classic') {
          ctx.fillRect(
            segment.x * params.gridSize,
            segment.y * params.gridSize,
            params.gridSize - 2,
            params.gridSize - 2
          );
        } else {
          const snakeEmoji = snakeTypes[customization.snakeType as keyof typeof snakeTypes];
          ctx.font = `${params.gridSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(
            index === 0 ? snakeEmoji.head : snakeEmoji.body,
            segment.x * params.gridSize + params.gridSize / 2,
            segment.y * params.gridSize + params.gridSize * 0.8
          );
        }
      });
    }

    // Draw UI text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    if (gameState === 'menu') {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Snake Game', CANVAS_WIDTH / 2, 150);
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Use Arrow Keys to Start', CANVAS_WIDTH / 2, 200);
      ctx.font = '18px Arial';
      ctx.fillText('Customize your snake in settings!', CANVAS_WIDTH / 2, 240);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, 150);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, 190);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH / 2, 220);
      ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2, 250);
      ctx.fillText('Press Space to Play Again', CANVAS_WIDTH / 2, 290);
    }

    // Draw active game UI
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Level: ${level}`, 10, 55);
      ctx.fillText(`Length: ${snake.length}`, 10, 80);
      
      // Active power-ups display
      if (activePowerUps.length > 0) {
        ctx.font = '14px Arial';
        ctx.fillText('Power-ups:', 10, 105);
        activePowerUps.forEach((powerUp, index) => {
          const names = { slow: 'Slow Mo', shield: 'Shield', double: 'Double', magnet: 'Magnet' };
          ctx.fillText(`• ${names[powerUp as keyof typeof names]}`, 10, 125 + index * 18);
        });
      }
    }
  }, [gameState, snake, food, powerUps, score, level, highScore, activePowerUps, customization]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    
    const params = getDifficultyParams();
    const speed = activePowerUps.includes('slow') ? params.speed * 2 : params.speed;
    
    gameLoopRef.current = window.setTimeout(gameLoop, speed);
  }, [updateGame, draw, activePowerUps]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = window.setTimeout(gameLoop, getDifficultyParams().speed);
    } else {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
      draw();
    }

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, draw]);

  useEffect(() => {
    if (gameState === 'gameOver') {
      if (score > highScore) {
        setHighScore(score);
        onStatsUpdate((prev: any) => ({ ...prev, totalScore: Math.max(prev.totalScore, score) }));
      }
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [gameState, score, highScore, onStatsUpdate]);

  useEffect(() => {
    if (gameState === 'playing') {
      generatePowerUp();
    }
  }, [score, generatePowerUp]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'menu' || gameState === 'gameOver') {
        if (e.code === 'Space' || e.code.startsWith('Arrow')) {
          initializeGame();
        }
        return;
      }

      if (gameState === 'playing') {
        switch (e.code) {
          case 'ArrowUp':
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case 'ArrowLeft':
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
          case 'KeyP':
            setGameState('paused');
            break;
        }
      } else if (gameState === 'paused' && e.code === 'KeyP') {
        setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, direction, initializeGame]);

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-green-800">🐍 Advanced Snake</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowCustomization(!showCustomization)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="sm">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Canvas */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-4 border-green-300 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg p-2 w-full">
                      Score: {score}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg p-2 w-full">
                      <Star className="h-4 w-4 mr-1" />
                      Level: {level}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg p-2 w-full">
                      Length: {snake.length}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg p-2 w-full">
                      <Trophy className="h-4 w-4 mr-1" />
                      Best: {highScore}
                    </Badge>
                  </div>
                </div>

                {activePowerUps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Active Power-ups:</h4>
                    <div className="space-y-1">
                      {activePowerUps.map((powerUp, index) => {
                        const names = {
                          slow: 'Slow Motion',
                          shield: 'Shield',
                          double: 'Double Points',
                          magnet: 'Food Magnet'
                        };
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {names[powerUp as keyof typeof names]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {gameState === 'playing' && (
                    <Button onClick={togglePause} className="w-full" variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Game
                    </Button>
                  )}
                  {gameState === 'paused' && (
                    <Button onClick={togglePause} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Resume Game
                    </Button>
                  )}
                  <Button onClick={initializeGame} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• ↑↓←→ Arrow keys to move</li>
                  <li>• P to pause/resume</li>
                  <li>• Space to start new game</li>
                  <li>• Collect food to grow</li>
                  <li>• Avoid walls and yourself</li>
                  <li>• Special food gives bonus points</li>
                  <li>• Power-ups provide abilities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Snake Game</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Snake Type</label>
                  <Select value={customization.snakeType} onValueChange={(value) => setCustomization(prev => ({ ...prev, snakeType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="dragon">Dragon 🐲</SelectItem>
                      <SelectItem value="robot">Robot 🤖</SelectItem>
                      <SelectItem value="fire">Fire 🔥</SelectItem>
                      <SelectItem value="ice">Ice ❄️</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Snake Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {snakeColors.map(color => (
                      <button
                        key={color}
                        className={`w-full h-8 rounded border-2 ${customization.snakeColor === color ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomization(prev => ({ ...prev, snakeColor: color }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Background Theme</label>
                  <Select value={customization.backgroundTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, backgroundTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grass">Grass</SelectItem>
                      <SelectItem value="desert">Desert</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Snake Pattern</label>
                  <Select value={customization.snakePattern} onValueChange={(value) => setCustomization(prev => ({ ...prev, snakePattern: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={customization.difficulty} onValueChange={(value) => setCustomization(prev => ({ ...prev, difficulty: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Game Speed: {customization.gameSpeed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={customization.gameSpeed}
                    onChange={(e) => setCustomization(prev => ({ ...prev, gameSpeed: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Grid Size: {customization.gridSize}px</label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    value={customization.gridSize}
                    onChange={(e) => setCustomization(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="powerups"
                      checked={customization.enablePowerUps}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enablePowerUps: e.target.checked }))}
                    />
                    <label htmlFor="powerups" className="text-sm font-medium">Enable Power-ups</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="particles"
                      checked={customization.enableParticles}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableParticles: e.target.checked }))}
                    />
                    <label htmlFor="particles" className="text-sm font-medium">Enable Particles</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
