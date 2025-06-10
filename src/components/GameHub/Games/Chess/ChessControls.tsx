
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Crown, Settings } from 'lucide-react';
import { useChessGame } from './ChessGameProvider';

export const ChessControls: React.FC = () => {
  const { 
    currentPlayer,
    capturedPieces,
    gameMode,
    difficulty,
    setGameMode,
    setDifficulty,
    resetGame,
    setShowCustomization,
    getPieceSymbol
  } = useChessGame();

  return (
    <div className="lg:w-80 space-y-4">
      {/* Current Turn */}
      <Card className="shadow-lg border-2 border-amber-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span>Current Turn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge 
            variant={currentPlayer === 'white' ? 'default' : 'secondary'} 
            className="w-full p-2 text-center text-lg font-medium animate-pulse"
          >
            {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'} to move
          </Badge>
        </CardContent>
      </Card>

      {/* Captured Pieces */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Captured Pieces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-xs font-medium">White Captured:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {capturedPieces.white.length > 0 ? 
                capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {typeof piece === 'string' ? piece : getPieceSymbol(piece.type, piece.color)}
                  </span>
                )) : 
                <span className="text-gray-400 text-xs">None</span>
              }
            </div>
          </div>
          <div>
            <span className="text-xs font-medium">Black Captured:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {capturedPieces.black.length > 0 ? 
                capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {typeof piece === 'string' ? piece : getPieceSymbol(piece.type, piece.color)}
                  </span>
                )) : 
                <span className="text-gray-400 text-xs">None</span>
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-amber-600" />
            <span>Game Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Game Mode</label>
            <select 
              value={gameMode} 
              onChange={(e) => setGameMode(e.target.value as "human-vs-human" | "human-vs-ai")}
              className="w-full p-2 border rounded"
            >
              <option value="human-vs-human">Human vs Human</option>
              <option value="human-vs-ai">Human vs AI</option>
            </select>
          </div>

          {gameMode === 'human-vs-ai' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "expert")}
                className="w-full p-2 border rounded"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={() => setShowCustomization(true)} className="w-full" variant="outline">
              Customize Board & Pieces
            </Button>
            
            <Button onClick={resetGame} className="w-full" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
