
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Settings, Volume2, VolumeX } from 'lucide-react';
import { useChessGame } from './ChessGameProvider';

interface ChessHeaderProps {
  onBack: () => void;
}

export const ChessHeader: React.FC<ChessHeaderProps> = ({ onBack }) => {
  const { soundEnabled, setSoundEnabled, setShowHowToPlay, setShowCustomization } = useChessGame();

  return (
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
  {/* Back Button */}
  <div>
    <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
      <ArrowLeft className="h-4 w-4" />
      <span>Back to Hub</span>
    </Button>
  </div>

  {/* Title */}
  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center sm:text-left">
    ♛ Master Chess
  </h1>

  {/* Action Buttons */}
  <div className="flex flex-wrap justify-center sm:justify-end gap-2">
    <Button onClick={() => setShowHowToPlay(true)} variant="outline" size="sm">
      <HelpCircle className="h-4 w-4 mr-2" />
      How to Play
    </Button>
    <Button onClick={() => setShowCustomization(true)} variant="outline" size="sm">
      <Settings className="h-4 w-4 mr-2" />
      Customize
    </Button>
    <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="sm">
      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </Button>
  </div>
</div>

  );
};
