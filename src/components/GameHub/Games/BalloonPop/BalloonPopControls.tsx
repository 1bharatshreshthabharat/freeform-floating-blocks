
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LearningCategory, GameTheme } from './types';

export const BalloonPopControls: React.FC = () => {
  const { state, changeCategory, changeTheme } = useBalloonPopGame();

  const categories: { key: LearningCategory; label: string; icon: string }[] = [
    { key: 'letters', label: 'Letters', icon: '🔤' },
    { key: 'numbers', label: 'Numbers', icon: '🔢' },
    { key: 'math', label: 'Math', icon: '➕' },
    { key: 'colors', label: 'Colors', icon: '🌈' },
    { key: 'shapes', label: 'Shapes', icon: '🔺' },
    { key: 'animals', label: 'Animals', icon: '🐾' }
  ];

  const themes: { key: GameTheme; label: string; icon: string }[] = [
    { key: 'rainbow', label: 'Rainbow', icon: '🌈' },
    { key: 'jungle', label: 'Jungle', icon: '🌿' },
    { key: 'space', label: 'Space', icon: '🚀' },
    { key: 'underwater', label: 'Ocean', icon: '🌊' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
        <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
          📚 Learning Categories
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Button
              key={category.key}
              onClick={() => changeCategory(category.key)}
              variant={state.category === category.key ? "default" : "outline"}
              className={`h-16 flex flex-col items-center justify-center space-y-1 transition-all duration-200 transform hover:scale-105 ${
                state.category === category.key 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-300'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-semibold">{category.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
        <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
          🎨 Game Themes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <Button
              key={theme.key}
              onClick={() => changeTheme(theme.key)}
              variant={state.theme === theme.key ? "default" : "outline"}
              className={`h-16 flex flex-col items-center justify-center space-y-1 transition-all duration-200 transform hover:scale-105 ${
                state.theme === theme.key 
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
                  : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'
              }`}
            >
              <span className="text-2xl">{theme.icon}</span>
              <span className="text-sm font-semibold">{theme.label}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
