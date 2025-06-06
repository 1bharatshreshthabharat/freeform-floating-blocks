
import React from 'react';
import { ChessGame as RefactoredChessGame } from './Chess/ChessGame';

interface ChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({ onBack, onStatsUpdate }) => {
  return <RefactoredChessGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
