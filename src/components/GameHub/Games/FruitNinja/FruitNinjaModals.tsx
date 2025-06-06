
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFruitNinja } from './FruitNinjaProvider';
import { bladeColors } from './fruitNinjaUtils';

export const FruitNinjaModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization, 
    customization,
    setShowHowToPlay,
    setShowCustomization,
    setCustomization
  } = useFruitNinja();

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
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customize Fruit Ninja</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Blade Type</label>
                <Select value={customization.bladeType} onValueChange={(value) => setCustomization(prev => ({ ...prev, bladeType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="flaming">Flaming</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="ice">Ice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Blade Color</label>
                <Select value={customization.bladeColor} onValueChange={(value) => setCustomization(prev => ({ ...prev, bladeColor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bladeColors.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Background Theme</label>
                <Select value={customization.backgroundTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, backgroundTheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dojo">Dojo</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={customization.difficulty} onValueChange={(value) => setCustomization(prev => ({ ...prev, difficulty: value as any }))}>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Game Speed: {customization.gameSpeed}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={customization.gameSpeed}
                  onChange={(e) => setCustomization(prev => ({ ...prev, gameSpeed: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fruit Spawn Rate: {customization.fruitSpawnRate.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={customization.fruitSpawnRate}
                  onChange={(e) => setCustomization(prev => ({ ...prev, fruitSpawnRate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="particles"
                    checked={customization.enableParticles}
                    onChange={(e) => setCustomization(prev => ({ ...prev, enableParticles: e.target.checked }))}
                  />
                  <label htmlFor="particles" className="text-sm font-medium">Enable Particle Effects</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="trails"
                    checked={customization.enableTrails}
                    onChange={(e) => setCustomization(prev => ({ ...prev, enableTrails: e.target.checked }))}
                  />
                  <label htmlFor="trails" className="text-sm font-medium">Enable Blade Trails</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
