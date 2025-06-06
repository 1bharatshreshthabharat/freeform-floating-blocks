
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Settings, Volume2, VolumeX } from 'lucide-react';
import { useSnakeGame } from './SnakeGameProvider';

interface SnakeHeaderProps {
  onBack: () => void;
}

export const SnakeHeader: React.FC<SnakeHeaderProps> = ({ onBack }) => {
  const { soundEnabled, setSoundEnabled, setShowHowToPlay, setShowCustomization } = useSnakeGame();

  return (
    <div className="flex justify-between items-center mb-6">
      <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Hub</span>
      </Button>
      <h1 className="text-3xl font-bold text-green-800">🐍 Advanced Snake</h1>
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
