
import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFlappyGame } from './FlappyGameProvider';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const birdTypes = {
  classic: { body: '🐦', wing: '🪶', color: '#FFD700' },
  eagle: { body: '🦅', wing: '🪶', color: '#8B4513' },
  duck: { body: '🦆', wing: '🪶', color: '#32CD32' },
  robin: { body: '🐦', wing: '🪶', color: '#FF6B6B' },
  parrot: { body: '🦜', wing: '🪶', color: '#00CED1' }
};

const backgroundThemes = {
  day: { sky: '#87CEEB', ground: '#DEB887', clouds: '#FFFFFF' },
  sunset: { sky: '#FF6B35', ground: '#8B4513', clouds: '#FFE4B5' },
  night: { sky: '#191970', ground: '#2F4F4F', clouds: '#D3D3D3' },
  space: { sky: '#000000', ground: '#696969', clouds: '#C0C0C0' },
  underwater: { sky: '#006994', ground: '#8FBC8F', clouds: '#20B2AA' }
};

export const FlappyCanvas: React.FC = () => {
  const { 
    gameState,
    bird,
    obstacles,
    particles,
    score,
    level,
    customization,
    canvasRef,
    gameLoopRef,
    setBird,
    setObstacles,
    setParticles,
    setScore,
    setLevel,
    setLives,
    setGameState,
    flap,
    onStatsUpdate
  } = useFlappyGame();

  // Create local refs for animation frame
  const animationFrameRef = useRef<number | null>(null);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 5) => {
    if (!customization.enableParticles) return;
    
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        color,
        size: Math.random() * 3 + 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, [customization.enableParticles, setParticles]);

  const spawnObstacle = useCallback(() => {
    const difficultyIndex = customization.difficulty === 'easy' ? 0 : customization.difficulty === 'medium' ? 1 : 2;
    
    // Different types of obstacles based on difficulty
    let types: ('pipe' | 'laser' | 'spike' | 'moving' | 'swinging' | 'paired')[] = ['pipe'];
    
    if (difficultyIndex >= 1) {
      types.push('laser', 'spike');
    }
    if (difficultyIndex >= 2) {
      types.push('moving', 'swinging', 'paired');
    }
    
    const type = types[Math.floor(Math.random() * types.length)] as any;
    
    // Gap size decreases with difficulty
    const gapSize = customization.difficulty === 'easy' ? 220 : customization.difficulty === 'medium' ? 180 : 140;
    
    // Ensure gap is playable - never place obstacles that overlap or make passage impossible
    const minTopHeight = 50;
    const maxTopHeight = CANVAS_HEIGHT - gapSize - 50;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    
    const newObstacle = {
      x: CANVAS_WIDTH,
      topHeight,
      bottomHeight: CANVAS_HEIGHT - topHeight - gapSize,
      passed: false,
      type,
      width: type === 'laser' ? 10 : type === 'spike' ? 40 : type === 'paired' ? 100 : 80,
      color: type === 'laser' ? '#FF0000' : type === 'spike' ? '#8B0000' : type === 'swinging' ? '#9400D3' : '#228B22',
      velocity: (type === 'moving' || type === 'swinging') ? Math.sin(Date.now() * 0.01) * 2 : 0,
      swingPhase: Math.random() * Math.PI * 2
    };
    
    setObstacles(prev => [...prev, newObstacle]);
  }, [customization.difficulty, setObstacles]);

  const checkCollision = useCallback((birdObj: any, obstacleObj: any) => {
    const birdSize = customization.birdSize;
    const birdHitbox = {
      x: 100,
      y: birdObj.y,
      width: birdSize * 0.8,
      height: birdSize * 0.8
    };
    
    // Different hitbox calculations based on obstacle type
    if (obstacleObj.type === 'laser') {
      // Top laser beam
      const topLaser = {
        x: obstacleObj.x,
        y: 0,
        width: obstacleObj.width,
        height: obstacleObj.topHeight
      };
      
      // Bottom laser beam
      const bottomLaser = {
        x: obstacleObj.x,
        y: CANVAS_HEIGHT - obstacleObj.bottomHeight,
        width: obstacleObj.width,
        height: obstacleObj.bottomHeight
      };
      
      return (
        (birdHitbox.x + birdHitbox.width > topLaser.x &&
         birdHitbox.x < topLaser.x + topLaser.width &&
         birdHitbox.y + birdHitbox.height > topLaser.y &&
         birdHitbox.y < topLaser.y + topLaser.height) ||
        (birdHitbox.x + birdHitbox.width > bottomLaser.x &&
         birdHitbox.x < bottomLaser.x + bottomLaser.width &&
         birdHitbox.y + birdHitbox.height > bottomLaser.y &&
         birdHitbox.y < bottomLaser.y + bottomLaser.height)
      );
    } 
    else {
      // Top and bottom obstacles
      const topObstacle = {
        x: obstacleObj.x,
        y: 0,
        width: obstacleObj.width,
        height: obstacleObj.topHeight
      };
      
      const bottomObstacle = {
        x: obstacleObj.x,
        y: CANVAS_HEIGHT - obstacleObj.bottomHeight,
        width: obstacleObj.width,
        height: obstacleObj.bottomHeight
      };
      
      return (
        (birdHitbox.x + birdHitbox.width > topObstacle.x &&
         birdHitbox.x < topObstacle.x + topObstacle.width &&
         birdHitbox.y + birdHitbox.height > topObstacle.y &&
         birdHitbox.y < topObstacle.y + topObstacle.height) ||
        (birdHitbox.x + birdHitbox.width > bottomObstacle.x &&
         birdHitbox.x < bottomObstacle.x + bottomObstacle.width &&
         birdHitbox.y + birdHitbox.height > bottomObstacle.y &&
         birdHitbox.y < bottomObstacle.y + bottomObstacle.height)
      );
    }
  }, [customization.birdSize]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update bird
    setBird(prev => {
      const newBird = {
        ...prev,
        velocity: prev.velocity + customization.gravity,
        y: prev.y + prev.velocity,
        flapState: prev.isFlapping ? (prev.flapState + 1) % 10 : 0,
        isFlapping: prev.flapState < 5 ? prev.isFlapping : false
      };

      // Check boundaries
      if (newBird.y < 0 || newBird.y > CANVAS_HEIGHT - customization.birdSize) {
        setGameState('gameOver');
        onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
        createParticles(100, newBird.y, '#FF0000', 10);
        return newBird;
      }

      return newBird;
    });

    // Update obstacles
    setObstacles(prev => {
      const updatedObstacles = prev.map(obstacle => {
        // Different movement patterns based on obstacle type
        let updatedTopHeight = obstacle.topHeight;
        let updatedY = 0;
        
        if (obstacle.type === 'moving') {
          updatedTopHeight += Math.sin(Date.now() * 0.002) * 2;
        }
        else if (obstacle.type === 'swinging') {
          updatedY = Math.sin(Date.now() * 0.001 + obstacle.swingPhase) * 80;
          updatedTopHeight = obstacle.topHeight + updatedY;
        }
        
        return {
          ...obstacle,
          x: obstacle.x - 3,
          topHeight: updatedTopHeight
        };
      });

      // Check for collisions
      updatedObstacles.forEach(obstacle => {
        if (!obstacle.passed && checkCollision(bird, obstacle)) {
          setGameState('gameOver');
          onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
          createParticles(obstacle.x, CANVAS_HEIGHT / 2, '#FF0000', 15);
        }
      });

      // Check for scoring
      updatedObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + obstacle.width < 100) {
          obstacle.passed = true;
          setScore(current => {
            const newScore = current + 1;
            if (newScore % 10 === 0) {
              setLevel(prev => prev + 1);
            }
            return newScore;
          });
          createParticles(obstacle.x, CANVAS_HEIGHT / 2, '#FFD700', 8);
        }
      });

      // Remove off-screen obstacles
      return updatedObstacles.filter(obstacle => obstacle.x > -obstacle.width);
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

    // Spawn new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < CANVAS_WIDTH - customization.obstacleSpacing) {
      spawnObstacle();
    }
  }, [gameState, customization, obstacles.length, bird, setBird, setObstacles, setParticles, setScore, setLevel, setGameState, createParticles, spawnObstacle, onStatsUpdate, checkCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];
    const birdConfig = birdTypes[customization.birdType as keyof typeof birdTypes];

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, theme.sky);
    gradient.addColorStop(1, theme.ground);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    if (customization.backgroundTheme !== 'space') {
      ctx.fillStyle = theme.clouds;
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 5; i++) {
        const x = ((i * 200 + Date.now() * 0.01) % (CANVAS_WIDTH + 100)) - 50;
        ctx.beginPath();
        ctx.arc(x, 100 + i * 50, 30, 0, Math.PI * 2);
        ctx.arc(x + 25, 100 + i * 50, 35, 0, Math.PI * 2);
        ctx.arc(x + 50, 100 + i * 50, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Draw weather effects
    if (customization.enableWeather && customization.weatherType !== 'none') {
      ctx.fillStyle = customization.weatherType === 'rain' ? '#0066CC' : '#FFFFFF';
      for (let i = 0; i < 50; i++) {
        const x = (Math.random() * CANVAS_WIDTH + Date.now() * 0.1) % CANVAS_WIDTH;
        const y = (Math.random() * CANVAS_HEIGHT + Date.now() * 0.3) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 2, customization.weatherType === 'rain' ? 10 : 3);
      }
    }

    if (gameState !== 'menu') {
      // Draw obstacles
      obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        
        if (obstacle.type === 'laser') {
          ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
          ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight);
          
          // Laser glow effect
          ctx.shadowColor = obstacle.color;
          ctx.shadowBlur = 20;
          ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
          ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight);
          ctx.shadowBlur = 0;
        } 
        else if (obstacle.type === 'spike') {
          // Draw spikes
          const spikeCount = Math.floor(obstacle.topHeight / 20);
          for (let i = 0; i < spikeCount; i++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x, i * 20);
            ctx.lineTo(obstacle.x + obstacle.width / 2, i * 20 + 15);
            ctx.lineTo(obstacle.x + obstacle.width, i * 20);
            ctx.fill();
          }
          
          const bottomSpikeCount = Math.floor(obstacle.bottomHeight / 20);
          for (let i = 0; i < bottomSpikeCount; i++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x, CANVAS_HEIGHT - i * 20);
            ctx.lineTo(obstacle.x + obstacle.width / 2, CANVAS_HEIGHT - i * 20 - 15);
            ctx.lineTo(obstacle.x + obstacle.width, CANVAS_HEIGHT - i * 20);
            ctx.fill();
          }
        }
        else if (obstacle.type === 'paired') {
          // Double pipes close together
          ctx.fillRect(obstacle.x, 0, obstacle.width/2, obstacle.topHeight);
          ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width/2, obstacle.bottomHeight);
          
          ctx.fillRect(obstacle.x + obstacle.width/2 + 30, 0, obstacle.width/2, obstacle.topHeight - 40);
          ctx.fillRect(obstacle.x + obstacle.width/2 + 30, CANVAS_HEIGHT - obstacle.bottomHeight + 40, obstacle.width/2, obstacle.bottomHeight - 40);
          
          // Pipe caps
          ctx.fillRect(obstacle.x - 10, obstacle.topHeight - 20, obstacle.width/2 + 20, 20);
          ctx.fillRect(obstacle.x - 10, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width/2 + 20, 20);
          
          ctx.fillRect(obstacle.x + obstacle.width/2 + 20, obstacle.topHeight - 40 - 20, obstacle.width/2 + 20, 20);
          ctx.fillRect(obstacle.x + obstacle.width/2 + 20, CANVAS_HEIGHT - obstacle.bottomHeight + 40, obstacle.width/2 + 20, 20);
        }
        else if (obstacle.type === 'swinging') {
          // Swinging obstacles that move up and down
          const baseY = obstacle.topHeight - Math.sin(Date.now() * 0.001 + obstacle.swingPhase) * 80;
          
          ctx.fillRect(obstacle.x, 0, obstacle.width, baseY);
          ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight + Math.sin(Date.now() * 0.001 + obstacle.swingPhase) * 80, obstacle.width, obstacle.bottomHeight);
          
          // Obstacle caps
          ctx.fillRect(obstacle.x - 10, baseY - 20, obstacle.width + 20, 20);
          ctx.fillRect(obstacle.x - 10, CANVAS_HEIGHT - obstacle.bottomHeight + Math.sin(Date.now() * 0.001 + obstacle.swingPhase) * 80, obstacle.width + 20, 20);
        }
        else {
          // Regular pipes or moving pipes
          ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
          ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight);
          
          // Pipe caps
          ctx.fillRect(obstacle.x - 10, obstacle.topHeight - 20, obstacle.width + 20, 20);
          ctx.fillRect(obstacle.x - 10, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width + 20, 20);
        }
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw bird
      ctx.save();
      ctx.translate(100, bird.y);
      
      // Bird body
      ctx.font = `${customization.birdSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(birdConfig.body, 0, 0);
      
      // Wing flapping animation
      if (bird.isFlapping) {
        ctx.font = `${customization.birdSize * 0.8}px Arial`;
        ctx.fillText(birdConfig.wing, bird.flapState < 3 ? -8 : 8, -5);
      }
      
      ctx.restore();
    }

    // Draw UI
    if (gameState === 'menu') {
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText('Flappy Bird', CANVAS_WIDTH/2, 200);
      ctx.fillText('Flappy Bird', CANVAS_WIDTH/2, 200);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click, Space, or Touch to Start!', CANVAS_WIDTH/2, 250);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 250);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, 290);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH/2, 320);
      ctx.fillText('Click to Restart', CANVAS_WIDTH/2, 360);
    }

    // Score and level display
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeText(`Score: ${score}`, CANVAS_WIDTH/2, 50);
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, 50);
      
      ctx.font = 'bold 20px Arial';
      ctx.strokeText(`Level: ${level}`, CANVAS_WIDTH/2, 80);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH/2, 80);
    }
  }, [gameState, bird, obstacles, particles, score, level, customization, canvasRef]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    
    // Use local ref for animation frame
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

  // Event handlers
  const handleClick = useCallback(() => {
    flap();
  }, [flap]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      flap();
    }
  }, [flap]);

  const handleTouch = useCallback((e: TouchEvent) => {
    e.preventDefault();
    flap();
  }, [flap]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouch, { passive: false });
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [handleKeyPress, handleTouch]);

  return (
    <Card className="flex-1 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-blue-300 rounded-lg cursor-pointer touch-none"
            onClick={handleClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
