
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Settings, Zap, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  isBonus?: boolean;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'slow' | 'small' | 'shield' | 'double';
  collected: boolean;
}

interface GameCustomization {
  birdColor: string;
  birdSize: number;
  pipeColor: string;
  backgroundTheme: string;
  gravity: number;
  jumpForce: number;
  pipeSpeed: number;
  enablePowerUps: boolean;
  difficulty: string;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBack, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    birdColor: '#FFD700',
    birdSize: 20,
    pipeColor: '#228B22',
    backgroundTheme: 'day',
    gravity: 0.5,
    jumpForce: -8,
    pipeSpeed: 2,
    enablePowerUps: true,
    difficulty: 'normal'
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const PIPE_WIDTH = 60;
  
  // Dynamic game parameters based on level and customization
  const getLevelParams = () => {
    const baseGap = 150;
    const difficultyMultiplier = {
      easy: 1.2,
      normal: 1.0,
      hard: 0.8,
      expert: 0.6
    }[customization.difficulty] || 1.0;
    
    return {
      PIPE_GAP: Math.max(100, baseGap - (level - 1) * 5) * difficultyMultiplier,
      GRAVITY: customization.gravity + (level - 1) * 0.05,
      JUMP_FORCE: customization.jumpForce - (level - 1) * 0.2,
      PIPE_SPEED: customization.pipeSpeed + (level - 1) * 0.2,
      BIRD_SIZE: customization.birdSize
    };
  };

  const backgroundThemes = {
    day: {
      sky: ['#87CEEB', '#98FB98'],
      clouds: 'rgba(255, 255, 255, 0.8)',
      ground: '#8FBC8F'
    },
    night: {
      sky: ['#191970', '#483D8B'],
      clouds: 'rgba(200, 200, 200, 0.6)',
      ground: '#2F4F4F'
    },
    sunset: {
      sky: ['#FF6347', '#FF1493'],
      clouds: 'rgba(255, 215, 0, 0.7)',
      ground: '#CD853F'
    },
    space: {
      sky: ['#000000', '#191970'],
      clouds: 'rgba(255, 255, 255, 0.3)',
      ground: '#2F2F2F'
    }
  };

  const birdColors = ['#FFD700', '#FF4500', '#32CD32', '#FF69B4', '#00CED1', '#9370DB'];
  const pipeColors = ['#228B22', '#8B4513', '#4682B4', '#B22222', '#DAA520', '#9932CC'];

