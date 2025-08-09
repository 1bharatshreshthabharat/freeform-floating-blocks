import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GameHeader } from '../../GameHeader';
import { HowToPlayDialog, CustomizationDialog, CompletionDialog } from '../../GameDialogs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface TrainSwitchGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

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
  targetPattern: string;
  challenges: string[];
  hurdles: string[];
  theme: string;
}

const TrainSwitch: React.FC<TrainSwitchGameProps> = ({ onBack, onStatsUpdate }) => {
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
  const [theme, setTheme] = useState('classic');
  const [speed, setSpeed] = useState(50);
  const [obstacles, setObstacles] = useState<{trackIndex: number, position: number}[]>([]);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);

  const levels: GameLevel[] = [
    { 
      level: 1, timeLimit: 180, trackCount: 3, carCount: 6, targetPattern: 'color',
      challenges: ['Basic sorting'], hurdles: ['None'], theme: 'Country Station'
    },
    { 
      level: 2, timeLimit: 160, trackCount: 4, carCount: 8, targetPattern: 'type',
      challenges: ['Type sorting', 'Speed control'], hurdles: ['Track limits'], theme: 'City Terminal'
    },
    { 
      level: 3, timeLimit: 140, trackCount: 4, carCount: 12, targetPattern: 'number',
      challenges: ['Number sorting', 'Multi-track'], hurdles: ['Blocked tracks', 'Weight limits'], theme: 'Industrial Yard'
    },
    { 
      level: 4, timeLimit: 120, trackCount: 5, carCount: 15, targetPattern: 'mixed',
      challenges: ['Complex sorting', 'Perfect efficiency'], hurdles: ['Moving obstacles', 'Time pressure'], theme: 'Grand Central'
    },
    { 
      level: 5, timeLimit: 100, trackCount: 6, carCount: 20, targetPattern: 'advanced',
      challenges: ['Master conductor', 'Flawless execution'], hurdles: ['Signal failures', 'Track switching'], theme: 'Quantum Rails'
    },
    { 
      level: 6, timeLimit: 90, trackCount: 7, carCount: 25, targetPattern: 'ultimate',
      challenges: ['Ultimate challenge', 'Legendary precision'], hurdles: ['Chaos mode', 'Reality bends'], theme: 'Infinity Express'
    }
  ];

  const carTypes = {
    passenger: { emoji: '🚃', colors: ['blue', 'red', 'green'] },
    freight: { emoji: '🚛', colors: ['brown', 'gray', 'yellow'] },
    engine: { emoji: '🚂', colors: ['black', 'red'] }
  };

  const trackColors = ['#8B4513', '#4682B4', '#228B22', '#DC143C', '#9932CC'];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const generatePuzzle = () => {
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
        id: `car-${i}`,
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
  };

  const startGame = () => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generatePuzzle();
  };

  const selectCar = (car: TrainCar) => {
    const track = tracks[car.track];
    // Can only select the last car in a track (like a stack)
    if (track[track.length - 1]?.id === car.id) {
      setSelectedCar(car);
    } else {
      toast({
        title: "Can't move! 🚫",
        description: "You can only move the last car in each track!",
      });
    }
  };

  const moveCar = (targetTrackIndex: number) => {
    if (!selectedCar) return;

    const sourceTrackIndex = selectedCar.track;
    if (sourceTrackIndex === targetTrackIndex) {
      setSelectedCar(null);
      return;
    }

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
    const newTracks = [...tracks];
    const carToMove = newTracks[sourceTrackIndex].pop()!;
    carToMove.track = targetTrackIndex;
    carToMove.position = newTracks[targetTrackIndex].length;
    newTracks[targetTrackIndex].push(carToMove);

    setTracks(newTracks);
    setMoves(prev => prev + 1);
    setSelectedCar(null);

    // Check win condition
    checkWinCondition(newTracks);
  };

  const checkWinCondition = (currentTracks: TrainCar[][]) => {
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
      const timeBonus = Math.floor(timeLeft / 10);
      const moveBonus = Math.max(0, 100 - moves * 5);
      const totalScore = 300 + timeBonus + moveBonus;
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
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setTimeout(() => {
      const nextLevelData = levels[currentLevel];
      setTimeLeft(nextLevelData.timeLimit);
      generatePuzzle();
    }, 1000);
  };

  const endGame = () => {
    setGameStarted(false);
    toast({
      title: "Station Master Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🚂🔄🚃</div>
            <h2 className="text-3xl font-bold mb-4">Train Switch</h2>
            <p className="text-muted-foreground mb-6">
              Sort train cars by switching them between tracks! You can only 
              move the last car from each track. Match the target arrangement 
              to complete each level. All aboard!
            </p>
            <Button onClick={startGame} className="w-full text-lg py-6">
              Start Switching! 🚂
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center p-6">
        <CompletionDialog
          open={true}
          onOpenChange={() => {}}
          title="End of the Line!"
          score={score}
          stats={[
            { label: "Total Moves", value: moves },
            { label: "Perfect Sorts", value: perfectSorts },
            { label: "Efficiency", value: `${efficiency}%` }
          ]}
          onRestart={() => { setCurrentLevel(1); startGame(); }}
          onGoHome={() => window.location.href = '/'}
        />
      </div>
    );
  }

  const level = levels[currentLevel - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <GameHeader
          title="🚂 Train Switch"
          level={currentLevel}
          score={score}
          timeLeft={timeLeft}
          moves={moves}
          progress={(timeLeft / level.timeLimit) * 100}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowCustomization={() => setShowCustomization(true)}
          onGoBack={onBack}
          onGoHome={() => window.location.href = '/'}
        />

        <div className="text-center mb-6">
          <p className="text-lg">
            Sort by: <span className="font-bold capitalize">{level.targetPattern}</span>
          </p>
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
          onOpenChange={setShowCustomization}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Speed: {speed}%</label>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                max={100}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Obstacles</label>
              <Button 
                onClick={() => setObstacles(obstacles.length > 0 ? [] : [{trackIndex: 1, position: 2}])} 
                variant={obstacles.length > 0 ? "default" : "outline"}
                className="w-full"
              >
                {obstacles.length > 0 ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CustomizationDialog>

        <CompletionDialog
          open={showCompletion}
          onOpenChange={setShowCompletion}
          title="Perfect Switching!"
          score={score}
          stats={[
            { label: "Moves", value: moves },
            { label: "Efficiency", value: `${efficiency}%` },
            { label: "Bonus", value: `x${bonusMultiplier}` }
          ]}
          onNextLevel={() => nextLevel()}
          onRestart={() => startGame()}
          onGoHome={() => window.location.href = '/'}
          isLastLevel={currentLevel >= levels.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current State */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">🚧 Current Yard</h3>
            <div className="space-y-4">
              {tracks.map((track, trackIndex) => (
                <div key={trackIndex} className="relative">
                  <div 
                    className="h-16 rounded-lg border-4 border-dashed border-gray-400 flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: `${trackColors[trackIndex]}20` }}
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
                          }`}
                          style={{ backgroundColor: car.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCar(car);
                          }}
                        >
                          {carTypes[car.type].emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                  {trackIndex < trackColors.length && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-2 rounded-b-lg"
                      style={{ backgroundColor: trackColors[trackIndex] }}
                    />
                  )}
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
                    className="h-16 rounded-lg border-4 border-green-400 flex items-center px-4"
                    style={{ backgroundColor: `${trackColors[trackIndex]}10` }}
                  >
                    <div className="text-sm font-bold mr-4">Track {trackIndex + 1}</div>
                    <div className="flex space-x-2 overflow-x-auto">
                      {track.map((car) => (
                        <div
                          key={car.id}
                          className="min-w-16 h-12 rounded-lg border-2 border-green-400 flex items-center justify-center text-2xl opacity-80"
                          style={{ backgroundColor: car.color }}
                        >
                          {carTypes[car.type].emoji}
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

        {/* Instructions */}
        <div className="text-center mt-8">
          {selectedCar ? (
            <div className="space-y-4">
              <p className="text-lg">
                Selected: {carTypes[selectedCar.type].emoji} {selectedCar.type} car (#{selectedCar.number})
              </p>
              <p className="text-muted-foreground">
                Click on a track to move this car there, or click the car again to deselect.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Click on the last car in any track to select it, then click a track to move it there.
            </p>
          )}
        </div>

        {/* Car Legend */}
        <div className="mt-8 text-center">
          <h4 className="text-lg font-bold mb-4">🚂 Car Types</h4>
          <div className="flex justify-center gap-6">
            {Object.entries(carTypes).map(([type, data]) => (
              <div key={type} className="flex items-center gap-2">
                <span className="text-2xl">{data.emoji}</span>
                <span className="capitalize font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainSwitch;