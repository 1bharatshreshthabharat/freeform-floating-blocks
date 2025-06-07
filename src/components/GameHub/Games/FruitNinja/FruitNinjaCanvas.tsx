
import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFruitNinja } from './FruitNinjaProvider';
import { fruitTypes, backgroundThemes } from './fruitNinjaUtils';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY } from './FruitNinjaProvider';

export const FruitNinjaCanvas: React.FC = () => {
  const {
    gameState,
    score,
    level,
    combo,
    lives,
    fruits,
    particles,
    sliceTrail,
    customization,
    canvasRef,
    setFruits,
    setParticles,
    setScore,
    setLevel,
    setCombo,
    setLives,
    setGameState,
    setSliceTrail,
    setHighScore,
    onStatsUpdate,
    handleInteractionStart,
    handleInteractionMove,
    handleInteractionEnd,
    initializeGame
  } = useFruitNinja();

  const animationFrameRef = useRef<number | null>(null);
  const isSlicingRef = useRef(false);

  const getDifficultyParams = useCallback(() => {
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
  }, [customization.difficulty, customization.fruitSpawnRate, customization.gameSpeed, level]);

  const createParticles = useCallback((x: number, y: number, color: string, type: 'juice' | 'spark' | 'explosion', count: number = 10) => {
    if (!customization.enableParticles) return;
    
    const newParticles = [];
    
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
  }, [customization.enableParticles, setParticles]);

  const sliceFruit = useCallback((fruitId: number) => {
    setFruits(prev => {
      const fruitIndex = prev.findIndex(f => f.id === fruitId);
      if (fruitIndex === -1) return prev;
      
      const fruit = prev[fruitIndex];
      if (fruit.sliced) return prev;
      
      const newFruits = [...prev];
      newFruits[fruitIndex] = { ...fruit, sliced: true, sliceTime: Date.now() };
      
      if (fruit.isBomb) {
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
        const points = fruit.points * (combo > 0 ? 1 + combo * 0.1 : 1);
        setScore(prev => prev + Math.floor(points));
        setCombo(prev => prev + 1);
        
        if ((score + points) % 500 < points) {
          setLevel(prev => prev + 1);
        }
        
        const fruitData = fruitTypes[fruit.type as keyof typeof fruitTypes];
        createParticles(fruit.x, fruit.y, fruitData?.juiceColor || '#FF6B6B', 'juice', 15);
        createParticles(fruit.x, fruit.y, '#FFFF00', 'spark', 8);
      }
      
      return newFruits;
    });
  }, [createParticles, score, combo, setCombo, setFruits, setGameState, setLevel, setLives, setScore]);

  const spawnFruit = useCallback(() => {
    const params = getDifficultyParams();
    
    if (Math.random() < params.spawnRate) {
      const fruitTypeKeys = Object.keys(fruitTypes);
      const fruitType = fruitTypeKeys[Math.floor(Math.random() * fruitTypeKeys.length)];
      const fruitData = fruitTypes[fruitType as keyof typeof fruitTypes];
      
      const isBomb = Math.random() < params.bombChance;
      const isSpecial = !isBomb && Math.random() < params.specialChance;
      
      const newFruit = {
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
  }, [getDifficultyParams, setFruits]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

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
          if (fruit.sliced && Date.now() - fruit.sliceTime > 500) return false;
          if (!fruit.sliced && fruit.y > CANVAS_HEIGHT + 100) {
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

    setParticles(prev => {
      return prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3,
          life: particle.life - 1,
          vx: particle.vx * 0.98
        }))
        .filter(particle => particle.life > 0);
    });

    setSliceTrail(prev => ({
      ...prev,
      points: prev.points
        .map(point => ({ ...point, time: point.time - 1 }))
        .filter(point => point.time > 0)
    }));

    spawnFruit();
  }, [gameState, spawnFruit, setFruits, setGameState, setLives, setCombo, setParticles, setSliceTrail]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear and draw background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (customization.backgroundTheme === 'dojo') {
      gradient.addColorStop(0, '#2C1810');
      gradient.addColorStop(1, '#8B4513');
    } else if (customization.backgroundTheme === 'sunset') {
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#FFE66D');
    } else if (customization.backgroundTheme === 'forest') {
      gradient.addColorStop(0, '#2ECC71');
      gradient.addColorStop(1, '#27AE60');
    } else if (customization.backgroundTheme === 'ocean') {
      gradient.addColorStop(0, '#3498DB');
      gradient.addColorStop(1, '#2980B9');
    } else if (customization.backgroundTheme === 'space') {
      gradient.addColorStop(0, '#2C3E50');
      gradient.addColorStop(1, '#4A90E2');
    }
    
    ctx.fillStyle = gradient;
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
          ctx.scale(1.2, 0.8);
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
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop, draw]);

  useEffect(() => {
    if (gameState === 'gameOver') {
      setHighScore(prev => {
        const newHighScore = Math.max(prev, score);
        onStatsUpdate((prevStats: any) => ({ 
          ...prevStats, 
          totalScore: Math.max(prevStats.totalScore || 0, score),
          gamesPlayed: prevStats.gamesPlayed + 1
        }));
        return newHighScore;
      });
    }
  }, [gameState, score, setHighScore, onStatsUpdate]);

  // Mouse and touch event handlers with proper trail tracking
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState === 'gameOver' || gameState === 'menu') {
      initializeGame();
      return;
    }
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    isSlicingRef.current = true;
    handleInteractionStart(coords.x, coords.y);
  }, [getCanvasCoordinates, handleInteractionStart, gameState, initializeGame]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    handleInteractionMove(coords.x, coords.y);
    
    // Check for fruit slicing
    fruits.forEach(fruit => {
      if (!fruit.sliced) {
        const distance = Math.sqrt((fruit.x - coords.x) ** 2 + (fruit.y - coords.y) ** 2);
        if (distance < fruit.size / 2 + 20) {
          sliceFruit(fruit.id);
        }
      }
    });
  }, [getCanvasCoordinates, handleInteractionMove, fruits, sliceFruit, gameState]);

  const handleMouseUp = useCallback(() => {
    isSlicingRef.current = false;
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState === 'gameOver' || gameState === 'menu') {
      initializeGame();
      return;
    }
    
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    isSlicingRef.current = true;
    handleInteractionStart(coords.x, coords.y);
  }, [getCanvasCoordinates, handleInteractionStart, gameState, initializeGame]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    handleInteractionMove(coords.x, coords.y);
    
    // Check for fruit slicing
    fruits.forEach(fruit => {
      if (!fruit.sliced) {
        const distance = Math.sqrt((fruit.x - coords.x) ** 2 + (fruit.y - coords.y) ** 2);
        if (distance < fruit.size / 2 + 20) {
          sliceFruit(fruit.id);
        }
      }
    });
  }, [getCanvasCoordinates, handleInteractionMove, fruits, sliceFruit, gameState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasEvent>) => {
    e.preventDefault();
    isSlicingRef.current = false;
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  return (
    <Card className="flex-1 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-red-300 rounded-lg cursor-crosshair touch-none"
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
  );
};