  const initializeGame = useCallback(() => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([]);
    setPowerUps([]);
    setActivePowerUps([]);
    setScore(0);
    setLevel(1);
    setGameState('playing');
  }, []);

  const jump = useCallback(() => {
    const params = getLevelParams();
    if (gameState === 'playing') {
      const jumpMultiplier = activePowerUps.includes('small') ? 0.8 : 1;
      setBird(prev => ({ ...prev, velocity: params.JUMP_FORCE * jumpMultiplier }));
    } else if (gameState === 'menu' || gameState === 'gameOver') {
      initializeGame();
    }
  }, [gameState, activePowerUps, initializeGame]);

  const createPipe = useCallback((x: number): Pipe => {
    const params = getLevelParams();
    const topHeight = Math.random() * (CANVAS_HEIGHT - params.PIPE_GAP - 100) + 50;
    const isBonus = Math.random() < 0.1; // 10% chance for bonus pipe
    
    return {
      x,
      topHeight,
      bottomY: topHeight + params.PIPE_GAP,
      passed: false,
      isBonus
    };
  }, [level, customization]);

  const createPowerUp = useCallback((x: number, y: number): PowerUp => {
    const types: PowerUp['type'][] = ['slow', 'small', 'shield', 'double'];
    return {
      x,
      y,
      type: types[Math.floor(Math.random() * types.length)],
      collected: false
    };
  }, []);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const params = getLevelParams();
    const gravityMultiplier = activePowerUps.includes('slow') ? 0.5 : 1;

    setBird(prev => {
      let newY = prev.y + prev.velocity;
      let newVelocity = prev.velocity + params.GRAVITY * gravityMultiplier;

      // Ground and ceiling collision (unless shielded)
      if (!activePowerUps.includes('shield')) {
        if (newY <= 0 || newY >= CANVAS_HEIGHT - params.BIRD_SIZE) {
          setGameState('gameOver');
          return prev;
        }
      } else {
        // Bounce off boundaries when shielded
        if (newY <= 0) {
          newY = 0;
          newVelocity = Math.abs(newVelocity) * 0.5;
        }
        if (newY >= CANVAS_HEIGHT - params.BIRD_SIZE) {
          newY = CANVAS_HEIGHT - params.BIRD_SIZE;
          newVelocity = -Math.abs(newVelocity) * 0.5;
        }
      }

      return { ...prev, y: newY, velocity: newVelocity };
    });

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - params.PIPE_SPEED }));
      
      // Remove off-screen pipes
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
      
      // Add new pipes
      const lastPipe = newPipes[newPipes.length - 1];
      if (!lastPipe || lastPipe.x < CANVAS_WIDTH - 300) {
        newPipes.push(createPipe(CANVAS_WIDTH));
      }

      // Check scoring and level progression
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          const scoreIncrease = pipe.isBonus ? 3 : 1;
          const finalScore = activePowerUps.includes('double') ? scoreIncrease * 2 : scoreIncrease;
          
          setScore(prev => prev + finalScore);
          
          // Level up every 10 points
          if ((score + finalScore) % 10 === 0) {
            setLevel(prev => prev + 1);
          }
        }
      });

      // Collision detection (unless shielded)
      if (!activePowerUps.includes('shield')) {
        newPipes.forEach(pipe => {
          if (
            bird.x < pipe.x + PIPE_WIDTH &&
            bird.x + params.BIRD_SIZE > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + params.BIRD_SIZE > pipe.bottomY)
          ) {
            setGameState('gameOver');
          }
        });
      }

      return newPipes;
    });

    // Update power-ups
    if (customization.enablePowerUps) {
      setPowerUps(prev => {
        let newPowerUps = prev.map(powerUp => ({ ...powerUp, x: powerUp.x - params.PIPE_SPEED }));
        
        // Remove off-screen power-ups
        newPowerUps = newPowerUps.filter(powerUp => powerUp.x > -50 && !powerUp.collected);
        
        // Add new power-ups occasionally
        if (Math.random() < 0.002 && newPowerUps.length < 3) {
          newPowerUps.push(createPowerUp(CANVAS_WIDTH, Math.random() * (CANVAS_HEIGHT - 100) + 50));
        }

        // Check collection
        newPowerUps.forEach(powerUp => {
          if (!powerUp.collected &&
              bird.x < powerUp.x + 30 &&
              bird.x + params.BIRD_SIZE > powerUp.x &&
              bird.y < powerUp.y + 30 &&
              bird.y + params.BIRD_SIZE > powerUp.y) {
            powerUp.collected = true;
            setActivePowerUps(prev => [...prev, powerUp.type]);
            
            // Power-ups last for 5 seconds
            setTimeout(() => {
              setActivePowerUps(prev => prev.filter(p => p !== powerUp.type));
            }, 5000);
          }
        });

        return newPowerUps;
      });
    }
  }, [gameState, bird, score, level, activePowerUps, customization, createPipe, createPowerUp]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const params = getLevelParams();
    const theme = backgroundThemes[customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear canvas with themed background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, theme.sky[0]);
    gradient.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stars for space theme
    if (customization.backgroundTheme === 'space') {
      ctx.fillStyle = 'white';
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT * 0.7, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw clouds
    ctx.fillStyle = theme.clouds;
    for (let i = 0; i < 3; i++) {
      const x = 150 + i * 200;
      const y = 80 + i * 20;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 40, 0, Math.PI * 2);
      ctx.arc(x + 60, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    if (gameState !== 'menu') {
      // Draw pipes
      pipes.forEach(pipe => {
        const pipeColor = pipe.isBonus ? '#FFD700' : customization.pipeColor;
        ctx.fillStyle = pipeColor;
        
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
        
        // Pipe caps
        ctx.fillStyle = pipe.isBonus ? '#FFA500' : '#32CD32';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
        
        // Bonus pipe indicator
        if (pipe.isBonus) {
          ctx.fillStyle = '#FF6347';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('★', pipe.x + PIPE_WIDTH/2, pipe.topHeight + params.PIPE_GAP/2);
        }
      });

      // Draw power-ups
      if (customization.enablePowerUps) {
        powerUps.forEach(powerUp => {
          if (!powerUp.collected) {
            const icons = {
              slow: '🐌',
              small: '🔽',
              shield: '🛡️',
              double: '2️⃣'
            };
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(powerUp.x, powerUp.y, 30, 30);
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(icons[powerUp.type], powerUp.x + 15, powerUp.y + 22);
          }
        });
      }

      // Draw bird with customization
      ctx.fillStyle = customization.birdColor;
      const birdSize = activePowerUps.includes('small') ? params.BIRD_SIZE * 0.7 : params.BIRD_SIZE;
      
      // Shield effect
      if (activePowerUps.includes('shield')) {
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bird.x + birdSize/2, bird.y + birdSize/2, birdSize/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Bird body
      ctx.beginPath();
      ctx.arc(bird.x + birdSize/2, bird.y + birdSize/2, birdSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bird.x + birdSize/2 + 5, bird.y + birdSize/2 - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird beak
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.moveTo(bird.x + birdSize, bird.y + birdSize/2);
      ctx.lineTo(bird.x + birdSize + 8, bird.y + birdSize/2 - 2);
      ctx.lineTo(bird.x + birdSize + 8, bird.y + birdSize/2 + 2);
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
      ctx.fillText('Enhanced Flappy Bird', CANVAS_WIDTH/2, 200);
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click or Press Space to Start', CANVAS_WIDTH/2, 280);
      ctx.font = '18px Arial';
      ctx.fillText('Customize your experience in the settings!', CANVAS_WIDTH/2, 320);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 200);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, 250);
      ctx.fillText(`Level Reached: ${level}`, CANVAS_WIDTH/2, 280);
      ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH/2, 310);
      ctx.fillText('Click to Play Again', CANVAS_WIDTH/2, 350);
    }

    // Draw active game UI
    if (gameState === 'playing' || gameState === 'paused') {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Level: ${level}`, 20, 75);
      
      // Active power-ups display
      if (activePowerUps.length > 0) {
        ctx.font = '16px Arial';
        ctx.fillText('Power-ups:', 20, 110);
        activePowerUps.forEach((powerUp, index) => {
          const names = { slow: 'Slow Motion', small: 'Small Bird', shield: 'Shield', double: 'Double Points' };
          ctx.fillText(`• ${names[powerUp as keyof typeof names]}`, 20, 130 + index * 20);
        });
      }
    }
  }, [gameState, bird, pipes, powerUps, score, level, highScore, activePowerUps, customization]);

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
          <h1 className="text-3xl font-bold text-blue-800">🐦 Enhanced Flappy Bird</h1>
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
                  className="border-4 border-blue-300 rounded-lg cursor-pointer"
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
                      <Star className="h-4 w-4 mr-1" />
                      Level: {level}
                    </Badge>
                  </div>
                  <div className="text-center col-span-2">
                    <Badge variant="secondary" className="text-lg p-2 w-full">
                      <Trophy className="h-4 w-4 mr-1" />
                      Best: {highScore}
                    </Badge>
                  </div>
                </div>

                {activePowerUps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Active Power-ups:</h4>
                    <div className="space-y-1">
                      {activePowerUps.map((powerUp, index) => {
                        const names = {
                          slow: 'Slow Motion',
                          small: 'Small Bird',
                          shield: 'Shield',
                          double: 'Double Points'
                        };
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {names[powerUp as keyof typeof names]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                  <Button onClick={initializeGame} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Level Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">Current Level: <Badge>{level}</Badge></div>
                  <div className="text-sm">Next Level: {10 - (score % 10)} points</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(score % 10) * 10}%` }}
                    />
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
                  <li>• Click or press SPACE to make the bird jump</li>
                  <li>• Avoid hitting pipes or ground</li>
                  <li>• Golden pipes give bonus points</li>
                  <li>• Collect power-ups for special abilities</li>
                  <li>• Level up every 10 points</li>
                  <li>• Press P to pause during gameplay</li>
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
              <h2 className="text-xl font-bold">Customize Flappy Bird</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bird Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {birdColors.map(color => (
                      <button
                        key={color}
                        className={`w-full h-8 rounded border-2 ${customization.birdColor === color ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomization(prev => ({ ...prev, birdColor: color }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pipe Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {pipeColors.map(color => (
                      <button
                        key={color}
                        className={`w-full h-8 rounded border-2 ${customization.pipeColor === color ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomization(prev => ({ ...prev, pipeColor: color }))}
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
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={customization.difficulty} onValueChange={(value) => setCustomization(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Bird Size: {customization.birdSize}px</label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    value={customization.birdSize}
                    onChange={(e) => setCustomization(prev => ({ ...prev, birdSize: parseInt(e.target.value) }))}
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="powerups"
                    checked={customization.enablePowerUps}
                    onChange={(e) => setCustomization(prev => ({ ...prev, enablePowerUps: e.target.checked }))}
                  />
                  <label htmlFor="powerups" className="text-sm font-medium">Enable Power-ups</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
