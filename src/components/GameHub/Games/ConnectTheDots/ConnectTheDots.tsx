import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

interface ConnectTheDotsProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Dot {
  id: number;
  label: string;
  x: number;
  y: number;
  connected: boolean;
}

interface ConnectLevel {
  level: number;
  dotCount: number;
  theme: string;
  emoji: string;
  completionImage: string;
  sequence: 'numbers' | 'alphabet' | 'animals' | 'objects' | 'odds' | 'evens';
  challengeType?: 'normal' | 'reverse' | 'skip' | 'mixed';
}

const ConnectTheDots: React.FC<ConnectTheDotsProps> = ({ onBack, onStatsUpdate })  => {
  const { toast } = useToast();
  const [gameMode] = useState<'kids'>('kids');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(true);
  const [dots, setDots] = useState<Dot[]>([]);
  const [connections, setConnections] = useState<{ from: number; to: number }[]>([]);
  const [currentDot, setCurrentDot] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [stars, setStars] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPath, setDragPath] = useState<{ x: number; y: number }[]>([]);
  const [revealProgress, setRevealProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const kidsLevels: ConnectLevel[] = [
    { level: 1, dotCount: 10, theme: 'Cat', emoji: '🐱', completionImage: '🐱', sequence: 'numbers' },
    { level: 2, dotCount: 15, theme: 'Dog', emoji: '🐶', completionImage: '🐶', sequence: 'alphabet' },
    { level: 3, dotCount: 12, theme: 'Fish', emoji: '🐠', completionImage: '🐠', sequence: 'animals' },
    { level: 4, dotCount: 10, theme: 'Car', emoji: '🚗', completionImage: '🚗', sequence: 'odds' },
    { level: 5, dotCount: 12, theme: 'House', emoji: '🏠', completionImage: '🏠', sequence: 'evens' },
    { level: 6, dotCount: 16, theme: 'Tree', emoji: '🌳', completionImage: '🌳', sequence: 'objects' },
    { level: 7, dotCount: 18, theme: 'Flower', emoji: '🌸', completionImage: '🌸', sequence: 'numbers', challengeType: 'reverse' },
    { level: 8, dotCount: 20, theme: 'Elephant', emoji: '🐘', completionImage: '🐘', sequence: 'animals' },
    { level: 9, dotCount: 15, theme: 'Butterfly', emoji: '🦋', completionImage: '🦋', sequence: 'alphabet', challengeType: 'skip' },
    { level: 10, dotCount: 14, theme: 'Lion', emoji: '🦁', completionImage: '🦁', sequence: 'animals' },
    { level: 11, dotCount: 16, theme: 'Octopus', emoji: '🐙', completionImage: '🐙', sequence: 'objects' },
    { level: 12, dotCount: 18, theme: 'Whale', emoji: '🐋', completionImage: '🐋', sequence: 'numbers', challengeType: 'mixed' },
    { level: 13, dotCount: 20, theme: 'Eagle', emoji: '🦅', completionImage: '🦅', sequence: 'alphabet' },
    { level: 14, dotCount: 22, theme: 'Shark', emoji: '🦈', completionImage: '🦈', sequence: 'evens' },
    { level: 15, dotCount: 25, theme: 'Robot', emoji: '🤖', completionImage: '🤖', sequence: 'objects', challengeType: 'mixed' },
    { level: 16, dotCount: 20, theme: 'Butterfly Garden', emoji: '🦋', completionImage: '🦋🌺', sequence: 'numbers' },
    { level: 17, dotCount: 22, theme: 'Rocket Ship', emoji: '🚀', completionImage: '🚀', sequence: 'alphabet' },
    { level: 18, dotCount: 24, theme: 'Castle', emoji: '🏰', completionImage: '🏰', sequence: 'objects' },
    { level: 19, dotCount: 26, theme: 'Dragon', emoji: '🐉', completionImage: '🐉', sequence: 'animals' },
    { level: 20, dotCount: 28, theme: 'Magic Wand', emoji: '🪄', completionImage: '🪄✨', sequence: 'numbers', challengeType: 'mixed' },
  ];

  const levels = kidsLevels;

  const generateSequence = (count: number, sequence: string, challengeType?: string) => {
    const labels: string[] = [];
    
    switch (sequence) {
      case 'numbers':
        if (challengeType === 'reverse') {
          for (let i = count; i >= 1; i--) labels.push(i.toString());
        } else if (challengeType === 'skip') {
          for (let i = 2; i <= count * 2; i += 2) labels.push(i.toString());
        } else {
          for (let i = 1; i <= count; i++) labels.push(i.toString());
        }
        break;
      case 'alphabet':
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (challengeType === 'skip') {
          for (let i = 0; i < count && i < 26; i += 2) labels.push(alphabet[i]);
        } else {
          for (let i = 0; i < count && i < 26; i++) labels.push(alphabet[i]);
        }
        break;
      case 'animals':
        const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🐠', '🐙', '🦈', '🐋', '🐬', '🦭', '🐢', '🐊', '🦎', '🐍'];
        for (let i = 0; i < count && i < animals.length; i++) labels.push(animals[i]);
        break;
      case 'objects':
        const objects = ['⚽', '🏀', '🎾', '🏐', '🏈', '⚾', '🎱', '🏓', '🏸', '🥅', '⛳', '🎯', '🎪', '🎨', '🎭', '🎰', '🎲', '🃏', '🎴', '🌸', '🌺', '🌻', '🌷', '🌹', '🌴', '🌳', '🌲', '🍎', '🍌', '🍇'];
        for (let i = 0; i < count && i < objects.length; i++) labels.push(objects[i]);
        break;
      case 'odds':
        for (let i = 1; i <= count * 2; i += 2) labels.push(i.toString());
        break;
      case 'evens':
        for (let i = 2; i <= count * 2; i += 2) labels.push(i.toString());
        break;
    }

    if (challengeType === 'mixed' && sequence === 'numbers') {
      // Shuffle some numbers for extra challenge
      const shuffled = [...labels];
      for (let i = shuffled.length - 1; i > 0; i--) {
        if (Math.random() < 0.3) { // 30% chance to shuffle
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
      return shuffled.slice(0, count);
    }

    return labels.slice(0, count);
  };

  const generateDots = useCallback(() => {
    const level = levels[currentLevel - 1];
    const newDots: Dot[] = [];
    const width = 500;
    const height = 400;

    const labels = generateSequence(level.dotCount, level.sequence, level.challengeType);

    // Kid-friendly patterns with better spacing
    if (level.dotCount <= 12) {
      // Simple circle for smaller numbers
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      for (let i = 0; i < level.dotCount; i++) {
        const angle = (i / level.dotCount) * 2 * Math.PI - Math.PI / 2; // Start from top
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        newDots.push({
          id: i + 1,
          label: labels[i] || (i + 1).toString(),
          x: Math.max(50, Math.min(width - 50, x)),
          y: Math.max(50, Math.min(height - 50, y)),
          connected: false
        });
      }
    } else {
      // Larger patterns use structured approach
      const shapes = ['star', 'flower', 'heart', 'spiral'];
      const shape = shapes[level.level % shapes.length];
      
      for (let i = 0; i < level.dotCount; i++) {
        let x, y;
        const progress = i / (level.dotCount - 1);
        
        switch(shape) {
          case 'star':
            const starPoints = 5;
            const outerRadius = 140;
            const innerRadius = 70;
            const angle = (i / level.dotCount) * 2 * Math.PI * starPoints;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            x = width / 2 + Math.cos(angle) * radius;
            y = height / 2 + Math.sin(angle) * radius;
            break;
            
          case 'flower':
            const petalAngle = (i / level.dotCount) * 2 * Math.PI;
            const petalRadius = 100 + Math.sin(petalAngle * 6) * 40;
            x = width / 2 + Math.cos(petalAngle) * petalRadius;
            y = height / 2 + Math.sin(petalAngle) * petalRadius;
            break;
            
          case 'spiral':
            const spiralAngle = progress * 4 * Math.PI;
            const spiralRadius = 30 + progress * 100;
            x = width / 2 + Math.cos(spiralAngle) * spiralRadius;
            y = height / 2 + Math.sin(spiralAngle) * spiralRadius;
            break;
            
          default: // heart
            const t = progress * 2 * Math.PI;
            const scale = 8;
            x = width / 2 + scale * (16 * Math.pow(Math.sin(t), 3));
            y = height / 2 - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        }

        newDots.push({
          id: i + 1,
          label: labels[i] || (i + 1).toString(),
          x: Math.max(50, Math.min(width - 50, x)),
          y: Math.max(50, Math.min(height - 50, y)),
          connected: false
        });
      }
    }

    setDots(newDots);
    setConnections([]);
    setCurrentDot(1);
    setIsComplete(false);
    setRevealProgress(0);
    setMistakes(0);
  }, [currentLevel, levels]);

  const startGame = () => {
    setGameStarted(true);
    setShowModeSelect(false);
    setCurrentLevel(1);
    setStars(0);
    setScore(0);
  };

  const connectDot = (dotId: number) => {
    if (dotId !== currentDot || isComplete) return;

    const updatedDots = dots.map(dot => 
      dot.id === dotId ? { ...dot, connected: true } : dot
    );
    setDots(updatedDots);

    if (currentDot > 1) {
      const newConnection = { from: currentDot - 1, to: currentDot };
      setConnections(prev => [...prev, newConnection]);
    }

    setRevealProgress((currentDot / dots.length) * 100);

    if (dotId === dots.length) {
      endGame(true);
    } else {
      setCurrentDot(prev => prev + 1);
      setScore(prev => prev + 10);
    }
  };

  const handleWrongDot = (dotId: number) => {
    setMistakes(prev => prev + 1);
    toast({
      title: "Oops! 🎯",
      description: `Try to follow the sequence!`,
    });
  };

  const endGame = (success: boolean) => {
    setIsComplete(true);
    
    if (success) {
      const earnedStars = 3;
      setStars(prev => prev + earnedStars);
      
      toast({
        title: "Amazing! 🌟",
        description: `You revealed a beautiful ${levels[currentLevel - 1].theme}!`,
      });

      // Celebration with dot animation
      const level = levels[currentLevel - 1];
      if (level.completionImage) {
        setTimeout(() => {
          toast({
            title: `${level.completionImage} says hello!`,
            description: "Great job connecting all the dots!",
          });
        }, 1000);
      }

      setTimeout(() => {
        setShowCompletion(true);
      }, 3000);
    } else {
      toast({
        title: "Try again! 😊",
        description: "You can do it!",
      });
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(prev => prev + 1);
      setShowCompletion(false);
      setTimeout(() => generateDots(), 1000);
    } else {
      toast({
        title: "All Complete! 🎉",
        description: "You're a connect-the-dots master!",
      });
    }
  };

  const skipLevel = () => {
    if (currentLevel < levels.length) {
      toast({
        title: "Skipped! ⏭️",
        description: "Moving to next pattern...",
      });
      nextLevel();
    }
  };

  const handleMouseDown = (dotId: number) => {
    if (dotId === currentDot) {
      setIsDragging(true);
      const dot = dots.find(d => d.id === dotId);
      if (dot) {
        setDragPath([{ x: dot.x, y: dot.y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragPath(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = (dotId?: number) => {
    if (isDragging) {
      if (dotId === currentDot) {
        connectDot(dotId);
      } else if (dotId && dotId !== currentDot) {
        handleWrongDot(dotId);
      }
    }
    setIsDragging(false);
    setDragPath([]);
  };

  const handleTouchStart = (e: React.TouchEvent, dotId: number) => {
    e.preventDefault();
    handleMouseDown(dotId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging && e.touches[0]) {
      const touch = e.touches[0];
      const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setDragPath(prev => [...prev, { x, y }]);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, dotId?: number) => {
    e.preventDefault();
    if (isDragging) {
      // Find which dot the touch ended on
      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const dotElement = element?.closest('[data-dot-id]');
      const touchedDotId = dotElement ? parseInt(dotElement.getAttribute('data-dot-id') || '0') : undefined;
      
      if (touchedDotId === currentDot) {
        connectDot(touchedDotId);
      } else if (touchedDotId && touchedDotId !== currentDot) {
        handleWrongDot(touchedDotId);
      }
    }
    setIsDragging(false);
    setDragPath([]);
  };

  useEffect(() => {
    if (gameStarted) {
      generateDots();
    }
  }, [gameStarted, generateDots]);

  if (showModeSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center p-4">
  <Card className="w-full max-w-xl shadow-xl rounded-2xl border-0">
    <CardContent className="p-6 sm:p-8">
      
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🌟 Connect the Dots Universe
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Connect dots to complete beautiful pictures & learn through play. 20+ fun levels await!
        </p>
      </div>

      {/* Kids Mode Card */}
      <div className="text-center mb-6">
        <Card 
          className="cursor-pointer hover:scale-105 transition-all border-2 border-pink-200 rounded-xl shadow-md bg-white"
          onClick={() => startGame()}
        >
          <CardContent className="p-5 sm:p-6">
            <div className="text-5xl mb-3">👶🌟</div>
            <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-1">Kids Mode</h3>
            <p className="text-sm text-gray-600 mb-2">
              🔢 Numbers • 🔤 Alphabets • 🐶 Animals & more. Learning meets fun!
            </p>
            <div className="text-xs text-purple-600 font-medium">✨ 20 Amazing Levels ✨</div>
            <Badge variant="secondary" className="mt-2">Educational & Fun</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Back Button */}
      <div>
        <Button 
          variant="outline" 
          onClick={onBack}
          // onClick={() => window.history.back()}
          className="w-full"
        >
          ← Choose Another Game
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl">Score: {score}</p>
              <p className="text-lg">Level: {currentLevel}</p>
              <p className="text-muted-foreground">Stars Earned: 3</p>
            </div>
            <div className="space-y-3">
              <Button onClick={nextLevel} className="w-full">
                {currentLevel < levels.length ? 'Next Level 🎯' : 'Complete Game 🏆'}
              </Button>
              <Button variant="outline" onClick={() => {
                setCurrentLevel(1);
                setShowCompletion(false);
                generateDots();
              }} className="w-full">
                Restart Game 🔄
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) return null;

  const level = levels[currentLevel - 1];
  const nextDot = dots.find(d => d.id === currentDot);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {level.emoji} {level.theme} - Level {currentLevel}
          </h1>
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="text-lg">🏆 Score: {score}</div>
            <div className="text-lg">⭐ Stars: {stars}</div>
            <div className="text-lg">🎯 Next: {nextDot?.label}</div>
          </div>
          <Progress value={revealProgress} className="w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <svg
                  width="100%"
                  height="450"
                  viewBox="0 0 500 400"
                  className="border rounded-lg bg-gradient-to-br from-white to-blue-50"
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => handleMouseUp()}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e)}
                >
                  {/* Draw connections */}
                  {connections.map((conn, index) => {
                    const fromDot = dots.find(d => d.id === conn.from);
                    const toDot = dots.find(d => d.id === conn.to);
                    if (!fromDot || !toDot) return null;
                    
                    return (
                      <line
                        key={index}
                        x1={fromDot.x}
                        y1={fromDot.y}
                        x2={toDot.x}
                        y2={toDot.y}
                        stroke={level.theme.includes('Rainbow') ? `hsl(${index * 30}, 70%, 50%)` : '#8B5CF6'}
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                    );
                  })}

                  {/* Draw drag path */}
                  {isDragging && dragPath.length > 1 && (
                    <polyline
                      points={dragPath.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Draw dots */}
                  {dots.map((dot) => (
                    <g key={dot.id} data-dot-id={dot.id}>
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="20"
                        fill={
                          dot.connected
                            ? '#10B981'
                            : dot.id === currentDot
                            ? '#F59E0B'
                            : '#E5E7EB'
                        }
                        stroke={dot.id === currentDot ? '#F59E0B' : '#374151'}
                        strokeWidth="2"
                        className={`cursor-pointer transition-all ${
                          dot.id === currentDot ? 'animate-pulse' : ''
                        }`}
                        onMouseDown={() => handleMouseDown(dot.id)}
                        onMouseUp={() => handleMouseUp(dot.id)}
                        onTouchStart={(e) => handleTouchStart(e, dot.id)}
                        onTouchEnd={(e) => handleTouchEnd(e, dot.id)}
                        onClick={() => {
                          if (dot.id === currentDot) {
                            connectDot(dot.id);
                          } else {
                            handleWrongDot(dot.id);
                          }
                        }}
                      />
                      <text
                        x={dot.x}
                        y={dot.y + 5}
                        textAnchor="middle"
                        className="font-bold text-sm pointer-events-none select-none"
                        fill={dot.connected ? 'white' : '#374151'}
                      >
                        {dot.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">🎯 Challenge</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {level.challengeType === 'reverse' && 'Connect dots in reverse order!'}
                  {level.challengeType === 'skip' && level.sequence === 'alphabet' && 'Connect every other letter!'}
                  {level.challengeType === 'skip' && level.sequence === 'numbers' && 'Connect even numbers!'}
                  {level.challengeType === 'mixed' && 'Mixed sequence challenge!'}
                  {!level.challengeType && 'Connect the dots in order!'}
                </p>
                <div className="text-xs text-purple-600">
                  Sequence: {level.sequence.charAt(0).toUpperCase() + level.sequence.slice(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">🌟 Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Connected:</span>
                    <span>{currentDot - 1}/{dots.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span>{dots.length - (currentDot - 1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    How to Play
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>🎯 How to Play Connect the Dots</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold">🎮 Basic Controls:</h4>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Click dots in sequence order</li>
                        <li>Drag from one dot to the next</li>
                        <li>Follow the highlighted dot</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold">🔢 Sequences:</h4>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Numbers: 1, 2, 3...</li>
                        <li>Alphabet: A, B, C...</li>
                        <li>Animals: 🐶, 🐱, 🐭...</li>
                        <li>Objects: ⚽, 🏀, 🎾...</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                onClick={skipLevel}
                className="w-full"
              >
                Skip Level ⏭️
              </Button>

              <Button 
                variant="outline" 
                // onClick={() => window.history.back()}
                onClick={onBack}
                className="w-full"
              >
               ← Back to Games
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectTheDots;