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
  sliceAngle?: number;
}

interface SliceEffect {
  x: number;
  y: number;
  angle: number;
  life: number;
  fruitType: string;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
  }>;
}

interface GameCustomization {
  bladeColor: string;
  bladeTrail: boolean;
  backgroundTheme: string;
  difficulty: 'beginner' | 'medium' | 'expert';
  gameSpeed: number;
  enableBombs: boolean;
  enableCombo: boolean;
  senseiMode: boolean;
  criticalHits: boolean;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    trail: [] as { x: number; y: number; time: number; pressure: number }[],
    isDown: false 
  });
  
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
  const [criticalHit, setCriticalHit] = useState<{ x: number; y: number; life: number; text: string } | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const [customization, setCustomization] = useState<GameCustomization>({
    bladeColor: '#00BFFF',
    bladeTrail: true,
    backgroundTheme: 'dojo',
    difficulty: 'medium',
    gameSpeed: 1.0,
    enableBombs: true,
    enableCombo: true,
    senseiMode: false,
    criticalHits: true
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const MAX_TRAIL_LENGTH = 25;
  
  // Dynamic game parameters based on level and difficulty
  const getLevelParams = () => {
    const difficultyMultiplier = {
      beginner: { spawnRate: 1.5, fruitSpeed: 0.7, bombRate: 0.5 },
      medium: { spawnRate: 1.0, fruitSpeed: 1.0, bombRate: 1.0 },
      expert: { spawnRate: 0.7, fruitSpeed: 1.3, bombRate: 1.5 }
    }[customization.difficulty];
    
    return {
      spawnRate: 1200 / customization.gameSpeed * difficultyMultiplier.spawnRate / (1 + (level - 1) * 0.1),
      fruitSpeed: 12 * customization.gameSpeed * difficultyMultiplier.fruitSpeed * (1 + (level - 1) * 0.05),
      bombRate: customization.enableBombs ? Math.min(0.05 + (level - 1) * 0.01, 0.25) * difficultyMultiplier.bombRate : 0,
      bonusRate: 0.1 + (level - 1) * 0.01,
      fruitCount: Math.min(2 + Math.floor((level - 1) / 2), 6),
      criticalHitChance: customization.criticalHits ? 0.1 + (level - 1) * 0.01 : 0
    };
  };

  const backgroundThemes = {
    dojo: {
      background: 'linear-gradient(to bottom, #3a0000, #8b0000)',
      floor: '#422018',
      elements: '🈴🈯🈵🈶🉐🈺'
    },
    forest: {
      background: 'linear-gradient(to bottom, #143601, #1a4301)',
      floor: '#2a3d00',
      elements: '🌲🌳🍀🌿🌱🍃'
    },
    beach: {
      background: 'linear-gradient(to bottom, #87ceeb, #00bfff)',
      floor: '#f0e68c',
      elements: '🌊🏄‍♂️🐚🌴🐬☀️'
    },
    night: {
      background: 'linear-gradient(to bottom, #000000, #191970)',
      floor: '#000033',
      elements: '🌙⭐✨🔭⚪🌠'
    },
    dusk: {
      background: 'linear-gradient(to bottom, #FF6347, #8B008B)',
      floor: '#8B4513',
      elements: '🌇🌆🧨🪔🌄🎆'
    }
  };

  const fruitTypes = [
    { type: 'apple', color: '#FF0000', icon: '🍎', points: 1, sfx: 'apple_slice' },
    { type: 'orange', color: '#FFA500', icon: '🍊', points: 1, sfx: 'orange_slice' },
    { type: 'watermelon', color: '#006400', icon: '🍉', points: 3, sfx: 'watermelon_slice' },
    { type: 'banana', color: '#FFE135', icon: '🍌', points: 2, sfx: 'banana_slice' },
    { type: 'pineapple', color: '#FEDC56', icon: '🍍', points: 3, sfx: 'pineapple_slice' },
    { type: 'strawberry', color: '#FF3131', icon: '🍓', points: 2, sfx: 'strawberry_slice' },
    { type: 'mango', color: '#FFD700', icon: '🥭', points: 3, sfx: 'mango_slice' },
    { type: 'kiwi', color: '#8EE53F', icon: '🥝', points: 2, sfx: 'kiwi_slice' },
    { type: 'pomegranate', color: '#C71585', icon: '🫑', points: 4, sfx: 'pomegranate_slice' },
    { type: 'peach', color: '#FFDAB9', icon: '🍑', points: 2, sfx: 'peach_slice' }
  ];

  const bladeColors = ['#FFD700', '#FF0000', '#4169E1', '#00BFFF', '#FF1493', '#00CED1', '#9370DB'];

  const createFruit = useCallback((id: number): Fruit => {
    const params = getLevelParams();
    const fruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    
    const isBomb = Math.random() < params.bombRate;
    const isBonus = !isBomb && Math.random() < params.bonusRate;
    
    const speedMultiplier = isBonus ? 0.8 : 1.0;
    const sizeMultiplier = isBonus ? 1.5 : 1.0;
    
    return {
      id,
      x: Math.random() * (CANVAS_WIDTH - 200) + 100,
      y: CANVAS_HEIGHT + 50,
      vx: (Math.random() - 0.5) * 8,
      vy: -params.fruitSpeed * speedMultiplier,
      type: isBomb ? 'bomb' : fruitType.type,
      size: 50 * sizeMultiplier,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      sliced: false,
      points: isBomb ? 0 : isBonus ? fruitType.points * 2 : fruitType.points,
      isBomb,
      isBonus
    };
  }, [customization.difficulty, level, customization.gameSpeed]);

  const initializeGame = useCallback(() => {
    setFruits([]);
    setSliceEffects([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLevel(1);
    setLives(3);
    setCriticalHit(null);
    setGameState('playing');
    mouseRef.current.trail = [];
  }, []);

  const spawnFruits = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const params = getLevelParams();
    const fruitCount = params.fruitCount;
    
    const newFruits = Array.from({ length: fruitCount }, (_, i) => 
      createFruit(Date.now() + i)
    );
    
    setFruits(prev => [...prev, ...newFruits]);
    
    // Schedule next spawn
    setTimeout(spawnFruits, params.spawnRate + Math.random() * 500);
  }, [gameState, level, customization, createFruit]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    // Calculate canvas-relative mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current.isDown = true;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.trail = [{ x, y, time: Date.now(), pressure: 1.0 }];
    setIsSlicing(true);
  }, [gameState]);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
    setIsSlicing(false);

    // If on menu screen, start the game
    if (gameState === 'menu' || gameState === 'gameOver') {
      setShowSplash(false);
      setTimeout(() => {
        initializeGame();
      }, 500);
    }
  }, [gameState, initializeGame]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !mouseRef.current.isDown) return;
    
    // Calculate canvas-relative mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    
    // Add to trail with timestamp
    const trailPoint = { x, y, time: Date.now(), pressure: 1.0 };
    mouseRef.current.trail.push(trailPoint);
    
    // Limit trail length
    if (mouseRef.current.trail.length > MAX_TRAIL_LENGTH) {
      mouseRef.current.trail.shift();
    }
    
    // Check for sliced fruits
    setFruits(prevFruits => {
      const newFruits = [...prevFruits];
      let slicedCount = 0;
      let lostLife = false;
      
      // Get the previous point for line slice detection
      const trail = mouseRef.current.trail;
      if (trail.length < 2) return newFruits;
      
      const prevPoint = trail[trail.length - 2];
      const currPoint = trail[trail.length - 1];
      
      newFruits.forEach(fruit => {
        if (!fruit.sliced && !fruit.isBomb) {
          // Check if line segment from prevPoint to currPoint intersects the fruit
          const distToLine = lineDistToCircle(
            prevPoint.x, prevPoint.y,
            currPoint.x, currPoint.y,
            fruit.x, fruit.y, fruit.size / 2
          );
          
          if (distToLine < fruit.size / 2 + 10) {
            fruit.sliced = true;
            fruit.sliceTime = Date.now();
            fruit.sliceAngle = Math.atan2(currPoint.y - prevPoint.y, currPoint.x - prevPoint.x);
            slicedCount++;
            
            // Create slice effect with particles
            const sliceParticles = [];
            const fruitColor = fruitTypes.find(f => f.type === fruit.type)?.color || '#FF0000';
            
            // Create juice particles
            for (let i = 0; i < 12; i++) {
              const angle = fruit.sliceAngle + (Math.random() - 0.5) * 1.5;
              const speed = Math.random() * 5 + 2;
              
              sliceParticles.push({
                x: fruit.x,
                y: fruit.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 5 + 2,
                color: fruitColor,
                life: Math.random() * 20 + 20
              });
            }
            
            setSliceEffects(prev => [
              ...prev, 
              {
                x: fruit.x,
                y: fruit.y,
                angle: fruit.sliceAngle || 0,
                life: 30,
                fruitType: fruit.type,
                particles: sliceParticles
              }
            ]);
            
            // Critical hit chance
            const params = getLevelParams();
            if (Math.random() < params.criticalHitChance) {
              const bonusPoints = fruit.points * 2;
              const critText = ['CRITICAL!', 'PERFECT!', 'EXCELLENT!', 'COMBO x2!'][Math.floor(Math.random() * 4)];
              setCriticalHit({
                x: fruit.x,
                y: fruit.y,
                life: 60,
                text: critText
              });
              
              setScore(prevScore => prevScore + bonusPoints);
            } else {
              // Regular points
              setScore(prevScore => prevScore + fruit.points);
            }
            
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
            
            // Level up every 20 points
            if ((score + fruit.points) % 20 === 0) {
              setLevel(prev => prev + 1);
            }
          }
        } else if (!fruit.sliced && fruit.isBomb) {
          // Check bomb collision
          const distToLine = lineDistToCircle(
            prevPoint.x, prevPoint.y,
            currPoint.x, currPoint.y,
            fruit.x, fruit.y, fruit.size / 2
          );
          
          if (distToLine < fruit.size / 2 + 5 && !lostLife) {
            fruit.sliced = true;
            lostLife = true;
            
            // Create bomb explosion effect with particles
            const explosionParticles = [];
            
            // Create explosion particles
            for (let i = 0; i < 30; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 8 + 2;
              
              explosionParticles.push({
                x: fruit.x,
                y: fruit.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 6 + 3,
                color: ['#FF0000', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 3)],
                life: Math.random() * 30 + 30
              });
            }
            
            setSliceEffects(prev => [
              ...prev, 
              {
                x: fruit.x,
                y: fruit.y,
                angle: 0,
                life: 40,
                fruitType: 'bomb',
                particles: explosionParticles
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
  }, [isSlicing, score, customization.enableCombo]);

  // Helper function to calculate distance from line segment to circle
  const lineDistToCircle = (x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number): number => {
    // Calculate vector from point 1 to point 2
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize the vector
    const nx = dx / len;
    const ny = dy / len;
    
    // Calculate vector from point 1 to circle center
    const px = cx - x1;
    const py = cy - y1;
    
    // Project circle center onto line
    const proj = px * nx + py * ny;
    
    // Clamp projection to line segment
    const projClamp = Math.max(0, Math.min(len, proj));
    
    // Calculate nearest point on line segment
    const nearestX = x1 + projClamp * nx;
    const nearestY = y1 + projClamp * ny;
    
    // Calculate distance from nearest point to circle center
    const distance = Math.sqrt((nearestX - cx) * (nearestX - cx) + (nearestY - cy) * (nearestY - cy));
    
    return distance;
  };

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
            vy: fruit.vy + 0.3, // gravity
            rotation: fruit.rotation + fruit.rotationSpeed
          };
          
          // Add special behavior for sliced fruits
          if (fruit.sliced) {
            // Split sliced fruits
            updatedFruit.vx += fruit.id % 2 === 0 ? 0.3 : -0.3;
            
            // Add spinning effect for sliced fruits
            updatedFruit.rotationSpeed *= 1.01;
          }
          
          return updatedFruit;
        })
        .filter(fruit => {
          // Remove fruits that have fallen below the screen
          if (fruit.y > CANVAS_HEIGHT + 100 && !fruit.sliced && !fruit.isBomb) {
            // Missing a fruit loses a life
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              }
              return newLives;
            });
            return false;
          }
          
          // Remove sliced fruits after they've fallen or off-screen bombs
          if ((fruit.sliced && fruit.y > CANVAS_HEIGHT + 100) || 
              (fruit.isBomb && fruit.y > CANVAS_HEIGHT + 100)) {
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
          life: effect.life - 1,
          particles: effect.particles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2,
            life: particle.life - 1
          })).filter(particle => particle.life > 0)
        }))
        .filter(effect => effect.life > 0 || effect.particles.length > 0)
    );

    // Update critical hit animations
    if (criticalHit) {
      setCriticalHit(prev => {
        if (!prev) return null;
        
        if (prev.life <= 0) {
          return null;
        } else {
          return {
            ...prev,
            y: prev.y - 1,
            life: prev.life - 1
          };
        }
      });
    }
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear canvas with themed background
    const backdropGradient = theme.background.substring(
      theme.background.indexOf('(') + 1, 
      theme.background.lastIndexOf(')')
    );
    const colors = backdropGradient.split(',');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, colors[colors.length - 2].trim());
    gradient.addColorStop(1, colors[colors.length - 1].trim());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw themed background elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '40px Arial';
    
    const elementsArray = theme.elements.split('');
    for (let i = 0; i < 6; i++) {
      const x = (i * 150 + (Date.now() * 0.02) % 150) % CANVAS_WIDTH;
      const y = 80 + (i % 3) * 150;
      ctx.fillText(elementsArray[i % elementsArray.length], x, y);
    }
    
    // Draw floor backdrop
    ctx.fillStyle = theme.floor;
    ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);

    if (gameState !== 'menu') {
      // Draw fruits with enhanced details
      fruits.forEach(fruit => {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.rotate(fruit.rotation);
        
        if (fruit.isBomb) {
          // Draw bomb
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(0, 0, fruit.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          
          // Bomb shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(fruit.size * 0.3, -fruit.size * 0.3, fruit.size * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Bomb fuse with animated sparks
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -fruit.size * 0.7);
          ctx.quadraticCurveTo(
            fruit.size * 0.5, -fruit.size * 1.3,
            fruit.size * 0.7, -fruit.size * 0.7
          );
          ctx.stroke();
          
          if (!fruit.sliced) {
            // Animated fuse sparks
            if (Math.random() > 0.5) {
              ctx.fillStyle = '#FFFF00';
              ctx.beginPath();
              ctx.arc(
                fruit.size * 0.7, 
                -fruit.size * 0.7, 
                Math.random() * 5 + 2,
                0, Math.PI * 2
              );
              ctx.fill();
            }
          } else {
            // Sliced bomb effect - X eyes
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            
            // X eyes
            ctx.beginPath();
            ctx.moveTo(-fruit.size * 0.3, -fruit.size * 0.2);
            ctx.lineTo(-fruit.size * 0.1, -fruit.size * 0.4);
            ctx.moveTo(-fruit.size * 0.3, -fruit.size * 0.4);
            ctx.lineTo(-fruit.size * 0.1, -fruit.size * 0.2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(fruit.size * 0.1, -fruit.size * 0.2);
            ctx.lineTo(fruit.size * 0.3, -fruit.size * 0.4);
            ctx.moveTo(fruit.size * 0.1, -fruit.size * 0.4);
            ctx.lineTo(fruit.size * 0.3, -fruit.size * 0.2);
            ctx.stroke();
          }
        } else {
          // Get fruit info
          const fruitInfo = fruitTypes.find(f => f.type === fruit.type);
          const fruitIcon = fruitInfo?.icon || '🍎';
          
          if (!fruit.sliced) {
            // Draw whole fruit
            ctx.font = `${fruit.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruitIcon, 0, 0);
            
            // Bonus glow
            if (fruit.isBonus) {
              ctx.save();
              ctx.shadowColor = '#FFD700';
              ctx.shadowBlur = 20;
              ctx.strokeStyle = '#FFD700';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, fruit.size * 0.8, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }
          } else {
            // Draw sliced fruit (two halves)
            const sliceAngle = fruit.sliceAngle || Math.PI/4;
            
            ctx.save();
            // Left half (rotated slightly)
            ctx.rotate(-0.2);
            ctx.translate(-fruit.size * 0.3, 0);
            ctx.scale(0.8, 1);
            ctx.font = `${fruit.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruitIcon, 0, 0);
            ctx.restore();
            
            ctx.save();
            // Right half (rotated opposite)
            ctx.rotate(0.2);
            ctx.translate(fruit.size * 0.3, 0);
            ctx.scale(0.8, 1);
            ctx.font = `${fruit.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruitIcon, 0, 0);
            ctx.restore();
            
            // Slice line
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-fruit.size * 0.8 * Math.cos(sliceAngle), -fruit.size * 0.8 * Math.sin(sliceAngle));
            ctx.lineTo(fruit.size * 0.8 * Math.cos(sliceAngle), fruit.size * 0.8 * Math.sin(sliceAngle));
            ctx.stroke();
          }
        }
        
        ctx.restore();
      });

      // Draw slice effect particles
      sliceEffects.forEach(effect => {
        if (effect.fruitType === 'bomb') {
          // Draw explosion effect
          ctx.save();
          const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, 100 * (1 - effect.life / 40)
          );
          gradient.addColorStop(0, `rgba(255, 200, 0, ${effect.life / 40})`);
          gradient.addColorStop(0.5, `rgba(255, 0, 0, ${effect.life / 40 * 0.8})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 80 * (1 - effect.life / 40), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Draw juice/particle effects
        effect.particles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.life / 30;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      });

      // Draw blade trail
      if (isSlicing && customization.bladeTrail && mouseRef.current.trail.length > 1) {
        ctx.save();
        
        // Create gradient for blade trail
        const gradient = ctx.createLinearGradient(
          mouseRef.current.trail[0].x, mouseRef.current.trail[0].y,
          mouseRef.current.x, mouseRef.current.y
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, customization.bladeColor);
        gradient.addColorStop(1, 'white');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw main blade trail
        ctx.beginPath();
        ctx.moveTo(mouseRef.current.trail[0].x, mouseRef.current.trail[0].y);
        
        for (let i = 1; i < mouseRef.current.trail.length; i++) {
          const point = mouseRef.current.trail[i];
          
          // Adjust line width by pressure and time
          const age = (Date.now() - point.time) / 200;
          const thickness = 8 * Math.max(0, 1 - age) * point.pressure;
          
          if (i === 1) {
            ctx.lineTo(point.x, point.y);
          } else {
            ctx.lineWidth = thickness;
            ctx.lineTo(point.x, point.y);
          }
        }
        
        ctx.stroke();
        
        // Draw blade sparkles
        for (let i = 0; i < mouseRef.current.trail.length; i += 3) {
          const point = mouseRef.current.trail[i];
          const age = (Date.now() - point.time) / 200;
          if (age < 0.7) {
            ctx.globalAlpha = 1 - age;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Extra sparkle effect
            if (i % 9 === 0) {
              ctx.fillStyle = customization.bladeColor;
              ctx.beginPath();
              ctx.arc(point.x + (Math.random() - 0.5) * 10, 
                      point.y + (Math.random() - 0.5) * 10, 
                      1 + Math.random() * 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      }

      // Draw critical hit text
      if (criticalHit) {
        ctx.save();
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255, 215, 0, ${criticalHit.life / 60})`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(criticalHit.text, criticalHit.x, criticalHit.y - 30);
        ctx.fillText(criticalHit.text, criticalHit.x, criticalHit.y - 30);
        ctx.restore();
      }
    }

    // Draw UI text
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';

    if (gameState === 'playing' || gameState === 'paused') {
      // Score with shadow
      ctx.save();
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 45);
      
      // Lives display with hearts
      ctx.fillText(`${Array(lives).fill('❤️').join('')}${Array(3 - lives).fill('🖤').join('')}`, 20, 85);
      
      // Level indicator
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`Level ${level}`, 20, 125);
      
      // Combo display
      if (customization.enableCombo && combo > 1) {
        const comboSize = Math.min(48, 32 + combo * 2);
        ctx.font = `bold ${comboSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.strokeText(`${combo}x COMBO!`, CANVAS_WIDTH / 2, 80);
        ctx.fillText(`${combo}x COMBO!`, CANVAS_WIDTH / 2, 80);
      }
      
      ctx.restore();
    } else if (gameState === 'menu') {
      // Title screen with splash animation
      if (showSplash) {
        // Fruit Ninja logo
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Top text "FRUIT"
        ctx.font = 'bold 90px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF4500';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 8;
        ctx.strokeText('FRUIT', CANVAS_WIDTH / 2, 180);
        ctx.fillText('FRUIT', CANVAS_WIDTH / 2, 180);
        
        // Bottom text "NINJA"
        ctx.font = 'bold 110px Arial';
        ctx.fillStyle = '#8B0000';
        ctx.strokeText('NINJA', CANVAS_WIDTH / 2, 280);
        ctx.fillText('NINJA', CANVAS_WIDTH / 2, 280);
        
        // Ninja sword swing animation
        const swordAngle = Math.PI * 0.15 * Math.sin(Date.now() * 0.003);
        
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, 350);
        ctx.rotate(swordAngle);
        ctx.fillStyle = '#363636';
        ctx.fillRect(-100, -10, 200, 20);
        
        // Sword handle
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-100, -15, 40, 30);
        
        // Sword sharpened edge
        ctx.beginPath();
        ctx.moveTo(100, -10);
        ctx.lineTo(120, 0);
        ctx.lineTo(100, 10);
        ctx.closePath();
        ctx.fillStyle = '#C0C0C0';
        ctx.fill();
        
        // Sword glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, -5, 80, 3);
        
        ctx.restore();
        
        // Instruction text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFF';
        ctx.fillText('Slice to Start', CANVAS_WIDTH / 2 - 70, 420);
        
        // Animated fruits
        const time = Date.now() / 1000;
        for (let i = 0; i < fruitTypes.length; i++) {
          const fruitIcon = fruitTypes[i].icon;
          const x = 100 + (i * 70) % (CANVAS_WIDTH - 200);
          const y = 100 + Math.sin(time + i * 0.7) * 50;
          
          ctx.font = '40px Arial';
          ctx.fillText(fruitIcon, x, y);
        }
        
        ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF';
        ctx.fillText('Starting Game...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FF0000';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.strokeText('GAME OVER', CANVAS_WIDTH / 2, 200);
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 200);
      
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#FFF';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, 260);
      ctx.fillText(`Max Combo: ${maxCombo}x`, CANVAS_WIDTH / 2, 310);
      ctx.fillText(`Level Reached: ${level}`, CANVAS_WIDTH / 2, 360);
      
      // Sliced watermelon with splatter
      ctx.font = '80px Arial';
      ctx.fillText('🍉', CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT - 100);
      
      ctx.fillStyle = '#FF0000';
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI * 2 * i / 8;
        const dist = 30 + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(
          CANVAS_WIDTH / 2 - 100 + Math.cos(angle) * dist,
          CANVAS_HEIGHT - 100 - 20 + Math.sin(angle) * dist,
          4 + Math.random() * 6,
          0, Math.PI * 2
        );
        ctx.fill();
      }
      
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#FFF';
      ctx.fillText('Slice to Play Again', CANVAS_WIDTH / 2, 420);
    }
  }, [
    gameState, fruits, sliceEffects, score, level, lives, highScore, maxCombo, combo, 
    customization, isSlicing, criticalHit, showSplash
  ]);

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
      draw(); // Make sure to still draw when paused/menu
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (gameState === 'menu' || gameState === 'gameOver') {
          setShowSplash(false);
          setTimeout(() => {
            initializeGame();
          }, 500);
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, initializeGame]);

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
                  className="border-4 border-red-300 rounded-lg cursor-crosshair"
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
                  <div className="text-xl">
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
                  <Button onClick={() => {
                    setShowSplash(false);
                    initializeGame();
                  }} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">Difficulty: <Badge>{customization.difficulty}</Badge></div>
                  
                  <div className="text-sm">Next Level: {20 - (score % 20)} points</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(score % 20) * 5}%` }}
                    />
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Level attributes:</p>
                    <ul className="list-disc list-inside">
                      <li>Fruit speed increases</li>
                      <li>More fruits spawn at once</li>
                      <li>Critical hit chance increases</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Slice fruits by swiping your mouse</li>
                  <li>• Avoid bombs or lose a life</li>
                  <li>• Missing fruits costs lives too</li>
                  <li>• Make combos for bonus points</li>
                  <li>• Special fruits give bonus points</li>
                  <li>• Watch for critical hits!</li>
                  <li>• Level up every 20 points</li>
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
                      <SelectItem value="dojo">Classic Dojo</SelectItem>
                      <SelectItem value="forest">Bamboo Forest</SelectItem>
                      <SelectItem value="beach">Sunny Beach</SelectItem>
                      <SelectItem value="night">Nighttime</SelectItem>
                      <SelectItem value="dusk">Sakura Dusk</SelectItem>
                    </SelectContent>
                  </Select>
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
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="criticalHits"
                      checked={customization.criticalHits}
                      onChange={(e) => setCustomization(prev => ({ ...prev, criticalHits: e.target.checked }))}
                    />
                    <label htmlFor="criticalHits" className="text-sm font-medium">Enable Critical Hits</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="senseiMode"
                      checked={customization.senseiMode}
                      onChange={(e) => setCustomization(prev => ({ ...prev, senseiMode: e.target.checked }))}
                    />
                    <label htmlFor="senseiMode" className="text-sm font-medium">Sensei Mode (Harder)</label>
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
