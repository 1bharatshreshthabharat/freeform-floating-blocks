
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningCategory, GameTheme } from './types';

export const BalloonPopControls: React.FC = () => {
  const { state, changeCategory, changeTheme, startGame, pauseGame, resetGame } = useBalloonPopGame();

  const categories: { key: LearningCategory; label: string; icon: string }[] = [
    { key: 'letters', label: 'Letters', icon: '🔤' },
    { key: 'numbers', label: 'Numbers', icon: '🔢' },
    { key: 'math', label: 'Math', icon: '➕' },
    { key: 'colors', label: 'Colors', icon: '🌈' },
    { key: 'shapes', label: 'Shapes', icon: '🔺' },
    { key: 'animals', label: 'Animals', icon: '🐾' },
    { key: 'words', label: 'Words', icon: '📝' },
    { key: 'science', label: 'Science', icon: '🔬' },
    { key: 'geography', label: 'Geography', icon: '🌍' }
  ];

  const themes: { key: GameTheme; label: string; icon: string }[] = [
    { key: 'rainbow', label: 'Rainbow', icon: '🌈' },
    { key: 'jungle', label: 'Jungle', icon: '🌿' },
    { key: 'space', label: 'Space', icon: '🚀' },
    { key: 'underwater', label: 'Ocean', icon: '🌊' },
    { key: 'castle', label: 'Castle', icon: '🏰' },
    { key: 'farm', label: 'Farm', icon: '🚜' },
    { key: 'ocean', label: 'Deep Ocean', icon: '🐠' },
    { key: 'forest', label: 'Forest', icon: '🌲' }
  ];

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
      <div className="space-y-4">
        {/* Game Controls */}
        <div className="flex gap-2">
          {!state.isPlaying ? (
            <Button
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold"
            >
              🎈 Start Game
            </Button>
          ) : (
            <>
              <Button
                onClick={pauseGame}
                variant="outline"
                className="flex-1"
              >
                {state.isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex-1"
              >
                🔄 Reset
              </Button>
            </>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-700">📚 Learning Category</label>
          <Select value={state.category} onValueChange={(value: LearningCategory) => changeCategory(value)}>
            <SelectTrigger className="w-full bg-white border-purple-300">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-purple-300 shadow-lg z-50">
              {categories.map((category) => (
                <SelectItem 
                  key={category.key} 
                  value={category.key}
                  className="hover:bg-purple-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-700">🎨 Game Theme</label>
          <Select value={state.theme} onValueChange={(value: GameTheme) => changeTheme(value)}>
            <SelectTrigger className="w-full bg-white border-purple-300">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-purple-300 shadow-lg z-50">
              {themes.map((theme) => (
                <SelectItem 
                  key={theme.key} 
                  value={theme.key}
                  className="hover:bg-blue-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{theme.icon}</span>
                    <span>{theme.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Game Stats */}
        <div className="bg-white/80 p-3 rounded-lg">
          <h4 className="font-bold text-purple-700 mb-2">📊 Game Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Score: <span className="font-bold text-green-600">{state.gameStats.score}</span></div>
            <div>Level: <span className="font-bold text-blue-600">{state.gameStats.level}</span></div>
            <div>Streak: <span className="font-bold text-orange-600">{state.gameStats.streak}</span></div>
            <div>Time: <span className="font-bold text-purple-600">{Math.floor(state.gameStats.timeElapsed / 60)}:{(state.gameStats.timeElapsed % 60).toString().padStart(2, '0')}</span></div>
          </div>
        </div>

        {/* Current Question */}
        {state.currentQuestion && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-orange-700 mb-1">🎯 Mission:</h4>
            <p className="text-orange-800 font-semibold">{state.currentQuestion.instruction}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
