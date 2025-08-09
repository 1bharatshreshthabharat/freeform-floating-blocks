import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GameHeader } from '../GameHeader';
import { HowToPlayDialog, CustomizationDialog, CompletionDialog } from '../GameDialogs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Undo, Lightbulb, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BicolorBall {
  id: string;
  topColor: string;
  bottomColor: string;
  tube: number;
  position: number;
} 

interface GameLevel {
  level: number;
  timeLimit: number;
  tubeCount: number;
  ballsPerTube: number;
  colorPairs: [string, string][];
  challenges: string[];
  hurdles: string[];
  theme: string;
  maxMoves: number;
  hints: number;
}

interface GameSettings {
  theme: string;
  difficulty: string;
  soundEffects: boolean;
  animations: boolean;
  showNumbers: boolean;
  tubeOpacity: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'classic',
  difficulty: 'normal',
  soundEffects: true,
  animations: true,
  showNumbers: true,
  tubeOpacity: 90,
};

const BallSortBicolor: React.FC = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [balls, setBalls] = useState<BicolorBall[]>([]);
  const [tubes, setTubes] = useState<BicolorBall[][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [perfectSorts, setPerfectSorts] = useState(0);
  const [efficiency, setEfficiency] = useState(100);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gamePaused, setGamePaused] = useState(false);
  const [moveHistory, setMoveHistory] = useState<{tubes: BicolorBall[][], move: number}[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightedBall, setHighlightedBall] = useState<string | null>(null);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);

  const levels: GameLevel[] = useMemo(() => [
    { 
      level: 1, 
      timeLimit: 180, 
      tubeCount: 5, 
      ballsPerTube: 4, 
      colorPairs: [['#FF5252', '#448AFF'], ['#4CAF50', '#FFD740']],
      challenges: ['Basic sorting'], 
      hurdles: ['None'], 
      theme: 'Beginner',
      maxMoves: 20,
      hints: 3
    },
    { 
      level: 2, 
      timeLimit: 160, 
      tubeCount: 6, 
      ballsPerTube: 4, 
      colorPairs: [['#FF5252', '#448AFF'], ['#4CAF50', '#FFD740'], ['#9C27B0', '#FF9800']],
      challenges: ['More colors'], 
      hurdles: ['Limited moves'], 
      theme: 'Intermediate',
      maxMoves: 25,
      hints: 2
    },
    { 
      level: 3, 
      timeLimit: 140, 
      tubeCount: 7, 
      ballsPerTube: 4, 
      colorPairs: [['#FF5252', '#448AFF'], ['#4CAF50', '#FFD740'], ['#9C27B0', '#FF9800'], ['#E91E63', '#00BCD4']],
      challenges: ['Complex patterns'], 
      hurdles: ['Time pressure'], 
      theme: 'Advanced',
      maxMoves: 30,
      hints: 2
    },
    { 
      level: 4, 
      timeLimit: 120, 
      tubeCount: 8, 
      ballsPerTube: 4, 
      colorPairs: [['#FF5252', '#448AFF'], ['#4CAF50', '#FFD740'], ['#9C27B0', '#FF9800'], ['#E91E63', '#00BCD4'], ['#607D8B', '#FFEB3B']],
      challenges: ['Master sorting'], 
      hurdles: ['No mistakes'], 
      theme: 'Expert',
      maxMoves: 35,
      hints: 1
    },
    { 
      level: 5, 
      timeLimit: 100, 
      tubeCount: 9, 
      ballsPerTube: 4, 
      colorPairs: [['#FF5252', '#448AFF'], ['#4CAF50', '#FFD740'], ['#9C27B0', '#FF9800'], ['#E91E63', '#00BCD4'], ['#607D8B', '#FFEB3B'], ['#795548', '#8BC34A']],
      challenges: ['Ultimate challenge'], 
      hurdles: ['Perfection required'], 
      theme: 'Master',
      maxMoves: 40,
      hints: 1
    }
  ], []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gamePaused && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted) {
      endGame();
    }
  }, [timeLeft, gameStarted, gamePaused, isComplete]);

  // Save settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('ballSortSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  const saveSettings = useCallback((newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('ballSortSettings', JSON.stringify(updatedSettings));
  }, [settings]);

  const generatePuzzle = useCallback(() => {
    const level = levels[currentLevel - 1];
    const newBalls: BicolorBall[] = [];
    const newTubes: BicolorBall[][] = Array(level.tubeCount).fill(null).map(() => []);
    
    let ballId = 0;
    
    // Create sets of bicolor balls for each color pair
    level.colorPairs.forEach(([topColor, bottomColor]) => {
      // Create balls with this color combination
      for (let i = 0; i < level.ballsPerTube; i++) {
        newBalls.push({
          id: `ball-${Date.now()}-${ballId++}`,
          topColor,
          bottomColor,
          tube: 0,
          position: 0
        });
      }
    });

    // Shuffle balls
    for (let i = newBalls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newBalls[i], newBalls[j]] = [newBalls[j], newBalls[i]];
    }

    // Distribute balls to tubes (leaving 2 empty tubes)
    const filledTubes = level.tubeCount - 2;
    const ballsPerFilledTube = Math.ceil(newBalls.length / filledTubes);
    
    newBalls.forEach((ball, index) => {
      const tubeIndex = Math.floor(index / ballsPerFilledTube);
      if (tubeIndex < filledTubes) {
        ball.tube = tubeIndex;
        ball.position = newTubes[tubeIndex].length;
        newTubes[tubeIndex].push(ball);
      }
    });

    setBalls(newBalls);
    setTubes(newTubes);
    setMoves(0);
    setIsComplete(false);
    setMoveHistory([]);
    setHintsUsed(0);
    setSelectedTube(null);
    setHighlightedBall(null);
  }, [currentLevel, levels]);

  const startGame = useCallback(() => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generatePuzzle();
  }, [currentLevel, generatePuzzle, levels]);

  const moveBall = useCallback((fromTube: number, toTube: number) => {
    if (fromTube === toTube || gamePaused) {
      setSelectedTube(null);
      return;
    }

    const fromTubeArray = tubes[fromTube];
    const toTubeArray = tubes[toTube];

    // Can't move from empty tube
    if (fromTubeArray.length === 0) {
      toast({
        title: "Can't move! ❌",
        description: "The tube is empty!",
        variant: "destructive"
      });
      setSelectedTube(null);
      return;
    }

    // Can't move to full tube
    if (toTubeArray.length >= 4) {
      toast({
        title: "Can't move! ❌",
        description: "The tube is full!",
        variant: "destructive"
      });
      setSelectedTube(null);
      return;
    }

    // Get the top ball from source tube
    const ballToMove = fromTubeArray[fromTubeArray.length - 1];
    
    // Check if move is valid (can only place on matching color or empty tube)
    if (toTubeArray.length > 0) {
      const topBallInDestination = toTubeArray[toTubeArray.length - 1];
      const canPlace = 
        ballToMove.topColor === topBallInDestination.topColor &&
        ballToMove.bottomColor === topBallInDestination.bottomColor;
      
      if (!canPlace) {
        toast({
          title: "Can't move! ❌",
          description: "Bicolor balls must match both colors!",
          variant: "destructive"
        });
        setSelectedTube(null);
        return;
      }
    }

    // Save current state to history (max 5 moves)
    setMoveHistory(prev => {
      const newHistory = [...prev, { tubes: JSON.parse(JSON.stringify(tubes)), move: moves }];
      return newHistory.slice(-5);
    });

    // Perform the move
    const newTubes = tubes.map(tube => [...tube]);
    const movedBall = newTubes[fromTube].pop()!;
    movedBall.tube = toTube;
    movedBall.position = newTubes[toTube].length;
    newTubes[toTube].push(movedBall);

    setTubes(newTubes);
    setMoves(prev => prev + 1);
    setSelectedTube(null);

    // Update efficiency
    const level = levels[currentLevel - 1];
    const newEfficiency = Math.max(0, Math.floor(100 - ((moves + 1) / level.maxMoves * 100)));
    setEfficiency(newEfficiency);

    // Check for completion
    checkWinCondition(newTubes);
  }, [tubes, moves, currentLevel, levels, gamePaused, toast]);

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || gamePaused) return;

    const lastState = moveHistory[moveHistory.length - 1];
    setTubes(lastState.tubes);
    setMoves(lastState.move);
    setMoveHistory(prev => prev.slice(0, -1));
    setSelectedTube(null);
  }, [moveHistory, gamePaused]);

  const giveHint = useCallback(() => {
    const level = levels[currentLevel - 1];
    if (hintsUsed >= level.hints) {
      toast({
        title: "No Hints Left!",
        description: `You've used all ${level.hints} hints for this level.`,
      });
      return;
    }

    // Find the first ball that's not in its correct position
    for (let tubeIndex = 0; tubeIndex < tubes.length; tubeIndex++) {
      for (let ballIndex = 0; ballIndex < tubes[tubeIndex].length; ballIndex++) {
        const ball = tubes[tubeIndex][ballIndex];
        
        // Check if this ball is in the correct tube (simple heuristic)
        const correctTube = Number(ball.id.split('-')[2]) % level.tubeCount;
        if (ball.tube !== correctTube) {
          setHighlightedBall(ball.id);
          setTimeout(() => setHighlightedBall(null), 2000);
          setHintsUsed(prev => prev + 1);
          return;
        }
      }
    }
  }, [currentLevel, levels, hintsUsed, tubes, toast]);

  const checkWinCondition = useCallback((currentTubes: BicolorBall[][]) => {
    const level = levels[currentLevel - 1];
    
    // Check if all tubes are either empty or contain 4 balls of the same bicolor pattern
    const isWin = currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== 4) return false;
      
      const firstBall = tube[0];
      return tube.every(ball => 
        ball.topColor === firstBall.topColor && 
        ball.bottomColor === firstBall.bottomColor
      );
    });

    if (isWin) {
      setIsComplete(true);
      
      // Calculate bonuses
      const timeBonus = Math.floor(timeLeft / 10);
      const moveBonus = Math.max(0, 100 - moves * 2);
      const efficiencyBonus = Math.floor(efficiency / 10);
      const perfectBonus = moves <= level.maxMoves * 0.5 ? 100 : 0;
      
      // Apply difficulty multiplier
      let difficultyMultiplier = 1;
      switch (settings.difficulty) {
        case 'easy': difficultyMultiplier = 0.8; break;
        case 'hard': difficultyMultiplier = 1.3; break;
      }

      const totalScore = Math.floor(
        (300 + timeBonus + moveBonus + efficiencyBonus + perfectBonus) * 
        difficultyMultiplier * 
        bonusMultiplier
      );

      if (perfectBonus > 0) {
        setPerfectSorts(prev => prev + 1);
        setBonusMultiplier(prev => Math.min(prev + 0.1, 2));
      }
      
      setScore(prev => prev + totalScore);
      
      toast({
        title: "Perfect Sort! 🎉",
        description: `Level complete! +${totalScore} points!`,
      });

      setTimeout(() => {
        if (currentLevel < levels.length) {
          nextLevel();
        } else {
          endGame();
        }
      }, 2000);
    }
  }, [levels, currentLevel, timeLeft, moves, efficiency, bonusMultiplier, settings.difficulty, toast]);

  const nextLevel = useCallback(() => {
    setCurrentLevel(prev => prev + 1);
    setTimeout(() => {
      const nextLevelData = levels[currentLevel];
      setTimeLeft(nextLevelData.timeLimit);
      generatePuzzle();
    }, 1000);
  }, [currentLevel, generatePuzzle, levels]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setShowCompletion(true);
    toast({
      title: "Game Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  }, [score, toast]);

  const resetGame = useCallback(() => {
    setCurrentLevel(1);
    setScore(0);
    setMoves(0);
    setPerfectSorts(0);
    setEfficiency(100);
    setBonusMultiplier(1);
    setGameStarted(false);
    setShowTutorial(true);
  }, []);

  const applyThemeStyles = useCallback(() => {
    const themes: Record<string, string> = {
      classic: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      modern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      vintage: 'bg-gradient-to-br from-amber-50 to-rose-50',
      dark: 'bg-gradient-to-br from-gray-800 to-gray-900',
      pastel: 'bg-gradient-to-br from-pink-100 to-blue-100',
    };
    return themes[settings.theme] || themes.classic;
  }, [settings.theme]);

  if (showTutorial) {
    return (
      <div className={`min-h-screen ${applyThemeStyles()} flex items-center justify-center p-6`}>
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🏀🎨🔵</div>
            <h2 className="text-3xl font-bold mb-4">Ball Sort Bicolor</h2>
            <p className="text-muted-foreground mb-6">
              Sort bicolor balls into tubes! Each ball has two colors and must be 
              matched with balls of the exact same color combination. More challenging 
              than regular ball sort!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all"
              >
                Start Sorting! 🏀
              </Button>
              <Button  
                variant="outline" 
                onClick={() => window.history.back()} 
                className="w-full"
              >
                ← Choose Different Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted && showCompletion) {
    return (
      <div className={`min-h-screen ${applyThemeStyles()} flex items-center justify-center p-6`}>
        <CompletionDialog
          open={showCompletion}
          onOpenChange={setShowCompletion}
          title="Game Complete!"
          score={score}
          stats={[
            { label: "Total Moves", value: moves },
            { label: "Perfect Sorts", value: perfectSorts },
            { label: "Efficiency", value: `${efficiency}%` },
            { label: "Highest Level", value: currentLevel }
          ]}
          onRestart={resetGame}
          onGoHome={() => window.location.href = '/'}
          isLastLevel={currentLevel >= levels.length}
        />
      </div>
    );
  }

  const level = levels[currentLevel - 1];
  const timePercentage = (timeLeft / level.timeLimit) * 100;
  const movesPercentage = (moves / level.maxMoves) * 100;

  return (
    <div className={`min-h-screen ${applyThemeStyles()} p-6`}>
      <div className="max-w-6xl mx-auto">
        <GameHeader
          title="🏀 Ball Sort Bicolor"
          level={currentLevel}
          score={score}
          timeLeft={timeLeft}
          moves={moves}
          progress={timePercentage}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowCustomization={() => setShowCustomization(true)}
          onGoBack={() => window.history.back()}
          onGoHome={() => window.location.href = '/'}
          onPause={() => setGamePaused(!gamePaused)}
          isPaused={gamePaused}
        />

        {gamePaused && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
              <Button onClick={() => setGamePaused(false)}>Resume Game</Button>
            </Card>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium">
            Sort by: <span className="font-bold capitalize">{level.theme}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undoMove}
              disabled={moveHistory.length === 0 || gamePaused}
            >
              <Undo className="w-4 h-4 mr-1" /> Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={giveHint}
              disabled={hintsUsed >= level.hints || gamePaused}
            >
              <Lightbulb className="w-4 h-4 mr-1" /> Hint ({level.hints - hintsUsed})
            </Button>
          </div>
        </div>

        <HowToPlayDialog
          open={showHowToPlay}
          onOpenChange={setShowHowToPlay}
          title="Ball Sort Bicolor"
          instructions={[
            "Click on a tube to select it, then click another tube to move the top ball",
            "Bicolor balls must match both colors exactly to stack",
            "Only the top ball in each tube can be moved",
            "Complete each tube with 4 identical bicolor balls",
            "Use empty tubes strategically to rearrange balls"
          ]}
          tips={[
            "Plan several moves ahead to avoid getting stuck",
            "Try to group similar colors together first",
            "Use the undo button if you make a mistake",
            "Hints can show you which ball to move next"
          ]}
        />

        <CustomizationDialog
          open={showCustomization}
          onOpenChange={(open) => {
            setShowCustomization(open);
            if (!open) {
              saveSettings(settings);
            }
          }}
        >
          <div className="space-y-6">
            <div>
              <Label>Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => saveSettings({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Difficulty</Label>
              <Select 
                value={settings.difficulty} 
                onValueChange={(value) => saveSettings({ difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Sound Effects</Label>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => saveSettings({ soundEffects: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Animations</Label>
              <Switch
                checked={settings.animations}
                onCheckedChange={(checked) => saveSettings({ animations: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Numbers</Label>
              <Switch
                checked={settings.showNumbers}
                onCheckedChange={(checked) => saveSettings({ showNumbers: checked })}
              />
            </div>

            <div>
              <Label>Tube Opacity: {settings.tubeOpacity}%</Label>
              <Slider
                value={[settings.tubeOpacity]}
                onValueChange={([value]) => saveSettings({ tubeOpacity: value })}
                min={50}
                max={100}
                step={5}
              />
            </div>
          </div>
        </CustomizationDialog>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-600">Time Remaining</span>
              <span className="text-2xl font-bold">{timeLeft}s</span>
              <Progress value={timePercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-600">Moves Used</span>
              <span className="text-2xl font-bold">{moves}/{level.maxMoves}</span>
              <Progress value={movesPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-600">Efficiency</span>
              <span className="text-2xl font-bold">{efficiency}%</span>
              <Progress value={efficiency} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tubes */}
        <div className="flex justify-center gap-6 flex-wrap">
          {tubes.map((tube, tubeIndex) => (
            <motion.div 
              key={tubeIndex}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`w-20 h-60 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedTube === tubeIndex ? 'ring-4 ring-primary' : ''
                } ${tube.length === 0 ? 'bg-gray-100/50' : 'bg-white'}`}
                style={{ opacity: settings.tubeOpacity / 100 }}
                onClick={() => {
                  if (selectedTube === null) {
                    setSelectedTube(tubeIndex);
                  } else {
                    moveBall(selectedTube, tubeIndex);
                  }
                }}
              >
                <CardContent className="p-2 h-full flex flex-col-reverse items-center justify-start gap-1">
                  <AnimatePresence>
                    {tube.map((ball) => (
                      <motion.div
                        key={ball.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          boxShadow: highlightedBall === ball.id ? '0 0 10px 5px rgba(255, 255, 255, 0.8)' : 'none'
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: settings.animations ? 0.3 : 0 }}
                        className={`w-14 h-14 rounded-full border-2 border-white shadow-lg relative ${
                          highlightedBall === ball.id ? 'animate-pulse' : ''
                        }`}
                        style={{
                          background: `linear-gradient(180deg, ${ball.topColor} 50%, ${ball.bottomColor} 50%)`
                        }}
                      >
                        {settings.showNumbers && (
                          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {ball.id.split('-')[2]}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
              <div className="text-center mt-2 text-sm font-medium">
                Tube {tubeIndex + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Tube Indicator */}
        {selectedTube !== null && (
          <div className="text-center mt-6">
            <p className="text-lg">
              Selected tube {selectedTube + 1}. Click another tube to move the ball!
            </p>
            <Button 
              onClick={() => setSelectedTube(null)} 
              variant="outline" 
              className="mt-2"
            >
              Cancel Selection
            </Button>
          </div>
        )}

        {/* Color Legend */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-bold mb-4">Color Combinations:</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {level.colorPairs.map(([topColor, bottomColor], index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-md"
                  style={{
                    background: `linear-gradient(180deg, ${topColor} 50%, ${bottomColor} 50%)`
                  }}
                />
                <span className="text-sm font-medium">Pair {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BallSortBicolor;