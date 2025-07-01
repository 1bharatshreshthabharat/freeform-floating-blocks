
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Card } from '@/components/ui/card';

export const BalloonPopGameStats: React.FC = () => {
  const { state } = useBalloonPopGame();

  if (!state.isPlaying) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-purple-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Mission */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-2">🎯 Your Mission</h3>
          <p className="text-blue-700 font-medium">
            {state.currentQuestion?.instruction || 'Loading mission...'}
          </p>
        </Card>

        {/* Expected Answer */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-2">✅ Right Answer</h3>
          <p className="text-green-700 font-medium">
            {state.gameStats.expectedAnswer || 'Look for clues!'}
          </p>
        </Card>

        {/* Last Answer Given */}
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <h3 className="text-lg font-bold text-orange-800 mb-2">🎈 You Popped</h3>
          <p className="text-orange-700 font-medium">
            {state.gameStats.lastAnswer || 'Pop a balloon!'}
          </p>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Mission Progress</span>
          <span className="text-sm font-medium text-gray-700">
            Level {state.gameStats.level} • Streak: {state.gameStats.streak}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (state.gameStats.streak / 5) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
