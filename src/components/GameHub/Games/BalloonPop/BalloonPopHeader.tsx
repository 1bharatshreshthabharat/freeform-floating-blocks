
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Volume2, VolumeX, HelpCircle } from 'lucide-react';

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

  return (
    <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-4 shadow-lg border-b-4 border-yellow-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white text-purple-600 border-purple-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              🎈 Balloon Pop Learning
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={showInstructions}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white text-purple-600 border-purple-300"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </Button>
            <Button
              onClick={toggleSound}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white"
            >
              {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{state.gameStats.score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </Card>

          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{state.gameStats.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
          </Card>

          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{state.gameStats.streak}</div>
              <div className="text-sm text-gray-600">Streak</div>
            </div>
          </Card>

          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(state.gameStats.timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </Card>

          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-pink-600">
                {state.gameStats.correctAnswers}/{state.gameStats.correctAnswers + state.gameStats.wrongAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
