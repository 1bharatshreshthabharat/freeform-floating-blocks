import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Compass, RotateCcw, Trophy, Timer, Zap, Star, Target, Settings, Play, Pause, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedMazeGameAppProps {
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
  hasItem?: boolean;
  itemType?: 'coin' | 'key' | 'power' | 'trap';
}

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  duration: number;
}

interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    wall: string;
    path: string;
    player: string;
    exit: string;
  };
  emoji: string;
}

const MAZE_SIZES = {
  easy: { width: 11, height: 11, name: 'Easy' },
  medium: { width: 17, height: 17, name: 'Medium' },
  hard: { width: 23, height: 23, name: 'Hard' },
  expert: { width: 31, height: 31, name: 'Expert' }
};

const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    colors: {
      background: '#f3f4f6',
      wall: '#374151',
      path: '#ffffff',
      player: '#3b82f6',
      exit: '#ef4444'
    },
    emoji: '🏛️'
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '#065f46',
      wall: '#1f2937',
      path: '#d1fae5',
      player: '#f59e0b',
      exit: '#dc2626'
    },
    emoji: '🌲'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: '#0c4a6e',
      wall: '#1e40af',
      path: '#dbeafe',
      player: '#f97316',
      exit: '#dc2626'
    },
    emoji: '🌊'
  },
  {
    id: 'space',
    name: 'Space',
    colors: {
      background: '#1f2937',
      wall: '#6b21a8',
      path: '#f3f4f6',
      player: '#10b981',
      exit: '#dc2626'
    },
    emoji: '🚀'
  }
];

