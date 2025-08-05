import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, Eye, EyeOff, Download } from 'lucide-react';
import { DrawingCanvas } from './DrawingCanvas';
import { GameHeader } from './GameHeader';
import { CompletionModal } from './CompletionModal';
import { AnimatedCompletion } from './AnimatedCompletion';
import { ReferenceImage } from './ReferenceImage';
import { outlineDatabase } from './outlineDatabase';
import { GameMode, ColoringOutline, GameStats } from './types';

interface ColorMyWorldGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const ColorMyWorldGame: React.FC<ColorMyWorldGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentOutline, setCurrentOutline] = useState<ColoringOutline | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [gameMode, setGameMode] = useState<GameMode>('realistic');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedSections, setCompletedSections] = useState<Map<string, string>>(new Map());
  const [showCompletion, setShowCompletion] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [showOutlines, setShowOutlines] = useState(true);
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [usedOutlines, setUsedOutlines] = useState<Set<string>>(new Set());
  const [showReference, setShowReference] = useState(true);
  const canvasRef = useRef<SVGSVGElement>(null);

  const [gameStats, setGameStats] = useState<GameStats>({
    totalOutlinesCompleted: 0,
    totalScore: 0,
    fastestCompletion: Infinity,
    perfectRounds: 0,
    hintsUsed: 0
  });

  useEffect(() => {
    loadRandomOutline();
  }, []);

  const loadRandomOutline = () => {
    // Get available outlines (not recently used)
    const availableOutlines = outlineDatabase.filter(outline => !usedOutlines.has(outline.id));
    
    // If all outlines have been used, reset the used set
    if (availableOutlines.length === 0) {
      setUsedOutlines(new Set());
      const randomIndex = Math.floor(Math.random() * outlineDatabase.length);
      setCurrentOutline(outlineDatabase[randomIndex]);
      setUsedOutlines(new Set([outlineDatabase[randomIndex].id]));
    } else {
      const randomIndex = Math.floor(Math.random() * availableOutlines.length);
      const selectedOutline = availableOutlines[randomIndex];
      setCurrentOutline(selectedOutline);
      setUsedOutlines(prev => new Set([...prev, selectedOutline.id]));
    }
    
    resetGameState();
  };

  const resetGameState = () => {
    setCompletedSections(new Map());
    setHintsUsed(0);
    setTimeStarted(Date.now());
    setShowHint(false);
    setShowAnimation(false);
    setShowCompletion(false);
  };

  const handleSectionFill = (sectionId: string, color: string) => {
    if (!currentOutline) return;

    const newCompleted = new Map(completedSections);
    newCompleted.set(sectionId, color);
    setCompletedSections(newCompleted);

    // Advanced scoring system
    let sectionScore = 10;
    if (gameMode === 'realistic') {
      const section = currentOutline.sections.find(s => s.id === sectionId);
      if (section && section.suggestedColor === color) {
        sectionScore = 25; // Higher bonus for exact color match
      } else if (section && isColorSimilar(section.suggestedColor, color)) {
        sectionScore = 18; // Partial bonus for similar colors
      }
    } 
    
    // Combo bonus for consecutive correct colors
    if (gameMode === 'realistic' && sectionScore > 15) {
      const comboMultiplier = Math.min(2, 1 + (newCompleted.size * 0.1));
      sectionScore = Math.floor(sectionScore * comboMultiplier);
    }
    
    setScore(prev => prev + sectionScore);

    // Check if outline is complete
    const totalSections = currentOutline.sections.length + (currentOutline.missingParts?.length || 0);
    if (newCompleted.size === totalSections) {
      handleCompletion();
    }
  };

  const isColorSimilar = (color1: string, color2: string): boolean => {
    // Simple color similarity check - could be enhanced with proper color distance calculation
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    return distance < 100; // Threshold for similar colors
  };

  const handleCompletion = () => {
    if (!currentOutline) return;

    const completionTime = Date.now() - timeStarted;
    const timeBonus = Math.max(0, 1000 - Math.floor(completionTime / 100));
    const hintPenalty = hintsUsed * 15;
    const difficultyBonus = currentOutline.difficulty * 50;
    const perfectBonus = hintsUsed === 0 ? 200 : 0;
    
    const finalScore = timeBonus - hintPenalty + difficultyBonus + perfectBonus;
    setScore(prev => prev + finalScore);
    
    // Update game stats
    const newStats = {
      ...gameStats,
      totalOutlinesCompleted: gameStats.totalOutlinesCompleted + 1,
      totalScore: gameStats.totalScore + finalScore,
      fastestCompletion: Math.min(gameStats.fastestCompletion, completionTime),
      perfectRounds: hintsUsed === 0 ? gameStats.perfectRounds + 1 : gameStats.perfectRounds,
      hintsUsed: gameStats.hintsUsed + hintsUsed
    };
    setGameStats(newStats);
    onStatsUpdate(newStats);
    
    // Show animation first, then completion modal
    setTimeout(() => setShowAnimation(true), 500);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowCompletion(true);
  };

  const handleNextOutline = () => {
    setShowCompletion(false);
    setLevel(prev => prev + 1);
    loadRandomOutline();
  };

  const handleSkip = () => {
    // Small penalty for skipping
    setScore(prev => Math.max(0, prev - 25));
    loadRandomOutline();
  };

  const handleReset = () => {
    resetGameState();
  };

  const handleHint = () => {
    if (gameMode === 'realistic' && currentOutline && hintsUsed < 5) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 10)); // Increased penalty for hint
      setTimeout(() => setShowHint(false), 4000); // Longer hint display
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const svgData = new XMLSerializer().serializeToString(canvasRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        
        const link = document.createElement('a');
        link.download = `colored-${currentOutline?.name || 'artwork'}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  if (!currentOutline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600 animate-pulse flex items-center gap-2">
          <Palette className="h-8 w-8" />
          Loading Color My World...
        </div>
      </div>
    );
  }

  const canNext = completedSections.size === currentOutline.sections.length + (currentOutline.missingParts?.length || 0);
  const canSkip = completedSections.size < (currentOutline.sections.length + (currentOutline.missingParts?.length || 0)) / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Compact Header */}
     <GameHeader
  onBack={onBack}
  score={score}
  level={level}
  onModeChange={(mode) => setGameMode(mode)}
  outlineName={currentOutline.category}
/>
      {/* Single Page Layout */}
      <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-80px)] ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Compact Color Palette */}
          <Card className="lg:col-span-1 p-3 bg-white/90 backdrop-blur-sm shadow-xl max-h-full overflow-y-auto">
            <div className="space-y-3">

              {/* Compact Color Grid */}
              <div className="grid grid-cols-8 gap-2">
                {[
                  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
                  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
                  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'
                ].map(color => (
                 
                   <button
      key={color}
      aria-label={`Select color ${color}`}
      onClick={() => setSelectedColor(color)}
      className={`w-5 h-5 rounded-full border-1 shadow-sm transition-transform duration-200 ease-in-out
        ${selectedColor === color
          ? 'border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-300'
          : 'border-gray-300 hover:scale-105'}`}
      style={{ backgroundColor: color }}
    />

                ))}
              </div>

              {/* Control Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowOutlines(!showOutlines)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    {showOutlines ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-3">
                <div className="flex gap-2">
                  {canSkip && (
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      Skip
                    </Button>
                  )}
                  {canNext && (
                    <Button
                      onClick={handleNextOutline}
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      Next
                    </Button>
                  )}
                </div>

                {gameMode === 'realistic' && hintsUsed < 5 && (
                  <Button
                    onClick={handleHint}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Hint ({5 - hintsUsed} left)
                  </Button>
                )}

                <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Progress Info */}
              {/* <div className="text-xs text-gray-600 space-y-1">
                <div>Progress: {completedSections.size}/{currentOutline.sections.length + (currentOutline.missingParts?.length || 0)}</div>
                <div>Hints used: {hintsUsed}</div>
              </div> */}



          <div className="flex flex-wrap items-center gap-3 justify-center mt-4">
          <Card className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-md shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-700">{score}</div>
                <div className="text-xs text-yellow-600">Score</div>
              </div>
            </div>
          </Card>

          <Card className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-md shadow-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-700">{level}</div>
              <div className="text-xs text-purple-600">Level</div>
            </div>
          </Card>
<Card className="px-4 py-2 bg-green-100 border border-green-300 rounded-md shadow-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-700"> {completedSections.size}/{currentOutline.sections.length + (currentOutline.missingParts?.length || 0)}</div>
              <div className="text-xs text-green-600">Progress</div>
            </div>
          </Card>      
        </div>
            </div>
          </Card>

          {/* Responsive Drawing Canvas - Fixed and Centered */}
          <Card className="lg:col-span-3 p-3 bg-white/90 backdrop-blur-sm shadow-xl relative ">
            <div className="h-[calc(100vh-200px)] w-full relative flex items-center justify-center">
              <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
               
                  <div className="w-full h-full flex items-center justify-center">
                    <DrawingCanvas
                      ref={canvasRef}
                      outline={currentOutline}
                      selectedColor={selectedColor}
                      onSectionFill={handleSectionFill}
                      completedSections={completedSections}
                      gameMode={gameMode}
                      showHint={showHint}
                      showOutlines={showOutlines}
                      outlineColor={outlineColor}
                    />
                  </div>
             
              </div>
              
              {/* Reference Image for Realistic Mode - Fixed */}
              {gameMode === 'realistic' && currentOutline && (
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    onClick={() => setShowReference(!showReference)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-white"
                  >
                    {showReference ? 'Hide' : 'Show'} Reference
                  </Button>
                  {showReference && (
                    <div className="absolute top-8 right-0 w-40 h-40 bg-white rounded-lg border-2 shadow-xl p-2 z-20">
                      <img 
                        src={currentOutline.referenceImage || '/placeholder.svg'} 
                        alt="Reference"
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Animated Completion */}
      {showAnimation && currentOutline && (
        <AnimatedCompletion
          outline={currentOutline}
          completedSections={completedSections}
          onAnimationComplete={handleAnimationComplete}
        />
      )}

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        onNext={handleNextOutline}
        score={score}
        timeBonus={Math.max(0, 1000 - Math.floor((Date.now() - timeStarted) / 100))}
        hintsUsed={hintsUsed}
        outlineName={currentOutline.name}
        level={level}
      />
    </div>
  );
};
