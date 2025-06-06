
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Settings, Volume2, VolumeX } from 'lucide-react';
import { useFlappyGame } from './FlappyGameProvider';

interface FlappyHeaderProps {
  onBack: () => void;
}

export const FlappyHeader: React.FC<FlappyHeaderProps> = ({ onBack }) => {
  const { soundEnabled, setSoundEnabled, setShowHowToPlay, setShowCustomization } = useFlappyGame();

  return (
    <div className="flex justify-between items-center mb-6">
      <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Hub</span>
      </Button>
      <h1 className="text-3xl font-bold text-blue-800">🐦 Flappy Bird</h1>
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
