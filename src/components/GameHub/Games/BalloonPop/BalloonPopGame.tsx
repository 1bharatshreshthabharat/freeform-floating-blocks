
import React from 'react';
import { BalloonPopGameProvider } from './BalloonPopGameProvider';
import { BalloonPopHeader } from './BalloonPopHeader';
import { BalloonPopCanvas } from './BalloonPopCanvas';
import { BalloonPopControls } from './BalloonPopControls';
import { BalloonPopFeedback } from './BalloonPopFeedback';
import { BalloonPopInstructions } from './BalloonPopInstructions';
import { BalloonPopSettings } from './BalloonPopSettings';
import { BalloonPopAchievements } from './BalloonPopAchievements';

interface BalloonPopGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <BalloonPopGameProvider>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Clean animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-3 h-3 bg-blue-300 rounded-full animate-bounce opacity-40"></div>
          <div className="absolute top-20 right-20 w-4 h-4 bg-purple-300 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-300 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>
        </div>

        <BalloonPopHeader onBack={onBack} />
        
        <div className="max-w-7xl mx-auto p-2 lg:p-4 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-2 xl:col-span-3 order-2 lg:order-1">
              <BalloonPopCanvas />
            </div>
            
            {/* Sidebar Controls */}
            <div className="space-y-4 order-1 lg:order-2">
              <BalloonPopControls />
            </div>
          </div>
        </div>

        {/* Modals and Overlays */}
        <BalloonPopFeedback />
        <BalloonPopInstructions />
        <BalloonPopSettings />
        <BalloonPopAchievements />
      </div>
    </BalloonPopGameProvider>
  );
};
