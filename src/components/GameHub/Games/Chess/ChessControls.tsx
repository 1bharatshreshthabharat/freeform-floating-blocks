
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, RotateCcw } from 'lucide-react';
import { useChessGame } from './ChessGameProvider';

export const ChessControls: React.FC = () => {
  const { 
    currentPlayer, 
    capturedPieces, 
    gameMode, 
    difficulty,
    setGameMode,
    setDifficulty,
    resetGame 
  } = useChessGame();

  return (
    <div className="lg:w-80 space-y-4">
      {/* Current Turn */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Current Turn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'}>
              {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Captured Pieces */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Captured Pieces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600">White captured:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-lg">{piece}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600">Black captured:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-lg">{piece}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span>Game Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Game Mode</label>
            <Select value={gameMode} onValueChange={(value: any) => setGameMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-vs-ai">Human vs AI</SelectItem>
                <SelectItem value="human-vs-human">Human vs Human</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
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
