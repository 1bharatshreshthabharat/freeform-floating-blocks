
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useSnakeGame } from './SnakeGameProvider';

export const SnakeControls: React.FC = () => {
  const { 
    gameState,
    score,
    highScore,
    level,
    gridSize,
    boardTheme,
    snakeType,
    snakeColor,
    powerUp,
    setGameState,
    setGridSize,
    setBoardTheme,
    setSnakeType,
    setSnakeColor,
    startGame
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

      {/* Snake Customization */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Snake Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Snake Type</Label>
            <Select value={snakeType} onValueChange={setSnakeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="3">3D Style</SelectItem>
                <SelectItem value="pixelated">Pixelated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Snake Color</Label>
            <Select value={snakeColor} onValueChange={setSnakeColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="#4CAF50">🟢 Green</SelectItem>
                <SelectItem value="#FF5722">🔴 Red</SelectItem>
                <SelectItem value="#2196F3">🔵 Blue</SelectItem>
                <SelectItem value="#FF9800">🟠 Orange</SelectItem>
                <SelectItem value="#9C27B0">🟣 Purple</SelectItem>
                <SelectItem value="#FFD700">🟡 Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Board Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Board Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Board Theme</Label>
            <Select value={boardTheme} onValueChange={setBoardTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="retro">Retro</SelectItem>
                <SelectItem value="desert">Desert</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grid Size: {gridSize}x{gridSize}</Label>
            <Slider
              value={[gridSize]}
              onValueChange={([value]) => setGridSize(value)}
              min={15}
              max={30}
              step={1}
            />
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-600">
              Use arrow keys or WASD to change direction
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Collect power-ups for special abilities!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
