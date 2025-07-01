
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningCategory, GameTheme } from './types';
import { Clock } from 'lucide-react';

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
    { key: 'space', label: 'Space', icon: '🚀' },
    { key: 'underwater', label: 'Ocean', icon: '🌊' },
    { key: 'forest', label: 'Forest', icon: '🌲' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = Math.max(0, state.timeLimit - state.gameStats.timeElapsed);

  return (
    <div className="space-y-4">
      {/* Current Question - Prominent Display */}
      {state.currentQuestion && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
          <h3 className="font-bold text-blue-700 mb-2 text-lg text-center">🎯 Your Mission:</h3>
          <p className="text-blue-800 font-bold text-center text-xl">{state.currentQuestion.instruction}</p>
          
          {/* Time Display */}
          <div className="flex items-center justify-center mt-3 text-red-500">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-bold text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </Card>
      )}

      {/* Game Controls */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 shadow-lg border border-green-200">
        <div className="space-y-4">
          <div className="flex gap-2">
            {!state.isPlaying ? (
              <Button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold shadow-md"
              >
                🎈 Start Game
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseGame}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {state.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
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
              <SelectTrigger className="w-full bg-white border-purple-200 shadow-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-purple-200 shadow-lg z-50">
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
            <label className="text-sm font-semibold text-blue-700">🎨 Game Theme</label>
            <Select value={state.theme} onValueChange={(value: GameTheme) => changeTheme(value)}>
              <SelectTrigger className="w-full bg-white border-blue-200 shadow-sm">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-200 shadow-lg z-50">
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
          <div className="bg-white/90 p-3 rounded-lg border border-indigo-200 shadow-sm">
            <h4 className="font-bold text-indigo-700 mb-2">📊 Game Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Score: <span className="font-bold text-green-600">{state.gameStats.score}</span></div>
              <div>Level: <span className="font-bold text-blue-600">{state.gameStats.level}</span></div>
              <div>Streak: <span className="font-bold text-orange-600">{state.gameStats.streak}</span></div>
              <div>Accuracy: <span className="font-bold text-purple-600">
                {state.gameStats.correctAnswers + state.gameStats.wrongAnswers > 0 
                  ? Math.round((state.gameStats.correctAnswers / (state.gameStats.correctAnswers + state.gameStats.wrongAnswers)) * 100)
                  : 0}%
              </span></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
