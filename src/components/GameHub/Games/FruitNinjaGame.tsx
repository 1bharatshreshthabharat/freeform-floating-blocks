
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Settings, Zap, Star, Sword } from 'lucide-react';
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
  points: number;
  isBomb?: boolean;
  isBonus?: boolean;
  sliceTime?: number;
}

interface SliceEffect {
  x: number;
  y: number;
  angle: number;
  life: number;
  fruitType: string;
}

interface GameCustomization {
  bladeColor: string;
  bladeTrail: boolean;
  backgroundTheme: string;
  fruitSize: number;
  gameSpeed: number;
  difficulty: string;
  enableBombs: boolean;
  enableCombo: boolean;
  trailLength: number;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, trail: [] as { x: number; y: number; time: number }[] });
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [sliceEffects, setSliceEffects] = useState<SliceEffect[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [isSlicing, setIsSlicing] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    bladeColor: '#FFD700',
    bladeTrail: true,
    backgroundTheme: 'dojo',
    fruitSize: 1.0,
    gameSpeed: 1.0,
    difficulty: 'normal',
    enableBombs: true,
    enableCombo: true,
    trailLength: 10
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const MAX_TRAIL_LENGTH = 20;
  
  // Dynamic game parameters based on level and customization
  const getLevelParams = () => {
    const baseSpawnRate = 1000;
    const difficultyMultiplier = {
      easy: 1.5,
      normal: 1.0,
      hard: 0.7,
      expert: 0.5
    }[customization.difficulty] || 1.0;
    
    return {
      spawnRate: baseSpawnRate * difficultyMultiplier / (1 + (level - 1) * 0.1) / customization.gameSpeed,
      fruitSpeed: 8 * customization.gameSpeed * (1 + (level - 1) * 0.05),
      bombRate: customization.enableBombs ? Math.min(0.05 + (level - 1) * 0.01, 0.25) : 0,
      bonusRate: 0.08 + (level - 1) * 0.01,
      fruitSize: 50 * customization.fruitSize
    };
  };

  const backgroundThemes = {
    dojo: {
      background: 'linear-gradient(to bottom, #3a0000, #8b0000)',
      floor: '#422018'
    },
    forest: {
      background: 'linear-gradient(to bottom, #143601, #1a4301)',
      floor: '#2a3d00'
    },
    beach: {
      background: 'linear-gradient(to bottom, #87ceeb, #00bfff)',
      floor: '#f0e68c'
    },
    night: {
      background: 'linear-gradient(to bottom, #000000, #191970)',
      floor: '#000033'
    }
  };

  const fruitTypes = [
    { type: 'apple', color: '#FF0000', points: 1 },
    { type: 'banana', color: '#FFE135', points: 1 },
    { type: 'orange', color: '#FFA500', points: 1 },
    { type: 'watermelon', color: '#006400', points: 2 },
    { type: 'kiwi', color: '#8EE53F', points: 2 },
    { type: 'strawberry', color: '#FF3131', points: 3 },
    { type: 'pineapple', color: '#FEDC56', points: 3 }
  ];

  const bladeColors = ['#FFD700', '#FF0000', '#4169E1', '#7CFC00', '#FF1493', '#00CED1', '#9370DB'];

  const createFruit = (id: number): Fruit => {
    const params = getLevelParams();
    const fruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    
    const isBomb = Math.random() < params.bombRate;
    const isBonus = !isBomb && Math.random() < params.bonusRate;
    
    const speedMultiplier = isBonus ? 0.8 : 1.0;
    
    return {
      id,
      x: Math.random() * (CANVAS_WIDTH - 100) + 50,
      y: CANVAS_HEIGHT + 50,
      vx: (Math.random() - 0.5) * 5,
      vy: -params.fruitSpeed * speedMultiplier,
      type: isBomb ? 'bomb' : fruitType.type,
      size: params.fruitSize * (isBonus ? 1.5 : 1.0),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      sliced: false,
      points: isBomb ? 0 : isBonus ? fruitType.points * 2 : fruitType.points,
      isBomb,
      isBonus
    };
  };

  const initializeGame = useCallback(() => {
    setFruits([]);
    setSliceEffects([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    mouseRef.current.trail = [];
  }, []);

  const spawnFruits = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const params = getLevelParams();
    const fruitCount = Math.max(1, Math.floor(Math.random() * (level / 2 + 1)));
    
    const newFruits = Array.from({ length: fruitCount }, (_, i) => 
      createFruit(Date.now() + i)
    );
    
    setFruits(prev => [...prev, ...newFruits]);
    
    // Schedule next spawn
    setTimeout(spawnFruits, params.spawnRate + Math.random() * 500);
  }, [gameState, level, customization]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    // Calculate canvas-relative mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.trail = [{ x, y, time: Date.now() }];
    setIsSlicing(true);
  }, [gameState]);

  const handleMouseUp = useCallback(() => {
    setIsSlicing(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isSlicing) return;
    
    // Calculate canvas-relative mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    
    // Add to trail with timestamp
    const trailPoint = { x, y, time: Date.now() };
    mouseRef.current.trail.push(trailPoint);
    
    // Limit trail length
    if (mouseRef.current.trail.length > customization.trailLength) {
      mouseRef.current.trail.shift();
    }
    
    // Check for sliced fruits
    setFruits(prevFruits => {
      const newFruits = [...prevFruits];
      let slicedCount = 0;
      let lostLife = false;
      
      newFruits.forEach(fruit => {
        if (!fruit.sliced && !fruit.isBomb) {
          const distToMouse = Math.sqrt(
            Math.pow(fruit.x - mouseRef.current.x, 2) + 
            Math.pow(fruit.y - mouseRef.current.y, 2)
          );
          
          if (distToMouse < fruit.size) {
            fruit.sliced = true;
            fruit.sliceTime = Date.now();
            slicedCount++;
            
            // Create slice effect
            setSliceEffects(prev => [
              ...prev, 
              {
                x: fruit.x,
                y: fruit.y,
                angle: Math.atan2(mouseRef.current.y - fruit.y, mouseRef.current.x - fruit.x),
                life: 30,
                fruitType: fruit.type
              }
            ]);
            
            // Update score
            setScore(prevScore => prevScore + fruit.points);
            
            // Update combo
            if (customization.enableCombo) {
              setCombo(prev => {
                const newCombo = prev + 1;
                setMaxCombo(currentMax => Math.max(currentMax, newCombo));
                return newCombo;
              });
              
              // Reset combo after a second of not slicing
              setTimeout(() => {
                setCombo(0);
              }, 1000);
            }
            
            // Level up every 25 points
            if ((score + fruit.points) % 25 === 0) {
              setLevel(prev => prev + 1);
            }
          }
        } else if (!fruit.sliced && fruit.isBomb) {
          // Check bomb collision
          const distToMouse = Math.sqrt(
            Math.pow(fruit.x - mouseRef.current.x, 2) + 
            Math.pow(fruit.y - mouseRef.current.y, 2)
          );
          
          if (distToMouse < fruit.size && !lostLife) {
            fruit.sliced = true;
            lostLife = true;
            
            // Create bomb explosion effect
            setSliceEffects(prev => [
              ...prev, 
              {
                x: fruit.x,
                y: fruit.y,
                angle: Math.random() * Math.PI * 2,
                life: 40,
                fruitType: 'bomb'
              }
            ]);
            
            // Lose a life
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              }
              return newLives;
            });
          }
        }
      });
      
      return newFruits;
    });
  }, [isSlicing, score, customization.enableCombo, customization.trailLength]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update fruits
    setFruits(prev => {
      return prev
        .map(fruit => {
          // Apply gravity and motion
          const updatedFruit = {
            ...fruit,
            x: fruit.x + fruit.vx,
            y: fruit.y + fruit.vy,
            vy: fruit.vy + 0.2,
            rotation: fruit.rotation + fruit.rotationSpeed
          };
          
          // Add special behavior for sliced fruits
          if (fruit.sliced) {
            // Split sliced fruits
            updatedFruit.vx += fruit.isBomb ? 0 : (fruit.id % 2 === 0 ? 0.5 : -0.5);
          }
          
          return updatedFruit;
        })
        .filter(fruit => {
          // Remove fruits that have fallen below the screen
          if (fruit.y > CANVAS_HEIGHT + 50 && !fruit.sliced) {
            // Missing a fruit loses a life (except bombs)
            if (!fruit.isBomb && !fruit.sliced) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  setGameState('gameOver');
                }
                return newLives;
              });
            }
            return false;
          }
          
          // Remove sliced fruits after they've fallen
          if (fruit.sliced && fruit.y > CANVAS_HEIGHT + 150) {
            return false;
          }
          
          return true;
        });
    });

    // Update slice effects
    setSliceEffects(prev => 
      prev
        .map(effect => ({
          ...effect,
          life: effect.life - 1
        }))
        .filter(effect => effect.life > 0)
    );
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get theme
    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes] || backgroundThemes.dojo;

    // Clear canvas with themed background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    const gradientColor = theme.background.substring(
      theme.background.indexOf('(') + 1, 
      theme.background.lastIndexOf(')')
    );
    const colors = gradientColor.split(',').slice(-2);
    
    bgGradient.addColorStop(0, colors[0].trim());
    bgGradient.addColorStop(1, colors[1].trim());
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw floor
    ctx.fillStyle = theme.floor;
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

    if (gameState === 'playing' || gameState === 'paused') {
      // Draw blade trail if active
      if (isSlicing && customization.bladeTrail && mouseRef.current.trail.length > 1) {
        ctx.strokeStyle = customization.bladeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        // Draw trail with fading opacity based on time
        const now = Date.now();
        mouseRef.current.trail.forEach((point, index) => {
          const opacity = 1 - (now - point.time) / 200; // Fade over 200ms
          
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
          
          // Add blade sparkle effect
          if (index % 3 === 0) {
            ctx.shadowColor = customization.bladeColor;
            ctx.shadowBlur = 15;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        
        ctx.stroke();
      }

      // Draw slice effects
      sliceEffects.forEach(effect => {
        const opacity = effect.life / 30;
        
        if (effect.fruitType === 'bomb') {
          // Explosion effect
          const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, 40 * (1 - effect.life / 40)
          );
          gradient.addColorStop(0, `rgba(255, 200, 0, ${opacity})`);
          gradient.addColorStop(0.7, `rgba(255, 0, 0, ${opacity * 0.7})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 50 * (1 - effect.life / 40), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Juice splash effect
          const fruitColor = fruitTypes.find(f => f.type === effect.fruitType)?.color || '#FF0000';
          
          ctx.fillStyle = fruitColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          
          for (let i = 0; i < 8; i++) {
            const angle = effect.angle + (Math.PI * 2 / 8) * i + Math.random() * 0.3;
            const distance = (30 - effect.life) * 1.5;
            const x = effect.x + Math.cos(angle) * distance;
            const y = effect.y + Math.sin(angle) * distance;
            const size = Math.random() * 4 + 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw fruits
      fruits.forEach(fruit => {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.rotate(fruit.rotation);
        
        // Special rendering for bombs
        if (fruit.isBomb) {
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(0, 0, fruit.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
          
          // Bomb fuse
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -fruit.size * 0.8);
          ctx.quadraticCurveTo(
            fruit.size * 0.5, -fruit.size * 1.3,
            fruit.size * 0.7, -fruit.size * 0.7
          );
          ctx.stroke();
          
          if (!fruit.sliced) {
            // Bomb shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(fruit.size * 0.3, -fruit.size * 0.3, fruit.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Bomb with "X" eyes when sliced
            ctx.fillStyle = '#FF0000';
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            
            // X eyes
            // Left eye
            ctx.beginPath();
            ctx.moveTo(-fruit.size * 0.3, -fruit.size * 0.1);
            ctx.lineTo(-fruit.size * 0.1, -fruit.size * 0.3);
            ctx.moveTo(-fruit.size * 0.3, -fruit.size * 0.3);
            ctx.lineTo(-fruit.size * 0.1, -fruit.size * 0.1);
            ctx.stroke();
            
            // Right eye
            ctx.beginPath();
            ctx.moveTo(fruit.size * 0.1, -fruit.size * 0.1);
            ctx.lineTo(fruit.size * 0.3, -fruit.size * 0.3);
            ctx.moveTo(fruit.size * 0.1, -fruit.size * 0.3);
            ctx.lineTo(fruit.size * 0.3, -fruit.size * 0.1);
            ctx.stroke();
          }
        } else {
          // Find fruit color
          const fruitInfo = fruitTypes.find(f => f.type === fruit.type);
          const fruitColor = fruitInfo?.color || '#FF0000';
          
          if (!fruit.sliced) {
            // Draw whole fruit
            ctx.fillStyle = fruitColor;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(fruit.size * 0.3, -fruit.size * 0.3, fruit.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw stem for some fruits
            if (['apple', 'watermelon', 'strawberry'].includes(fruit.type)) {
              ctx.fillStyle = '#654321';
              ctx.beginPath();
              ctx.ellipse(0, -fruit.size * 0.9, fruit.size * 0.15, fruit.size * 0.3, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Bonus indicator
            if (fruit.isBonus) {
              ctx.strokeStyle = '#FFD700';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, fruit.size * 1.2, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else {
            // Draw sliced fruit (two halves)
            const sliceAngle = Math.atan2(
              mouseRef.current.y - fruit.y, 
              mouseRef.current.x - fruit.x
            );
            
            // Left/top half
            ctx.fillStyle = fruitColor;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.size, sliceAngle - Math.PI/2, sliceAngle + Math.PI/2);
            ctx.lineTo(0, 0);
            ctx.fill();
            
            // Right/bottom half (slightly offset)
            ctx.translate(Math.cos(sliceAngle) * 5, Math.sin(sliceAngle) * 5);
            ctx.fillStyle = fruitColor;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.size, sliceAngle + Math.PI/2, sliceAngle + 3*Math.PI/2);
            ctx.lineTo(0, 0);
            ctx.fill();
            
            // Inside of fruit (white/red/etc depending on fruit)
            const insideColor = fruit.type === 'watermelon' ? '#FF3131' : 
                               (fruit.type === 'banana' ? '#FFF9E3' : '#FFFA');
            
            // Left half inside
            ctx.translate(-Math.cos(sliceAngle) * 5, -Math.sin(sliceAngle) * 5);
            ctx.fillStyle = insideColor;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.size * 0.85, sliceAngle - Math.PI/2, sliceAngle + Math.PI/2);
            ctx.lineTo(0, 0);
            ctx.fill();
            
            // Right half inside
            ctx.translate(Math.cos(sliceAngle) * 5, Math.sin(sliceAngle) * 5);
            ctx.fillStyle = insideColor;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.size * 0.85, sliceAngle + Math.PI/2, sliceAngle + 3*Math.PI/2);
            ctx.lineTo(0, 0);
            ctx.fill();
          }
        }
        
        ctx.restore();
      });

      // Draw UI text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Level: ${level}`, 20, 75);
      
      // Draw lives
      ctx.textAlign = 'right';
      ctx.fillText(`Lives: ${'❤️'.repeat(lives)}`, CANVAS_WIDTH - 20, 40);
      
      // Draw combo if enabled
      if (customization.enableCombo && combo > 1) {
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`${combo}x COMBO!`, CANVAS_WIDTH / 2, 100);
      }
    } else if (gameState === 'menu') {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Fruit Ninja', CANVAS_WIDTH / 2, 200);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Slice to Start', CANVAS_WIDTH / 2, 260);
      
      ctx.font = '18px Arial';
      ctx.fillText('Customize your game in settings!', CANVAS_WIDTH / 2, 310);
      
      // Draw animated fruit on title screen
      const time = Date.now() / 1000;
      
      for (let i = 0; i < 5; i++) {
        const x = CANVAS_WIDTH / 2 + Math.cos(time + i) * 150;
        const y = 100 + Math.sin(time * 0.8 + i * 0.5) * 50;
        const fruitType = fruitTypes[i % fruitTypes.length];
        
        ctx.fillStyle = fruitType.color;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, 200);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, 250);
      ctx.fillText(`Max Combo: ${maxCombo}x`, CANVAS_WIDTH / 2, 280);
      ctx.fillText(`Level Reached: ${level}`, CANVAS_WIDTH / 2, 310);
      ctx.fillText(`High Score: ${Math.max(score, highScore)}`, CANVAS_WIDTH / 2, 340);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Slice to Play Again', CANVAS_WIDTH / 2, 400);
    }
  }, [gameState, fruits, sliceEffects, score, highScore, level, combo, maxCombo, lives, customization, isSlicing]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

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
        onStatsUpdate(prev => ({ ...prev, totalScore: Math.max(prev.totalScore, score) }));
      }
      onStatsUpdate(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [gameState, score, highScore, onStatsUpdate]);

  useEffect(() => {
    if (gameState === 'playing') {
      spawnFruits();
    }
  }, [gameState, spawnFruits]);

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

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
                  className="border-4 border-red-300 rounded-lg cursor-pointer"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
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
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Lives:</span>
                  <div>
                    {'❤️'.repeat(lives)}
                    {'🖤'.repeat(3 - lives)}
                  </div>
                </div>
                
                {customization.enableCombo && (
                  <div className="flex justify-between items-center">
                    <span>Current Combo:</span>
                    <Badge variant={combo > 1 ? 'default' : 'outline'} className="text-sm">
                      {combo}x
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span>Best Combo:</span>
                  <Badge variant="secondary" className="text-sm">
                    {maxCombo}x
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>High Score:</span>
                  <Badge variant="secondary" className="text-sm">
                    <Trophy className="h-3 w-3 mr-1" />
                    {Math.max(score, highScore)}
                  </Badge>
                </div>

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
                <CardTitle>Level Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">Current Level: <Badge>{level}</Badge></div>
                  <div className="text-sm">Next Level: {25 - (score % 25)} points</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(score % 25) * 4}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Higher levels increase:</p>
                  <ul className="list-disc list-inside">
                    <li>Fruit spawn rate</li>
                    <li>Fruit speed</li>
                    <li>Bomb frequency</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Slice fruits by dragging your mouse</li>
                  <li>• Avoid missing fruits (lose a life)</li>
                  <li>• Never hit bombs!</li>
                  <li>• Special golden fruits give bonus points</li>
                  <li>• Combo slices for multiplier points!</li>
                  <li>• Level up every 25 points</li>
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
              <h2 className="text-xl font-bold">Customize Fruit Ninja</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blade Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {bladeColors.map(color => (
                      <button
                        key={color}
                        className={`w-full h-8 rounded border-2 ${customization.bladeColor === color ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomization(prev => ({ ...prev, bladeColor: color }))}
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
                      <SelectItem value="dojo">Dojo</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Trail Length: {customization.trailLength}</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={customization.trailLength}
                    onChange={(e) => setCustomization(prev => ({ 
                      ...prev, 
                      trailLength: parseInt(e.target.value) 
                    }))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bladeTrail"
                    checked={customization.bladeTrail}
                    onChange={(e) => setCustomization(prev => ({ ...prev, bladeTrail: e.target.checked }))}
                  />
                  <label htmlFor="bladeTrail" className="text-sm font-medium">Show Blade Trail</label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={customization.difficulty} onValueChange={(value) => setCustomization(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
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
                  <label className="text-sm font-medium mb-2 block">Fruit Size: {customization.fruitSize}x</label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.1"
                    value={customization.fruitSize}
                    onChange={(e) => setCustomization(prev => ({ ...prev, fruitSize: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="bombs"
                      checked={customization.enableBombs}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableBombs: e.target.checked }))}
                    />
                    <label htmlFor="bombs" className="text-sm font-medium">Enable Bombs</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="combos"
                      checked={customization.enableCombo}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableCombo: e.target.checked }))}
                    />
                    <label htmlFor="combos" className="text-sm font-medium">Enable Combo System</label>
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
