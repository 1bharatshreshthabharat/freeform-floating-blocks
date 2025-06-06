
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSnakeGame } from './SnakeGameProvider';

export const SnakeModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization,
    gridSize,
    boardTheme,
    snakeType,
    snakeColor,
    setShowHowToPlay,
    setShowCustomization,
    setGridSize,
    setBoardTheme,
    setSnakeType,
    setSnakeColor
  } = useSnakeGame();

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Snake</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Use the arrow keys or WASD to control the snake</li>
                <li>• Press Space to start or restart the game</li>
                <li>• Click or touch the game area to control direction</li>
                <li>• Press P to pause/resume the game</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Objective</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Guide the snake to eat food to grow longer</li>
                <li>• Avoid hitting the walls or your own body</li>
                <li>• Score points by eating food</li>
                <li>• As your score increases, the level and speed increases</li>
                <li>• Collect special power-ups for bonuses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Power-Ups</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Speed: Makes your snake move faster temporarily</li>
                <li>• Slow Motion: Slows down your snake temporarily</li>
                <li>• Double Points: Doubles your points for a short time</li>
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
            <h2 className="text-xl font-bold">Customize Snake Game</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Snake Customization */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Snake Customization</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Snake Type</label>
                  <Select value={snakeType} onValueChange={setSnakeType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="3d">3D Style</SelectItem>
                      <SelectItem value="pixelated">Pixelated</SelectItem>
                      <SelectItem value="emoji">Snake Emoji</SelectItem>
                      <SelectItem value="dragon">Dragon</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="worm">Worm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Snake Color</label>
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
              </div>
            </div>

            {/* Board Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Board Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Board Theme</label>
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
                  <label className="text-sm font-medium">Grid Size: {gridSize}x{gridSize}</label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={([value]) => setGridSize(value)}
                    min={15}
                    max={30}
                    step={1}
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
