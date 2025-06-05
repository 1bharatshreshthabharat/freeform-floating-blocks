
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';

interface FlappyGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const BIRD_SIZE = 20;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_SPEED = 2;

  const initializeGame = useCallback(() => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameState('playing');
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    } else if (gameState === 'menu' || gameState === 'gameOver') {
      initializeGame();
    }
  }, [gameState, initializeGame]);

  const createPipe = useCallback((x: number): Pipe => {
    const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false
    };
  }, []);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    setBird(prev => {
      let newY = prev.y + prev.velocity;
      let newVelocity = prev.velocity + GRAVITY;

      // Ground and ceiling collision
      if (newY <= 0 || newY >= CANVAS_HEIGHT - BIRD_SIZE) {
        setGameState('gameOver');
        return prev;
      }

      return { ...prev, y: newY, velocity: newVelocity };
    });

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      
      // Remove pipes that have gone off screen
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
      
      // Add new pipe if needed
      const lastPipe = newPipes[newPipes.length - 1];
      if (!lastPipe || lastPipe.x < CANVAS_WIDTH - 300) {
        newPipes.push(createPipe(CANVAS_WIDTH));
      }

      // Check for scoring
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      // Check for collisions
      newPipes.forEach(pipe => {
        if (
          bird.x < pipe.x + PIPE_WIDTH &&
          bird.x + BIRD_SIZE > pipe.x &&
          (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY)
        ) {
          setGameState('gameOver');
        }
      });

      return newPipes;
    });
  }, [gameState, bird, createPipe]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(150, 80, 30, 0, Math.PI * 2);
    ctx.arc(180, 80, 40, 0, Math.PI * 2);
    ctx.arc(210, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(500, 120, 25, 0, Math.PI * 2);
    ctx.arc(525, 120, 35, 0, Math.PI * 2);
    ctx.arc(550, 120, 25, 0, Math.PI * 2);
    ctx.fill();

    if (gameState !== 'menu') {
      // Draw pipes
      ctx.fillStyle = '#228B22';
      pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
        
        // Pipe caps
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
        ctx.fillStyle = '#228B22';
      });

      // Draw bird
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(bird.x + BIRD_SIZE/2, bird.y + BIRD_SIZE/2, BIRD_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bird.x + BIRD_SIZE/2 + 5, bird.y + BIRD_SIZE/2 - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird beak
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.moveTo(bird.x + BIRD_SIZE, bird.y + BIRD_SIZE/2);
      ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE/2 - 2);
      ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE/2 + 2);
      ctx.closePath();
      ctx.fill();
    }

    // Draw UI text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    if (gameState === 'menu') {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Flappy Bird', CANVAS_WIDTH/2, 200);
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click or Press Space to Start', CANVAS_WIDTH/2, 280);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 200);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, 250);
      ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH/2, 280);
      ctx.fillText('Click to Play Again', CANVAS_WIDTH/2, 320);
    }

    // Draw score during gameplay
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 50);
    }
  }, [gameState, bird, pipes, score, highScore]);

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

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameState]);

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-blue-800">🐦 Flappy Bird</h1>
          <div className="flex space-x-2">
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
                  className="border-4 border-blue-300 rounded-lg cursor-pointer bg-gradient-to-b from-blue-200 to-green-200"
                  onClick={jump}
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
                      <Trophy className="h-4 w-4 mr-1" />
                      Best: {highScore}
                    </Badge>
                  </div>
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
                  <Button onClick={() => { initializeGame(); }} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Click or press SPACE to make the bird jump</li>
                  <li>• Avoid hitting the pipes or ground</li>
                  <li>• Each pipe you pass gives you 1 point</li>
                  <li>• Press P to pause during gameplay</li>
                  <li>• Try to beat your high score!</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips & Tricks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Tap rhythmically for better control</li>
                  <li>• Don't tap too rapidly</li>
                  <li>• Focus on the next pipe opening</li>
                  <li>• Stay calm and be patient</li>
                  <li>• Practice makes perfect!</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
