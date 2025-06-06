
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
    setCustomization,
    initializeGame
  } = useFruitNinja();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="lg:w-80 space-y-4">
      {/* Game Status */}
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
            <Badge variant="secondary" className="p-2 text-center">
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

      {/* Blade Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Blade Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Blade Type</Label>
            <Select value={customization.bladeType} onValueChange={(value) => handleCustomizationChange('bladeType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">⚔️ Classic</SelectItem>
                <SelectItem value="katana">🗡️ Katana</SelectItem>
                <SelectItem value="laser">⚡ Laser</SelectItem>
                <SelectItem value="fire">🔥 Fire</SelectItem>
                <SelectItem value="ice">❄️ Ice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Blade Color</Label>
            <Select value={customization.bladeColor} onValueChange={(value) => handleCustomizationChange('bladeColor', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="#FFD700">🟡 Gold</SelectItem>
                <SelectItem value="#FF0000">🔴 Red</SelectItem>
                <SelectItem value="#0066FF">🔵 Blue</SelectItem>
                <SelectItem value="#00FF00">🟢 Green</SelectItem>
                <SelectItem value="#FF00FF">🟣 Purple</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
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
                <SelectItem value="dojo">🥋 Dojo</SelectItem>
                <SelectItem value="sunset">🌅 Sunset</SelectItem>
                <SelectItem value="forest">🌲 Forest</SelectItem>
                <SelectItem value="ocean">🌊 Ocean</SelectItem>
                <SelectItem value="space">🚀 Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Game Speed: {customization.gameSpeed}x</Label>
            <Slider
              value={[customization.gameSpeed]}
              onValueChange={([value]) => handleCustomizationChange('gameSpeed', value)}
              min={0.5}
              max={2.0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>Fruit Spawn Rate: {customization.fruitSpawnRate}x</Label>
            <Slider
              value={[customization.fruitSpawnRate]}
              onValueChange={([value]) => handleCustomizationChange('fruitSpawnRate', value)}
              min={0.5}
              max={2.0}
              step={0.1}
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
            <Label>Slice Trails</Label>
            <Switch
              checked={customization.enableTrails}
              onCheckedChange={(checked) => handleCustomizationChange('enableTrails', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Sound Volume: {Math.round(customization.soundVolume * 100)}%</Label>
            <Slider
              value={[customization.soundVolume]}
              onValueChange={([value]) => handleCustomizationChange('soundVolume', value)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