export const EnhancedMazeGameApp: React.FC<EnhancedMazeGameAppProps> = ({ onBack, onStatsUpdate }) => {
  const [mazeSize, setMazeSize] = useState<keyof typeof MAZE_SIZES>('easy');
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
  const [level, setLevel] = useState(1);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionPath, setSolutionPath] = useState<Position[]>([]);
  const [gameMode, setGameMode] = useState<'normal' | 'timed'>('normal');
  const [isPaused, setIsPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!gameWon && !isPaused) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [startTime, gameWon, isPaused]);

  const generateMaze = useCallback((width: number, height: number): { maze: MazeCell[][], solution: Position[] } => {
    // Ensure odd dimensions for proper maze generation
    const w = width % 2 === 0 ? width + 1 : width;
    const h = height % 2 === 0 ? height + 1 : height;
    
    // Initialize maze with all walls
    const newMaze: MazeCell[][] = Array(h).fill(null).map(() =>
      Array(w).fill(null).map(() => ({
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
        hasItem: false
      }))
    );

    // Recursive backtracking maze generation
    const stack: Position[] = [];
    const current = { x: 0, y: 0 };
    newMaze[current.y][current.x].visited = true;

    const getUnvisitedNeighbors = (x: number, y: number): Position[] => {
      const neighbors = [];
      if (y >= 2 && !newMaze[y - 2][x].visited) neighbors.push({ x, y: y - 2 });
      if (x <= w - 3 && !newMaze[y][x + 2].visited) neighbors.push({ x: x + 2, y });
      if (y <= h - 3 && !newMaze[y + 2][x].visited) neighbors.push({ x, y: y + 2 });
      if (x >= 2 && !newMaze[y][x - 2].visited) neighbors.push({ x: x - 2, y });
      return neighbors;
    };

    const removeWall = (current: Position, next: Position) => {
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const wallX = current.x + dx / 2;
      const wallY = current.y + dy / 2;

      if (dx === 2) {
        newMaze[current.y][current.x].walls.right = false;
        newMaze[wallY][wallX].walls.right = false;
        newMaze[wallY][wallX].walls.left = false;
        newMaze[next.y][next.x].walls.left = false;
      } else if (dx === -2) {
        newMaze[current.y][current.x].walls.left = false;
        newMaze[wallY][wallX].walls.left = false;
        newMaze[wallY][wallX].walls.right = false;
        newMaze[next.y][next.x].walls.right = false;
      } else if (dy === 2) {
        newMaze[current.y][current.x].walls.bottom = false;
        newMaze[wallY][wallX].walls.bottom = false;
        newMaze[wallY][wallX].walls.top = false;
        newMaze[next.y][next.x].walls.top = false;
      } else if (dy === -2) {
        newMaze[current.y][current.x].walls.top = false;
        newMaze[wallY][wallX].walls.top = false;
        newMaze[wallY][wallX].walls.bottom = false;
        newMaze[next.y][next.x].walls.bottom = false;
      }
    };

    // Generate maze
    while (true) {
      const neighbors = getUnvisitedNeighbors(current.x, current.y);
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(current, next);
        newMaze[next.y][next.x].visited = true;
        
        // Clear wall between current and next
        const wallX = current.x + (next.x - current.x) / 2;
        const wallY = current.y + (next.y - current.y) / 2;
        newMaze[wallY][wallX].visited = true;
        
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

    // Find solution path using A*
    const solution = findPath(newMaze, { x: 0, y: 0 }, { x: w - 1, y: h - 1 });
    
    // Add collectible items
    addItemsToMaze(newMaze, solution);

    return { maze: newMaze, solution };
  }, []);

  const findPath = (maze: MazeCell[][], start: Position, end: Position): Position[] => {
    const openSet = [start];
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const heuristic = (a: Position, b: Position) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start, end));

    while (openSet.length > 0) {
      const current = openSet.reduce((lowest, pos) => 
        (fScore.get(key(pos)) || Infinity) < (fScore.get(key(lowest)) || Infinity) ? pos : lowest
      );

      if (current.x === end.x && current.y === end.y) {
        const path = [];
        let temp = current;
        while (temp) {
          path.unshift(temp);
          temp = cameFrom.get(key(temp))!;
        }
        return path;
      }

      openSet.splice(openSet.indexOf(current), 1);

      const neighbors = getValidNeighbors(maze, current);
      for (const neighbor of neighbors) {
        const tentativeGScore = (gScore.get(key(current)) || Infinity) + 1;

        if (tentativeGScore < (gScore.get(key(neighbor)) || Infinity)) {
          cameFrom.set(key(neighbor), current);
          gScore.set(key(neighbor), tentativeGScore);
          fScore.set(key(neighbor), tentativeGScore + heuristic(neighbor, end));

          if (!openSet.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return [];
  };

  const getValidNeighbors = (maze: MazeCell[][], pos: Position): Position[] => {
    const neighbors = [];
    const { x, y } = pos;

    if (y > 0 && !maze[y][x].walls.top) neighbors.push({ x, y: y - 1 });
    if (x < maze[0].length - 1 && !maze[y][x].walls.right) neighbors.push({ x: x + 1, y });
    if (y < maze.length - 1 && !maze[y][x].walls.bottom) neighbors.push({ x, y: y + 1 });
    if (x > 0 && !maze[y][x].walls.left) neighbors.push({ x: x - 1, y });

    return neighbors;
  };

  const addItemsToMaze = (maze: MazeCell[][], solution: Position[]) => {
    const availableCells = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (!maze[y][x].walls.top || !maze[y][x].walls.right || 
            !maze[y][x].walls.bottom || !maze[y][x].walls.left) {
          if (!solution.some(pos => pos.x === x && pos.y === y)) {
            availableCells.push({ x, y });
          }
        }
      }
    }

    // Add coins
    const numCoins = Math.floor(availableCells.length * 0.1);
    for (let i = 0; i < numCoins && availableCells.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const cell = availableCells.splice(randomIndex, 1)[0];
      maze[cell.y][cell.x].hasItem = true;
      maze[cell.y][cell.x].itemType = 'coin';
    }

    setTotalCoins(numCoins);
  };

  const initializeGame = useCallback(() => {
    const { width, height } = MAZE_SIZES[mazeSize];
    const { maze: newMaze, solution } = generateMaze(width, height);
    
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setEndPos({ x: width - 1, y: height - 1 });
    setGameWon(false);
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCoinsCollected(0);
    setSolutionPath(solution);
    setShowSolution(false);
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

    if (Math.abs(dx) + Math.abs(dy) !== 1) return false;

    if (dx === 1) return !maze[from.y][from.x].walls.right;
    if (dx === -1) return !maze[from.y][from.x].walls.left;
    if (dy === 1) return !maze[from.y][from.x].walls.bottom;
    if (dy === -1) return !maze[from.y][from.x].walls.top;

    return false;
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameWon || isPaused) return;

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

      // Check for items
      if (maze[newPos.y][newPos.x].hasItem) {
        const itemType = maze[newPos.y][newPos.x].itemType;
        if (itemType === 'coin') {
          setCoinsCollected(prev => prev + 1);
          setScore(prev => prev + 10);
          toast.success('+10 points! Coin collected! 💰');
        }
        
        // Remove item
        const newMaze = [...maze];
        newMaze[newPos.y][newPos.x].hasItem = false;
        newMaze[newPos.y][newPos.x].itemType = undefined;
        setMaze(newMaze);
      }

      // Check for win
      if (newPos.x === endPos.x && newPos.y === endPos.y) {
        const completionTime = Date.now() - startTime;
        setGameWon(true);
        
        // Calculate score
        const timeBonus = Math.max(0, 30000 - completionTime) / 100;
        const moveBonus = Math.max(0, 500 - moves) * 2;
        const coinBonus = coinsCollected * 50;
        const difficultyMultiplier = 
          mazeSize === 'easy' ? 1 : 
          mazeSize === 'medium' ? 2 : 
          mazeSize === 'hard' ? 3 : 4;
        const totalScore = (timeBonus + moveBonus + coinBonus) * difficultyMultiplier;
        
        setScore(prev => prev + totalScore);
        setMazesCompleted(prev => {
          const newCount = prev + 1;
          if (newCount % 5 === 0) {
            setLevel(prev => prev + 1);
            toast.success(`🎉 Level Up! You're now level ${level + 1}!`);
          }
          
          onStatsUpdate({
            totalScore: score + totalScore,
            totalCompleted: newCount,
            bestTime: bestTime ? Math.min(bestTime, completionTime) : completionTime,
            level: level + (newCount % 5 === 0 ? 1 : 0)
          });
          return newCount;
        });

        if (!bestTime || completionTime < bestTime) {
          setBestTime(completionTime);
        }

        toast.success(`🎉 Maze completed! +${Math.floor(totalScore)} points!`);
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': 
        case 'w': 
        case 'W': 
          e.preventDefault(); 
          movePlayer('up'); 
          break;
        case 'ArrowDown': 
        case 's': 
        case 'S': 
          e.preventDefault(); 
          movePlayer('down'); 
          break;
        case 'ArrowLeft': 
        case 'a': 
        case 'A': 
          e.preventDefault(); 
          movePlayer('left'); 
          break;
        case 'ArrowRight': 
        case 'd': 
        case 'D': 
          e.preventDefault(); 
          movePlayer('right'); 
          break;
        case ' ':
          e.preventDefault();
          setShowSolution(!showSolution);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameWon, maze, showSolution]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getCellStyle = (x: number, y: number) => {
    const cell = maze[y]?.[x];
    if (!cell) return {};

    const theme = selectedTheme.colors;
    const borderWidth = '2px';
    
    return {
      backgroundColor: theme.path,
      borderTop: cell.walls.top ? `${borderWidth} solid ${theme.wall}` : `${borderWidth} solid transparent`,
      borderRight: cell.walls.right ? `${borderWidth} solid ${theme.wall}` : `${borderWidth} solid transparent`,
      borderBottom: cell.walls.bottom ? `${borderWidth} solid ${theme.wall}` : `${borderWidth} solid transparent`,
      borderLeft: cell.walls.left ? `${borderWidth} solid ${theme.wall}` : `${borderWidth} solid transparent`,
    };
  };

  const progressToNextLevel = () => {
    return ((mazesCompleted % 5) / 5) * 100;
  };

  const cellSize = mazeSize === 'easy' ? 20 : mazeSize === 'medium' ? 16 : mazeSize === 'hard' ? 12 : 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Compact Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-600" />
                <h1 className="text-lg font-bold text-emerald-700">Maze Adventures</h1>
                <span className="text-lg">{selectedTheme.emoji}</span>
              </div>
            </div>
            
            {/* Compact Stats */}
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-medium">
                <Timer className="h-3 w-3 inline mr-1" />
                {formatTime(elapsedTime)}
              </div>
              <div className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-medium">
                Moves: {moves}
              </div>
              <div className="bg-green-100 px-2 py-1 rounded text-green-800 font-medium">
                Score: {score}
              </div>
              <div className="bg-purple-100 px-2 py-1 rounded text-purple-800 font-medium">
                L{level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Row Layout */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          
          {/* Controls Panel - Compact */}
          <Card className="lg:col-span-1 p-3 bg-white/95 backdrop-blur-sm h-fit">
            {/* Quick Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Controls</h3>
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant="outline"
                  size="sm"
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Difficulty</label>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(MAZE_SIZES).map(([key, size]) => (
                    <Button
                      key={key}
                      onClick={() => setMazeSize(key as keyof typeof MAZE_SIZES)}
                      variant={mazeSize === key ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      {size.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Theme</label>
                <div className="grid grid-cols-2 gap-1">
                  {THEMES.map(theme => (
                    <Button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      variant={selectedTheme.id === theme.id ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      {theme.emoji} {theme.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <Button
                  onClick={initializeGame}
                  className="w-full mb-2"
                  size="sm"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  New Maze
                </Button>
                
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {showSolution ? 'Hide' : 'Show'} Path
                </Button>
              </div>

              {/* Progress */}
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded text-center">
                <div className="text-sm font-bold">Level {level}</div>
                <Progress value={progressToNextLevel()} className="mt-1 bg-white/20" />
                <div className="text-xs mt-1">{mazesCompleted % 5}/5 mazes</div>
              </div>

              {/* Stats */}
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Coins:</span>
                  <span className="font-bold text-yellow-600">{coinsCollected}/{totalCoins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Time:</span>
                  <span className="font-bold text-blue-600">{bestTime ? formatTime(bestTime) : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-bold text-green-600">{mazesCompleted}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Maze Area */}
          <Card className="lg:col-span-3 p-4 bg-white/95 backdrop-blur-sm">
            <div className="flex justify-center">
              <div 
                className="grid border-2 border-gray-300 relative"
                style={{
                  gridTemplateColumns: `repeat(${maze[0]?.length || 1}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${maze.length || 1}, ${cellSize}px)`,
                  backgroundColor: selectedTheme.colors.background,
                  maxWidth: '90vw',
                  maxHeight: '70vh'
                }}
              >
                {maze.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="relative"
                      style={{
                        ...getCellStyle(x, y),
                        width: `${cellSize}px`,
                        height: `${cellSize}px`
                      }}
                    >
                      {/* Player */}
                      {playerPos.x === x && playerPos.y === y && (
                        <div
                          className="absolute inset-0 rounded-full animate-pulse"
                          style={{ 
                            backgroundColor: selectedTheme.colors.player,
                            margin: '2px'
                          }}
                        />
                      )}
                      
                      {/* Exit */}
                      {endPos.x === x && endPos.y === y && (
                        <div
                          className="absolute inset-0 rounded-full animate-bounce"
                          style={{ 
                            backgroundColor: selectedTheme.colors.exit,
                            margin: '3px'
                          }}
                        />
                      )}
                      
                      {/* Items */}
                      {cell.hasItem && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs animate-pulse">
                          {cell.itemType === 'coin' && '💰'}
                        </div>
                      )}
                      
                      {/* Solution Path */}
                      {showSolution && solutionPath.some(pos => pos.x === x && pos.y === y) && (
                        <div className="absolute inset-0 bg-yellow-300 opacity-50 rounded" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Game Instructions */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Use arrow keys or WASD to move • Space to toggle solution • Collect coins for bonus points!
              {gameWon && (
                <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-lg font-bold">
                  🎉 Congratulations! Maze completed in {formatTime(elapsedTime)} with {moves} moves!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};