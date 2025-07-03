
import React from 'react';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameMode } from './types';

export const WordWondersControls: React.FC = () => {
  const { state, dispatch, startGame, resetGame, speakText } = useWordWonders();

  const gameModes: { key: GameMode; label: string; icon: string; description: string }[] = [
    { key: 'random', label: 'Random Mode', icon: '🎲', description: 'Surprise me with any game!' },
    { key: 'complete-verb', label: 'Complete the Verb', icon: '🏃', description: 'Fill in action words' },
    { key: 'make-words', label: 'Make Many Words', icon: '🔤', description: 'Create words from letters' },
    { key: 'fix-word', label: 'Fix Broken Word', icon: '🧩', description: 'Complete the missing letters' },
    { key: 'word-riddle', label: 'Word Riddle', icon: '🧠', description: 'Guess from the clue' },
    { key: 'magic-trays', label: 'Magic Word Trays', icon: '🔮', description: 'Spell what you see' },
    { key: 'sentence-picker', label: 'Sentence Word Picker', icon: '📚', description: 'Choose the right word' },
    { key: 'hidden-word', label: 'Hidden Word', icon: '🕵️', description: 'Unscramble the letters' }
  ];

  const themes = [
    { key: 'forest', label: 'Forest Adventure', icon: '🌲' },
    { key: 'sky', label: 'Sky Kingdom', icon: '☁️' },
    { key: 'candyland', label: 'Candyland', icon: '🍭' },
    { key: 'underwater', label: 'Ocean World', icon: '🌊' }
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
    speakText('Look for the golden letters - they might help you!');
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-yellow-400 shadow-lg">
      <div className="space-y-4">
        {/* Game Mode Selection */}
        <div>
          <label className="block text-lg font-bold text-purple-700 mb-2">
            🎮 Choose Your Adventure:
          </label>
          <Select value={state.mode} onValueChange={handleModeChange}>
            <SelectTrigger className="w-full bg-white border-2 border-purple-300">
              <SelectValue placeholder="Select a game mode" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-purple-300">
              {gameModes.map((mode) => (
                <SelectItem key={mode.key} value={mode.key} className="hover:bg-purple-50">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{mode.icon}</span>
                    <div>
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-sm text-gray-600">{mode.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-lg font-bold text-purple-700 mb-2">
            🎨 Choose Your World:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.key}
                onClick={() => handleThemeChange(theme.key)}
                variant={state.theme === theme.key ? "default" : "outline"}
                className={`p-3 h-auto ${
                  state.theme === theme.key 
                    ? 'bg-purple-500 text-white border-purple-600' 
                    : 'bg-white border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="text-sm font-medium">{theme.label}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleStartGame}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎈 Start Adventure!
          </Button>
          
          {state.isGameActive && (
            <Button
              onClick={handleHint}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-4 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              💡 Hint
            </Button>
          )}
          
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-white border-2 border-red-300 hover:bg-red-50 text-red-600 font-bold py-3 px-4 shadow-lg"
          >
            🔄 Reset
          </Button>
        </div>

        {/* Game Status */}
        {state.isGameActive && (
          <div className="bg-white/80 rounded-lg p-4 border-2 border-blue-300">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700 mb-2">
                Current Game: {gameModes.find(m => m.key === state.mode)?.label}
              </div>
              {state.riddle && (
                <div className="text-purple-600 italic mb-2">{state.riddle}</div>
              )}
              {state.sentence && (
                <div className="text-purple-600 italic mb-2">{state.sentence}</div>
              )}
              <div className="flex justify-center space-x-4 text-sm">
                <span className="bg-green-100 px-2 py-1 rounded">Score: {state.score}</span>
                <span className="bg-yellow-100 px-2 py-1 rounded">Stars: {state.stars}</span>
                <span className="bg-blue-100 px-2 py-1 rounded">Level: {state.level}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
