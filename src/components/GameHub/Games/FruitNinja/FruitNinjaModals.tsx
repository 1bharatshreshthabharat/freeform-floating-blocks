
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useFruitNinja } from './FruitNinjaProvider';

export const FruitNinjaModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization, 
    customization,
    setShowHowToPlay,
    setShowCustomization,
    setCustomization
  } = useFruitNinja();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Fruit Ninja</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Click and drag or swipe to slice fruits</li>
                <li>• Move fast for better slicing action</li>
                <li>• Create long slices for style points</li>
                <li>• Touch controls work on mobile devices</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gameplay</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Slice all fruits before they fall</li>
                <li>• Avoid slicing bombs (💣)</li>
                <li>• Build combos for higher scores</li>
                <li>• Don't let 3 fruits fall or hit a bomb</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Scoring</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Regular fruits: 10-30 points</li>
                <li>• Special fruits: Double points + glow</li>
                <li>• Combo multiplier increases score</li>
                <li>• Level up every 500 points</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fruits</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 🍎 Apple, 🍊 Orange, 🍌 Banana</li>
                <li>• 🍉 Watermelon, 🍍 Pineapple, 🍓 Strawberry</li>
                <li>• 🍇 Grape, 🍑 Peach, 🥥 Coconut, 🥝 Kiwi</li>
                <li>• 🥭 Mango, 🍒 Cherry, 🍋 Lemon, 🥑 Avocado</li>
                <li>• 🍅 Tomato, 🍆 Eggplant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCustomization) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customize Fruit Ninja</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blade Customization */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Blade Customization</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blade Type</label>
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
                  <label className="text-sm font-medium">Blade Color</label>
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

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Slice Trails</label>
                  <Switch
                    checked={customization.enableTrails}
                    onCheckedChange={(checked) => handleCustomizationChange('enableTrails', checked)}
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
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
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
                      <SelectItem value="dojo">🥋 Dojo</SelectItem>
                      <SelectItem value="sunset">🌅 Sunset</SelectItem>
                      <SelectItem value="forest">🌲 Forest</SelectItem>
                      <SelectItem value="ocean">🌊 Ocean</SelectItem>
                      <SelectItem value="space">🚀 Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Game Speed: {customization.gameSpeed}x</label>
                  <Slider
                    value={[customization.gameSpeed]}
                    onValueChange={([value]) => handleCustomizationChange('gameSpeed', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fruit Spawn Rate: {customization.fruitSpawnRate}x</label>
                  <Slider
                    value={[customization.fruitSpawnRate]}
                    onValueChange={([value]) => handleCustomizationChange('fruitSpawnRate', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Particles</label>
                  <Switch
                    checked={customization.enableParticles}
                    onCheckedChange={(checked) => handleCustomizationChange('enableParticles', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sound Volume: {Math.round(customization.soundVolume * 100)}%</label>
                  <Slider
                    value={[customization.soundVolume]}
                    onValueChange={([value]) => handleCustomizationChange('soundVolume', value)}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
