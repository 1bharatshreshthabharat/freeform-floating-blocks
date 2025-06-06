
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useFruitNinja } from './FruitNinjaProvider';

export const FruitNinjaControls: React.FC = () => {
  const { 
    gameState,
    score,
    highScore,
    level,
    combo,
    lives,
    customization,
    setGameState,
    initializeGame
  } = useFruitNinja();

  return (
    <div className="lg:w-80 space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-red-600" />
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
              Combo: {combo}x
            </Badge>
            <Badge variant={lives > 1 ? "secondary" : "destructive"} className="p-2 text-center">
              Lives: {lives}
            </Badge>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="p-2 w-full">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Current Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Difficulty:</span>
              <Badge variant="outline">{customization.difficulty}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Theme:</span>
              <Badge variant="secondary">{customization.backgroundTheme}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Blade:</span>
              <Badge variant="outline">{customization.bladeType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
