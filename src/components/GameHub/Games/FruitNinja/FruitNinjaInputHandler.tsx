
import React, { useCallback, useRef } from 'react';

interface InputHandlerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameState: string;
  fruits: any[];
  handleInteractionStart: (x: number, y: number) => void;
  handleInteractionMove: (x: number, y: number) => void;
  handleInteractionEnd: () => void;
  sliceFruit: (fruitId: number) => void;
  initializeGame: () => void;
}

export const useFruitNinjaInputHandler = ({
  canvasRef,
  gameState,
  fruits,
  handleInteractionStart,
  handleInteractionMove,
  handleInteractionEnd,
  sliceFruit,
  initializeGame
}: InputHandlerProps) => {
  const isSlicingRef = useRef(false);

  // Fixed coordinate calculation for proper blade alignment
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
  }, [canvasRef]);

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

  // Touch event handlers with proper coordinate calculation
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

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isSlicingRef.current = false;
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

// Legacy component wrapper (not used anymore)
export const FruitNinjaInputHandler: React.FC<InputHandlerProps> = (props) => {
  return null;
};
