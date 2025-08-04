
import React, { useState } from 'react';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameMode } from './types';
import { HowToPlayModal } from './HowToPlayModal';
import { Volume2, VolumeX, HelpCircle, Play, Pause, Clock, Heart } from 'lucide-react';

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
    { key: 'forest', label: 'Forest', icon: '🌲', colors: 'from-green-400 to-green-600 text-white' },
    { key: 'sky', label: 'Sky', icon: '☁️', colors: 'from-blue-400 to-blue-600 text-white' },
    { key: 'candyland', label: 'Candy', icon: '🍭', colors: 'from-pink-400 to-pink-600 text-white' },
    { key: 'underwater', label: 'Ocean', icon: '🌊', colors: 'from-teal-400 to-teal-600 text-white' }
  ];

  const handleModeChange = (mode: string) => {
    dispatch({ type: 'SET_MODE', payload: mode as GameMode });
  };

  const handleThemeChange = (theme: string) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    speakText(`Switching to ${theme} theme!`);
  };

  const handleStartPause = () => {
    if (!state.isGameActive) {
      startGame(state.mode);
      speakText('Game started!');
    } else {
      pauseGame();
      speakText(state.isPaused ? 'Game resumed!' : 'Game paused!');
    }
  };

  const handleSoundToggle = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    if (state.soundEnabled) {
      speakText('Sound disabled');
    }
  };

  const handleHint = () => {
    dispatch({ type: 'SHOW_HINT' });
    speakText('Look for the golden letters!');
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Controls */}
        {/* <div className="flex justify-between items-center">
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
        
        </div> */}


{/* Game Mode Selection */}
<Card className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-purple-200 shadow-md">
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
      🎮 Choose Your Game
    </h3>

    <Select value={state.mode} onValueChange={handleModeChange}>
      <SelectTrigger className="w-full bg-white border border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 text-base">
        <SelectValue placeholder="Select a game mode" />
      </SelectTrigger>

      <SelectContent className="bg-white max-h-64 overflow-y-auto shadow-lg rounded-xl z-50">
        {gameModes.map((mode) => (
          <SelectItem key={mode.key} value={mode.key}>
            <div className="flex items-start gap-3 py-1">
              <span className="text-lg">{mode.icon}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{mode.label}</span>
                <span className="text-xs text-gray-500">{mode.description}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>


{/* Action Buttons */}
<div className="flex flex-wrap gap-3 mt-6">
  <Button
    onClick={handleStartPause}
    className={`flex-1 min-w-[140px] py-3 text-base font-bold rounded-xl transition-all duration-300
      ${
        !state.isGameActive || state.isPaused
          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
          : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white'
      }`}
  >
    {!state.isGameActive ? (
      <>
        <Play className="h-4 w-4 mr-2" />
        Start Game!
      </>
    ) : state.isPaused ? (
      <>
        <Play className="h-4 w-4 mr-2" />
        Resume
      </>
    ) : (
      <>
        <Pause className="h-4 w-4 mr-2" />
        Pause
      </>
    )}
  </Button>

  {state.isGameActive && (
    <Button
      onClick={handleHint}
      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-5 rounded-xl shadow-md"
    >
      💡 Hint
    </Button>
  )}

  <Button
    onClick={resetGame}
    variant="outline"
    className="bg-white/90 border border-red-300 hover:bg-red-50 text-red-600 font-bold py-3 px-5 rounded-xl shadow-sm"
  >
    🔄 Reset
  </Button>
</div>
</Card>

      </div>

      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
    </>
  );
};
