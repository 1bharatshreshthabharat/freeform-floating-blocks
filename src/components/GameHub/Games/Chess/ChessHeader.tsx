
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
    <div className="flex justify-between items-center mb-6">
      <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Hub</span>
      </Button>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
        ♛ Master Chess
      </h1>
      <div className="flex space-x-2">
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
