
import React from 'react';
import { BalloonPopGame as RefactoredBalloonPopGame } from './BalloonPop/BalloonPopGame';

interface BalloonPopGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onStatsUpdate }) => {
  return <RefactoredBalloonPopGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
