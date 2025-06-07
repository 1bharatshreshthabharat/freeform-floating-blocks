
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlappyGame } from './FlappyGameProvider';

export const FlappyModals: React.FC = () => {
  const {
    showCustomization,
    showHowToPlay,
    customization,
    setShowCustomization,
    setShowHowToPlay,
    setCustomization
  } = useFlappyGame();

  const updateCustomization = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Customization Modal */}
      <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Flappy Bird</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Bird Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bird Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bird Type</Label>
                  <Select value={customization.birdType} onValueChange={(value) => updateCustomization('birdType', value)}>
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
                  <Label>Bird Color</Label>
                  <Select value={customization.birdColor} onValueChange={(value) => updateCustomization('birdColor', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#FFD700">🟡 Golden</SelectItem>
                      <SelectItem value="#FF6B6B">🔴 Red</SelectItem>
                      <SelectItem value="#4ECDC4">🔵 Teal</SelectItem>
                      <SelectItem value="#45B7D1">🔵 Blue</SelectItem>
                      <SelectItem value="#96CEB4">🟢 Green</SelectItem>
                      <SelectItem value="#FFEAA7">🟡 Yellow</SelectItem>
                      <SelectItem value="#DDA0DD">🟣 Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bird Size: {customization.birdSize}</Label>
                  <Slider
                    value={[customization.birdSize]}
                    onValueChange={([value]) => updateCustomization('birdSize', value)}
                    min={20}
                    max={50}
                    step={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Game Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Theme</Label>
                  <Select value={customization.backgroundTheme} onValueChange={(value) => updateCustomization('backgroundTheme', value)}>
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
                  <Label>Difficulty</Label>
                  <Select value={customization.difficulty} onValueChange={(value) => updateCustomization('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Game Speed: {customization.gameSpeed.toFixed(1)}x</Label>
                  <Slider
                    value={[customization.gameSpeed]}
                    onValueChange={([value]) => updateCustomization('gameSpeed', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gravity: {customization.gravity.toFixed(1)}</Label>
                  <Slider
                    value={[customization.gravity]}
                    onValueChange={([value]) => updateCustomization('gravity', value)}
                    min={0.3}
                    max={1.0}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Obstacle Spacing: {customization.obstacleSpacing}</Label>
                  <Slider
                    value={[customization.obstacleSpacing]}
                    onValueChange={([value]) => updateCustomization('obstacleSpacing', value)}
                    min={150}
                    max={300}
                    step={10}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visual Effects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visual Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Particles</Label>
                  <Switch
                    checked={customization.enableParticles}
                    onCheckedChange={(checked) => updateCustomization('enableParticles', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Weather Effects</Label>
                  <Switch
                    checked={customization.enableWeather}
                    onCheckedChange={(checked) => updateCustomization('enableWeather', checked)}
                  />
                </div>

                {customization.enableWeather && (
                  <div className="space-y-2">
                    <Label>Weather Type</Label>
                    <Select value={customization.weatherType} onValueChange={(value) => updateCustomization('weatherType', value)}>
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

                <div className="flex items-center justify-between">
                  <Label>Enable Power-ups</Label>
                  <Switch
                    checked={customization.enablePowerUps}
                    onCheckedChange={(checked) => updateCustomization('enablePowerUps', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setShowCustomization(false)} className="w-full">
              Apply Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* How to Play Modal */}
      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to Play Flappy Bird</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>🎯 Goal:</strong> Navigate the bird through obstacles and score points</p>
              <p><strong>🎮 Controls:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Click or tap to make the bird flap</li>
                <li>Press Space bar to flap</li>
                <li>Avoid hitting obstacles or the ground</li>
              </ul>
              <p><strong>🏆 Scoring:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Pass through obstacles to earn points</li>
                <li>Level up every 10 points</li>
                <li>Different obstacles appear based on difficulty</li>
              </ul>
              <p><strong>💡 Tips:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Time your flaps carefully</li>
                <li>Watch for moving obstacles at higher levels</li>
                <li>Use the gap size to your advantage</li>
              </ul>
            </div>
            
            <Button onClick={() => setShowHowToPlay(false)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
