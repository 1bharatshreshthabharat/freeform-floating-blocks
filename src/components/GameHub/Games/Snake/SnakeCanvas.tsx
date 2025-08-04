
import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSnakeGame } from './SnakeGameProvider';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// Define board themes
const boardThemes = {
  classic: { background: '#000000', gridLines: '#333333', border: '#00FF00' },
  forest: { background: '#003300', gridLines: '#004400', border: '#008800' },
  retro: { background: '#000033', gridLines: '#000066', border: '#0000FF' },
  desert: { background: '#996633', gridLines: '#997744', border: '#CC9966' },
  neon: { background: '#000000', gridLines: '#111111', border: '#FF00FF' }
};

// Define snake types with their rendering functions
const snakeTypes = {
  classic: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, isHead: boolean) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    
    if (isHead) {
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.3, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.3, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw tongue
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.7);
      ctx.lineTo(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.9);
      ctx.lineTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.8);
      ctx.lineTo(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.9);
      ctx.lineTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.7);
      ctx.fill();
    }
  },
  rounded: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, isHead: boolean) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    if (isHead) {
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.3, cellSize * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.3, cellSize * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.3, cellSize * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.3, cellSize * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  gradient: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, isHead: boolean) => {
    const gradient = ctx.createRadialGradient(
      x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 0,
      x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    
    if (isHead) {
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.3, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.3, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  '3d': (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, isHead: boolean) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * cellSize + 3, y * cellSize + 3, cellSize - 6, cellSize - 6);
    
    if (isHead) {
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.4, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.4, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  pixelated: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, isHead: boolean) => {
    // Draw pixelated snake segment
    const pixelSize = Math.max(4, Math.floor(cellSize / 4));
    for (let px = 0; px < cellSize; px += pixelSize) {
      for (let py = 0; py < cellSize; py += pixelSize) {
        if (Math.random() > 0.2) { // Add some randomness to the pixelated look
          ctx.fillStyle = color;
          ctx.fillRect(x * cellSize + px, y * cellSize + py, pixelSize - 1, pixelSize - 1);
        }
      }
    }
    
    if (isHead) {
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      const eyeSize = pixelSize * 1.5;
      ctx.fillRect(x * cellSize + cellSize * 0.2, y * cellSize + cellSize * 0.2, eyeSize, eyeSize);
      ctx.fillRect(x * cellSize + cellSize * 0.6, y * cellSize + cellSize * 0.2, eyeSize, eyeSize);
    }
  },
  emoji: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, _color: string, isHead: boolean) => {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isHead) {
      ctx.fillText('🐍', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    } else {
      ctx.fillText('🟢', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
  },
  dragon: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, _color: string, isHead: boolean) => {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isHead) {
      ctx.fillText('🐉', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    } else {
      ctx.fillText('🔶', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
  },
  cat: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, _color: string, isHead: boolean) => {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isHead) {
      ctx.fillText('🐱', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    } else {
      ctx.fillText('🐾', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
  },
  worm: (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, _color: string, isHead: boolean) => {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isHead) {
      ctx.fillText('🪱', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    } else {
      ctx.fillText('🟤', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
  }
};

export const SnakeCanvas: React.FC = () => {
  const { 
    gameState,
    direction,
    nextDirection,
    snake,
    food,
    score,
    level,
    speed,
    gridSize,
    boardTheme,
    snakeType,
    snakeColor,
    powerUp,
    powerUpTime,
    canvasRef,
    gameLoopRef,
    lastMovementTime,
    setDirection,
    setNextDirection,
    setSnake,
    setFood,
    setScore,
    setLevel,
    setSpeed,
    setGameState,
    setLastMovementTime,
    setPowerUp,
    setPowerUpTime,
    isCollision,
    generateFood,
    startGame,
    initializeGame,
    setHighScore,
    onStatsUpdate
  } = useSnakeGame();

  // Create local refs for animation frame
  const animationFrameRef = useRef<number | null>(null);

  // Check if the snake is colliding with itself
  const isSelfCollision = useCallback((head: {x: number, y: number}) => {
    // Check only if snake has more than 4 segments (head + 3 body parts)
    if (snake.length <= 4) return false;
    
    // Check if head position matches any body segment (skip first 4 to avoid false positives)
    for (let i = 4; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setDirection(nextDirection);
    
    const head = { ...snake[0] };
    
    // Calculate new head position based on direction
    switch (nextDirection) {
      case 'up':
        head.y -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
    }
    
    // Check for collision with walls or self
    if (isCollision(head) || isSelfCollision(head)) {
      setGameState('gameOver');
      onStatsUpdate((prev: any) => ({ 
        ...prev, 
        gamesPlayed: prev.gamesPlayed + 1,
        totalScore: Math.max(prev.totalScore || 0, score)
      }));
      
      // Update high score
      setHighScore(prev => Math.max(prev, score));
      return;
    }
    
    // Check for food
    if (head.x === food.position.x && head.y === food.position.y) {
      // Don't remove tail if food is eaten (snake grows)
      const newSnake = [head, ...snake];
      setSnake(newSnake);
      
      // Add points based on food type and power-ups
      const pointsMultiplier = powerUp === 'doublePoints' ? 2 : 1;
      const newPoints = food.points * pointsMultiplier;
      
      // Update score
      setScore(prev => {
        const newScore = prev + newPoints;
        
        // Level up every 100 points
        if (Math.floor(newScore / 100) > Math.floor(prev / 100)) {
          setLevel(prevLevel => prevLevel + 1);
          
          // Increase speed with level
          const newSpeed = Math.max(50, 150 - (level * 10));
          setSpeed(newSpeed);
        }
        
        return newScore;
      });
      
      // Apply power-up if any
      if (food.powerUp) {
        setPowerUp(food.powerUp);
        setPowerUpTime(10); // 10 seconds duration
        
        if (food.powerUp === 'speed') {
          setSpeed(prev => prev * 0.7); // 30% faster
        } else if (food.powerUp === 'slowMotion') {
          setSpeed(prev => prev * 1.5); // 50% slower
        }
      }
      
      // Generate new food
      setFood(generateFood());
    } else {
      // Normal movement: add new head and remove tail
      const newSnake = [head, ...snake.slice(0, -1)];
      setSnake(newSnake);
    }
    
    // Update last movement time
    setLastMovementTime(Date.now());
    
    // Update power-up time
    if (powerUp && powerUpTime > 0) {
      setPowerUpTime(prev => {
        if (prev <= 0.1) {
          // Reset power-up effects
          if (powerUp === 'speed' || powerUp === 'slowMotion') {
            // Reset speed
            setSpeed(Math.max(50, 150 - (level * 10)));
          }
          setPowerUp(null);
          return 0;
        }
        return prev - 0.1;
      });
    }
  }, [gameState, nextDirection, snake, food, score, level, speed, powerUp, powerUpTime, isCollision, isSelfCollision, generateFood, setDirection, setFood, setHighScore, setLastMovementTime, setPowerUp, setPowerUpTime, setScore, setSnake, setSpeed, setLevel, setGameState, onStatsUpdate]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Get cell size
    const cellSize = CANVAS_WIDTH / gridSize;

    // Get theme
    const theme = boardThemes[boardTheme as keyof typeof boardThemes] || boardThemes.classic;

    // Draw background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines
    ctx.strokeStyle = theme.gridLines;
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, CANVAS_HEIGHT);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(CANVAS_WIDTH, pos);
      ctx.stroke();
    }

    if (gameState === 'menu') {
      // Draw start menu
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Advanced Snake', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.font = '24px Arial';
      ctx.fillText('Press Space, Click or Touch to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.font = '16px Arial';
      ctx.fillText('Use Arrow Keys or WASD to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      return;
    }

    if (gameState === 'gameOver') {
      // Draw game over screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
      ctx.font = '16px Arial';
      ctx.fillText('Press Space, Click or Touch to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
      return;
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const renderSnake = snakeTypes[snakeType as keyof typeof snakeTypes] || snakeTypes.classic;
      renderSnake(ctx, segment.x, segment.y, cellSize, snakeColor, isHead);
    });

    // Draw food
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(
      food.position.x * cellSize + cellSize / 2,
      food.position.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw special food effects
    if (food.powerUp) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        food.position.x * cellSize + cellSize / 2,
        food.position.y * cellSize + cellSize / 2,
        cellSize / 2 + 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Pulsating glow effect
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
      ctx.beginPath();
      ctx.arc(
        food.position.x * cellSize + cellSize / 2,
        food.position.y * cellSize + cellSize / 2,
        cellSize / 2 + 5 + Math.sin(Date.now() * 0.01) * 3,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw power-up indicator
    if (powerUp) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      const powerUpText = powerUp === 'speed' ? 'Speed!' :
                          powerUp === 'slowMotion' ? 'Slow Motion!' :
                          powerUp === 'doublePoints' ? 'Double Points!' : '';
      ctx.fillText(powerUpText, CANVAS_WIDTH / 2, 20);

      // Draw power-up timer bar
      const barWidth = 200;
      const barHeight = 10;
      const barX = (CANVAS_WIDTH - barWidth) / 2;
      const barY = 30;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Timer filled portion
      ctx.fillStyle = powerUp === 'speed' ? '#FF0000' :
                      powerUp === 'slowMotion' ? '#00FF00' :
                      powerUp === 'doublePoints' ? '#FFFF00' : '#FFFFFF';
      ctx.fillRect(barX, barY, barWidth * (powerUpTime / 10), barHeight);
    }

    // Draw border
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw score and level
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.textAlign = 'right';
    ctx.fillText(`Level: ${level}`, CANVAS_WIDTH - 10, 25);
  }, [gameState, gridSize, boardTheme, snake, food, score, level, snakeType, snakeColor, powerUp, powerUpTime]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    const elapsed = now - lastMovementTime;
    
    if (elapsed > speed) {
      moveSnake();
    }
    
    draw();
    
    // Use local ref for animation frame
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, lastMovementTime, speed, moveSnake, draw]);

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

  // Handle keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    
    // Start game with spacebar
    if (e.code === 'Space' && (gameState === 'menu' || gameState === 'gameOver')) {
      startGame();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    // Skip if moving in the opposite direction
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'down') setNextDirection('up');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'left') setNextDirection('right');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'up') setNextDirection('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'right') setNextDirection('left');
        break;
      case 'p':
      case 'P':
        setGameState(prev => (prev === 'playing' ? 'paused' : 'playing'));
        break;
    }
  }, [gameState, direction, setNextDirection, setGameState, startGame]);

  // Handle touch/click controls
  const handleTouch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState === 'menu' || gameState === 'gameOver') {
      startGame();
      return;
    }

    if (gameState !== 'playing') return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Get center of canvas for directional calculation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate the angle from the center
    const dx = x - centerX;
    const dy = y - centerY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal movement dominates
      if (dx > 0 && direction !== 'left') {
        setNextDirection('right');
      } else if (dx < 0 && direction !== 'right') {
        setNextDirection('left');
      }
    } else {
      // Vertical movement dominates
      if (dy > 0 && direction !== 'up') {
        setNextDirection('down');
      } else if (dy < 0 && direction !== 'down') {
        setNextDirection('up');
      }
    }
  }, [gameState, direction, setNextDirection, startGame]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Card className="flex-1 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-green-300 rounded-lg touch-none"
            style={{
              height: 'auto',
              maxWidth: '100%',
              // Add responsive minHeight overrides
            // minHeight: '40vh', // Taller on small screens
            }}
            onClick={handleTouch}
            onTouchStart={handleTouch}
          />
        </div>
      </CardContent>
    </Card>
  );
};
