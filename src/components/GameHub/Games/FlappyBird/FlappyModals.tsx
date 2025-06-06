
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Flappy Bird</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Click, tap the screen, or press SPACE to flap</li>
                <li>• Flap repeatedly to maintain altitude</li>
                <li>• Touch controls work on mobile devices</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gameplay</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Navigate through gaps between obstacles</li>
                <li>• Each obstacle passed gives you 1 point</li>
                <li>• Level increases every 10 points</li>
                <li>• Hitting obstacles or the ground costs a life</li>
                <li>• Game over when you lose all 3 lives</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Obstacles</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Pipes:</strong> Standard obstacles with a gap</li>
                <li>• <strong>Lasers:</strong> Narrow, fast-moving obstacles</li>
                <li>• <strong>Spikes:</strong> Jagged obstacles, harder to navigate</li>
                <li>• <strong>Moving:</strong> Obstacles that shift up and down</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tips</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Tap lightly for small altitude changes</li>
                <li>• Anticipate obstacle patterns</li>
                <li>• Keep a steady rhythm with your flapping</li>
                <li>• Choose slower difficulty settings when starting</li>
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
            <h2 className="text-xl font-bold">Customize Flappy Bird</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bird Type</label>
                <Select value={customization.birdType} onValueChange={(value) => setCustomization(prev => ({ ...prev, birdType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic Bird</SelectItem>
                    <SelectItem value="eagle">Eagle</SelectItem>
                    <SelectItem value="duck">Duck</SelectItem>
                    <SelectItem value="robin">Robin</SelectItem>
                    <SelectItem value="parrot">Parrot</SelectItem>
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
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                    <SelectItem value="underwater">Underwater</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Weather Effects</label>
                <Select 
                  value={customization.weatherType} 
                  onValueChange={(value) => setCustomization(prev => ({ ...prev, weatherType: value, enableWeather: value !== 'none' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="snow">Snow</SelectItem>
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
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bird Size: {customization.birdSize}</label>
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={customization.birdSize}
                  onChange={(e) => setCustomization(prev => ({ ...prev, birdSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Gravity: {customization.gravity}</label>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.1"
                  value={customization.gravity}
                  onChange={(e) => setCustomization(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Obstacle Spacing: {customization.obstacleSpacing}</label>
                <input
                  type="range"
                  min="150"
                  max="300"
                  step="10"
                  value={customization.obstacleSpacing}
                  onChange={(e) => setCustomization(prev => ({ ...prev, obstacleSpacing: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableParticles"
                    checked={customization.enableParticles}
                    onChange={(e) => setCustomization(prev => ({ ...prev, enableParticles: e.target.checked }))}
                  />
                  <label htmlFor="enableParticles" className="text-sm font-medium">Enable Particle Effects</label>
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
