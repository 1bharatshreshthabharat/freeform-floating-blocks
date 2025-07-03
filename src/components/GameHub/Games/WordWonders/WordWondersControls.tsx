
import React from 'react';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameMode } from './types';

export const WordWondersControls: React.FC = () => {
  const { state, dispatch, startGame, resetGame, speakText } = useWordWonders();

  const gameModes: { key: GameMode; label: string; icon: string; description: string }[] = [
    { key: 'random', label: 'Random Adventure', icon: '🎲', description: 'Surprise me!' },
    { key: 'complete-verb', label: 'Complete the Verb', icon: '🏃', description: 'Fill in action words' },
    { key: 'make-words', label: 'Make Many Words', icon: '🔤', description: 'Create multiple words' },
    { key: 'fix-word', label: 'Fix Broken Word', icon: '🧩', description: 'Complete missing letters' },
    { key: 'word-riddle', label: 'Word Riddle', icon: '🧠', description: 'Guess from clues' },
    { key: 'magic-trays', label: 'Magic Word Trays', icon: '🔮', description: 'Spell what you see' },
    { key: 'sentence-picker', label: 'Sentence Picker', icon: '📚', description: 'Choose the right word' },
    { key: 'hidden-word', label: 'Hidden Word', icon: '🕵️', description: 'Unscramble letters' }
  ];

  const themes = [
    { key: 'forest', label: 'Forest', icon: '🌲', color: 'bg-green-100 border-green-300' },
    { key: 'sky', label: 'Sky', icon: '☁️', color: 'bg-blue-100 border-blue-300' },
    { key: 'candyland', label: 'Candy', icon: '🍭', color: 'bg-pink-100 border-pink-300' },
    { key: 'underwater', label: 'Ocean', icon: '🌊', color: 'bg-teal-100 border-teal-300' }
  ];

  const handleModeChange = (mode: string) => {
    dispatch({ type: 'SET_MODE', payload: mode as GameMode });
  };

  const handleThemeChange = (theme: string) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    speakText(`Switching to ${theme} theme!`);
  };

  const handleStartGame = () => {
    startGame(state.mode);
  };

  const handleHint = () => {
    dispatch({ type: 'SHOW_HINT' });
    speakText('Look for the golden letters!');
  };

  return (
    <div className="space-y-4">
      {/* Game Mode Selection */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            🎮 Choose Your Game
          </h3>
          <Select value={state.mode} onValueChange={handleModeChange}>
            <SelectTrigger className="w-full bg-white border-purple-300">
              <SelectValue placeholder="Select a game mode" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {gameModes.map((mode) => (
                <SelectItem key={mode.key} value={mode.key}>
                  <div className="flex items-center gap-2">
                    <span>{mode.icon}</span>
                    <div>
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs text-gray-600">{mode.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Theme Selection */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            🎨 Choose Your World
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.key}
                onClick={() => handleThemeChange(theme.key)}
                variant="outline"
                className={`p-3 h-auto transition-all ${
                  state.theme === theme.key 
                    ? `${theme.color} border-2` 
                    : 'bg-white/50 border hover:bg-white/80'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">{theme.icon}</div>
                  <div className="text-xs font-medium">{theme.label}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleStartGame}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base"
        >
          🚀 Start Game!
        </Button>
        
        {state.isGameActive && (
          <Button
            onClick={handleHint}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-4"
          >
            💡
          </Button>
        )}
        
        <Button
          onClick={resetGame}
          variant="outline"
          className="bg-white/80 border-red-300 hover:bg-red-50 text-red-600 font-bold py-3 px-4"
        >
          🔄
        </Button>
      </div>
    </div>
  );
};
