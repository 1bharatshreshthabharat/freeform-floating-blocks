
import React from 'react';
import { FlappyGame as RefactoredFlappyGame } from './FlappyBird/FlappyGame';

interface FlappyGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBack, onStatsUpdate }) => {
  return <RefactoredFlappyGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
