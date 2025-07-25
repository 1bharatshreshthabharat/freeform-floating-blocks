import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Compass, RotateCcw, Trophy, Timer } from 'lucide-react';

interface MazeGameAppProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Position {
  x: number;
  y: number;
}

interface MazeCell {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isPath?: boolean;
}

const MAZE_SIZES = {
  easy: { width: 8, height: 8, name: 'Easy (8x8)' },
  medium: { width: 12, height: 12, name: 'Medium (12x12)' },
  hard: { width: 16, height: 16, name: 'Hard (16x16)' }
};

export const MazeGameApp: React.FC<MazeGameAppProps> = ({ onBack, onStatsUpdate }) => {
  const [mazeSize, setMazeSize] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState<Position>({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [mazesCompleted, setMazesCompleted] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (!gameWon) {
      const timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [startTime, gameWon]);

  const generateMaze = useCallback((width: number, height: number): MazeCell[][] => {
    // Initialize maze with all walls
    const newMaze: MazeCell[][] = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => ({
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      }))
    );

    // Maze generation using recursive backtracking
    const stack: Position[] = [];
    const current = { x: 0, y: 0 };
    newMaze[current.y][current.x].visited = true;

    const getNeighbors = (x: number, y: number): Position[] => {
      const neighbors = [];
      if (y > 1 && !newMaze[y - 2][x].visited) neighbors.push({ x, y: y - 2 });
      if (x < width - 2 && !newMaze[y][x + 2].visited) neighbors.push({ x: x + 2, y });
      if (y < height - 2 && !newMaze[y + 2][x].visited) neighbors.push({ x, y: y + 2 });
      if (x > 1 && !newMaze[y][x - 2].visited) neighbors.push({ x: x - 2, y });
      return neighbors;
    };

    const removeWall = (current: Position, next: Position) => {
      const dx = next.x - current.x;
      const dy = next.y - current.y;

      if (dx === 2) {
        newMaze[current.y][current.x].walls.right = false;
        newMaze[current.y][current.x + 1].walls.right = false;
        newMaze[current.y][current.x + 1].walls.left = false;
        newMaze[next.y][next.x].walls.left = false;
      } else if (dx === -2) {
        newMaze[current.y][current.x].walls.left = false;
        newMaze[current.y][current.x - 1].walls.left = false;
        newMaze[current.y][current.x - 1].walls.right = false;
        newMaze[next.y][next.x].walls.right = false;
      } else if (dy === 2) {
        newMaze[current.y][current.x].walls.bottom = false;
        newMaze[current.y + 1][current.x].walls.bottom = false;
        newMaze[current.y + 1][current.x].walls.top = false;
        newMaze[next.y][next.x].walls.top = false;
      } else if (dy === -2) {
        newMaze[current.y][current.x].walls.top = false;
        newMaze[current.y - 1][current.x].walls.top = false;
        newMaze[current.y - 1][current.x].walls.bottom = false;
        newMaze[next.y][next.x].walls.bottom = false;
      }
    };

    while (true) {
      const neighbors = getNeighbors(current.x, current.y);
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(current, next);
        newMaze[next.y][next.x].visited = true;
        stack.push({ ...current });
        current.x = next.x;
        current.y = next.y;
      } else if (stack.length > 0) {
        const prev = stack.pop()!;
        current.x = prev.x;
        current.y = prev.y;
      } else {
        break;
      }
    }

    return newMaze;
  }, []);

  const initializeGame = useCallback(() => {
    const { width, height } = MAZE_SIZES[mazeSize];
    const newMaze = generateMaze(width, height);
    
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setEndPos({ x: width - 1, y: height - 1 });
    setGameWon(false);
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, [mazeSize, generateMaze]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const canMoveTo = (from: Position, to: Position): boolean => {
    if (to.x < 0 || to.y < 0 || to.y >= maze.length || to.x >= maze[0].length) {
      return false;
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (dx === 1) return !maze[from.y][from.x].walls.right;
    if (dx === -1) return !maze[from.y][from.x].walls.left;
    if (dy === 1) return !maze[from.y][from.x].walls.bottom;
    if (dy === -1) return !maze[from.y][from.x].walls.top;

    return false;
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameWon) return;

    const newPos = { ...playerPos };
    
    switch (direction) {
      case 'up': newPos.y -= 1; break;
      case 'down': newPos.y += 1; break;
      case 'left': newPos.x -= 1; break;
      case 'right': newPos.x += 1; break;
    }

    if (canMoveTo(playerPos, newPos)) {
      setPlayerPos(newPos);
      setMoves(prev => prev + 1);

      // Check for win
      if (newPos.x === endPos.x && newPos.y === endPos.y) {
        const completionTime = Date.now() - startTime;
        setGameWon(true);
        
        // Calculate score
        const timeBonus = Math.max(0, 10000 - completionTime);
        const moveBonus = Math.max(0, 1000 - moves * 10);
        const difficultyMultiplier = mazeSize === 'easy' ? 1 : mazeSize === 'medium' ? 2 : 3;
        const totalScore = (timeBonus + moveBonus) * difficultyMultiplier;
        
        setScore(prev => prev + totalScore);
        setMazesCompleted(prev => {
          const newCount = prev + 1;
          onStatsUpdate({
            totalScore: score + totalScore,
            totalCompleted: newCount,
            bestTime: bestTime ? Math.min(bestTime, completionTime) : completionTime
          });
          return newCount;
        });

        if (!bestTime || completionTime < bestTime) {
          setBestTime(completionTime);
        }
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); movePlayer('up'); break;
        case 'ArrowDown': e.preventDefault(); movePlayer('down'); break;
        case 'ArrowLeft': e.preventDefault(); movePlayer('left'); break;
        case 'ArrowRight': e.preventDefault(); movePlayer('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameWon, maze]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getCellStyle = (x: number, y: number) => {
    const cell = maze[y]?.[x];
    if (!cell) return {};

    const borderStyle = '2px solid #374151';
    
    return {
      borderTop: cell.walls.top ? borderStyle : '2px solid transparent',
      borderRight: cell.walls.right ? borderStyle : '2px solid transparent',
      borderBottom: cell.walls.bottom ? borderStyle : '2px solid transparent',
      borderLeft: cell.walls.left ? borderStyle : '2px solid transparent',
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Maze Adventures</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <Timer className="h-3 w-3 inline mr-1" />
                {formatTime(elapsedTime)}
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="font-medium text-yellow-800">Moves: {moves}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-medium text-green-800">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1 p-4 bg-white/90 backdrop-blur-sm">
            <h3 className="font-bold text-gray-800 mb-4">Difficulty</h3>
            <div className="space-y-2 mb-6">
              {(Object.keys(MAZE_SIZES) as Array<keyof typeof MAZE_SIZES>).map((size) => (
                <Button
                  key={size}
                  onClick={() => setMazeSize(size)}
                  variant={mazeSize === size ? 'default' : 'outline'}
                  className="w-full"
                  disabled={!gameWon && moves > 0}
                >
                  {MAZE_SIZES[size].name}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <Button onClick={initializeGame} className="w-full" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Maze
              </Button>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Instructions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use arrow keys to move</li>
                  <li>• Reach the red exit</li>
                  <li>• Faster time = higher score</li>
                  <li>• Fewer moves = bonus points</li>
                </ul>
              </div>

              {bestTime && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold">Best Time</span>
                  </div>
                  <div className="text-sm text-yellow-700">{formatTime(bestTime)}</div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div>Mazes Completed: {mazesCompleted}</div>
                  <div>Current Difficulty: {MAZE_SIZES[mazeSize].name}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Maze */}
          <Card className="lg:col-span-3 p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Navigate to the Exit! 🎯
              </h2>
              <p className="text-gray-600">
                Use arrow keys or tap direction buttons to move
              </p>
            </div>

            {maze.length > 0 && (
              <div className="flex justify-center mb-6">
                <div 
                  className="inline-grid gap-0 bg-gray-800 p-2 rounded-lg"
                  style={{ 
                    gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
                    maxWidth: '90vw',
                    maxHeight: '60vh'
                  }}
                >
                  {maze.map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${x}-${y}`}
                        className="relative bg-white"
                        style={{
                          width: `${Math.min(400 / maze[0].length, 25)}px`,
                          height: `${Math.min(400 / maze.length, 25)}px`,
                          ...getCellStyle(x, y)
                        }}
                      >
                        {/* Player */}
                        {playerPos.x === x && playerPos.y === y && (
                          <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse" 
                               style={{ margin: '2px' }} />
                        )}
                        
                        {/* Exit */}
                        {endPos.x === x && endPos.y === y && (
                          <div className="absolute inset-0 bg-red-500 animate-bounce"
                               style={{ margin: '2px' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Mobile Controls */}
            <div className="flex justify-center lg:hidden">
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button onClick={() => movePlayer('up')} variant="outline" size="sm">
                  ↑
                </Button>
                <div></div>
                <Button onClick={() => movePlayer('left')} variant="outline" size="sm">
                  ←
                </Button>
                <div></div>
                <Button onClick={() => movePlayer('right')} variant="outline" size="sm">
                  →
                </Button>
                <div></div>
                <Button onClick={() => movePlayer('down')} variant="outline" size="sm">
                  ↓
                </Button>
                <div></div>
              </div>
            </div>

            {gameWon && (
              <div className="mt-6 text-center p-6 bg-green-100 border border-green-300 rounded-lg">
                <div className="text-2xl font-bold text-green-800 mb-2">🎉 Maze Completed! 🎉</div>
                <div className="text-green-700 space-y-1">
                  <div>Time: {formatTime(elapsedTime)}</div>
                  <div>Moves: {moves}</div>
                  <div>Score: +{Math.floor(score / mazesCompleted)} points</div>
                </div>
                <Button 
                  onClick={initializeGame} 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Next Maze
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};