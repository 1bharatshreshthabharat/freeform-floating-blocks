
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
  const lastSlicePositionRef = useRef<{x: number, y: number} | null>(null);

  // Fixed coordinate calculation with proper scaling
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the exact scaling based on canvas internal vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Transform coordinates with exact scaling
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  }, [canvasRef]);

  const checkFruitCollision = useCallback((x: number, y: number) => {
    fruits.forEach(fruit => {
      if (!fruit.sliced) {
        const distance = Math.sqrt((fruit.x - x) ** 2 + (fruit.y - y) ** 2);
        const hitRadius = fruit.size / 2 + 20; // Generous hit radius
        if (distance < hitRadius) {
          sliceFruit(fruit.id);
        }
      }
    });
  }, [fruits, sliceFruit]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState === 'gameOver' || gameState === 'menu') {
      initializeGame();
      return;
    }
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    isSlicingRef.current = true;
    lastSlicePositionRef.current = coords;
    handleInteractionStart(coords.x, coords.y);
    checkFruitCollision(coords.x, coords.y);
  }, [getCanvasCoordinates, handleInteractionStart, gameState, initializeGame, checkFruitCollision]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    handleInteractionMove(coords.x, coords.y);
    
    // Check collision along the slice path for better detection
    if (lastSlicePositionRef.current) {
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpolatedX = lastSlicePositionRef.current.x + (coords.x - lastSlicePositionRef.current.x) * t;
        const interpolatedY = lastSlicePositionRef.current.y + (coords.y - lastSlicePositionRef.current.y) * t;
        checkFruitCollision(interpolatedX, interpolatedY);
      }
    }
    
    lastSlicePositionRef.current = coords;
  }, [getCanvasCoordinates, handleInteractionMove, gameState, checkFruitCollision]);

  const handleMouseUp = useCallback((e?: React.MouseEvent<HTMLCanvasElement>) => {
    isSlicingRef.current = false;
    lastSlicePositionRef.current = null;
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  // Touch event handlers with proper coordinate handling
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState === 'gameOver' || gameState === 'menu') {
      initializeGame();
      return;
    }
    
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    isSlicingRef.current = true;
    lastSlicePositionRef.current = coords;
    handleInteractionStart(coords.x, coords.y);
    checkFruitCollision(coords.x, coords.y);
  }, [getCanvasCoordinates, handleInteractionStart, gameState, initializeGame, checkFruitCollision]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isSlicingRef.current || gameState !== 'playing') return;
    
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    handleInteractionMove(coords.x, coords.y);
    
    // Check collision along the slice path
    if (lastSlicePositionRef.current) {
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpolatedX = lastSlicePositionRef.current.x + (coords.x - lastSlicePositionRef.current.x) * t;
        const interpolatedY = lastSlicePositionRef.current.y + (coords.y - lastSlicePositionRef.current.y) * t;
        checkFruitCollision(interpolatedX, interpolatedY);
      }
    }
    
    lastSlicePositionRef.current = coords;
  }, [getCanvasCoordinates, handleInteractionMove, gameState, checkFruitCollision]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isSlicingRef.current = false;
    lastSlicePositionRef.current = null;
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

export const FruitNinjaInputHandler: React.FC<InputHandlerProps> = (props) => {
  return null;
};
