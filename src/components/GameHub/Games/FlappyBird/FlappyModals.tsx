
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useFlappyGame } from './FlappyGameProvider';

export const FlappyModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization, 
    customization,
    setShowHowToPlay,
    setShowCustomization,
    setCustomization
  } = useFlappyGame();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Flappy Bird</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Tap the screen or click your mouse to make the bird flap upwards</li>
                <li>• Press the space bar to flap (desktop)</li>
                <li>• Tap screen to flap (mobile)</li>
                <li>• Time your flaps to navigate through obstacles</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gameplay</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Navigate your bird through openings between obstacles</li>
                <li>• Each successfully passed obstacle earns one point</li>
                <li>• The game gets progressively more difficult</li>
                <li>• You have 3 lives - touching obstacles, floor, or ceiling costs a life</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Obstacles</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Regular Pipes: Standard green pipes to fly between</li>
                <li>• Lasers: Thin red beams that are harder to see</li>
                <li>• Spikes: Sharp obstacles that punish poor timing</li>
                <li>• Moving Obstacles: Pipes that shift position vertically</li>
                <li>• Swinging Obstacles: Pipes that swing up and down</li>
                <li>• Paired Obstacles: Double pipes with offset openings</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showCustomization) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customize Flappy Bird</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bird Customization */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Bird Customization</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bird Type</label>
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
                  <label className="text-sm font-medium">Bird Size: {customization.birdSize}px</label>
                  <Slider
                    value={[customization.birdSize]}
                    onValueChange={([value]) => handleCustomizationChange('birdSize', value)}
                    min={15}
                    max={35}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gravity: {customization.gravity}</label>
                  <Slider
                    value={[customization.gravity]}
                    onValueChange={([value]) => handleCustomizationChange('gravity', value)}
                    min={0.3}
                    max={0.8}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            {/* Game Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Game Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
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
                  <label className="text-sm font-medium">Background Theme</label>
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
                  <label className="text-sm font-medium">Obstacle Spacing: {customization.obstacleSpacing}px</label>
                  <Slider
                    value={[customization.obstacleSpacing]}
                    onValueChange={([value]) => handleCustomizationChange('obstacleSpacing', value)}
                    min={150}
                    max={300}
                    step={10}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Particles</label>
                  <Switch
                    checked={customization.enableParticles}
                    onCheckedChange={(checked) => handleCustomizationChange('enableParticles', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Weather Effects</label>
                  <Switch
                    checked={customization.enableWeather}
                    onCheckedChange={(checked) => handleCustomizationChange('enableWeather', checked)}
                  />
                </div>

                {customization.enableWeather && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weather Type</label>
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
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
