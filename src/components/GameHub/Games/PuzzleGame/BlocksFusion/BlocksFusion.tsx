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

interface BlockFusionGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

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

const BlocksFusion: React.FC<BlockFusionGameProps> = ({ onBack, onStatsUpdate }) => {
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
  const [theme, setTheme] = useState('cosmic');
  const [difficulty, setDifficulty] = useState('normal');
  const [chainReaction, setChainReaction] = useState(false);
  const [megaCombo, setMegaCombo] = useState(0);
  const [perfectMerges, setPerfectMerges] = useState(0);

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

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const generateGrid = () => {
    const level = levels[currentLevel - 1];
    const newGrid: (Block | null)[][] = Array(level.gridSize).fill(null).map(() => Array(level.gridSize).fill(null));
    const newBlocks: Block[] = [];

    // Fill 60% of grid with random blocks
    const totalCells = level.gridSize * level.gridSize;
    const blocksToPlace = Math.floor(totalCells * 0.6);

    for (let i = 0; i < blocksToPlace; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * level.gridSize);
        y = Math.floor(Math.random() * level.gridSize);
      } while (newGrid[y][x] !== null);

      const colorIndex = Math.floor(Math.random() * level.blockTypes);
      const block: Block = {
        id: `block-${i}`,
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
  };

  const startGame = () => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(level.timeLimit);
    setScore(0);
    generateGrid();
  };

  const selectBlock = (block: Block) => {
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(prev => prev.filter(b => b.id !== block.id));
    } else {
      setSelectedBlocks(prev => [...prev, block]);
    }
  };

  const canMerge = (blocksToMerge: Block[]): boolean => {
    if (blocksToMerge.length < 2) return false;
    
    // Check if all blocks have the same color
    const firstColor = blocksToMerge[0].color;
    const sameColor = blocksToMerge.every(block => block.color === firstColor);
    
    if (!sameColor) return false;

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
      if (blocksToMerge.length > 2 && !hasAdjacent) return false;
    }

    return true;
  };

  const mergeBlocks = () => {
    if (!canMerge(selectedBlocks)) {
      toast({
        title: "Can't merge! ❌",
        description: "Blocks must be the same color and adjacent!",
      });
      return;
    }

    const level = levels[currentLevel - 1];
    const mergeCount = selectedBlocks.length;
    const baseScore = selectedBlocks.reduce((sum, block) => sum + block.value, 0);
    const comboMultiplier = 1 + (combos * 0.5);
    const mergeBonus = mergeCount * 20;
    const totalScore = Math.floor((baseScore + mergeBonus) * comboMultiplier);

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
    const newGrid = [...grid];
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
  };

  const nextLevel = () => {
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
  };

  const endGame = () => {
    setGameStarted(false);
    toast({
      title: "Block Fusion Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  };

  const getBlockEmoji = (block: Block) => {
    const colorIndex = blockColors.indexOf(block.color);
    let emoji = blockEmojis[colorIndex] || '⬜';
    
    if (block.type === 'merged') {
      emoji = '⭐';
    } else if (block.type === 'super') {
      emoji = '💎';
    }
    
    return emoji;
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🧩⭐💎</div>
            <h2 className="text-3xl font-bold mb-4 text-white">Blocks Fusion</h2>
            <p className="text-gray-300 mb-6">
              Merge blocks of the same color to create powerful new blocks! 
              Connect adjacent blocks and watch them fuse into something amazing. 
              Chain combos for massive scores!
            </p>
            <Button onClick={startGame} className="w-full text-lg py-6">
              Start Fusing! ⚡
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <CompletionDialog
          open={true}
          onOpenChange={() => {}}
          title="Fusion Complete!"
          score={score}
          stats={[
            { label: "Max Combo", value: combos },
            { label: "Perfect Merges", value: perfectMerges },
            { label: "Level Reached", value: currentLevel }
          ]}
          onRestart={() => { setCurrentLevel(1); startGame(); }}
          onGoHome={() => window.location.href = '/'}
        />
      </div>
    );
  }

  const level = levels[currentLevel - 1];
  const progressPercent = (score / level.targetScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-white">
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
          onGoBack={onBack}
          onGoHome={() => window.location.href = '/'}
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
                  <SelectItem value="cosmic">Cosmic</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="retro">Retro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
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

            <div>
              <label className="text-sm font-medium">Chain Reactions</label>
              <Button 
                onClick={() => setChainReaction(!chainReaction)} 
                variant={chainReaction ? "default" : "outline"}
                className="w-full"
              >
                {chainReaction ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CustomizationDialog>

        <CompletionDialog
          open={showCompletion}
          onOpenChange={setShowCompletion}
          title="Level Complete!"
          score={score}
          stats={[
            { label: "Time Left", value: `${timeLeft}s` },
            { label: "Max Combo", value: `x${combos}` },
            { label: "Perfect Merges", value: perfectMerges }
          ]}
          onNextLevel={() => nextLevel()}
          onRestart={() => startGame()}
          onGoHome={() => window.location.href = '/'}
          isLastLevel={currentLevel >= levels.length}
        />

        {/* Instructions */}
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
            className="grid gap-2 p-4 bg-black/30 rounded-lg"
            style={{ 
              gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${level.gridSize}, 1fr)` 
            }}
          >
            {grid.map((row, y) => 
              row.map((block, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-12 h-12 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    block ? 'hover:scale-110 ' : 'bg-gray-800/50'
                  } ${
                    block && selectedBlocks.includes(block) ? 'ring-4 ring-yellow-400 scale-110' : ''
                  } ${
                    block?.merging ? 'animate-pulse scale-125' : ''
                  }`}
                  style={{
                    backgroundColor: block ? block.color : undefined,
                    opacity: block ? 0.9 : 0.3
                  }}
                  onClick={() => block && selectBlock(block)}
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
          <div className="flex justify-center gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocksFusion;