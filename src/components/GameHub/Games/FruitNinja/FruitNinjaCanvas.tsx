
import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFruitNinja } from './FruitNinjaProvider';
import { fruitTypes } from './fruitNinjaUtils';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY } from './FruitNinjaProvider';
import { useFruitNinjaRenderer } from './FruitNinjaCanvasRenderer';
import { useFruitNinjaInputHandler } from './FruitNinjaInputHandler';

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

  const renderer = useFruitNinjaRenderer({
    canvasRef,
    gameState,
    fruits,
    particles,
    sliceTrail,
    score,
    level,
    combo,
    lives,
    customization
  });

  const inputHandler = useFruitNinjaInputHandler({
    canvasRef,
    gameState,
    fruits,
    handleInteractionStart,
    handleInteractionMove,
    handleInteractionEnd,
    sliceFruit,
    initializeGame
  });

  const gameLoop = useCallback(() => {
    updateGame();
    renderer.draw();
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, renderer.draw]);

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
      renderer.draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop, renderer.draw]);

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

  return (
    <Card className="flex-1 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-red-300 rounded-lg cursor-crosshair touch-none"
            onMouseDown={inputHandler.handleMouseDown}
            onMouseMove={inputHandler.handleMouseMove}
            onMouseUp={inputHandler.handleMouseUp}
            onMouseLeave={inputHandler.handleMouseUp}
            onTouchStart={inputHandler.handleTouchStart}
            onTouchMove={inputHandler.handleTouchMove}
            onTouchEnd={inputHandler.handleTouchEnd}
          />
        </div>
      </CardContent>
    </Card>
  );
};
