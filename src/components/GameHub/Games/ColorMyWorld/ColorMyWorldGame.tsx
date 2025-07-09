
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, RotateCcw, Download, Lightbulb, Star } from 'lucide-react';
import { ColorPalette } from './ColorPalette';
import { DrawingCanvas } from './DrawingCanvas';
import { GameHeader } from './GameHeader';
import { CompletionModal } from './CompletionModal';
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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(Date.now());
  const [showHint, setShowHint] = useState(false);
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
    const randomIndex = Math.floor(Math.random() * outlineDatabase.length);
    const outline = outlineDatabase[randomIndex];
    setCurrentOutline(outline);
    setCompletedSections(new Map());
    setHintsUsed(0);
    setTimeStarted(Date.now());
    setShowHint(false);
  };

  const handleSectionFill = (sectionId: string, color: string) => {
    if (!currentOutline) return;

    const newCompleted = new Map(completedSections);
    newCompleted.set(sectionId, color);
    setCompletedSections(newCompleted);

    // Calculate score based on mode and accuracy
    let sectionScore = 10;
    if (gameMode === 'realistic') {
      const section = currentOutline.sections.find(s => s.id === sectionId);
      if (section && section.suggestedColor === color) {
        sectionScore = 20; // Bonus for correct realistic color
      }
    }
    setScore(prev => prev + sectionScore);

    // Check if outline is complete
    if (newCompleted.size === currentOutline.sections.length) {
      const completionTime = Date.now() - timeStarted;
      const timeBonus = Math.max(0, 500 - Math.floor(completionTime / 100));
      const hintPenalty = hintsUsed * 10;
      const finalScore = sectionScore + timeBonus - hintPenalty;
      
      setScore(prev => prev + timeBonus - hintPenalty);
      
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
      
      setTimeout(() => setShowCompletion(true), 800);
    }
  };

  const handleNextOutline = () => {
    setShowCompletion(false);
    setLevel(prev => prev + 1);
    loadRandomOutline();
  };

  const handleReset = () => {
    setCompletedSections(new Map());
    setTimeStarted(Date.now());
    setHintsUsed(0);
    setShowHint(false);
    setScore(0);
  };

  const handleHint = () => {
    if (gameMode === 'realistic' && currentOutline && hintsUsed < 5) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5)); // Small penalty for hint
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const svgData = new XMLSerializer().serializeToString(canvasRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `colored-${currentOutline?.name || 'artwork'}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <GameHeader
        onBack={onBack}
        score={score}
        level={level}
        gameMode={gameMode}
        onModeChange={setGameMode}
        outlineName={currentOutline.name}
        category={currentOutline.category}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Color Palette - Responsive */}
          <Card className="lg:col-span-1 p-3 lg:p-4 bg-white/80 backdrop-blur-sm shadow-xl">
            <ColorPalette
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              gameMode={gameMode}
              currentOutline={currentOutline}
              showHint={showHint}
            />
            
            <div className="mt-4 space-y-2">
              <Button
                onClick={handleHint}
                variant="outline"
                className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300 text-sm"
                disabled={gameMode === 'creative' || hintsUsed >= 5}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint ({5 - hintsUsed} left)
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 text-sm"
                disabled={completedSections.size === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Save Art
              </Button>
            </div>
          </Card>

          {/* Drawing Canvas */}
          <Card className="lg:col-span-3 p-4 lg:p-6 bg-white/80 backdrop-blur-sm shadow-xl">
            <DrawingCanvas
              ref={canvasRef}
              outline={currentOutline}
              selectedColor={selectedColor}
              onSectionFill={handleSectionFill}
              completedSections={completedSections}
              gameMode={gameMode}
              showHint={showHint}
            />
          </Card>
        </div>
      </div>

      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        onNext={handleNextOutline}
        score={score}
        timeBonus={Math.max(0, 500 - Math.floor((Date.now() - timeStarted) / 100))}
        hintsUsed={hintsUsed}
        outlineName={currentOutline.name}
        level={level}
      />
    </div>
  );
};
