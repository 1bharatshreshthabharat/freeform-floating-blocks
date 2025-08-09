import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface BallSortBicolorGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

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
}

const BallSortBicolor: React.FC<BallSortBicolorGameProps> = ({ onBack, onStatsUpdate }) => {
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

  const levels: GameLevel[] = [
    { 
      level: 1, 
      timeLimit: 180, 
      tubeCount: 5, 
      ballsPerTube: 4, 
      colorPairs: [['red', 'blue'], ['green', 'yellow']]
    },
    { 
      level: 2, 
      timeLimit: 160, 
      tubeCount: 6, 
      ballsPerTube: 4, 
      colorPairs: [['red', 'blue'], ['green', 'yellow'], ['purple', 'orange']]
    },
    { 
      level: 3, 
      timeLimit: 140, 
      tubeCount: 7, 
      ballsPerTube: 4, 
      colorPairs: [['red', 'blue'], ['green', 'yellow'], ['purple', 'orange'], ['pink', 'cyan']]
    },
  ];

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
    const newBalls: BicolorBall[] = [];
    const newTubes: BicolorBall[][] = Array(level.tubeCount).fill(null).map(() => []);
    
    let ballId = 0;
    
    // Create sets of bicolor balls for each color pair
    level.colorPairs.forEach(([topColor, bottomColor]) => {
      // Create 4 balls with this color combination
      for (let i = 0; i < level.ballsPerTube; i++) {
        newBalls.push({
          id: `ball-${ballId++}`,
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
  };

  const startGame = () => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generatePuzzle();
  };

  const moveBall = (fromTube: number, toTube: number) => {
    if (fromTube === toTube) {
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
      });
      setSelectedTube(null);
      return;
    }

    // Can't move to full tube
    if (toTubeArray.length >= 4) {
      toast({
        title: "Can't move! ❌",
        description: "The tube is full!",
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
        });
        setSelectedTube(null);
        return;
      }
    }

    // Perform the move
    const newTubes = [...tubes];
    const movedBall = newTubes[fromTube].pop()!;
    movedBall.tube = toTube;
    movedBall.position = newTubes[toTube].length;
    newTubes[toTube].push(movedBall);

    setTubes(newTubes);
    setMoves(prev => prev + 1);
    setSelectedTube(null);

    // Check for completion
    checkWinCondition(newTubes);
  };

  const checkWinCondition = (currentTubes: BicolorBall[][]) => {
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
      const timeBonus = Math.floor(timeLeft / 10);
      const moveBonus = Math.max(0, 50 - moves);
      const totalScore = 200 + timeBonus + moveBonus;
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
      title: "Game Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🏀🎨🔵</div>
            <h2 className="text-3xl font-bold mb-4">Ball Sort Bicolor</h2>
            <p className="text-muted-foreground mb-6">
              Sort bicolor balls into tubes! Each ball has two colors and must be 
              matched with balls of the exact same color combination. More challenging 
              than regular ball sort!
            </p>
            <Button onClick={startGame} className="w-full text-lg py-6">
              Start Sorting! 🏀
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="text-xl mb-4">Final Score: {score}</p>
            <p className="text-muted-foreground mb-6">Moves Used: {moves}</p>
            <div className="space-y-3">
              <Button onClick={() => { setCurrentLevel(1); startGame(); }} className="w-full">
                Play Again 🔄
              </Button>
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="w-full"
              >
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const level = levels[currentLevel - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🏀 Ball Sort Bicolor - Level {currentLevel}</h1>
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="text-xl">🏆 Score: {score}</div>
            <div className="text-xl">⏰ Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            <div className="text-xl">🎯 Moves: {moves}</div>
          </div>
          <Progress value={(timeLeft / level.timeLimit) * 100} className="w-64 mx-auto" />
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Click a tube to select, then click another tube to move the top ball. 
            Bicolor balls must match both colors exactly!
          </p>
        </div>

        {/* Tubes */}
        <div className="flex justify-center gap-4 flex-wrap">
          {tubes.map((tube, tubeIndex) => (
            <Card
              key={tubeIndex}
              className={`w-20 h-60 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedTube === tubeIndex ? 'ring-4 ring-primary' : ''
              } ${tube.length === 0 ? 'bg-gray-100' : ''}`}
              onClick={() => {
                if (selectedTube === null) {
                  setSelectedTube(tubeIndex);
                } else {
                  moveBall(selectedTube, tubeIndex);
                }
              }}
            >
              <CardContent className="p-2 h-full flex flex-col-reverse items-center justify-start">
                {tube.map((ball, ballIndex) => (
                  <div
                    key={ball.id}
                    className="w-14 h-14 rounded-full mb-1 border-2 border-white shadow-lg"
                    style={{
                      background: `linear-gradient(180deg, ${ball.topColor} 50%, ${ball.bottomColor} 50%)`
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Tube Indicator */}
        {selectedTube !== null && (
          <div className="text-center mt-6">
            <p className="text-lg">
              Selected tube {selectedTube + 1}. Click another tube to move the ball!
            </p>
            <Button onClick={() => setSelectedTube(null)} variant="outline" className="mt-2">
              Cancel Selection
            </Button>
          </div>
        )}

        {/* Color Legend */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-bold mb-4">Color Combinations:</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {level.colorPairs.map(([topColor, bottomColor], index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{
                    background: `linear-gradient(180deg, ${topColor} 50%, ${bottomColor} 50%)`
                  }}
                />
                <span className="text-sm capitalize">{topColor}/{bottomColor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BallSortBicolor;
