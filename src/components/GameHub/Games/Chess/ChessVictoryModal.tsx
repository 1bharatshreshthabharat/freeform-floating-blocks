
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChessGame } from './ChessGameProvider';
import { Trophy, Crown, Sparkles, Star, Medal, Zap } from 'lucide-react';

export const ChessVictoryModal: React.FC = () => {
  const { showVictory, winner, resetGame, setShowVictory } = useChessGame();

  if (!showVictory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
      <Card className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 rounded-3xl p-10 max-w-lg w-full m-4 text-center shadow-2xl border-4 border-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 animate-scale-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-amber-200/20 to-orange-200/20 animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Floating decorations */}
          <div className="absolute -top-6 -left-6 text-yellow-500 animate-bounce">
            <Sparkles size={40} className="drop-shadow-lg" />
          </div>
          <div className="absolute -top-6 -right-6 text-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Star size={40} className="drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-6 -left-6 text-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }}>
            <Medal size={40} className="drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-6 -right-6 text-yellow-600 animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Zap size={40} className="drop-shadow-lg" />
          </div>

          {/* Victory crown and trophy */}
          <div className="flex justify-center mb-8 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Crown size={100} className="text-yellow-600 animate-pulse relative z-10 drop-shadow-2xl" />
              <Trophy size={50} className="absolute top-12 left-1/2 transform -translate-x-1/2 text-yellow-700 animate-bounce" />
            </div>
          </div>

          {/* Victory text with enhanced styling */}
          <div className="space-y-4 mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-bounce drop-shadow-lg">
              🎉 VICTORY! 🎉
            </h1>

            <div className="text-3xl font-bold text-yellow-700 mb-4">
              <span className="inline-block animate-pulse bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
                {winner} Wins!
              </span>
            </div>

            <div className="text-lg text-amber-700 leading-relaxed">
              <div className="font-semibold text-xl mb-2">🎯 Checkmate Achieved! 🎯</div>
              <div className="text-base">The king has fallen before your strategic brilliance!</div>
              <div className="text-sm mt-2 italic">A masterful display of chess prowess!</div>
            </div>
          </div>

          {/* Enhanced buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => {
                resetGame();
                setShowVictory(false);
              }}
              className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg border-2 border-yellow-400"
              size="lg"
            >
              <Trophy className="mr-2" size={20} />
              Play Again
            </Button>
            
            <Button 
              onClick={() => setShowVictory(false)}
              variant="outline"
              className="w-full border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Star className="mr-2" size={18} />
              Continue Viewing
            </Button>
          </div>

          {/* Achievement badge */}
          <div className="mt-6 inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
            <Medal className="mr-2" size={16} />
            Chess Master Achievement Unlocked!
          </div>
        </div>
      </Card>
    </div>
  );
};
