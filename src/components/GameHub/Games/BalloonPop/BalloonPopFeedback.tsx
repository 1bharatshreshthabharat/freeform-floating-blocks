
import React, { useEffect } from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Card } from '@/components/ui/card';

export const BalloonPopFeedback: React.FC = () => {
  const { state } = useBalloonPopGame();

  if (!state.showFeedback) return null;

  const feedbackColors = {
    correct: 'from-green-400 to-green-600',
    incorrect: 'from-red-400 to-red-600',
    encouragement: 'from-blue-400 to-blue-600',
    powerup: 'from-purple-400 to-purple-600',
    achievement: 'from-yellow-400 to-yellow-600'
  };

  const feedbackIcons = {
    correct: '🎉',
    incorrect: '💪',
    encouragement: '✨',
    powerup: '⚡',
    achievement: '🏆'
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <Card className={`p-4 bg-gradient-to-r ${feedbackColors[state.feedbackType]} text-white shadow-2xl transform animate-bounce`}>
        <div className="text-center">
          <div className="text-3xl mb-1">{feedbackIcons[state.feedbackType]}</div>
          <div className="text-lg font-bold">{state.feedbackMessage}</div>
        </div>
      </Card>
    </div>
  );
};
