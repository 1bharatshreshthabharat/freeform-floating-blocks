
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap, Settings } from 'lucide-react';
import { useFlappyGame } from './FlappyGameProvider';

export const FlappyControls: React.FC = () => {
  const { 
    gameState,
    score,
    highScore,
    level,
    lives,
    setGameState,
    initializeGame,
    setShowCustomization
  } = useFlappyGame();

  return (
    <div className="lg:w-80 space-y-4">
      {/* Game Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Game Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="outline" className="p-2 text-center">
              Score: {score}
            </Badge>
            <Badge variant="secondary" className="p-2 text-center">
              Level: {level}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="outline" className="p-2 text-center">
              Lives: {lives}
            </Badge>
            <Badge variant="secondary" className="p-2 text-center">
              <Trophy className="h-4 w-4 mr-1" />
              Best: {highScore}
            </Badge>
          </div>

          <div className="space-y-2">
            {gameState === 'playing' && (
              <Button onClick={() => setGameState('paused')} className="w-full" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            {gameState === 'paused' && (
              <Button onClick={() => setGameState('playing')} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            <Button onClick={initializeGame} className="w-full" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Game Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowCustomization(true)} className="w-full mb-4">
            Customize Game
          </Button>
          
          <div className="text-xs text-gray-600">
            Tap, click or press space to make the bird flap
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Avoid obstacles and collect points
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
