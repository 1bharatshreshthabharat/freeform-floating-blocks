// ./SpellingGameSidebar.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

type Props = {
  gameMode: string;
  setGameMode: React.Dispatch<React.SetStateAction<'spelling' | 'phonics' | 'listening'>>;
  difficulty: number;
  setDifficulty: (level: number) => void;
  score: number;
  streak: number;
  correctWords: number;
  totalWordsAttempted: number;
  gameLevel: number;
  experiencePoints: number;
  progressToNextLevel: () => number;
  achievements: Achievement[];
};

const SpellingGameSidebar: React.FC<Props> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  score,
  streak,
  correctWords,
  totalWordsAttempted,
  gameLevel,
  experiencePoints,
  progressToNextLevel,
  achievements
}) => {
  return (
    <Card className="lg:col-span-1 p-4 space-y-4">
      {/* Player Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">Level {gameLevel}</div>
          <Progress value={progressToNextLevel()} className="mt-2 bg-white/20" />
          <div className="text-sm mt-1">{experiencePoints % (gameLevel * 100)}/{gameLevel * 100} XP</div>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div>
        <h3 className="font-bold mb-2">Game Mode</h3>
        <div className="space-y-2">
          {(['spelling', 'phonics', 'listening'] as const).map((mode) => (
  <Button
    key={mode}
    onClick={() => setGameMode(mode)}
    variant={gameMode === mode ? 'default' : 'outline'}
    className="w-full"
  >
    {mode === 'spelling' ? '✏️ Spelling' : mode === 'phonics' ? '🔤 Phonics' : '👂 Listening'}
  </Button>
))}

        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="font-bold mb-2">Difficulty</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              onClick={() => setDifficulty(level)}
              variant={difficulty === level ? 'default' : 'outline'}
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
            <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="flex justify-between">
            <span>Streak:</span>
            <span className="font-bold text-green-600">{streak}</span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-bold text-purple-600">
              {totalWordsAttempted > 0
                ? Math.round((correctWords / totalWordsAttempted) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="font-semibold mb-2">Achievements</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 rounded text-xs ${
                achievement.unlocked
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{achievement.icon}</span>
                <div>
                  <div className="font-semibold">{achievement.name}</div>
                  <div className="text-xs">{achievement.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SpellingGameSidebar;
