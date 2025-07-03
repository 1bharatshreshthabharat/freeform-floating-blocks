
import React, { useState } from 'react';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameMode } from './types';
import { HowToPlayModal } from './HowToPlayModal';
import { Volume2, VolumeX, HelpCircle, Play, Pause } from 'lucide-react';

export const WordWondersControls: React.FC = () => {
  const { state, dispatch, startGame, pauseGame, resetGame, speakText } = useWordWonders();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const gameModes: { key: GameMode; label: string; icon: string; description: string }[] = [
    { key: 'random', label: 'Random Adventure', icon: '🎲', description: 'Surprise me!' },
    { key: 'complete-verb', label: 'Complete the Verb', icon: '🏃', description: 'Fill in action words' },
    { key: 'make-words', label: 'Make Many Words', icon: '🔤', description: 'Create multiple words' },
    { key: 'fix-word', label: 'Fix Broken Word', icon: '🧩', description: 'Unscramble letters' },
    { key: 'word-riddle', label: 'Word Riddle', icon: '🧠', description: 'Guess from clues' },
    { key: 'guess-word', label: 'Guess the Word', icon: '📝', description: 'Complete sentences' },
    { key: 'hidden-word', label: 'Hidden Word', icon: '🕵️', description: 'Find hidden words' }
  ];

  const themes = [
    { key: 'forest', label: 'Forest', icon: '🌲', color: 'bg-green-100 border-green-400 text-green-700' },
    { key: 'sky', label: 'Sky', icon: '☁️', color: 'bg-blue-100 border-blue-400 text-blue-700' },
    { key: 'candyland', label: 'Candy', icon: '🍭', color: 'bg-pink-100 border-pink-400 text-pink-700' },
    { key: 'underwater', label: 'Ocean', icon: '🌊', color: 'bg-teal-100 border-teal-400 text-teal-700' }
  ];

  const handleModeChange = (mode: string) => {
    dispatch({ type: 'SET_MODE', payload: mode as GameMode });
  };

  const handleThemeChange = (theme: string) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    speakText(`Switching to ${theme} theme!`);
  };

  const handleStartGame = () => {
    if (!state.isGameActive) {
      startGame(state.mode);
    }
  };

  const handlePauseGame = () => {
    pauseGame();
    speakText(state.isPaused ? 'Game resumed!' : 'Game paused!');
  };

  const handleSoundToggle = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    speakText(state.soundEnabled ? 'Sound disabled' : 'Sound enabled');
  };

  const handleHint = () => {
    dispatch({ type: 'SHOW_HINT' });
    speakText('Look for the golden letters!');
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={handleSoundToggle}
              variant="outline"
              size="sm"
              className="bg-white/80 border-purple-300"
            >
              {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={() => setShowHowToPlay(true)}
              variant="outline"
              size="sm"
              className="bg-white/80 border-purple-300"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              How to Play
            </Button>
          </div>

          {/* Game Stats */}
          {state.isGameActive && (
            <div className="flex gap-2 text-sm">
              <div className="bg-red-100 px-2 py-1 rounded border border-red-300">
                <span className="font-bold text-red-700">{'❤️'.repeat(state.lives)}</span>
              </div>
              <div className="bg-blue-100 px-2 py-1 rounded border border-blue-300">
                <span className="font-bold text-blue-700">{state.timeLeft}s</span>
              </div>
            </div>
          )}
        </div>

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
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
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
              🎨 Theme
            </h3>
            <Select value={state.theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-full bg-white border-purple-300">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {themes.map((theme) => (
                  <SelectItem key={theme.key} value={theme.key}>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded ${theme.color}`}>
                      <span>{theme.icon}</span>
                      <span className="font-medium">{theme.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!state.isGameActive ? (
            <Button
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game!
            </Button>
          ) : (
            <Button
              onClick={handlePauseGame}
              className={`flex-1 font-bold py-3 text-base ${
                state.isPaused 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
              }`}
            >
              {state.isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {state.isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          
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

      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
    </>
  );
};
