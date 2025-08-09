import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, Settings, ArrowLeft, Home } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  level: number;
  score: number;
  timeLeft?: number;
  targetScore?: number;
  moves?: number;
  combos?: number;
  progress?: number;
  onShowHelp: () => void;
  onShowCustomization: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  onPause?: () => void;  // Add this
  isPaused?: boolean;    // Add this
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  level,
  score,
  timeLeft,
  targetScore,
  moves,
  combos,
  progress,
  onShowHelp,
  onShowCustomization,
  onGoBack,
  onGoHome,
  onPause,
  isPaused,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Top Control Buttons */}
      <div className="absolute top-0 left-0 flex gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onGoBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoHome}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Home className="w-4 h-4 mr-1" />
          Home
        </Button>
      </div>

      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowHelp}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          How to Play
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowCustomization}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Settings className="w-4 h-4 mr-1" />
          Customize
        </Button>
        {onPause && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>

      {/* Game Title and Stats */}
      <div className="text-center pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">{title} - Level {level}</h1>
        
        <div className="flex justify-center items-center gap-6 mb-4 text-white">
          <div className="text-lg">🏆 Score: {score}{targetScore ? `/${targetScore}` : ''}</div>
          {timeLeft !== undefined && (
            <div className="text-lg">⏰ Time: {formatTime(timeLeft)}</div>
          )}
          {moves !== undefined && (
            <div className="text-lg">🔄 Moves: {moves}</div>
          )}
          {combos !== undefined && (
            <div className="text-lg">🔥 Combo: x{combos}</div>
          )}
        </div>

        {progress !== undefined && (
          <Progress value={Math.min(progress, 100)} className="w-64 mx-auto" />
        )}
      </div>
    </div>
  );
};