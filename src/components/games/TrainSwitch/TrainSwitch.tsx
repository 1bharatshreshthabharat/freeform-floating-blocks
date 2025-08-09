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
import { Undo, Lightbulb } from 'lucide-react';

interface TrainCar {
  id: string;
  type: 'passenger' | 'freight' | 'engine';
  color: string;
  number: number;
  track: number;
  position: number;
}

interface GameLevel {
  level: number;
  timeLimit: number;
  trackCount: number;
  carCount: number;
  targetPattern: 'color' | 'type' | 'number' | 'mixed' | 'advanced' | 'ultimate';
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
  showHints: boolean;
  gridOpacity: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'classic',
  difficulty: 'normal',
  soundEffects: true,
  animations: true,
  showHints: true,
  gridOpacity: 70,
};

const TrainSwitch: React.FC = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tracks, setTracks] = useState<TrainCar[][]>([]);
  const [selectedCar, setSelectedCar] = useState<TrainCar | null>(null);
  const [targetTracks, setTargetTracks] = useState<TrainCar[][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [perfectSorts, setPerfectSorts] = useState(0);
  const [efficiency, setEfficiency] = useState(100);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [speed, setSpeed] = useState(50);
  const [obstacles, setObstacles] = useState<{trackIndex: number, position: number}[]>([]);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);
  const [gamePaused, setGamePaused] = useState(false);
  const [moveHistory, setMoveHistory] = useState<{tracks: TrainCar[][], move: number}[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightedCar, setHighlightedCar] = useState<string | null>(null);

  const levels: GameLevel[] = useMemo(() => [
    { 
      level: 1, timeLimit: 180, trackCount: 3, carCount: 6, targetPattern: 'color',
      challenges: ['Basic sorting'], hurdles: ['None'], theme: 'Country Station',
      maxMoves: 20, hints: 3
    },
    { 
      level: 2, timeLimit: 160, trackCount: 4, carCount: 8, targetPattern: 'type',
      challenges: ['Type sorting', 'Speed control'], hurdles: ['Track limits'], 
      theme: 'City Terminal', maxMoves: 25, hints: 2
    },
    { 
      level: 3, timeLimit: 140, trackCount: 4, carCount: 12, targetPattern: 'number',
      challenges: ['Number sorting', 'Multi-track'], hurdles: ['Blocked tracks', 'Weight limits'], 
      theme: 'Industrial Yard', maxMoves: 30, hints: 2
    },
    { 
      level: 4, timeLimit: 120, trackCount: 5, carCount: 15, targetPattern: 'mixed',
      challenges: ['Complex sorting', 'Perfect efficiency'], hurdles: ['Moving obstacles', 'Time pressure'], 
      theme: 'Grand Central', maxMoves: 35, hints: 1
    },
    { 
      level: 5, timeLimit: 100, trackCount: 6, carCount: 20, targetPattern: 'advanced',
      challenges: ['Master conductor', 'Flawless execution'], hurdles: ['Signal failures', 'Track switching'], 
      theme: 'Quantum Rails', maxMoves: 40, hints: 1
    },
    { 
      level: 6, timeLimit: 90, trackCount: 7, carCount: 25, targetPattern: 'ultimate',
      challenges: ['Ultimate challenge', 'Legendary precision'], hurdles: ['Chaos mode', 'Reality bends'], 
      theme: 'Infinity Express', maxMoves: 50, hints: 0
    }
  ], []);

  const carTypes = useMemo(() => ({
    passenger: { emoji: '🚃', colors: ['#1E90FF', '#DC143C', '#228B22'] },
    freight: { emoji: '🚛', colors: ['#8B4513', '#808080', '#FFD700'] },
    engine: { emoji: '🚂', colors: ['#000000', '#DC143C'] }
  }), []);

  const trackColors = useMemo(() => ['#8B4513', '#4682B4', '#228B22', '#DC143C', '#9932CC', '#FF8C00', '#4B0082'], []);

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
    const savedSettings = localStorage.getItem('trainSwitchSettings');
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
    localStorage.setItem('trainSwitchSettings', JSON.stringify(updatedSettings));
  }, [settings]);

  const generatePuzzle = useCallback(() => {
    const level = levels[currentLevel - 1];
    const newTracks: TrainCar[][] = Array(level.trackCount).fill(null).map(() => []);
    const newTargetTracks: TrainCar[][] = Array(level.trackCount).fill(null).map(() => []);
    const cars: TrainCar[] = [];

    // Generate train cars
    for (let i = 0; i < level.carCount; i++) {
      const types = Object.keys(carTypes) as Array<keyof typeof carTypes>;
      const type = types[Math.floor(Math.random() * types.length)];
      const availableColors = carTypes[type].colors;
      const color = availableColors[Math.floor(Math.random() * availableColors.length)];
      
      cars.push({
        id: `car-${Date.now()}-${i}`,
        type,
        color,
        number: i + 1,
        track: 0,
        position: 0
      });
    }

    // Shuffle cars
    for (let i = cars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cars[i], cars[j]] = [cars[j], cars[i]];
    }

    // Distribute cars randomly to tracks
    cars.forEach((car, index) => {
      const trackIndex = Math.floor(Math.random() * level.trackCount);
      car.track = trackIndex;
      car.position = newTracks[trackIndex].length;
      newTracks[trackIndex].push(car);
    });

    // Generate target arrangement
    const sortedCars = [...cars];
    switch (level.targetPattern) {
      case 'color':
        sortedCars.sort((a, b) => a.color.localeCompare(b.color));
        break;
      case 'type':
        sortedCars.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'number':
        sortedCars.sort((a, b) => a.number - b.number);
        break;
      case 'mixed':
        // Sort by type first, then by color
        sortedCars.sort((a, b) => {
          if (a.type !== b.type) return a.type.localeCompare(b.type);
          return a.color.localeCompare(b.color);
        });
        break;
      case 'advanced':
        // Sort by type, then number
        sortedCars.sort((a, b) => {
          if (a.type !== b.type) return a.type.localeCompare(b.type);
          return a.number - b.number;
        });
        break;
      case 'ultimate':
        // Sort by color, then type, then number
        sortedCars.sort((a, b) => {
          if (a.color !== b.color) return a.color.localeCompare(b.color);
          if (a.type !== b.type) return a.type.localeCompare(b.type);
          return a.number - b.number;
        });
        break;
    }

    // Distribute sorted cars to target tracks
    const carsPerTrack = Math.ceil(sortedCars.length / level.trackCount);
    sortedCars.forEach((car, index) => {
      const targetTrackIndex = Math.floor(index / carsPerTrack);
      if (targetTrackIndex < level.trackCount) {
        const targetCar = { ...car };
        targetCar.track = targetTrackIndex;
        targetCar.position = newTargetTracks[targetTrackIndex].length;
        newTargetTracks[targetTrackIndex].push(targetCar);
      }
    });

    setTracks(newTracks);
    setTargetTracks(newTargetTracks);
    setMoves(0);
    setIsComplete(false);
    setMoveHistory([]);
    setHintsUsed(0);
    setSelectedCar(null);
  }, [currentLevel, levels, carTypes]);

  const startGame = useCallback(() => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generatePuzzle();
  }, [currentLevel, generatePuzzle, levels]);

  const selectCar = useCallback((car: TrainCar) => {
    if (gamePaused) return;

    const track = tracks[car.track];
    // Can only select the last car in a track (like a stack)
    if (track[track.length - 1]?.id === car.id) {
      setSelectedCar(car);
      if (settings.soundEffects) {
        // Play selection sound
      }
    } else {
      toast({
        title: "Can't move! 🚫",
        description: "You can only move the last car in each track!",
      });
    }
  }, [tracks, gamePaused, settings.soundEffects, toast]);

  const moveCar = useCallback((targetTrackIndex: number) => {
    if (!selectedCar || gamePaused) return;

    const sourceTrackIndex = selectedCar.track;
    if (sourceTrackIndex === targetTrackIndex) {
      setSelectedCar(null);
      return;
    }

    // Save current state to history (max 5 moves)
    setMoveHistory(prev => {
      const newHistory = [...prev, { tracks: JSON.parse(JSON.stringify(tracks)), move: moves }];
      return newHistory.slice(-5);
    });

    // Check if move is valid (track not too full)
    if (tracks[targetTrackIndex].length >= 5) {
      toast({
        title: "Track Full! 🚫",
        description: "This track can't hold more cars!",
      });
      setSelectedCar(null);
      return;
    }

    // Perform the move
    const newTracks = tracks.map(track => [...track]);
    const carToMove = newTracks[sourceTrackIndex].pop()!;
    carToMove.track = targetTrackIndex;
    carToMove.position = newTracks[targetTrackIndex].length;
    newTracks[targetTrackIndex].push(carToMove);

    setTracks(newTracks);
    setMoves(prev => prev + 1);
    setSelectedCar(null);

    // Update efficiency
    const level = levels[currentLevel - 1];
    const newEfficiency = Math.max(0, Math.floor(100 - ((moves + 1) / level.maxMoves * 100)));
    setEfficiency(newEfficiency);

    // Check win condition
    checkWinCondition(newTracks);
  }, [selectedCar, gamePaused, tracks, moves, currentLevel, levels, toast]);

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || gamePaused) return;

    const lastState = moveHistory[moveHistory.length - 1];
    setTracks(lastState.tracks);
    setMoves(lastState.move);
    setMoveHistory(prev => prev.slice(0, -1));
    setSelectedCar(null);
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

    // Find the first mismatched car
    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
      for (let carIndex = 0; carIndex < tracks[trackIndex].length; carIndex++) {
        const currentCar = tracks[trackIndex][carIndex];
        const targetCar = targetTracks[trackIndex][carIndex];

        if (!targetCar || currentCar.id !== targetCar.id) {
          setHighlightedCar(currentCar.id);
          setTimeout(() => setHighlightedCar(null), 2000);
          setHintsUsed(prev => prev + 1);
          return;
        }
      }
    }
  }, [currentLevel, levels, hintsUsed, tracks, targetTracks, toast]);

  const checkWinCondition = useCallback((currentTracks: TrainCar[][]) => {
    // Check if current arrangement matches target
    const isWin = currentTracks.every((track, trackIndex) => {
      const targetTrack = targetTracks[trackIndex];
      if (track.length !== targetTrack.length) return false;
      
      return track.every((car, carIndex) => {
        const targetCar = targetTrack[carIndex];
        return car.id === targetCar.id;
      });
    });

    if (isWin) {
      setIsComplete(true);
      const level = levels[currentLevel - 1];
      
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
        title: "Perfect Switching! 🚂✨",
        description: `All trains sorted! +${totalScore} points!`,
      });

      setTimeout(() => {
        if (currentLevel < levels.length) {
          nextLevel();
        } else {
          endGame();
        }
      }, 2000);
    }
  }, [targetTracks, levels, currentLevel, timeLeft, moves, efficiency, bonusMultiplier, settings.difficulty, toast]);

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
      title: "Station Master Complete! 🏆",
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
      classic: 'bg-gradient-to-br from-amber-100 to-red-100',
      modern: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      vintage: 'bg-gradient-to-br from-yellow-50 to-brown-100',
      dark: 'bg-gradient-to-br from-gray-800 to-gray-900',
      industrial: 'bg-gradient-to-br from-gray-200 to-gray-400',
    };
    return themes[settings.theme] || themes.classic;
  }, [settings.theme]);

  if (showTutorial) {
    return (
      <div className={`min-h-screen ${applyThemeStyles()} flex items-center justify-center p-6`}>
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🚂🔄🚃</div>
            <h2 className="text-3xl font-bold mb-4">Train Switch</h2>
            <p className="text-muted-foreground mb-6">
              Sort train cars by switching them between tracks! You can only 
              move the last car from each track. Match the target arrangement 
              to complete each level. All aboard!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all"
              >
                Start Switching! 🚂
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
          title="End of the Line!"
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
      <div className="max-w-7xl mx-auto">
        <GameHeader
          title="🚂 Train Switch"
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


           {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
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
            Sort by: <span className="font-bold capitalize">{level.targetPattern}</span>
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
          title="Train Switch"
          instructions={[
            "Click on the last car in any track to select it",
            "Click on another track to move the selected car there",
            "Only the last car in each track can be moved (like a stack)",
            "Match the target arrangement shown on the right",
            "Each track can hold maximum 5 cars"
          ]}
          tips={[
            "Plan your moves - use empty tracks strategically",
            "Study the target pattern before making moves",
            "Fewer moves = higher efficiency bonus",
            "Think like a train conductor - organize systematically!"
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
                  <SelectItem value="industrial">Industrial</SelectItem>
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
              <Label>Show Hints</Label>
              <Switch
                checked={settings.showHints}
                onCheckedChange={(checked) => saveSettings({ showHints: checked })}
              />
            </div>

            <div>
              <Label>Grid Opacity: {settings.gridOpacity}%</Label>
              <Slider
                value={[settings.gridOpacity]}
                onValueChange={([value]) => saveSettings({ gridOpacity: value })}
                min={30}
                max={100}
                step={5}
              />
            </div>
          </div>
        </CustomizationDialog>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current State */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">🚧 Current Yard</h3>
            <div className="space-y-4">
              {tracks.map((track, trackIndex) => (
                <div key={trackIndex} className="relative">
                  <div 
                    className={`h-16 rounded-lg border-4 ${track.length === 0 ? 'border-dashed' : 'border-solid'} flex items-center px-4 cursor-pointer transition-colors ${
                      selectedCar ? 'hover:bg-gray-50/30' : ''
                    }`}
                    style={{ 
                      backgroundColor: `${trackColors[trackIndex]}20`,
                      borderColor: trackColors[trackIndex]
                    }}
                    onClick={() => selectedCar && moveCar(trackIndex)}
                  >
                    <div className="text-sm font-bold mr-4">Track {trackIndex + 1}</div>
                    <div className="flex space-x-2 overflow-x-auto">
                      {track.map((car, carIndex) => (
                        <div
                          key={car.id}
                          className={`min-w-16 h-12 rounded-lg border-2 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 ${
                            selectedCar?.id === car.id 
                              ? 'ring-4 ring-yellow-400 scale-110' 
                              : carIndex === track.length - 1
                                ? 'hover:scale-105 border-green-400'
                                : 'border-gray-400 opacity-75'
                          } ${
                            highlightedCar === car.id ? 'animate-pulse ring-4 ring-white' : ''
                          }`}
                          style={{ 
                            backgroundColor: car.color,
                            borderColor: carIndex === track.length - 1 ? '#4ADE80' : '#9CA3AF'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCar(car);
                          }}
                        >
                          {carTypes[car.type].emoji}
                          {settings.showHints && (
                            <span className="text-xs absolute bottom-0 bg-black/70 text-white px-1 rounded">
                              {car.number}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-2 rounded-b-lg"
                    style={{ backgroundColor: trackColors[trackIndex] }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Target State */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">🎯 Target Arrangement</h3>
            <div className="space-y-4">
              {targetTracks.map((track, trackIndex) => (
                <div key={trackIndex} className="relative">
                  <div 
                    className="h-16 rounded-lg border-4 flex items-center px-4"
                    style={{ 
                      backgroundColor: `${trackColors[trackIndex]}10`,
                      borderColor: trackColors[trackIndex]
                    }}
                  >
                    <div className="text-sm font-bold mr-4">Track {trackIndex + 1}</div>
                    <div className="flex space-x-2 overflow-x-auto">
                      {track.map((car) => (
                        <div
                          key={car.id}
                          className="min-w-16 h-12 rounded-lg border-2 flex items-center justify-center text-2xl opacity-80 relative"
                          style={{ 
                            backgroundColor: car.color,
                            borderColor: trackColors[trackIndex]
                          }}
                        >
                          {carTypes[car.type].emoji}
                          {settings.showHints && (
                            <span className="text-xs absolute bottom-0 bg-black/70 text-white px-1 rounded">
                              {car.number}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-2 rounded-b-lg"
                    style={{ backgroundColor: trackColors[trackIndex] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

     

        {/* Car Legend */}
        <div className="mt-8 text-center">
          <h4 className="text-lg font-bold mb-4">🚂 Car Types</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(carTypes).map(([type, data]) => (
              <div key={type} className="flex items-center gap-2">
                <span className="text-2xl">{data.emoji}</span>
                <span className="capitalize font-medium">{type}</span>
                <div className="flex gap-1">
                  {data.colors.map(color => (
                    <div 
                      key={color} 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainSwitch;