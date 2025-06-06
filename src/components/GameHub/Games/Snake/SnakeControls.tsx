
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useSnakeGame } from './SnakeGameProvider';

export const SnakeControls: React.FC = () => {
  const { 
    gameState,
    score,
    highScore,
    level,
    powerUp,
    boardTheme,
    snakeType,
    snakeColor,
    setGameState,
    startGame,
    initializeGame
  } = useSnakeGame();

  return (
    <div className="lg:w-80 space-y-4">
      {/* Game Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-600" />
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
          
          <div className="text-center">
            <Badge variant="secondary" className="p-2 w-full">
              <Trophy className="h-4 w-4 mr-1" />
              Best: {highScore}
            </Badge>
          </div>

          {powerUp && (
            <div className="text-center">
              <Badge variant="outline" className="p-2 w-full animate-pulse">
                Power-up: {powerUp}
              </Badge>
            </div>
          )}

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
            <Button onClick={startGame} className="w-full" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Mode */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Current Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Board Theme:</span>
              <Badge variant="outline">{boardTheme}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Snake Type:</span>
              <Badge variant="secondary">{snakeType}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Snake Color:</span>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: snakeColor }}></div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-600">
                Use arrow keys or WASD to change direction
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Collect power-ups for special abilities!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
