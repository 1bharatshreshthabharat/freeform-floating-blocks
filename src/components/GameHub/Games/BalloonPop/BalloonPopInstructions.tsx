
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const BalloonPopInstructions: React.FC = () => {
  const { state, startGame } = useBalloonPopGame();

  if (!state.showInstructions) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-purple-100 to-pink-100 p-8 shadow-2xl border-4 border-yellow-300">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">
            🎈 Welcome to Balloon Pop Learning! 🎈
          </h2>
          <div className="text-6xl mb-4">🎯</div>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-white/80 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-2">🎮 How to Play:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Click on balloons to pop them!</li>
              <li>• Follow the instructions at the top</li>
              <li>• Pop only the correct balloons</li>
              <li>• Wrong answers lose points</li>
              <li>• Complete levels to advance</li>
            </ul>
          </div>

          <div className="bg-white/80 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-600 mb-2">🧠 Learning Areas:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>🔤 Letters & Words</div>
              <div>🔢 Numbers & Counting</div>
              <div>➕ Math Operations</div>
              <div>🌈 Colors & Shapes</div>
              <div>🐾 Animals & Nature</div>
              <div>🎨 Creative Themes</div>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-2">✨ Features:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Colorful animations and effects</li>
              <li>• Multiple difficulty levels</li>
              <li>• Progress tracking</li>
              <li>• Voice instructions (optional)</li>
              <li>• Multiple themed environments</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-xl"
          >
            🎈 Start Learning! 🎈
          </Button>
        </div>
      </Card>
    </div>
  );
};
