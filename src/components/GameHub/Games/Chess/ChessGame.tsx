
import React from 'react';
import { ChessGameProvider } from './ChessGameProvider';
import { ChessBoard } from './ChessBoard';
import { ChessControls } from './ChessControls';
import { ChessModals } from './ChessModals';
import { ChessHeader } from './ChessHeader';

interface ChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <ChessGameProvider onStatsUpdate={onStatsUpdate}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-7xl mx-auto">
          <ChessHeader onBack={onBack} />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <ChessBoard />
            <ChessControls />
          </div>
          
          <ChessModals />
        </div>
      </div>
    </ChessGameProvider>
  );
};
