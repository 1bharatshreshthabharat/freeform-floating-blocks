
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSnakeGame } from './SnakeGameProvider';

export const SnakeModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization,
    boardTheme,
    snakeType,
    snakeColor,
    setBoardTheme,
    setSnakeType,
    setSnakeColor,
    setShowHowToPlay,
    setShowCustomization
  } = useSnakeGame();

  const availableColors = [
    { name: 'Green', value: '#4CAF50' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Red', value: '#FF5252' },
    { name: 'Yellow', value: '#FFEB3B' },
    { name: 'Purple', value: '#9C27B0' }
  ];

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Advanced Snake</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Use Arrow Keys or WASD to change direction</li>
                <li>• Press Space to start or restart the game</li>
                <li>• Press P to pause/resume</li>
                <li>• Touch/click in a direction to move (mobile)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gameplay</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Eat food to grow longer and score points</li>
                <li>• Different foods give different points</li>
                <li>• Avoid hitting walls and your own body</li>
                <li>• Your speed increases with each level</li>
                <li>• Level up every 100 points</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Power-Ups</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Speed</strong>: Makes your snake move faster</li>
                <li>• <strong>Slow Motion</strong>: Slows down the game</li>
                <li>• <strong>Double Points</strong>: Doubles points for food</li>
                <li>• Power-ups last for 10 seconds</li>
                <li>• Special food items glow and pulsate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tips</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Plan your route ahead of time</li>
                <li>• Use the edges of the board effectively</li>
                <li>• Don't make sharp turns when moving quickly</li>
                <li>• Higher levels mean faster movement</li>
                <li>• Special food appears more often at higher levels</li>
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
            <h2 className="text-xl font-bold">Customize Snake Game</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Board Theme</label>
                <Select value={boardTheme} onValueChange={(value) => setBoardTheme(value)}>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Snake Type</label>
                <Select value={snakeType} onValueChange={(value) => setSnakeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="3d">3D</SelectItem>
                    <SelectItem value="pixelated">Pixelated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Snake Color</label>
                <Select value={snakeColor} onValueChange={(value) => setSnakeColor(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColors.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Snake Preview</h3>
                <div className="border p-4 bg-black rounded-lg min-h-[100px] flex items-center justify-center">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-sm" style={{ 
                      backgroundColor: snakeColor,
                      borderRadius: snakeType === 'rounded' ? '50%' : '0',
                      boxShadow: snakeType === 'gradient' ? `inset 0 0 10px rgba(0,0,0,0.7)` : 'none',
                      border: snakeType === '3d' ? '2px solid black' : 'none'
                    }}></div>
                    <div className="w-8 h-8 rounded-sm" style={{ 
                      backgroundColor: snakeColor,
                      borderRadius: snakeType === 'rounded' ? '50%' : '0',
                      boxShadow: snakeType === 'gradient' ? `inset 0 0 10px rgba(0,0,0,0.7)` : 'none',
                      border: snakeType === '3d' ? '2px solid black' : 'none'
                    }}></div>
                    <div className="w-8 h-8 rounded-sm" style={{ 
                      backgroundColor: snakeColor,
                      borderRadius: snakeType === 'rounded' ? '50%' : '0',
                      boxShadow: snakeType === 'gradient' ? `inset 0 0 10px rgba(0,0,0,0.7)` : 'none',
                      border: snakeType === '3d' ? '2px solid black' : 'none'
                    }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Board Preview</h3>
                <div className="border rounded-lg" style={{ 
                  backgroundColor: 
                    boardTheme === 'classic' ? '#000000' :
                    boardTheme === 'forest' ? '#003300' :
                    boardTheme === 'retro' ? '#000033' :
                    boardTheme === 'desert' ? '#996633' :
                    boardTheme === 'neon' ? '#000000' : '#000000',
                  height: '100px',
                  borderColor: 
                    boardTheme === 'classic' ? '#00FF00' :
                    boardTheme === 'forest' ? '#008800' :
                    boardTheme === 'retro' ? '#0000FF' :
                    boardTheme === 'desert' ? '#CC9966' :
                    boardTheme === 'neon' ? '#FF00FF' : '#00FF00',
                  borderWidth: '4px'
                }}>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  Customize the snake game appearance to your preference. Changes will be applied immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
