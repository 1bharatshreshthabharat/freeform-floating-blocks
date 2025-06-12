
import React, { useEffect } from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Card } from '@/components/ui/card';

export const BalloonPopFeedback: React.FC = () => {
  const { state } = useBalloonPopGame();

  if (!state.showFeedback) return null;

  const feedbackColors = {
    correct: 'from-green-400 to-green-600',
    incorrect: 'from-red-400 to-red-600',
    encouragement: 'from-blue-400 to-blue-600'
  };

  const feedbackIcons = {
    correct: '🎉',
    incorrect: '💪',
    encouragement: '✨'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Card className={`p-6 bg-gradient-to-r ${feedbackColors[state.feedbackType]} text-white shadow-2xl transform animate-bounce`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{feedbackIcons[state.feedbackType]}</div>
          <div className="text-2xl font-bold">{state.feedbackMessage}</div>
        </div>
      </Card>
    </div>
  );
};
