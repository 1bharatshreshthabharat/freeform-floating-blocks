import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GameHeader } from '../GameHeader';
import { HowToPlayDialog, CustomizationDialog, CompletionDialog } from '../GameDialogs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Block {
  id: string;
  type: 'basic' | 'merged' | 'super'; 
  color: string;
  value: number;
  x: number;
  y: number;
  merging: boolean;
}

interface GameLevel {
  level: number;
  timeLimit: number;
  gridSize: number;
  targetScore: number;
  blockTypes: number;
  challenges: string[];
  hurdles: string[];
  theme: string;
}

interface GameSettings {
  theme: string;
  difficulty: string;
  chainReaction: boolean;
  soundEffects: boolean;
  animations: boolean;
  blockAppearance: 'emoji' | 'shape' | 'both';
  gridOpacity: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'cosmic',
  difficulty: 'normal',
  chainReaction: false,
  soundEffects: true,
  animations: true,
  blockAppearance: 'both',
  gridOpacity: 70,
};

const BlocksFusion: React.FC = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const [combos, setCombos] = useState(0);
  const [grid, setGrid] = useState<(Block | null)[][]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [powerUps, setPowerUps] = useState<{type: string, active: boolean, uses: number}[]>([]);
  const [obstacles, setObstacles] = useState<{x: number, y: number, type: string}[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [chainReaction, setChainReaction] = useState(false);
  const [megaCombo, setMegaCombo] = useState(0);
  const [perfectMerges, setPerfectMerges] = useState(0);
  const [gamePaused, setGamePaused] = useState(false);

  const levels: GameLevel[] = [
    { 
      level: 1, timeLimit: 180, gridSize: 6, targetScore: 500, blockTypes: 3,
      challenges: ['Basic fusion'], hurdles: ['None'], theme: 'Fusion Lab'
    },
    { 
      level: 2, timeLimit: 160, gridSize: 7, targetScore: 1000, blockTypes: 4,
      challenges: ['Color mastery', 'Chain reactions'], hurdles: ['Locked blocks'], theme: 'Energy Core'
    },
    { 
      level: 3, timeLimit: 140, gridSize: 8, targetScore: 2000, blockTypes: 5,
      challenges: ['Super fusion', 'Mega combos'], hurdles: ['Gravity wells', 'Time freezes'], theme: 'Quantum Realm'
    },
    { 
      level: 4, timeLimit: 120, gridSize: 8, targetScore: 3500, blockTypes: 6,
      challenges: ['Master fusion', 'Perfect precision'], hurdles: ['Phase shifts', 'Block storms'], theme: 'Cosmic Forge'
    },
    { 
      level: 5, timeLimit: 100, gridSize: 9, targetScore: 5000, blockTypes: 7,
      challenges: ['Ultimate fusion', 'Legendary combos'], hurdles: ['Reality bends', 'Chaos mode'], theme: 'Infinity Engine'
    },
    { 
      level: 6, timeLimit: 90, gridSize: 10, targetScore: 8000, blockTypes: 8,
      challenges: ['Transcendent fusion', 'Divine precision'], hurdles: ['Dimensional rifts', 'Time paradox'], theme: 'Multiverse'
    }
  ];

  const blockColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
  const blockEmojis = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '🩷', '🩵'];
  const blockShapes = ['■', '●', '▲', '◆', '★', '⚫', '⚪', '◼'];

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gamePaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted) {
      endGame();
    }
  }, [timeLeft, gameStarted, gamePaused]);

  // Save settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('blocksFusionSettings');
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
    localStorage.setItem('blocksFusionSettings', JSON.stringify(updatedSettings));
  }, [settings]);

  const generateGrid = useCallback(() => {
    const level = levels[currentLevel - 1];
    const newGrid: (Block | null)[][] = Array(level.gridSize).fill(null).map(() => Array(level.gridSize).fill(null));
    const newBlocks: Block[] = [];

    // Fill 60% of grid with random blocks
    const totalCells = level.gridSize * level.gridSize;
    const blocksToPlace = Math.floor(totalCells * 0.6);

    for (let i = 0; i < blocksToPlace; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * level.gridSize);
        y = Math.floor(Math.random() * level.gridSize);
        attempts++;
        if (attempts > 100) break; // Prevent infinite loops
      } while (newGrid[y][x] !== null);

      if (attempts > 100) continue; // Skip if we couldn't find a spot

      const colorIndex = Math.floor(Math.random() * level.blockTypes);
      const block: Block = {
        id: `block-${Date.now()}-${i}`,
        type: 'basic',
        color: blockColors[colorIndex],
        value: 10,
        x,
        y,
        merging: false
      };

      newGrid[y][x] = block;
      newBlocks.push(block);
    }

    setGrid(newGrid);
    setBlocks(newBlocks);
    setSelectedBlocks([]);
    setCombos(0);
  }, [currentLevel, levels]);

  const startGame = useCallback(() => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generateGrid();
  }, [currentLevel, generateGrid, levels]);

  const selectBlock = useCallback((block: Block) => {
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(prev => prev.filter(b => b.id !== block.id));
    } else {
      // Validate we're not selecting too many blocks
      if (selectedBlocks.length >= 6) {
        toast({
          title: "Selection Limit",
          description: "You can select up to 6 blocks at a time",
          variant: "destructive"
        });
        return;
      }
      setSelectedBlocks(prev => [...prev, block]);
    }
  }, [selectedBlocks, toast]);

  const canMerge = useCallback((blocksToMerge: Block[]): boolean => {
    if (blocksToMerge.length < 2) return false;
    
    // Check if all blocks have the same color
    const firstColor = blocksToMerge[0].color;
    const sameColor = blocksToMerge.every(block => block.color === firstColor);
    
    if (!sameColor) {
      toast({
        title: "Color Mismatch",
        description: "All blocks must be the same color to merge",
        variant: "destructive"
      });
      return false;
    }

    // Check if blocks are adjacent
    for (let i = 0; i < blocksToMerge.length; i++) {
      const block = blocksToMerge[i];
      const hasAdjacent = blocksToMerge.some(otherBlock => {
        if (otherBlock.id === block.id) return false;
        const dx = Math.abs(otherBlock.x - block.x);
        const dy = Math.abs(otherBlock.y - block.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      });
      
      if (blocksToMerge.length === 2 && i === 0) continue;
      if (blocksToMerge.length > 2 && !hasAdjacent) {
        toast({
          title: "Not Adjacent",
          description: "All blocks must be adjacent to at least one other block",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  }, [toast]);

  const mergeBlocks = useCallback(() => {
    if (!canMerge(selectedBlocks)) return;

    const level = levels[currentLevel - 1];
    const mergeCount = selectedBlocks.length;
    const baseScore = selectedBlocks.reduce((sum, block) => sum + block.value, 0);
    
    // Apply difficulty multiplier
    let difficultyMultiplier = 1;
    switch (settings.difficulty) {
      case 'easy': difficultyMultiplier = 0.8; break;
      case 'hard': difficultyMultiplier = 1.3; break;
      default: difficultyMultiplier = 1;
    }

    const comboMultiplier = 1 + (combos * 0.5);
    const mergeBonus = mergeCount * 20;
    const totalScore = Math.floor((baseScore + mergeBonus) * comboMultiplier * difficultyMultiplier);

    // Create new merged block
    const firstBlock = selectedBlocks[0];
    let newBlockType: 'basic' | 'merged' | 'super' = 'merged';
    let newValue = baseScore * 2;

    if (mergeCount >= 4) {
      newBlockType = 'super';
      newValue = baseScore * 3;
    }

    const newBlock: Block = {
      id: `merged-${Date.now()}`,
      type: newBlockType,
      color: firstBlock.color,
      value: newValue,
      x: firstBlock.x,
      y: firstBlock.y,
      merging: true
    };

    // Update grid and blocks
    const newGrid = [...grid.map(row => [...row])];
    const newBlocks = blocks.filter(block => !selectedBlocks.includes(block));

    // Clear old positions
    selectedBlocks.forEach(block => {
      newGrid[block.y][block.x] = null;
    });

    // Place new block
    newGrid[newBlock.y][newBlock.x] = newBlock;
    newBlocks.push(newBlock);

    setGrid(newGrid);
    setBlocks(newBlocks);
    setSelectedBlocks([]);
    setScore(prev => prev + totalScore);
    setCombos(prev => prev + 1);

    // Check for perfect merge (all possible blocks of this color)
    const allBlocksOfColor = blocks.filter(b => b.color === firstBlock.color);
    if (mergeCount === allBlocksOfColor.length) {
      setPerfectMerges(prev => prev + 1);
      toast({
        title: "Perfect Merge! ✨",
        description: `You merged all ${firstBlock.color} blocks! +50 bonus`,
      });
      setScore(prev => prev + 50);
    }

    // Remove merging animation after delay
    setTimeout(() => {
      setBlocks(prev => prev.map(block => 
        block.id === newBlock.id ? { ...block, merging: false } : block
      ));
    }, 500);

    toast({
      title: `${mergeCount}-Block Fusion! 🎯`,
      description: `+${totalScore} points! Combo x${combos + 1}`,
    });

    // Check win condition
    if (score + totalScore >= level.targetScore) {
      setTimeout(() => {
        if (currentLevel < levels.length) {
          nextLevel();
        } else {
          endGame();
        }
      }, 1000);
    }

    // Handle chain reactions if enabled
    if (settings.chainReaction) {
      const adjacentBlocks = getAdjacentBlocks(newBlock, newGrid);
      const sameColorAdjacent = adjacentBlocks.filter(b => b.color === newBlock.color);
      if (sameColorAdjacent.length >= 2) {
        setTimeout(() => {
          setSelectedBlocks(sameColorAdjacent.concat(newBlock));
          mergeBlocks();
        }, 300);
      }
    }
  }, [selectedBlocks, canMerge, currentLevel, levels, settings.difficulty, settings.chainReaction, combos, grid, blocks, score, toast]);

  const getAdjacentBlocks = (block: Block, grid: (Block | null)[][]) => {
    const adjacent: Block[] = [];
    const { x, y } = block;
    const directions = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];

    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length) {
        const adjacentBlock = grid[newY][newX];
        if (adjacentBlock) {
          adjacent.push(adjacentBlock);
        }
      }
    }

    return adjacent;
  };

  const nextLevel = useCallback(() => {
    setCurrentLevel(prev => prev + 1);
    toast({
      title: "Fusion Complete! 🎉",
      description: `Moving to level ${currentLevel + 1}!`,
    });
    setTimeout(() => {
      const nextLevelData = levels[currentLevel];
      setTimeLeft(nextLevelData.timeLimit);
      generateGrid();
    }, 1500);
  }, [currentLevel, generateGrid, levels, toast]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setShowCompletion(true);
    toast({
      title: "Block Fusion Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  }, [score, toast]);

  const getBlockEmoji = useCallback((block: Block) => {
    const colorIndex = blockColors.indexOf(block.color);
    
    if (settings.blockAppearance === 'emoji') {
      let emoji = blockEmojis[colorIndex] || '⬜';
      if (block.type === 'merged') emoji = '⭐';
      if (block.type === 'super') emoji = '💎';
      return emoji;
    } else if (settings.blockAppearance === 'shape') {
      let shape = blockShapes[colorIndex] || '◻';
      if (block.type === 'merged') shape = '✦';
      if (block.type === 'super') shape = '✧';
      return shape;
    } else {
      // Both emoji and shape
      let display = blockEmojis[colorIndex] || '⬜';
      if (block.type === 'merged') display = '⭐';
      if (block.type === 'super') display = '💎';
      return (
        <div className="flex flex-col items-center">
          <span>{display}</span>
          <span className="text-xs">{block.value}</span>
        </div>
      );
    }
  }, [settings.blockAppearance]);

  const resetGame = useCallback(() => {
    setCurrentLevel(1);
    setScore(0);
    setCombos(0);
    setPerfectMerges(0);
    setGameStarted(false);
    setShowTutorial(true);
  }, []);

  const applyThemeStyles = () => {
    const themes: Record<string, string> = {
      cosmic: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
      retro: 'bg-gradient-to-br from-yellow-600 via-red-600 to-pink-600',
      dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700',
      ocean: 'bg-gradient-to-br from-blue-800 via-teal-800 to-emerald-900',
    };
    return themes[settings.theme] || themes.cosmic;
  };

  if (showTutorial) {
    return (
      <div className={`min-h-screen ${applyThemeStyles()} flex items-center justify-center p-6`}>
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🧩⭐💎</div>
            <h2 className="text-3xl font-bold mb-4">Blocks Fusion</h2>
            <p className="text-muted-foreground mb-6">
              Merge blocks of the same color to create powerful new blocks! 
              Connect adjacent blocks and watch them fuse into something amazing. 
              Chain combos for massive scores!
            </p>
            <div className="space-y-3"> 
              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all"
              >
                Start Game! 🎮
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
          title="Fusion Complete!"
          score={score}
          stats={[
            { label: "Max Combo", value: combos },
            { label: "Perfect Merges", value: perfectMerges },
            { label: "Level Reached", value: currentLevel }
          ]}
          onRestart={resetGame}
          onGoHome={() => window.location.href = '/'}
          isLastLevel={currentLevel >= levels.length}
        />
      </div>
    );
  }

  const level = levels[currentLevel - 1];
  const progressPercent = Math.min((score / level.targetScore) * 100, 100);
  const timePercentage = (timeLeft / level.timeLimit) * 100;

  return (
    <div className={`min-h-screen ${applyThemeStyles()} p-6 text-white`}>
      <div className="max-w-6xl mx-auto">
        <GameHeader
          title="🧩 Blocks Fusion"
          level={currentLevel}
          score={score}
          targetScore={level.targetScore}
          timeLeft={timeLeft}
          combos={combos}
          progress={progressPercent}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowCustomization={() => setShowCustomization(true)}
          onGoBack={() => window.history.back()}
          onGoHome={() => window.location.href = '/'}
          onPause={() => setGamePaused(!gamePaused)}
          isPaused={gamePaused}
        />

        <HowToPlayDialog
          open={showHowToPlay}
          onOpenChange={setShowHowToPlay}
          title="Blocks Fusion"
          instructions={[
            "Click on blocks of the same color to select them",
            "Selected blocks must be adjacent to each other",
            "Click 'Merge Blocks' to fuse selected blocks together",
            "Merged blocks have higher value and unlock special abilities",
            "Reach the target score before time runs out!"
          ]}
          tips={[
            "Merge 4+ blocks for super blocks with maximum points",
            "Chain merges for combo multipliers",
            "Use empty spaces strategically",
            "Plan ahead - bigger merges give exponential rewards"
          ]}
        />

        <CustomizationDialog
          open={showCustomization}
          onOpenChange={(open) => {
            setShowCustomization(open);
            if (!open) {
              // Save settings when dialog closes
              saveSettings(settings);
            }
          }}
          title="Game Settings"
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="theme-select">Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => saveSettings({ theme: value })}
              >
                <SelectTrigger id="theme-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosmic">Cosmic</SelectItem>
                  <SelectItem value="retro">Retro</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficulty-select">Difficulty</Label>
              <Select 
                value={settings.difficulty} 
                onValueChange={(value) => saveSettings({ difficulty: value })}
              >
                <SelectTrigger id="difficulty-select">
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
              <Label htmlFor="chain-reaction">Chain Reactions</Label>
              <Switch
                id="chain-reaction"
                checked={settings.chainReaction}
                onCheckedChange={(checked) => saveSettings({ chainReaction: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <Switch
                id="sound-effects"
                checked={settings.soundEffects}
                onCheckedChange={(checked) => saveSettings({ soundEffects: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Animations</Label>
              <Switch
                id="animations"
                checked={settings.animations}
                onCheckedChange={(checked) => saveSettings({ animations: checked })}
              />
            </div>

            <div>
              <Label htmlFor="block-appearance">Block Appearance</Label>
              <Select
                value={settings.blockAppearance}
                onValueChange={(value) => saveSettings({ blockAppearance: value as any })}
              >
                <SelectTrigger id="block-appearance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emoji">Emoji Only</SelectItem>
                  <SelectItem value="shape">Shapes Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grid-opacity">Grid Opacity: {settings.gridOpacity}%</Label>
              <Slider
                id="grid-opacity"
                value={[settings.gridOpacity]}
                onValueChange={([value]) => saveSettings({ gridOpacity: value })}
                min={30}
                max={100}
                step={5}
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => {
                  setSettings(DEFAULT_SETTINGS);
                  saveSettings(DEFAULT_SETTINGS);
                }} 
                variant="outline" 
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </CustomizationDialog>

        {/* Game Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-300">Target Score</span>
              <span className="text-2xl font-bold">{level.targetScore}</span>
              <Progress value={progressPercent} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-300">Time Remaining</span>
              <span className="text-2xl font-bold">{timeLeft}s</span>
              <Progress value={timePercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm text-gray-300">Current Combo</span>
              <span className="text-2xl font-bold">x{combos}</span>
              <Progress value={Math.min(combos * 10, 100)} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="text-center mb-6">
          <p className="text-gray-300 mb-4">
            Select same-colored adjacent blocks and merge them! Longer chains = higher scores!
          </p>
          {selectedBlocks.length > 0 && (
            <div className="space-y-2">
              <p>Selected: {selectedBlocks.length} blocks ({selectedBlocks[0].color})</p>
              <div className="space-x-4">
                <Button 
                  onClick={mergeBlocks} 
                  disabled={!canMerge(selectedBlocks)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  ⚡ Merge Blocks
                </Button>
                <Button onClick={() => setSelectedBlocks([])} variant="outline">
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Grid */}
        <div className="flex justify-center">
          <div 
            className="grid gap-2 p-4 rounded-lg"
            style={{ 
              gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${level.gridSize}, 1fr)`,
              backgroundColor: `rgba(0, 0, 0, ${settings.gridOpacity / 100})`
            }}
          >
            {grid.map((row, y) => 
              row.map((block, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    block ? 'hover:scale-110 ' : 'bg-gray-800/50'
                  } ${
                    block && selectedBlocks.includes(block) ? 'ring-4 ring-yellow-400 scale-110' : ''
                  } ${
                    block?.merging && settings.animations ? 'animate-pulse scale-125' : ''
                  }`}
                  style={{
                    backgroundColor: block ? block.color : undefined,
                    borderColor: block ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    opacity: block ? 0.9 : 0.3
                  }}
                  onClick={() => block && !gamePaused && selectBlock(block)}
                >
                  {block && (
                    <div className="text-2xl">
                      {getBlockEmoji(block)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Block Legend */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-bold mb-4">Block Types:</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <span className="text-sm">Basic (10 pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-sm">Merged (20+ pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="text-sm">Super (50+ pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✦</span>
              <span className="text-sm">Perfect Merge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-sm">Chain Reaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocksFusion;