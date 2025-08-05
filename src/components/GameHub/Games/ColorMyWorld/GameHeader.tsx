import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, Brush } from 'lucide-react';
import { GameMode } from './types';

interface GameHeaderProps {
  onBack: () => void;
  score: number;
  level: number;
  onModeChange: (mode: GameMode) => void;
  outlineName: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onBack,
  score,
  level,
  onModeChange,
  outlineName,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b-4 border-purple-300 shadow-md p-4">
        
        {/* Left - Back + Title */}
        <div className="flex items-start sm:items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center justify-center gap-3">
  <Palette className="w-8 h-8 text-purple-600" />
  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
    Color My World
  </h1>
</div>

        </div>

        {/* Right - Score + Level + Mode */}
        {/* <div className="flex flex-wrap items-center gap-3 justify-center mt-4">
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

      
        </div> */}
    </header>
  );
};
