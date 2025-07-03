
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWordWonders } from './WordWondersProvider';

export const WordWondersGameOverModal: React.FC = () => {
  const { state, dispatch, startGame } = useWordWonders();

  const isGameOver = state.lives === 0 || state.timeLeft === 0;

  const handlePlayAgain = () => {
    startGame(state.mode);
  };

  const handleBackToMenu = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <Dialog open={isGameOver} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {state.timeLeft === 0 ? '⏰ Time\'s Up!' : '💔 Game Over!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="text-6xl">
            {state.score >= 100 ? '🏆' : state.score >= 50 ? '🥉' : '🎮'}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-purple-700">Final Score</h3>
            <p className="text-3xl font-bold text-green-600">{state.score}</p>
            
            {state.mode === 'make-words' && (
              <p className="text-gray-600">
                Words Found: {state.foundWords.length}
              </p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {state.score >= 100 && "🌟 Excellent work!"}
            {state.score >= 50 && state.score < 100 && "👍 Good job!"}
            {state.score < 50 && "💪 Keep practicing!"}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handlePlayAgain}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              🔄 Play Again
            </Button>
            <Button 
              onClick={handleBackToMenu}
              variant="outline"
              className="flex-1"
            >
              🏠 Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
