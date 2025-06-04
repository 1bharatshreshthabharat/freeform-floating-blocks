
import React from 'react';
import { EnhancedChessGame } from './EnhancedChessGame';

interface ChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({ onBack, onStatsUpdate }) => {
  return <EnhancedChessGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
