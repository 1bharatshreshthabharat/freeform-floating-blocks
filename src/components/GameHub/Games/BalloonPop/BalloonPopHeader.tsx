
import React, {useState} from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BalloonPopCustomizeModal } from './BalloonPopCustomizeModal';
import { ArrowLeft, Volume2, VolumeX, HelpCircle, Settings } from 'lucide-react';

interface BalloonPopHeaderProps {
  onBack: () => void;
}

export const BalloonPopHeader: React.FC<BalloonPopHeaderProps> = ({ onBack }) => {
  const { 
    state, 
    toggleSound,
    dispatch
  } = useBalloonPopGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showInstructions = () => {
    dispatch({ type: 'SHOW_INSTRUCTIONS' });
  };

  const [showCustomize, setShowCustomize] = useState(false);

  return (
    
   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ml-2 my-6">
  {/* Back Button */}
  <div className="flex justify-start">
    <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
      <ArrowLeft className="h-4 w-4" />
      <span>Back to Hub</span>
    </Button>
  </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center">
          🎈 Balloon Pop Learning
        </h1>

{/* Right Buttons */}
  <div className="flex flex-wrap justify-center gap-2">
    <Button
          onClick={showInstructions}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white text-purple-600 border-purple-300"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          How to Play
        </Button>

   {/* Customize Button for Active Game */}
        {true && (
            <Button
              onClick={() => setShowCustomize(true)}
              variant="outline"
              size="sm"
              className="bg-white/90 border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
        )}

                {/* Customize Modal */}
        <BalloonPopCustomizeModal 
          isOpen={showCustomize} 
          onClose={() => setShowCustomize(false)} 
        />

        <Button
          onClick={toggleSound}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          {state.soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
  </div>
</div>

  );
};
