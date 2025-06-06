
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Crown } from 'lucide-react';
import { useChessGame } from './ChessGameProvider';

export const ChessModals: React.FC = () => {
  const { 
    showVictory, 
    winner, 
    showHowToPlay, 
    showCustomization, 
    customization,
    setShowVictory,
    setShowHowToPlay,
    setShowCustomization,
    setCustomization,
    resetGame 
  } = useChessGame();

  if (showVictory) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-bounce">
            {winner === 'Draw' ? '🤝' : '🏆'}
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {winner === 'Draw' ? 'Game Draw!' : `${winner} Wins!`}
          </h2>
          <div className="flex justify-center space-x-2 mb-6">
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            <Crown className="h-8 w-8 text-amber-600" />
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <Button onClick={() => { setShowVictory(false); resetGame(); }} className="w-full">
              Play Again
            </Button>
            <Button onClick={() => setShowVictory(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Chess</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Basic Rules</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Click to select a piece, then click destination</li>
                <li>• Or drag and drop pieces to move</li>
                <li>• Capture opponent pieces by moving to their square</li>
                <li>• Protect your King from checkmate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Piece Movements</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• ♜ Rook: Horizontal and vertical lines</li>
                <li>• ♝ Bishop: Diagonal lines</li>
                <li>• ♞ Knight: L-shaped moves</li>
                <li>• ♛ Queen: Any direction</li>
                <li>• ♚ King: One square in any direction</li>
                <li>• ♟ Pawn: Forward one square (two on first move)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Special Moves</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Castling: King and Rook special move</li>
                <li>• En passant: Special pawn capture</li>
                <li>• Promotion: Pawn reaches end, becomes Queen</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Strategic Hints</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Control the center of the board early</li>
                <li>• Develop pieces before attacking</li>
                <li>• Castle early to protect your king</li>
                <li>• Look for tactical patterns like forks and pins</li>
                <li>• Think several moves ahead</li>
                <li>• Protect your pieces and create threats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCustomization) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customize Chess</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Board Theme</label>
                <Select value={customization.boardTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, boardTheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic Wood</SelectItem>
                    <SelectItem value="marble">Marble</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Piece Set</label>
                <Select value={customization.pieceSet} onValueChange={(value) => setCustomization(prev => ({ ...prev, pieceSet: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="medieval">Medieval</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCoordinates"
                    checked={customization.showCoordinates}
                    onChange={(e) => setCustomization(prev => ({ ...prev, showCoordinates: e.target.checked }))}
                  />
                  <label htmlFor="showCoordinates" className="text-sm font-medium">Show Coordinates</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="highlightMoves"
                    checked={customization.highlightMoves}
                    onChange={(e) => setCustomization(prev => ({ ...prev, highlightMoves: e.target.checked }))}
                  />
                  <label htmlFor="highlightMoves" className="text-sm font-medium">Highlight Valid Moves</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="animations"
                    checked={customization.animations}
                    onChange={(e) => setCustomization(prev => ({ ...prev, animations: e.target.checked }))}
                  />
                  <label htmlFor="animations" className="text-sm font-medium">Enable Animations</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
