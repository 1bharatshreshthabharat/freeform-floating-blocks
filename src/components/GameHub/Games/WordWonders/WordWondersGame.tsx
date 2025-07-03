
import React from 'react';
import { WordWondersProvider } from './WordWondersProvider';
import { WordWondersHeader } from './WordWondersHeader';
import { WordWondersCanvas } from './WordWondersCanvas';
import { WordWondersControls } from './WordWondersControls';

interface WordWondersGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const WordWondersGame: React.FC<WordWondersGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <WordWondersProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-16 text-4xl animate-bounce opacity-30">🎈</div>
          <div className="absolute top-32 right-20 text-3xl animate-pulse opacity-30">🌈</div>
          <div className="absolute bottom-20 left-32 text-2xl animate-bounce opacity-30" style={{animationDelay: '1s'}}>⭐</div>
          <div className="absolute bottom-32 right-16 text-3xl animate-pulse opacity-30" style={{animationDelay: '2s'}}>🎨</div>
          <div className="absolute top-1/2 left-8 text-2xl animate-bounce opacity-20" style={{animationDelay: '3s'}}>📚</div>
          <div className="absolute top-1/3 right-8 text-3xl animate-pulse opacity-20" style={{animationDelay: '4s'}}>✨</div>
          <div className="absolute bottom-1/3 left-1/4 text-2xl animate-bounce opacity-25" style={{animationDelay: '5s'}}>🔤</div>
          <div className="absolute top-2/3 right-1/3 text-3xl animate-pulse opacity-25" style={{animationDelay: '6s'}}>🎭</div>
        </div>

        <WordWondersHeader onBack={onBack} />
        
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to Word Wonders! 🌟
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Drag floating letters to create words! Choose your adventure below and start learning through play!
            </p>
          </div>

          {/* Controls */}
          <div className="mb-6">
            <WordWondersControls />
          </div>
          
          {/* Game Canvas */}
          <div className="mb-6">
            <WordWondersCanvas />
          </div>

          {/* Instructions */}
          <div className="bg-white/80 rounded-lg p-6 shadow-lg border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
              🎮 How to Play:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🖱️</span>
                  <span>Click and drag floating letters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎯</span>
                  <span>Drop them in the correct boxes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✨</span>
                  <span>Golden letters are hints!</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span>Earn stars for correct words</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏰</span>
                  <span>Beat the timer for bonus points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💡</span>
                  <span>Use hints when you're stuck</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WordWondersProvider>
  );
};
