
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useFlappyGame } from './FlappyGameProvider';

export const FlappyControls: React.FC = () => {
  const { 
    gameState,
    score,
    highScore,
    level,
    lives,
    customization,
    setGameState,
    setCustomization,
    initializeGame
  } = useFlappyGame();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

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

      {/* Bird Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Bird Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bird Type</Label>
            <Select value={customization.birdType} onValueChange={(value) => handleCustomizationChange('birdType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">🐦 Classic</SelectItem>
                <SelectItem value="eagle">🦅 Eagle</SelectItem>
                <SelectItem value="duck">🦆 Duck</SelectItem>
                <SelectItem value="robin">🐦 Robin</SelectItem>
                <SelectItem value="parrot">🦜 Parrot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bird Size: {customization.birdSize}px</Label>
            <Slider
              value={[customization.birdSize]}
              onValueChange={([value]) => handleCustomizationChange('birdSize', value)}
              min={15}
              max={35}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Gravity: {customization.gravity}</Label>
            <Slider
              value={[customization.gravity]}
              onValueChange={([value]) => handleCustomizationChange('gravity', value)}
              min={0.3}
              max={0.8}
              step={0.1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={customization.difficulty} onValueChange={(value) => handleCustomizationChange('difficulty', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Background Theme</Label>
            <Select value={customization.backgroundTheme} onValueChange={(value) => handleCustomizationChange('backgroundTheme', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">☀️ Day</SelectItem>
                <SelectItem value="sunset">🌅 Sunset</SelectItem>
                <SelectItem value="night">🌙 Night</SelectItem>
                <SelectItem value="space">🚀 Space</SelectItem>
                <SelectItem value="underwater">🌊 Underwater</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Obstacle Spacing: {customization.obstacleSpacing}px</Label>
            <Slider
              value={[customization.obstacleSpacing]}
              onValueChange={([value]) => handleCustomizationChange('obstacleSpacing', value)}
              min={150}
              max={300}
              step={10}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Particles</Label>
            <Switch
              checked={customization.enableParticles}
              onCheckedChange={(checked) => handleCustomizationChange('enableParticles', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Weather Effects</Label>
            <Switch
              checked={customization.enableWeather}
              onCheckedChange={(checked) => handleCustomizationChange('enableWeather', checked)}
            />
          </div>

          {customization.enableWeather && (
            <div className="space-y-2">
              <Label>Weather Type</Label>
              <Select value={customization.weatherType} onValueChange={(value) => handleCustomizationChange('weatherType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="rain">🌧️ Rain</SelectItem>
                  <SelectItem value="snow">❄️ Snow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
