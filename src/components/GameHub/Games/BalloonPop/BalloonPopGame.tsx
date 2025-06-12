
import React from 'react';
import { BalloonPopGameProvider } from './BalloonPopGameProvider';
import { BalloonPopHeader } from './BalloonPopHeader';
import { BalloonPopCanvas } from './BalloonPopCanvas';
import { BalloonPopControls } from './BalloonPopControls';
import { BalloonPopFeedback } from './BalloonPopFeedback';
import { BalloonPopInstructions } from './BalloonPopInstructions';

interface BalloonPopGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <BalloonPopGameProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <BalloonPopHeader onBack={onBack} />
        
        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex justify-center">
                <BalloonPopCanvas />
              </div>
            </div>
            
            <div className="space-y-6">
              <BalloonPopControls />
            </div>
          </div>
        </div>

        <BalloonPopFeedback />
        <BalloonPopInstructions />
      </div>
    </BalloonPopGameProvider>
  );
};
