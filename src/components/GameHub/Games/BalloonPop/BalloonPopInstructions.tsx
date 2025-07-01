
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export const BalloonPopInstructions: React.FC = () => {
  const { state, startGame, dispatch } = useBalloonPopGame();

  const closeInstructions = () => {
    dispatch({ type: 'HIDE_INSTRUCTIONS' });
  };

  if (!state.showInstructions) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-100 to-pink-100 p-6 shadow-2xl border-4 border-yellow-300 relative">
        {/* Close Button */}
        <Button
          onClick={closeInstructions}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
            🎈 Welcome to Balloon Pop Learning! 🎈
          </h2>
          <div className="text-4xl md:text-6xl mb-4">🎯</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How to Play */}
          <div className="bg-white/80 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">🎮 How to Play:</h3>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li>• Click on balloons to pop them!</li>
              <li>• Follow the instructions at the top</li>
              <li>• Pop only the correct balloons</li>
              <li>• Wrong answers lose points</li>
              <li>• Complete levels to advance</li>
              <li>• Race against the clock!</li>
            </ul>
          </div>

          {/* Learning Areas */}
          <div className="bg-white/80 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-600 mb-3">🧠 Learning Areas:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>🔤 Letters & Words</div>
              <div>🔢 Numbers & Counting</div>
              <div>➕ Math Operations</div>
              <div>🌈 Colors & Shapes</div>
              <div>🐾 Animals & Nature</div>
              <div>🎨 Creative Themes</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg md:text-xl"
          >
            🎈 Start Learning Adventure! 🎈
          </Button>
        </div>
      </Card>
    </div>
  );
};
