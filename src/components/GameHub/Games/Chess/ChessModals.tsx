
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useChessGame } from './ChessGameProvider';

export const ChessModals: React.FC = () => {
  const { 
    showHowToPlay, 
    showCustomization, 
    customization,
    setShowHowToPlay,
    setShowCustomization,
    setCustomization
  } = useChessGame();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  if (showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play Chess</h2>
            <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Basic Movement</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <b>Pawns:</b> Move forward one square, but capture diagonally. On their first move, they can advance two squares.</li>
                <li>• <b>Rooks:</b> Move any number of squares horizontally or vertically.</li>
                <li>• <b>Knights:</b> Move in an L-shape: two squares horizontally then one vertically, or two vertically then one horizontally.</li>
                <li>• <b>Bishops:</b> Move any number of squares diagonally.</li>
                <li>• <b>Queen:</b> Combines the power of the rook and bishop - moves any number of squares horizontally, vertically, or diagonally.</li>
                <li>• <b>King:</b> Moves one square in any direction. The king must never be moved into check.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Special Moves</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <b>Castling:</b> The king moves two squares toward a rook, and the rook moves to the square the king crossed.</li>
                <li>• <b>En Passant:</b> If a pawn advances two squares and lands beside an opponent's pawn, that opponent's pawn can capture it as if it had only advanced one square.</li>
                <li>• <b>Promotion:</b> When a pawn reaches the opposite end of the board, it can be promoted to any other piece (usually a queen).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Check, Checkmate and Stalemate</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <b>Check:</b> When a king is under direct attack.</li>
                <li>• <b>Checkmate:</b> When a king is in check and there is no legal move to escape. The game ends and the player with the checkmated king loses.</li>
                <li>• <b>Stalemate:</b> When a player has no legal moves but their king is not in check. The game is a draw.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Game Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Click on a piece to select it</li>
                <li>• Click on a highlighted square to move the selected piece</li>
                <li>• If you select the wrong piece, click it again to deselect</li>
                <li>• The game shows whose turn it is (White or Black)</li>
                <li>• Captured pieces are displayed on the side</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showCustomization) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customize Chess</h2>
            <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Board Customization */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Board Customization</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Board Theme</label>
                  <Select 
                    value={customization.boardTheme} 
                    onValueChange={(value) => handleCustomizationChange('boardTheme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="marble">Marble</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Coordinates</label>
                  <Switch
                    checked={customization.showCoordinates}
                    onCheckedChange={(checked) => handleCustomizationChange('showCoordinates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Highlight Moves</label>
                  <Switch
                    checked={customization.highlightMoves}
                    onCheckedChange={(checked) => handleCustomizationChange('highlightMoves', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Piece Customization */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Piece Customization</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Piece Set</label>
                  <Select 
                    value={customization.pieceSet} 
                    onValueChange={(value) => handleCustomizationChange('pieceSet', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">♛ Classic</SelectItem>
                      <SelectItem value="modern">⬨ Modern</SelectItem>
                      <SelectItem value="medieval">🏰 Medieval</SelectItem>
                      <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Animations</label>
                  <Switch
                    checked={customization.animations}
                    onCheckedChange={(checked) => handleCustomizationChange('animations', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
