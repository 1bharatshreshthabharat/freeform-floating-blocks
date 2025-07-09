
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star, Palette, Brush } from 'lucide-react';
import { GameMode } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GameHeaderProps {
  onBack: () => void;
  score: number;
  level: number;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  outlineName: string;
  category: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onBack,
  score,
  level,
  gameMode,
  onModeChange,
  outlineName,
  category
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b-4 border-purple-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white/80 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎨 Color My World
              </h1>
              <p className="text-sm text-gray-600">
                Coloring {outlineName} • {category}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-700">{score}</div>
                  <div className="text-xs text-yellow-600">Score</div>
                </div>
              </div>
            </Card>

            <Card className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">Level {level}</div>
                <div className="text-xs text-purple-600">Progress</div>
              </div>
            </Card>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/80 hover:bg-white">
                  {gameMode === 'realistic' ? (
                    <Palette className="h-4 w-4 mr-2" />
                  ) : (
                    <Brush className="h-4 w-4 mr-2" />
                  )}
                  {gameMode === 'realistic' ? 'Realistic' : 'Creative'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem
                  onClick={() => onModeChange('realistic')}
                  className="cursor-pointer"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Realistic Mode
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onModeChange('creative')}
                  className="cursor-pointer"
                >
                  <Brush className="h-4 w-4 mr-2" />
                  Creative Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
