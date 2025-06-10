import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFruitNinja } from './FruitNinjaProvider';
import { useFruitNinjaRenderer } from './FruitNinjaCanvasRenderer';
import { useFruitNinjaInputHandler } from './FruitNinjaInputHandler';
import { useFruitNinjaGameLogic } from './FruitNinjaGameLogic';

export const FruitNinjaCanvas: React.FC = () => {
  const {
    gameState,
    score,
    level,
    combo,
    lives,
    fruits,
    particles,
    mistakeMessages,
    sliceTrail,
    customization,
    canvasRef,
    setFruits,
    setParticles,
    setMistakeMessages,
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

  const gameLogic = useFruitNinjaGameLogic({
    gameState,
    level,
    combo,
    customization,
    setFruits,
    setParticles,
    setScore,
    setLevel,
    setCombo,
    setLives,
    setGameState,
    score,
    setMistakeMessages
  });

  const renderer = useFruitNinjaRenderer({
    canvasRef,
    gameState,
    fruits,
    particles,
    mistakeMessages,
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
    sliceFruit: gameLogic.sliceFruit,
    initializeGame
  });

  // Update slice trail fade
  useEffect(() => {
    const interval = setInterval(() => {
      setSliceTrail(prev => ({
        ...prev,
        points: prev.points
          .map(point => ({ ...point, time: point.time - 2 }))
          .filter(point => point.time > 0)
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [setSliceTrail]);

  const gameLoop = useCallback(() => {
    gameLogic.updateGame();
    renderer.draw();
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLogic.updateGame, renderer.draw]);

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
            width={800}
            height={600}
            className="border-4 border-red-300 rounded-lg cursor-crosshair touch-none select-none"
            style={{ maxWidth: '100%', height: 'auto' }}
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
