
import React from 'react';
import { FlappyGameProvider } from './FlappyGameProvider';
import { FlappyCanvas } from './FlappyCanvas';
import { FlappyControls } from './FlappyControls';
import { FlappyModals } from './FlappyModals';
import { FlappyHeader } from './FlappyHeader';

interface FlappyGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <FlappyGameProvider onStatsUpdate={onStatsUpdate}>
      <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-300 p-4">
        <div className="max-w-6xl mx-auto">
          <FlappyHeader onBack={onBack} />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <FlappyCanvas />
            <FlappyControls />
          </div>
          
          <FlappyModals />
        </div>
      </div>
    </FlappyGameProvider>
  );
};
