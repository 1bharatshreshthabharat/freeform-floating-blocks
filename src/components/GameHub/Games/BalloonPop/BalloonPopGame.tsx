
import React, { useState } from 'react';
import { BalloonPopGameProvider } from './BalloonPopGameProvider';
import { BalloonPopHeader } from './BalloonPopHeader';
import { BalloonPopCanvas } from './BalloonPopCanvas';
import { BalloonPopControls } from './BalloonPopControls';
import { BalloonPopFeedback } from './BalloonPopFeedback';
import { BalloonPopInstructions } from './BalloonPopInstructions';
import { BalloonPopSettings } from './BalloonPopSettings';
import { BalloonPopAchievements } from './BalloonPopAchievements';
import { BalloonPopGameStats } from './BalloonPopGameStats';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useBalloonPopGame } from './BalloonPopGameProvider';

interface BalloonPopGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

const GameContent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state } = useBalloonPopGame();
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute top-20 right-20 w-5 h-5 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-30" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-20" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-20" style={{animationDelay: '4s'}}></div>
        </div>

        <BalloonPopHeader onBack={onBack} />
        
     
        
        <div className="max-w-7xl mx-auto p-2 lg:p-4">
          {/* Canvas */}
          <div className="mb-4">
            <BalloonPopCanvas />
          </div>
          
          {/* Controls below canvas */}
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-md">
              <BalloonPopControls />
            </div>
          </div>
          
          {/* Enhanced Game Stats - Moved to Bottom */}
          <BalloonPopGameStats />
        </div>

        {/* Modals and Overlays */}
        <BalloonPopFeedback />
        <BalloonPopInstructions />
        <BalloonPopSettings />
        <BalloonPopAchievements />
        

      </div>
  );
};

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <BalloonPopGameProvider>
      <GameContent onBack={onBack} />
    </BalloonPopGameProvider>
  );
};
