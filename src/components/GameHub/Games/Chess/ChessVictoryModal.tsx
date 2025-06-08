
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChessGame } from './ChessGameProvider';
import { Trophy, Crown, Sparkles, Star } from 'lucide-react';

export const ChessVictoryModal: React.FC = () => {
  const { showVictory, winner, resetGame, setShowVictory } = useChessGame();

  if (!showVictory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <Card className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-8 max-w-md w-full m-4 text-center shadow-2xl border-4 border-yellow-400 animate-scale-in">
        <div className="relative">
          {/* Celebration decorations */}
          <div className="absolute -top-4 -left-4 text-yellow-500 animate-bounce">
            <Sparkles size={32} />
          </div>
          <div className="absolute -top-4 -right-4 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Star size={32} />
          </div>
          <div className="absolute -bottom-4 -left-4 text-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }}>
            <Star size={32} />
          </div>
          <div className="absolute -bottom-4 -right-4 text-yellow-500 animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Sparkles size={32} />
          </div>

          {/* Victory content */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Crown size={80} className="text-yellow-600 animate-pulse" />
              <Trophy size={40} className="absolute top-8 left-1/2 transform -translate-x-1/2 text-yellow-700" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-yellow-800 mb-4 animate-bounce">
            🎉 Victory! 🎉
          </h1>

          <div className="text-2xl font-semibold text-yellow-700 mb-6">
            <span className="inline-block animate-pulse">
              {winner} Wins!
            </span>
          </div>

          <div className="text-lg text-yellow-600 mb-8">
            Congratulations on a brilliant game! 
            <br />
            <span className="text-sm">The king has been defeated!</span>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => {
                resetGame();
                setShowVictory(false);
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              Play Again
            </Button>
            
            <Button 
              onClick={() => setShowVictory(false)}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-semibold py-2 px-6 rounded-xl"
            >
              Continue Viewing
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
