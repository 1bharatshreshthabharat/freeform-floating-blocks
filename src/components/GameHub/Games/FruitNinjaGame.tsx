
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';

interface FruitNinjaGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  emoji: string;
  sliced: boolean;
  points: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Bomb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  exploded: boolean;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, trail: [] as { x: number; y: number }[] });
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.3;
  const FRUIT_TYPES = [
    { type: 'apple', emoji: '🍎', points: 10 },
    { type: 'banana', emoji: '🍌', points: 15 },
    { type: 'orange', emoji: '🍊', points: 10 },
    { type: 'watermelon', emoji: '🍉', points: 25 },
    { type: 'pineapple', emoji: '🍍', points: 20 },
    { type: 'strawberry', emoji: '🍓', points: 15 },
    { type: 'grapes', emoji: '🍇', points: 12 },
    { type: 'peach', emoji: '🍑', points: 18 }
  ];

  const initializeGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setTimeLeft(60);
    setFruits([]);
    setBombs([]);
    setParticles([]);
    setGameState('playing');
  }, []);

  const createFruit = useCallback((): Fruit => {
    const fruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
    const startX = Math.random() * CANVAS_WIDTH;
    const startY = CANVAS_HEIGHT + 50;
    
    return {
      id: Date.now() + Math.random(),
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 4,
      vy: -12 - Math.random() * 8,
      type: fruitType.type,
      emoji: fruitType.emoji,
      sliced: false,
      points: fruitType.points
    };
  }, []);

  const createBomb = useCallback((): Bomb => {
    const startX = Math.random() * CANVAS_WIDTH;
    const startY = CANVAS_HEIGHT + 50;
    
    return {
      id: Date.now() + Math.random(),
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 4,
      vy: -10 - Math.random() * 6,
      exploded: false
    };
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 30,
        color
      });
    }
    return newParticles;
  }, []);

  const checkSlice = useCallback((fruit: Fruit, mouseX: number, mouseY: number): boolean => {
    const distance = Math.sqrt((fruit.x - mouseX) ** 2 + (fruit.y - mouseY) ** 2);
    return distance < 40;
  }, []);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update fruits
    setFruits(prev => {
      let newFruits = prev.map(fruit => ({
        ...fruit,
        x: fruit.x + fruit.vx,
        y: fruit.y + fruit.vy,
        vy: fruit.vy + GRAVITY
      }));

      // Remove fruits that have fallen off screen
      const fallenFruits = newFruits.filter(fruit => fruit.y > CANVAS_HEIGHT + 100 && !fruit.sliced);
      if (fallenFruits.length > 0) {
        setLives(prev => Math.max(0, prev - fallenFruits.length));
      }

      newFruits = newFruits.filter(fruit => fruit.y <= CANVAS_HEIGHT + 100);
      return newFruits;
    });

    // Update bombs
    setBombs(prev => {
      let newBombs = prev.map(bomb => ({
        ...bomb,
        x: bomb.x + bomb.vx,
        y: bomb.y + bomb.vy,
        vy: bomb.vy + GRAVITY
      }));

      newBombs = newBombs.filter(bomb => bomb.y <= CANVAS_HEIGHT + 100);
      return newBombs;
    });

    // Update particles
    setParticles(prev => {
      return prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1
      })).filter(particle => particle.life > 0);
    });

    // Spawn new fruits and bombs
    if (Math.random() < 0.02) {
      setFruits(prev => [...prev, createFruit()]);
    }
    
    if (Math.random() < 0.005) {
      setBombs(prev => [...prev, createBomb()]);
    }
  }, [gameState, createFruit, createBomb]);

  const handleSlice = useCallback((mouseX: number, mouseY: number) => {
    if (gameState !== 'playing') return;

    // Check fruit slicing
    setFruits(prev => {
      let slicedCount = 0;
      const newFruits = prev.map(fruit => {
        if (!fruit.sliced && checkSlice(fruit, mouseX, mouseY)) {
          slicedCount++;
          setScore(prevScore => prevScore + fruit.points + (combo * 5));
          setParticles(prevParticles => [...prevParticles, ...createParticles(fruit.x, fruit.y, '#ff6b6b')]);
          return { ...fruit, sliced: true };
        }
        return fruit;
      });

      if (slicedCount > 0) {
        setCombo(prev => prev + slicedCount);
      } else {
        setCombo(0);
      }

      return newFruits;
    });

    // Check bomb slicing
    setBombs(prev => {
      const newBombs = prev.map(bomb => {
        if (!bomb.exploded && checkSlice({ x: bomb.x, y: bomb.y } as Fruit, mouseX, mouseY)) {
          setGameState('gameOver');
          setParticles(prevParticles => [...prevParticles, ...createParticles(bomb.x, bomb.y, '#ff0000')]);
          return { ...bomb, exploded: true };
        }
        return bomb;
      });
      return newBombs;
    });
  }, [gameState, checkSlice, combo, createParticles]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState !== 'menu') {
      // Draw fruits
      fruits.forEach(fruit => {
        if (!fruit.sliced) {
          ctx.font = '48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(fruit.emoji, fruit.x, fruit.y);
        }
      });

      // Draw bombs
      bombs.forEach(bomb => {
        if (!bomb.exploded) {
          ctx.font = '48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('💣', bomb.x, bomb.y);
        }
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw mouse trail
      const trail = mouseRef.current.trail;
      if (trail.length > 1) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.globalAlpha = i / trail.length;
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';

    if (gameState === 'menu') {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🥷 Fruit Ninja', CANVAS_WIDTH/2, 200);
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Slice fruits, avoid bombs!', CANVAS_WIDTH/2, 280);
      ctx.fillText('Click to Start', CANVAS_WIDTH/2, 320);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 250);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH/2, 300);
      ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH/2, 330);
      ctx.fillText('Click to Play Again', CANVAS_WIDTH/2, 380);
    }

    // Draw game UI during play
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Lives: ${'❤️'.repeat(lives)}`, 20, 70);
      ctx.fillText(`Time: ${timeLeft}s`, 20, 100);
      if (combo > 1) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText(`Combo x${combo}`, 20, 130);
      }
    }
  }, [gameState, fruits, bombs, particles, score, lives, timeLeft, combo, highScore]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      draw();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, draw]);

  // Game over handling
  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('gameOver');
    }
  }, [lives, gameState]);

  useEffect(() => {
    if (gameState === 'gameOver') {
      if (score > highScore) {
        setHighScore(score);
        onStatsUpdate(prev => ({ ...prev, totalScore: Math.max(prev.totalScore, score) }));
      }
      onStatsUpdate(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [gameState, score, highScore, onStatsUpdate]);

  // Mouse handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      
      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;
      
      // Update trail
      mouseRef.current.trail.push({ x: mouseX, y: mouseY });
      if (mouseRef.current.trail.length > 10) {
        mouseRef.current.trail.shift();
      }
      
      handleSlice(mouseX, mouseY);
    };

    const handleClick = () => {
      if (gameState === 'menu' || gameState === 'gameOver') {
        initializeGame();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [handleSlice, gameState, initializeGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-white">🥷 Fruit Ninja</h1>
          <div className="flex space-x-2">
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
                  className="border-4 border-yellow-400 rounded-lg cursor-crosshair bg-gradient-to-b from-blue-800 to-blue-900"
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
                      <Trophy className="h-4 w-4 mr-1" />
                      Best: {highScore}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <Badge variant="destructive" className="p-2 w-full">
                      Lives: {lives}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="p-2 w-full">
                      Time: {timeLeft}s
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="p-2 w-full">
                      <Zap className="h-4 w-4 mr-1" />
                      x{combo}
                    </Badge>
                  </div>
                </div>

                <Button onClick={initializeGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Slice fruits by moving your mouse over them</li>
                  <li>• Avoid slicing bombs (💣) - instant game over!</li>
                  <li>• Don't let fruits fall off screen - you lose lives</li>
                  <li>• Slice multiple fruits quickly for combo points</li>
                  <li>• Survive for 60 seconds to win!</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scoring System</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• 🍎 Apple: 10 points</li>
                  <li>• 🍌 Banana: 15 points</li>
                  <li>• 🍉 Watermelon: 25 points</li>
                  <li>• 🍍 Pineapple: 20 points</li>
                  <li>• Combo bonus: +5 points per combo level</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
