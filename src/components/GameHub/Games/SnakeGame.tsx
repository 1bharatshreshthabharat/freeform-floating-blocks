
import React from 'react';
import { SnakeGame as RefactoredSnakeGame } from './Snake/SnakeGame';

interface SnakeGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBack, onStatsUpdate }) => {
  return <RefactoredSnakeGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
