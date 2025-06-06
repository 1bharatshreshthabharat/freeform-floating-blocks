
import React from 'react';
import { SnakeGameProvider } from './SnakeGameProvider';
import { SnakeCanvas } from './SnakeCanvas';
import { SnakeControls } from './SnakeControls';
import { SnakeModals } from './SnakeModals';
import { SnakeHeader } from './SnakeHeader';

interface SnakeGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <SnakeGameProvider onStatsUpdate={onStatsUpdate}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
        <div className="max-w-6xl mx-auto">
          <SnakeHeader onBack={onBack} />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <SnakeCanvas />
            <SnakeControls />
          </div>
          
          <SnakeModals />
        </div>
      </div>
    </SnakeGameProvider>
  );
};
