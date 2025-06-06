
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Settings, Zap, Star, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlappyGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  type: string;
  animation: number;
  state: 'flying' | 'flapping' | 'hurt' | 'dead';
  expression: 'normal' | 'happy' | 'scared' | 'dizzy';
}

interface Obstacle {
  x: number;
  topHeight?: number;
  bottomY?: number;
  type: 'pipe' | 'spike' | 'laser' | 'moving-wall';
  passed: boolean;
  isBonus?: boolean;
  moving?: boolean;
  direction?: number;
  width: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface GameCustomization {
  birdType: string;
  birdColor: string;
  pipeTheme: string;
  backgroundTheme: string;
  difficulty: 'beginner' | 'medium' | 'expert';
  gravity: number;
  jumpForce: number;
  pipeSpeed: number;
  enableParticles: boolean;
  enableAnimations: boolean;
  weatherEffect: string;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bird, setBird] = useState<Bird>({ 
    x: 100, 
    y: 250, 
    velocity: 0, 
    rotation: 0, 
    type: 'classic',
    animation: 0,
    state: 'flying',
    expression: 'normal'
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [difficulty, setDifficulty] = useState<'beginner' | 'medium' | 'expert'>('medium');

  const [customization, setCustomization] = useState<GameCustomization>({
    birdType: 'classic',
    birdColor: '#FFD700',
    pipeTheme: 'classic',
    backgroundTheme: 'day',
    difficulty: 'medium',
    gravity: 0.5,
    jumpForce: -8,
    pipeSpeed: 2,
    enableParticles: true,
    enableAnimations: true,
    weatherEffect: 'none'
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  
  const birdTypes = {
    classic: { 
      idle: '🐦', 
      flap: '🕊️', 
      hurt: '😵‍💫', 
      expressions: { normal: '🐦', happy: '😊', scared: '😨', dizzy: '😵‍💫' }
    },
    eagle: { 
      idle: '🦅', 
      flap: '🦆', 
      hurt: '💀', 
      expressions: { normal: '🦅', happy: '😎', scared: '😰', dizzy: '💀' }
    },
    parrot: { 
      idle: '🦜', 
      flap: '🐥', 
      hurt: '😖', 
      expressions: { normal: '🦜', happy: '😄', scared: '😱', dizzy: '😖' }
    },
    owl: { 
      idle: '🦉', 
      flap: '🕊️', 
      hurt: '😴', 
      expressions: { normal: '🦉', happy: '🤓', scared: '😧', dizzy: '😴' }
    },
    peacock: { 
      idle: '🦚', 
      flap: '🪶', 
      hurt: '😵', 
      expressions: { normal: '🦚', happy: '💅', scared: '😲', dizzy: '😵' }
    },
    phoenix: { 
      idle: '🔥', 
      flap: '⚡', 
      hurt: '💫', 
      expressions: { normal: '🔥', happy: '✨', scared: '🌪️', dizzy: '💫' }
    }
  };

  const backgroundThemes = {
    day: {
      sky: ['#87CEEB', '#98FB98'],
      clouds: 'rgba(255, 255, 255, 0.8)',
      ground: '#8FBC8F',
      buildings: '#D3D3D3',
      stars: false,
      bubbles: false
    },
    sunset: {
      sky: ['#FF6B6B', '#FFA500'],
      clouds: 'rgba(255, 215, 0, 0.7)',
      ground: '#CD853F',
      buildings: '#8B4513',
      stars: false,
      bubbles: false
    },
    night: {
      sky: ['#191970', '#483D8B'],
      clouds: 'rgba(200, 200, 200, 0.6)',
      ground: '#2F4F4F',
      buildings: '#1C1C1C',
      stars: true,
      bubbles: false
    },
    space: {
      sky: ['#000000', '#191970'],
      clouds: 'rgba(255, 255, 255, 0.3)',
      ground: '#2F2F2F',
      buildings: '#4B0082',
      stars: true,
      nebula: true,
      bubbles: false
    },
    underwater: {
      sky: ['#006994', '#4682B4'],
      clouds: 'rgba(100, 200, 255, 0.5)',
      ground: '#4682B4',
      buildings: '#5F9EA0',
      bubbles: true,
      stars: false
    }
  };

  const getDifficultyParams = () => {
    const difficultyMultiplier = {
      beginner: { gap: 1.4, speed: 0.7, obstacles: 0.8 },
      medium: { gap: 1.0, speed: 1.0, obstacles: 1.0 },
      expert: { gap: 0.7, speed: 1.3, obstacles: 1.2 }
    }[difficulty];
    
    return {
      OBSTACLE_GAP: Math.max(120, 180 - (level - 1) * 3) * difficultyMultiplier.gap,
      GRAVITY: customization.gravity + (level - 1) * 0.02,
      JUMP_FORCE: customization.jumpForce - (level - 1) * 0.1,
      OBSTACLE_SPEED: customization.pipeSpeed * difficultyMultiplier.speed + (level - 1) * 0.1,
      OBSTACLE_FREQUENCY: 0.02 * difficultyMultiplier.obstacles
    };
  };

  const createObstacle = useCallback((x: number): Obstacle => {
    const params = getDifficultyParams();
    const obstacleTypes = ['pipe', 'spike', 'laser', 'moving-wall'];
    const type = obstacleTypes[Math.floor(Math.random() * (Math.min(2 + level, obstacleTypes.length)))] as any;
    
    const isBonus = Math.random() < 0.1;
    
    switch (type) {
      case 'pipe':
        const topHeight = Math.random() * (CANVAS_HEIGHT - params.OBSTACLE_GAP - 100) + 50;
        return {
          x,
          topHeight,
          bottomY: topHeight + params.OBSTACLE_GAP,
          type: 'pipe',
          passed: false,
          isBonus,
          width: 60
        };
      case 'spike':
        return {
          x,
          topHeight: Math.random() * 150 + 50,
          bottomY: CANVAS_HEIGHT - (Math.random() * 150 + 50),
          type: 'spike',
          passed: false,
          isBonus,
          width: 40
        };
      case 'laser':
        return {
          x,
          topHeight: Math.random() * 200 + 100,
          bottomY: Math.random() * 200 + 200,
          type: 'laser',
          passed: false,
          isBonus,
          width: 20
        };
      case 'moving-wall':
        return {
          x,
          topHeight: 100,
          bottomY: CANVAS_HEIGHT - 100,
          type: 'moving-wall',
          passed: false,
          isBonus,
          width: 80,
          moving: true,
          direction: Math.random() > 0.5 ? 1 : -1
        };
      default:
        return createObstacle(x);
    }
  }, [level, difficulty, customization]);

  const jump = useCallback(() => {
    if (gameState === 'menu' || gameState === 'gameOver') {
      initializeGame();
    } else if (gameState === 'playing') {
      setBird(prev => ({ 
        ...prev, 
        velocity: getDifficultyParams().JUMP_FORCE,
        state: 'flapping',
        expression: 'happy'
      }));
    }
  }, [gameState]);

  const initializeGame = useCallback(() => {
    setBird({ 
      x: 100, 
      y: 250, 
      velocity: 0, 
      rotation: 0, 
      type: customization.birdType,
      animation: 0,
      state: 'flying',
      expression: 'normal'
    });
    setObstacles([]);
    setParticles([]);
    setScore(0);
    setLevel(1);
    setGameState('playing');
    
    // Add initial obstacles
    const initialObstacles = [];
    for (let i = 1; i <= 3; i++) {
      initialObstacles.push(createObstacle(CANVAS_WIDTH + i * 250));
    }
    setObstacles(initialObstacles);
  }, [customization.birdType, createObstacle]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const params = getDifficultyParams();

    setBird(prev => {
      let newY = prev.y + prev.velocity;
      let newVelocity = prev.velocity + params.GRAVITY;
      let newRotation = Math.max(-0.5, Math.min(0.5, prev.velocity * 0.1));
      let newAnimation = (prev.animation + 1) % 30;
      let newState = prev.state;
      let newExpression = prev.expression;

      // Update bird state and expression based on velocity and surroundings
      if (prev.velocity < -2) {
        newState = 'flapping';
        newExpression = 'happy';
      } else if (prev.velocity > 4) {
        newState = 'flying';
        newExpression = 'scared';
      } else {
        newExpression = 'normal';
      }

      // Ground and ceiling collision
      if (newY <= 0 || newY >= CANVAS_HEIGHT - 30) {
        setGameState('gameOver');
        newState = 'hurt';
        newExpression = 'dizzy';
        return prev;
      }

      return { 
        ...prev, 
        y: newY, 
        velocity: newVelocity, 
        rotation: newRotation,
        animation: newAnimation,
        state: newState,
        expression: newExpression
      };
    });

    // Update obstacles with advanced movement
    setObstacles(prev => {
      let newObstacles = prev.map(obstacle => {
        const newObstacle = { ...obstacle, x: obstacle.x - params.OBSTACLE_SPEED };
        
        // Moving walls
        if (obstacle.type === 'moving-wall' && obstacle.moving) {
          if (obstacle.topHeight! <= 50 || obstacle.topHeight! >= CANVAS_HEIGHT - 150) {
            newObstacle.direction = -obstacle.direction!;
          }
          newObstacle.topHeight = obstacle.topHeight! + obstacle.direction! * 2;
          newObstacle.bottomY = newObstacle.topHeight + 100;
        }
        
        return newObstacle;
      });
      
      // Remove off-screen obstacles
      newObstacles = newObstacles.filter(obstacle => obstacle.x > -obstacle.width);
      
      // Add new obstacles
      const lastObstacle = newObstacles[newObstacles.length - 1];
      if (!lastObstacle || lastObstacle.x < CANVAS_WIDTH - 250) {
        newObstacles.push(createObstacle(CANVAS_WIDTH));
      }

      // Check scoring and collisions
      newObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + obstacle.width < bird.x) {
          obstacle.passed = true;
          const scoreIncrease = obstacle.isBonus ? 5 : 1;
          setScore(prev => prev + scoreIncrease);
          
          // Level up every 15 points
          if ((score + scoreIncrease) % 15 === 0) {
            setLevel(prev => prev + 1);
          }
        }

        // Enhanced collision detection for different obstacle types
        if (
          bird.x < obstacle.x + obstacle.width &&
          bird.x + 30 > obstacle.x
        ) {
          let collision = false;
          
          switch (obstacle.type) {
            case 'pipe':
              collision = bird.y < obstacle.topHeight! || bird.y + 30 > obstacle.bottomY!;
              break;
            case 'spike':
              collision = bird.y < obstacle.topHeight! || bird.y + 30 > obstacle.bottomY!;
              break;
            case 'laser':
              collision = bird.y > obstacle.topHeight! && bird.y < obstacle.bottomY!;
              break;
            case 'moving-wall':
              collision = bird.y < obstacle.topHeight! || bird.y + 30 > obstacle.bottomY!;
              break;
          }
          
          if (collision) {
            setGameState('gameOver');
            setBird(prev => ({ ...prev, state: 'hurt', expression: 'dizzy' }));
          }
        }
      });

      return newObstacles;
    });

    // Update particles
    if (customization.enableParticles) {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0)
      );
    }
  }, [gameState, bird, score, level, customization, createObstacle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Enhanced background with animations
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, theme.sky[0]);
    gradient.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Advanced background effects
    if (theme.stars) {
      ctx.fillStyle = 'white';
      for (let i = 0; i < 150; i++) {
        const x = (Date.now() * 0.001 * 10 + i * 50) % CANVAS_WIDTH;
        const y = (i * 37) % CANVAS_HEIGHT;
        const twinkle = Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalAlpha = 1;
    }

    if (theme.bubbles) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 20; i++) {
        const x = (Date.now() * 0.02 + i * 40) % CANVAS_WIDTH;
        const y = CANVAS_HEIGHT - ((Date.now() * 0.03 + i * 60) % (CANVAS_HEIGHT + 50));
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(Date.now() * 0.01 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Weather effects
    if (customization.weatherEffect === 'rain') {
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 100; i++) {
        const x = (Date.now() * 0.5 + i * 10) % CANVAS_WIDTH;
        const y = (Date.now() * 0.8 + i * 15) % CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 15);
        ctx.stroke();
      }
    }

    if (gameState !== 'menu') {
      // Draw advanced obstacles
      obstacles.forEach(obstacle => {
        ctx.save();
        
        switch (obstacle.type) {
          case 'pipe':
            const pipeColor = obstacle.isBonus ? '#FFD700' : '#228B22';
            ctx.fillStyle = pipeColor;
            ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight!);
            ctx.fillRect(obstacle.x, obstacle.bottomY!, obstacle.width, CANVAS_HEIGHT - obstacle.bottomY!);
            break;
            
          case 'spike':
            ctx.fillStyle = '#FF4444';
            // Draw spikes
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.topHeight!);
            ctx.lineTo(obstacle.x + obstacle.width/2, 0);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.topHeight!);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.bottomY!);
            ctx.lineTo(obstacle.x + obstacle.width/2, CANVAS_HEIGHT);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.bottomY!);
            ctx.closePath();
            ctx.fill();
            break;
            
          case 'laser':
            const gradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + obstacle.width, 0);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 100, 1)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(obstacle.x, obstacle.topHeight!, obstacle.width, obstacle.bottomY! - obstacle.topHeight!);
            
            // Laser glow effect
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 20;
            ctx.fillRect(obstacle.x, obstacle.topHeight!, obstacle.width, obstacle.bottomY! - obstacle.topHeight!);
            ctx.shadowBlur = 0;
            break;
            
          case 'moving-wall':
            ctx.fillStyle = '#666666';
            ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight!);
            ctx.fillRect(obstacle.x, obstacle.bottomY!, obstacle.width, CANVAS_HEIGHT - obstacle.bottomY!);
            
            // Movement indicator
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(obstacle.x + 5, obstacle.topHeight! - 10, obstacle.width - 10, 10);
            ctx.fillRect(obstacle.x + 5, obstacle.bottomY!, obstacle.width - 10, 10);
            break;
        }
        
        ctx.restore();
      });

      // Enhanced bird rendering with expressions
      ctx.save();
      ctx.translate(bird.x + 15, bird.y + 15);
      if (customization.enableAnimations) {
        ctx.rotate(bird.rotation);
      }
      
      ctx.translate(-15, -15);
      
      // Get bird appearance with expression
      const birdInfo = birdTypes[bird.type as keyof typeof birdTypes];
      let birdSymbol = birdInfo.expressions[bird.expression];
      
      if (bird.state === 'flapping' && bird.animation < 15) {
        birdSymbol = birdInfo.flap;
      }
      
      // Wing flapping effect
      if (bird.state === 'flapping' && customization.enableAnimations) {
        ctx.shadowColor = customization.birdColor;
        ctx.shadowBlur = 10;
        const wingOffset = Math.sin(bird.animation * 0.5) * 5;
        ctx.translate(0, wingOffset);
      }
      
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(birdSymbol, 15, 25);
      
      ctx.restore();
    }

    // Enhanced UI
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    if (gameState === 'menu') {
      ctx.save();
      const titleY = 180 + Math.sin(Date.now() * 0.003) * 5;
      ctx.fillStyle = '#333';
      ctx.font = 'bold 52px Arial';
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.strokeText('Enhanced Flappy Bird', CANVAS_WIDTH/2, titleY);
      ctx.fillText('Enhanced Flappy Bird', CANVAS_WIDTH/2, titleY);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#555';
      ctx.fillText('Click or Press Space to Start', CANVAS_WIDTH/2, 250);
      ctx.restore();
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 180);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, 220);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH/2, 250);
      ctx.fillText('Click to Fly Again', CANVAS_WIDTH/2, 290);
    }

    // Game UI
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Level: ${level}`, 20, 75);
      ctx.restore();
    }
  }, [gameState, bird, obstacles, particles, score, level, highScore, customization]);

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
        onStatsUpdate((prev: any) => ({ ...prev, totalScore: Math.max(prev.totalScore, score) }));
      }
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [gameState, score, highScore, onStatsUpdate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      } else if (e.code === 'KeyP' && gameState === 'playing') {
        setGameState('paused');
      } else if (e.code === 'KeyP' && gameState === 'paused') {
        setGameState('playing');
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouch);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [jump, gameState]);

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-blue-800">🐦 Enhanced Flappy Bird</h1>
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
                  className="border-4 border-blue-300 rounded-lg cursor-pointer"
                  onClick={jump}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    jump();
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Simplified Game Controls */}
          <div className="lg:w-80 space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-600" />
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
                
                <div className="text-center">
                  <Badge variant="secondary" className="p-2 w-full">
                    <Trophy className="h-4 w-4 mr-1" />
                    Best: {highScore}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
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

                <div className="space-y-2">
                  {gameState === 'playing' && (
                    <Button onClick={togglePause} className="w-full" variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {gameState === 'paused' && (
                    <Button onClick={togglePause} className="w-full">
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
                <CardTitle className="text-sm">Bird Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline">{customization.birdType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>State:</span>
                    <Badge variant="secondary">{bird.state}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Expression:</span>
                    <span>{birdTypes[bird.type as keyof typeof birdTypes]?.expressions[bird.expression]}</span>
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
              <h2 className="text-xl font-bold">How to Play Flappy Bird</h2>
              <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Controls</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click, tap, or press SPACE to make the bird fly</li>
                  <li>• Press P to pause/resume during gameplay</li>
                  <li>• Touch controls work on mobile devices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Gameplay</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Avoid hitting obstacles or ground</li>
                  <li>• Golden obstacles give bonus points</li>
                  <li>• Each level increases difficulty and new obstacles</li>
                  <li>• Collect 15 points to advance to next level</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Obstacles</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• 🟢 Pipes: Classic vertical barriers</li>
                  <li>• 🔺 Spikes: Sharp triangular obstacles</li>
                  <li>• 🔴 Lasers: Horizontal energy beams</li>
                  <li>• ⬜ Moving Walls: Dynamic barriers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bird Expressions</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• 😊 Happy: When flying upward</li>
                  <li>• 😨 Scared: When falling fast</li>
                  <li>• 😵‍💫 Dizzy: When crashed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Flappy Bird</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bird Type</label>
                  <Select value={customization.birdType} onValueChange={(value) => setCustomization(prev => ({ ...prev, birdType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic Bird 🐦</SelectItem>
                      <SelectItem value="eagle">Eagle 🦅</SelectItem>
                      <SelectItem value="parrot">Parrot 🦜</SelectItem>
                      <SelectItem value="owl">Owl 🦉</SelectItem>
                      <SelectItem value="peacock">Peacock 🦚</SelectItem>
                      <SelectItem value="phoenix">Phoenix 🔥</SelectItem>
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
                      <SelectItem value="day">Sunny Day</SelectItem>
                      <SelectItem value="sunset">Beautiful Sunset</SelectItem>
                      <SelectItem value="night">Starry Night</SelectItem>
                      <SelectItem value="space">Deep Space</SelectItem>
                      <SelectItem value="underwater">Underwater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pipe Theme</label>
                  <Select value={customization.pipeTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, pipeTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic Green</SelectItem>
                      <SelectItem value="metal">Metallic</SelectItem>
                      <SelectItem value="bamboo">Bamboo</SelectItem>
                      <SelectItem value="crystal">Crystal</SelectItem>
                      <SelectItem value="lava">Lava</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Weather Effect</label>
                  <Select value={customization.weatherEffect} onValueChange={(value) => setCustomization(prev => ({ ...prev, weatherEffect: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="rain">Rain</SelectItem>
                      <SelectItem value="snow">Snow</SelectItem>
                      <SelectItem value="wind">Wind</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
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
                  <label className="text-sm font-medium mb-2 block">Game Speed: {customization.pipeSpeed}x</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={customization.pipeSpeed}
                    onChange={(e) => setCustomization(prev => ({ ...prev, pipeSpeed: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Gravity: {customization.gravity}</label>
                  <input
                    type="range"
                    min="0.3"
                    max="0.8"
                    step="0.1"
                    value={customization.gravity}
                    onChange={(e) => setCustomization(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
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
                      id="animations"
                      checked={customization.enableAnimations}
                      onChange={(e) => setCustomization(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                    />
                    <label htmlFor="animations" className="text-sm font-medium">Enable Animations</label>
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
