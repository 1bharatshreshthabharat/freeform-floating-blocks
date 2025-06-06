
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Settings, Zap, Star, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
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

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.5;

  const fruitTypes = {
    apple: { emoji: '🍎', color: '#FF0000', points: 10, juiceColor: '#FF6B6B' },
    orange: { emoji: '🍊', color: '#FFA500', points: 10, juiceColor: '#FFB84D' },
    banana: { emoji: '🍌', color: '#FFFF00', points: 15, juiceColor: '#FFFF80' },
    watermelon: { emoji: '🍉', color: '#00FF00', points: 20, juiceColor: '#90EE90' },
    pineapple: { emoji: '🍍', color: '#FFD700', points: 25, juiceColor: '#FFE55C' },
    strawberry: { emoji: '🍓', color: '#FF1493', points: 15, juiceColor: '#FF69B4' },
    grape: { emoji: '🍇', color: '#8A2BE2', points: 15, juiceColor: '#DA70D6' },
    peach: { emoji: '🍑', color: '#FFB6C1', points: 20, juiceColor: '#FFC0CB' },
    coconut: { emoji: '🥥', color: '#8B4513', points: 30, juiceColor: '#DEB887' },
    kiwi: { emoji: '🥝', color: '#9ACD32', points: 25, juiceColor: '#ADFF2F' },
    mango: { emoji: '🥭', color: '#FFD700', points: 25, juiceColor: '#FFED4E' },
    cherry: { emoji: '🍒', color: '#FF0000', points: 15, juiceColor: '#FF6B6B' },
    lemon: { emoji: '🍋', color: '#FFFF00', points: 15, juiceColor: '#FFFF80' },
    avocado: { emoji: '🥑', color: '#568203', points: 20, juiceColor: '#9ACD32' }
  };

  const bladeColors = [
    { name: 'Golden', value: '#FFD700' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Fire', value: '#FF4500' },
    { name: 'Ice', value: '#00BFFF' },
    { name: 'Lightning', value: '#FFFF00' }
  ];

  const backgroundThemes = {
    dojo: {
      background: 'linear-gradient(135deg, #2C1810 0%, #8B4513 100%)',
      accent: '#FFD700',
      pattern: 'bamboo'
    },
    sunset: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      accent: '#FF4757',
      pattern: 'clouds'
    },
    forest: {
      background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
      accent: '#F39C12',
      pattern: 'leaves'
    },
    ocean: {
      background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
      accent: '#E74C3C',
      pattern: 'waves'
    },
    space: {
      background: 'linear-gradient(135deg, #2C3E50 0%, #4A90E2 100%)',
      accent: '#9B59B6',
      pattern: 'stars'
    }
  };

  const getDifficultyParams = () => {
    const baseParams = {
      beginner: { spawnRate: 0.01, bombChance: 0.05, speed: 0.8, specialChance: 0.1 },
      medium: { spawnRate: 0.015, bombChance: 0.1, speed: 1.0, specialChance: 0.08 },
      expert: { spawnRate: 0.02, bombChance: 0.15, speed: 1.3, specialChance: 0.05 }
    }[customization.difficulty];

    return {
      ...baseParams,
      spawnRate: baseParams.spawnRate * customization.fruitSpawnRate * (1 + level * 0.1),
      speed: baseParams.speed * customization.gameSpeed
    };
  };

  const spawnFruit = useCallback(() => {
    const params = getDifficultyParams();
    
    if (Math.random() < params.spawnRate) {
      const fruitTypeKeys = Object.keys(fruitTypes);
      const fruitType = fruitTypeKeys[Math.floor(Math.random() * fruitTypeKeys.length)];
      const fruitData = fruitTypes[fruitType as keyof typeof fruitTypes];
      
      const isBomb = Math.random() < params.bombChance;
      const isSpecial = !isBomb && Math.random() < params.specialChance;
      
      const newFruit: Fruit = {
        id: Date.now() + Math.random(),
        x: Math.random() * (CANVAS_WIDTH - 100) + 50,
        y: CANVAS_HEIGHT + 50,
        vx: (Math.random() - 0.5) * 4 * params.speed,
        vy: -(Math.random() * 8 + 10) * params.speed,
        type: isBomb ? 'bomb' : fruitType,
        size: isBomb ? 40 : (30 + Math.random() * 20),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        sliced: false,
        sliceTime: 0,
        isBomb,
        isSpecial,
        points: isSpecial ? fruitData.points * 2 : fruitData.points
      };
      
      setFruits(prev => [...prev, newFruit]);
    }
  }, [level, customization]);

  const createParticles = useCallback((x: number, y: number, color: string, type: 'juice' | 'spark' | 'explosion', count: number = 10) => {
    if (!customization.enableParticles) return;
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: type === 'explosion' ? 60 : 30,
        maxLife: type === 'explosion' ? 60 : 30,
        color,
        size: type === 'explosion' ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
        type
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, [customization.enableParticles]);

  const sliceFruit = useCallback((fruitId: number) => {
    setFruits(prev => {
      const fruitIndex = prev.findIndex(f => f.id === fruitId);
      if (fruitIndex === -1) return prev;
      
      const fruit = prev[fruitIndex];
      if (fruit.sliced) return prev;
      
      const newFruits = [...prev];
      newFruits[fruitIndex] = { ...fruit, sliced: true, sliceTime: Date.now() };
      
      if (fruit.isBomb) {
        // Bomb sliced - lose life
        setLives(current => {
          const newLives = current - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          }
          return newLives;
        });
        createParticles(fruit.x, fruit.y, '#FF0000', 'explosion', 20);
        setCombo(0);
      } else {
        // Fruit sliced - gain points
        const points = fruit.points * (combo > 0 ? 1 + combo * 0.1 : 1);
        setScore(prev => prev + Math.floor(points));
        setCombo(prev => prev + 1);
        
        // Level up every 500 points
        if ((score + points) % 500 < points) {
          setLevel(prev => prev + 1);
        }
        
        const fruitData = fruitTypes[fruit.type as keyof typeof fruitTypes];
        createParticles(fruit.x, fruit.y, fruitData?.juiceColor || '#FF6B6B', 'juice', 15);
        createParticles(fruit.x, fruit.y, '#FFFF00', 'spark', 8);
      }
      
      return newFruits;
    });
  }, [combo, score, createParticles]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update fruits
    setFruits(prev => {
      const newFruits = prev
        .map(fruit => ({
          ...fruit,
          x: fruit.x + fruit.vx,
          y: fruit.y + fruit.vy,
          vy: fruit.vy + GRAVITY,
          rotation: fruit.rotation + fruit.rotationSpeed
        }))
        .filter(fruit => {
          // Remove fruits that are off screen (not sliced) or sliced for too long
          if (fruit.sliced && Date.now() - fruit.sliceTime > 500) return false;
          if (!fruit.sliced && fruit.y > CANVAS_HEIGHT + 100) {
            // Missed fruit
            if (!fruit.isBomb) {
              setLives(current => {
                const newLives = current - 1;
                if (newLives <= 0) {
                  setGameState('gameOver');
                }
                return newLives;
              });
              setCombo(0);
            }
            return false;
          }
          return true;
        });
      
      return newFruits;
    });

    // Update particles
    setParticles(prev => {
      return prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3,
          life: particle.life - 1,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98
        }))
        .filter(particle => particle.life > 0);
    });

    // Update slice trail
    setSliceTrail(prev => ({
      ...prev,
      points: prev.points
        .map(point => ({ ...point, time: point.time - 1 }))
        .filter(point => point.time > 0)
    }));

    // Spawn new fruits
    spawnFruit();

    // Reset combo if no slice for a while
    if (combo > 0) {
      // Combo timeout logic here
    }
  }, [gameState, spawnFruit, combo]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState === 'menu') {
      initializeGame();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    isSlicingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [{ x, y, time: 30 }]
    }));
  }, [gameState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [...prev.points, { x, y, time: 30 }].slice(-10)
    }));

    // Check for fruit collisions
    fruits.forEach(fruit => {
      if (!fruit.sliced) {
        const distance = Math.sqrt((fruit.x - x) ** 2 + (fruit.y - y) ** 2);
        if (distance < fruit.size / 2 + 10) {
          sliceFruit(fruit.id);
        }
      }
    });
  }, [gameState, fruits, sliceFruit]);

  const handleMouseUp = useCallback(() => {
    isSlicingRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState === 'menu') {
      initializeGame();
      return;
    }
    if (gameState !== 'playing') return;
    
    isSlicingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [{ x, y, time: 30 }]
    }));
  }, [gameState]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setSliceTrail(prev => ({
      ...prev,
      points: [...prev.points, { x, y, time: 30 }].slice(-10)
    }));

    // Check for fruit collisions
    fruits.forEach(fruit => {
      if (!fruit.sliced) {
        const distance = Math.sqrt((fruit.x - x) ** 2 + (fruit.y - y) ** 2);
        if (distance < fruit.size / 2 + 10) {
          sliceFruit(fruit.id);
        }
      }
    });
  }, [gameState, fruits, sliceFruit]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isSlicingRef.current = false;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear and draw background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background pattern
    ctx.save();
    ctx.globalAlpha = 0.1;
    if (theme.pattern === 'bamboo') {
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(100 + i * 150, 0);
        ctx.lineTo(100 + i * 150, CANVAS_HEIGHT);
        ctx.stroke();
      }
    }
    ctx.restore();

    if (gameState !== 'menu') {
      // Draw particles
      if (customization.enableParticles) {
        particles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.life / particle.maxLife;
          
          if (particle.type === 'explosion') {
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = particle.color;
          }
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Draw fruits
      fruits.forEach(fruit => {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.rotate(fruit.rotation);
        
        if (fruit.sliced) {
          ctx.globalAlpha = Math.max(0, 1 - (Date.now() - fruit.sliceTime) / 500);
          ctx.scale(1.2, 0.8); // Slice effect
        }
        
        if (fruit.isBomb) {
          ctx.font = `${fruit.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('💣', 0, fruit.size / 3);
        } else {
          const fruitData = fruitTypes[fruit.type as keyof typeof fruitTypes];
          if (fruitData) {
            ctx.font = `${fruit.size}px Arial`;
            ctx.textAlign = 'center';
            
            if (fruit.isSpecial) {
              ctx.shadowColor = '#FFD700';
              ctx.shadowBlur = 15;
            }
            
            ctx.fillText(fruitData.emoji, 0, fruit.size / 3);
          }
        }
        
        ctx.restore();
      });

      // Draw slice trail
      if (customization.enableTrails && sliceTrail.points.length > 1) {
        ctx.save();
        ctx.strokeStyle = customization.bladeColor;
        ctx.lineWidth = sliceTrail.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = customization.bladeColor;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        sliceTrail.points.forEach((point, index) => {
          ctx.globalAlpha = point.time / 30;
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw UI
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    if (gameState === 'menu') {
      ctx.save();
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      ctx.strokeText('Fruit Ninja', CANVAS_WIDTH/2, 200);
      ctx.fillText('Fruit Ninja', CANVAS_WIDTH/2, 200);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click or Touch to Start!', CANVAS_WIDTH/2, 250);
      ctx.font = '18px Arial';
      ctx.fillText('Slice fruits to score!', CANVAS_WIDTH/2, 280);
      ctx.restore();
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 250);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH/2, 290);
      ctx.fillText(`Level Reached: ${level}`, CANVAS_WIDTH/2, 320);
      ctx.fillText('Click to Play Again', CANVAS_WIDTH/2, 360);
    }

    // Game UI
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Level: ${level}`, 20, 70);
      ctx.fillText(`Combo: ${combo}x`, 20, 100);
      
      // Lives
      ctx.textAlign = 'right';
      ctx.fillText('Lives:', CANVAS_WIDTH - 100, 40);
      for (let i = 0; i < lives; i++) {
        ctx.fillText('❤️', CANVAS_WIDTH - 60 + i * 25, 40);
      }
      
      ctx.restore();
    }
  }, [gameState, fruits, particles, sliceTrail, score, level, combo, lives, customization]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

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

  useEffect(() => {
    if (gameState === 'gameOver') {
      if (score > highScore) {
        setHighScore(score);
        onStatsUpdate((prev: any) => ({ ...prev, totalScore: Math.max(prev.totalScore, score) }));
      }
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [gameState, score, highScore, onStatsUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-red-800">🍎 Fruit Ninja</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowHowToPlay(true)} variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </Button>
            <Button onClick={() => setShowCustomization(true)} variant="outline" size="sm">
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
          <Card className="flex-1 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-4 border-red-300 rounded-lg cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Status */}
          <div className="lg:w-80 space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-red-600" />
                  <span>Game Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Badge variant="outline" className="p-2 text-center">
                    Score: {score}
                  </Badge>
                  <Badge variant="secondary" className="p-2 text-center">
                    Level: {level}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Badge variant="outline" className="p-2 text-center">
                    Combo: {combo}x
                  </Badge>
                  <Badge variant={lives > 1 ? "secondary" : "destructive"} className="p-2 text-center">
                    Lives: {lives}
                  </Badge>
                </div>

                <div className="text-center">
                  <Badge variant="secondary" className="p-2 w-full">
                    <Trophy className="h-4 w-4 mr-1" />
                    Best: {highScore}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {gameState === 'playing' && (
                    <Button onClick={() => setGameState('paused')} className="w-full" variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {gameState === 'paused' && (
                    <Button onClick={() => setGameState('playing')} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={initializeGame} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Current Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge variant="outline">{customization.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Theme:</span>
                    <Badge variant="secondary">{customization.backgroundTheme}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Blade:</span>
                    <Badge variant="outline">{customization.bladeType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Play Fruit Ninja</h2>
              <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Controls</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click and drag or swipe to slice fruits</li>
                  <li>• Move fast for better slicing action</li>
                  <li>• Create long slices for style points</li>
                  <li>• Touch controls work on mobile devices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Gameplay</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Slice all fruits before they fall</li>
                  <li>• Avoid slicing bombs (💣)</li>
                  <li>• Build combos for higher scores</li>
                  <li>• Don't let 3 fruits fall or hit a bomb</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scoring</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Regular fruits: 10-30 points</li>
                  <li>• Special fruits: Double points + glow</li>
                  <li>• Combo multiplier increases score</li>
                  <li>• Level up every 500 points</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fruits</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• 🍎 Apple, 🍊 Orange, 🍌 Banana</li>
                  <li>• 🍉 Watermelon, 🍍 Pineapple, 🍓 Strawberry</li>
                  <li>• 🍇 Grape, 🍑 Peach, 🥥 Coconut, 🥝 Kiwi</li>
                  <li>• 🥭 Mango, 🍒 Cherry, 🍋 Lemon, 🥑 Avocado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Fruit Ninja</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blade Type</label>
                  <Select value={customization.bladeType} onValueChange={(value) => setCustomization(prev => ({ ...prev, bladeType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="flaming">Flaming</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="ice">Ice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Blade Color</label>
                  <Select value={customization.bladeColor} onValueChange={(value) => setCustomization(prev => ({ ...prev, bladeColor: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bladeColors.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Background Theme</label>
                  <Select value={customization.backgroundTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, backgroundTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dojo">Dojo</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
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
                  <label className="text-sm font-medium mb-2 block">Fruit Spawn Rate: {customization.fruitSpawnRate.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={customization.fruitSpawnRate}
                    onChange={(e) => setCustomization(prev => ({ ...prev, fruitSpawnRate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="particles"
                      checked={customization.enableParticles}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableParticles: e.target.checked }))}
                    />
                    <label htmlFor="particles" className="text-sm font-medium">Enable Particle Effects</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="trails"
                      checked={customization.enableTrails}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableTrails: e.target.checked }))}
                    />
                    <label htmlFor="trails" className="text-sm font-medium">Enable Blade Trails</label>
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
