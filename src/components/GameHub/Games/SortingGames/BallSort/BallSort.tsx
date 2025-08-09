import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GameHeader } from '../../GameHeader';
import { HowToPlayDialog, CustomizationDialog, CompletionDialog } from '../../GameDialogs';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SortItRightGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Tube {
  id: string;
  balls: string[];
  maxCapacity: number;
}

const ballSets: Record<string, string[]> = {
  classic: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
  sports: ['⚽', '🏀', '🏈', '⚾', '⚫', '🏐'],
  gems: ['💎', '🔶', '🔷', '🔺', '🔻', '🔹'],
  fancy: ['⚫', '🏉', '🥎', '🧶','💣', '⚪'] 
};

const bgThemes = ['Emerald Mist', 'Sunset Glow', 'Ocean Breeze'];
const containerTypes = ['Rounded Glass', 'Square Tube', 'Fancy Vase'];
const containerColors = ['Emerald', 'Sky Blue', 'Lavender'];
const liquidStyles = ['None','Solid', 'Gradient', 'Animated'];
const hurdleOptions = ['None', 'Sticky Ball', 'Color Trap'];

const BallSort: React.FC<SortItRightGameProps> = ({ onBack, onStatsUpdate }) => {
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [history, setHistory] = useState<Tube[][]>([]);
  const [ballSet, setBallSet] = useState('classic');
  const [progress, setProgress] = useState(0);
  const [bgTheme, setBgTheme] = useState(bgThemes[0]);
  const [containerType, setContainerType] = useState(containerTypes[0]);
  const [containerColor, setContainerColor] = useState(containerColors[0]);
  const [liquidStyle, setLiquidStyle] = useState(liquidStyles[0]);
  const [hurdle, setHurdle] = useState(hurdleOptions[0]);
  const [hurdlesEnabled, setHurdlesEnabled] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [levelReady, setLevelReady] = useState(false);

const containerColorMap = {
  'Rounded Glass': 'border-blue-400',
  'Square Tube': 'border-gray-400',
  'Fancy Vase': 'border-pink-400',
};


  const ballColors = ballSets[ballSet];

  useEffect(() => {
    if (!gameComplete && timerActive) {
      const interval = setInterval(() => {
        setTime(t => t + 1);
        setProgress(p => Math.min(100, p + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameComplete, timerActive]);

  const generateLevel = (levelNum: number) => {
    const numColors = Math.min(3 + levelNum, ballColors.length);
    const tubesNeeded = numColors + 2;
    const newTubes: Tube[] = [];

    const allBalls: string[] = [];
    for (let i = 0; i < numColors; i++) {
      for (let j = 0; j < 4; j++) {
        allBalls.push(ballColors[i]);
      }
    }
    for (let i = allBalls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allBalls[i], allBalls[j]] = [allBalls[j], allBalls[i]];
    }

    for (let i = 0; i < tubesNeeded; i++) {
      const tubeBalls = i < numColors ? allBalls.slice(i * 4, (i + 1) * 4) : [];
      newTubes.push({ id: `tube-${i}`, balls: tubeBalls, maxCapacity: 4 });
    }

    setTubes(newTubes);
    setMoves(0);
    setScore(0);
    setTime(0);
    setGameComplete(false);
    setSelectedTube(null);
    setHistory([]);
    setTimerActive(true);
    setProgress(0);
    setTimeout(() => setLevelReady(true), 500); // wait half a second

  };

  useEffect(() => {
    generateLevel(level);
  }, [level, ballSet]);

  useEffect(() => {
  if (levelReady) checkWinCondition();
}, [tubes, levelReady]);


  const checkWinCondition = () => {
    const nonEmptyTubes = tubes.filter(tube => tube.balls.length > 0);
    const isComplete = nonEmptyTubes.every(tube => {
      if (tube.balls.length === 0) return true;
      if (tube.balls.length !== 4) return false;
      return tube.balls.every(ball => ball === tube.balls[0]);
    });

    if (isComplete && !gameComplete) {
      setGameComplete(true);
      setTimerActive(false);
      toast({
        title: '🎉 Level Complete!',
        description: `Level ${level} completed in ${moves} moves and ${time}s!`,
      });
    }
  };

  const handleTubeClick = (tubeId: string) => {
    if (gameComplete) return;
    const tube = tubes.find(t => t.id === tubeId);
    if (!tube) return;

    if (selectedTube === null) {
      if (tube.balls.length > 0) {
        setSelectedTube(tubeId);
      }
    } else if (selectedTube === tubeId) {
      setSelectedTube(null);
    } else {
      const fromTube = tubes.find(t => t.id === selectedTube);
      const toTube = tube;

      if (fromTube && canMoveBall(fromTube, toTube)) {
        const cloned = JSON.parse(JSON.stringify(tubes));
        setHistory(prev => [...prev, cloned]);
        moveBall(fromTube, toTube);
        setMoves(m => m + 1);
        setScore(s => s + 10);
        playSoundEffect();
      } else {
        toast({ title: 'Invalid Move', description: 'Balls must match!' });
      }
      setSelectedTube(null);
    }
  };

const canMoveBall = (fromTube: Tube, toTube: Tube): boolean => {
  if (fromTube.balls.length === 0 || toTube.balls.length >= toTube.maxCapacity) return false;

  const topFrom = fromTube.balls[fromTube.balls.length - 1];
  const topTo = toTube.balls[toTube.balls.length - 1];

  if (hurdlesEnabled) {
    if (hurdle === 'Sticky Ball' && fromTube.balls.length > 2) {
      toast({ title: '🚫 Sticky Ball Active', description: 'Too many balls to move with Sticky Ball!' });
      return false;
    }
    if (hurdle === 'Color Trap' && topFrom !== topTo && toTube.balls.length > 0) {
      toast({ title: '🎯 Color Trap Triggered', description: 'Only same colors allowed!' });
      return false;
    }
  }

  return topTo === undefined || topFrom === topTo;
};


  const moveBall = (fromTube: Tube, toTube: Tube) => {
    setTubes(prev => {
      const newTubes = [...prev];
      const from = { ...newTubes.find(t => t.id === fromTube.id)! };
      const to = { ...newTubes.find(t => t.id === toTube.id)! };
      const ballToMove = from.balls[from.balls.length - 1];
      let moveCount = 0;

      for (let i = from.balls.length - 1; i >= 0; i--) {
        if (from.balls[i] === ballToMove && to.balls.length + moveCount < to.maxCapacity) {
          moveCount++;
        } else {
          break;
        }
      }

      from.balls = from.balls.slice(0, -moveCount);
      to.balls.push(...Array(moveCount).fill(ballToMove));

      return newTubes.map(t =>
        t.id === from.id ? from : t.id === to.id ? to : t
      );
    });
  };

  const undo = () => {
    const prev = [...history];
    const last = prev.pop();
    if (last) {
      setTubes(last);
      setMoves(m => m - 1);
      setScore(s => s - 10);
      setHistory(prev);
    }
  };

  const playSoundEffect = () => {
    const audio = new Audio('/sounds/pop.mp3');
    audio.play();
  };

const themeClass = `${bgTheme.replace(/ /g, '-').toLowerCase()}-theme`;

return (
  <div className={`min-h-screen p-4 ${themeClass}`}>
     <div className="max-w-5xl mx-auto space-y-4">
        <GameHeader
          title="🎈 Ball Sort Puzzle"
          level={level}
          score={score}
          timeLeft={time}
          moves={moves}
          progress={progress}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowCustomization={() => setShowCustomization(true)}
          onGoBack={onBack}
          onGoHome={() => window.location.href = '/'}
        />

        <HowToPlayDialog
          open={showHowToPlay}
          onOpenChange={setShowHowToPlay}
          title="Ball Sort Puzzle"
          instructions={[
            "Click on a tube to select it (must have balls)",
            "Click on another tube to move balls of the same color",
            "All balls of the same color will move together",
            "Complete a level by sorting all balls by color",
            "Each tube must contain only one color when full"
          ]}
          tips={[
            "Plan your moves carefully - you can undo if needed",
            "Use empty tubes strategically",
            "Try to create combos for higher scores"
          ]}
        />

        <CustomizationDialog
          open={showCustomization}
          onOpenChange={setShowCustomization}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ball Type</label>
              <Select value={ballSet} onValueChange={setBallSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ballSets).map(setKey => (
                    <SelectItem key={setKey} value={setKey}>
                      {setKey.charAt(0).toUpperCase() + setKey.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Background Theme</label>
              <Select value={bgTheme} onValueChange={setBgTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bgThemes.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

           <div>
  <label className="text-sm font-medium">Container Type</label>
  <Select value={containerType} onValueChange={(val) => {
    setContainerType(val);
    toast({ title: '✅ Container Type Changed', description: `Now using: ${val}` });
  }}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {containerTypes.map(t => (
        <SelectItem key={t} value={t}>{t}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>




            <div>
              <label className="text-sm font-medium">Liquid Style</label>
              <Select value={liquidStyle} onValueChange={setLiquidStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {liquidStyles.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

    
            <div className="relative transition transform duration-300 ease-in-out">
              <div className={`w-20 h-40 p-2 shadow-2xl bg-white relative overflow-hidden border-4 ${
                containerType === 'Rounded Glass' ? 'rounded-2xl' :
                containerType === 'Square Tube' ? 'rounded-sm' :
                'rounded-full'
              } ${containerColorMap[containerType]}`}>

                {/* 🧱 HURDLE ICON OVERLAY */}
                {hurdlesEnabled && (
                  <div className="absolute top-1 left-1 z-20 text-lg">
                    {hurdle === 'Sticky Ball' && '🧲'}
                    {hurdle === 'Color Trap' && '🎯'}
                  </div>
                )}

                {liquidStyle !== 'None' && (
                  <div className={`absolute bottom-2 left-2 right-2 h-1/4 rounded-t-xl z-0 liquid-${liquidStyle.toLowerCase()}`}></div>
                )}

                <div className="flex flex-col-reverse h-full justify-start gap-1 relative z-10">
                  {ballColors.slice(0, 3).map((ball, i) => (
                    <div
                      key={i}
                      className="text-2xl text-center leading-none animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.6s' }}
                    >
                      {ball}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm mt-1">3/4</div>
            </div>


          </div>
        </CustomizationDialog>

        <CompletionDialog
          open={gameComplete}
          onOpenChange={setGameComplete}
          title="Level Complete!"
          score={score}
          stats={[
            { label: "Moves", value: moves },
            { label: "Time", value: `${time}s` },
            { label: "Level", value: level }
          ]}
          onNextLevel={() => setLevel(level + 1)}
          onRestart={() => generateLevel(level)}
          onGoHome={() => window.location.href = '/'}
        />

        <div className="flex flex-wrap justify-center gap-6">
          {tubes.map(tube => (
            <div
              key={tube.id}
              onClick={() => handleTubeClick(tube.id)}
              className={`relative transition transform duration-300 ease-in-out ${
                selectedTube === tube.id ? 'scale-110 ring-4 ring-emerald-400' : 'hover:scale-105'
              }`}
            >
        <div className={`w-20 h-40 p-2 shadow-2xl bg-white relative overflow-hidden border-4 ${
  containerType === 'Rounded Glass' ? 'rounded-2xl' :
  containerType === 'Square Tube' ? 'rounded-sm' :
  'rounded-full'
} ${containerColorMap[containerType]}`}>

                {liquidStyle !== 'None' && (
                  <div className={`absolute bottom-2 left-2 right-2 h-1/4 rounded-t-xl z-0 liquid-${liquidStyle.toLowerCase()}`}></div>
                )}
                <div className="flex flex-col-reverse h-full justify-start gap-1 relative z-10">
                  {tube.balls.map((ball, i) => (
                      <div
                      key={i}
                      className="text-2xl text-center leading-none animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.6s' }}
                    >
                      {ball}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm mt-1">{tube.balls.length}/{tube.maxCapacity}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Button onClick={() => generateLevel(level)} variant="outline">🔄 Restart</Button>
          <Button onClick={undo} variant="secondary" disabled={history.length === 0}>↩️ Undo</Button>
        </div>
      </div>

       <style>
        {`
          .liquid-solid {
            background-color: rgba(0, 255, 127, 0.3);
          }

          .liquid-gradient {
            background: linear-gradient(to top, #a0f0da, transparent);
          }

.emerald-mist-theme {
  background: linear-gradient(to bottom, #a7f3d0, #34d399);
}

.sunset-glow-theme {
  background: linear-gradient(to bottom, #fcd34d, #f472b6);
}

.ocean-breeze-theme {
  background: linear-gradient(to bottom, #93c5fd, #3b82f6);
}

          .liquid-animated {
            background: repeating-linear-gradient(
              to top,
              #10b981 0%,
              #10b981 20%,
              #d1fae5 20%,
              #d1fae5 40%
            );
            animation: shimmer 2s linear infinite;
            background-size: 100% 200%;
          }

          @keyframes shimmer {
            0% { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
          }
        `}
      </style>
      
    </div>
  );
};

export default BallSort;
