import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSpellingPhonicGame } from './SpellingPhonicGameProvider';

export const SpellingGameSidebar: React.FC = () => {
  const { state, setGameMode, setDifficulty } = useSpellingPhonicGame();

  const progressToNextLevel = () => {
    return ((state.experiencePoints % (state.gameLevel * 100)) / (state.gameLevel * 100)) * 100;
  };

  return (
    <Card className="lg:col-span-1 p-4 space-y-4">
      {/* Player Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">Level {state.gameLevel}</div>
          <Progress value={progressToNextLevel()} className="mt-2 bg-white/20" />
          <div className="text-sm mt-1">{state.experiencePoints % (state.gameLevel * 100)}/{state.gameLevel * 100} XP</div>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div>
        <h3 className="font-bold mb-2">Game Mode</h3>
        <div className="space-y-2">
          <Button
            onClick={() => setGameMode('spelling')}
            variant={state.gameMode === 'spelling' ? 'default' : 'outline'}
            className="w-full"
          >
            ✏️ Spelling
          </Button>
          <Button
            onClick={() => setGameMode('phonics')}
            variant={state.gameMode === 'phonics' ? 'default' : 'outline'}
            className="w-full"
          >
            🔤 Phonics
          </Button>
          <Button
            onClick={() => setGameMode('listening')}
            variant={state.gameMode === 'listening' ? 'default' : 'outline'}
            className="w-full"
          >
            👂 Listening
          </Button>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="font-bold mb-2">Difficulty</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(level => (
            <Button
              key={level}
              onClick={() => setDifficulty(level)}
              variant={state.difficulty === level ? 'default' : 'outline'}
              className="w-full"
            >
              {level === 1 ? '🌱 Easy' : level === 2 ? '🌳 Medium' : '🚀 Hard'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-semibold mb-2">Game Stats</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-bold text-blue-600">{state.score}</span>
          </div>
          <div className="flex justify-between">
            <span>Streak:</span>
            <span className="font-bold text-green-600">{state.streak}</span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-bold text-purple-600">
              {state.totalWordsAttempted > 0 ? Math.round((state.correctWords / state.totalWordsAttempted) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};