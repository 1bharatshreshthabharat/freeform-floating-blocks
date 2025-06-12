
import React from 'react';
import { BalloonPopGameProvider } from './BalloonPopGameProvider';
import { BalloonPopHeader } from './BalloonPopHeader';
import { BalloonPopCanvas } from './BalloonPopCanvas';
import { BalloonPopControls } from './BalloonPopControls';
import { BalloonPopPowerUps } from './BalloonPopPowerUps';
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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-blue-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-green-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '2s'}}></div>
        </div>

        <BalloonPopHeader onBack={onBack} />
        
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-3">
              <div className="flex justify-center">
                <BalloonPopCanvas />
              </div>
            </div>
            
            {/* Sidebar Controls */}
            <div className="space-y-4">
              <BalloonPopControls />
              <BalloonPopPowerUps />
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
