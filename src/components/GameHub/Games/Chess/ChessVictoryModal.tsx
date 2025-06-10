
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChessGame } from './ChessGameProvider';
import { Trophy, Crown, Sparkles, Star } from 'lucide-react';

export const ChessVictoryModal: React.FC = () => {
  const { showVictory, winner, resetGame, setShowVictory } = useChessGame();

  if (!showVictory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <Card className="bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 rounded-2xl p-6 max-w-sm w-full m-4 text-center shadow-xl border-2 border-yellow-400 animate-scale-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-orange-200/30 to-pink-200/30 animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Floating decorations */}
          <div className="absolute -top-2 -left-2 text-yellow-600 animate-bounce">
            <Sparkles size={20} className="drop-shadow-lg" />
          </div>
          <div className="absolute -top-2 -right-2 text-orange-600 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Star size={20} className="drop-shadow-lg" />
          </div>

          {/* Victory crown */}
          <div className="flex justify-center mb-4 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <Crown size={50} className="text-yellow-700 animate-pulse relative z-10 drop-shadow-xl" />
            </div>
          </div>

          {/* Victory text */}
          <div className="space-y-2 mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-800 via-orange-800 to-pink-800 bg-clip-text text-transparent animate-bounce drop-shadow-sm">
              🎉 VICTORY! 🎉
            </h1>

            <div className="text-lg font-bold text-yellow-900 mb-2">
              <span className="inline-block animate-pulse bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
                {winner} Wins!
              </span>
            </div>

            <div className="text-sm text-orange-800 leading-relaxed">
              <div className="font-semibold mb-1">🎯 Checkmate! 🎯</div>
              <div className="text-xs italic">Brilliant strategy!</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={() => {
                resetGame();
                setShowVictory(false);
              }}
              className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 hover:from-yellow-700 hover:via-orange-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-sm border border-yellow-500"
              size="sm"
            >
              <Trophy className="mr-1" size={14} />
              Play Again
            </Button>
            
            <Button 
              onClick={() => setShowVictory(false)}
              variant="outline"
              className="w-full border border-orange-500 text-orange-800 hover:bg-orange-100 font-semibold py-1 px-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
              size="sm"
            >
              Continue Viewing
            </Button>
          </div>

          {/* Achievement badge */}
          <div className="mt-3 inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-yellow-900 px-3 py-1 rounded-full font-semibold text-xs shadow-md">
            <Crown className="mr-1" size={12} />
            Chess Master!
          </div>
        </div>
      </Card>
    </div>
  );
};
