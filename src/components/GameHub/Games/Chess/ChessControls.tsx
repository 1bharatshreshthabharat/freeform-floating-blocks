
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, Crown, Users, Cpu } from 'lucide-react';
import { useChessGame } from './ChessGameProvider';

export const ChessControls: React.FC = () => {
  const { 
    currentPlayer,
    capturedPieces,
    customization,
    gameMode,
    difficulty,
    setCustomization,
    setGameMode,
    setDifficulty,
    resetGame
  } = useChessGame();

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="lg:w-80 space-y-4">
      {/* Current Turn */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span>Current Turn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'} className="w-full p-2 text-center">
            {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'} to move
          </Badge>
        </CardContent>
      </Card>

      {/* Captured Pieces */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Captured Pieces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">White Captured:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {capturedPieces.white.length > 0 ? 
                capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-lg">{piece}</span>
                )) : 
                <span className="text-gray-400 text-xs">None</span>
              }
            </div>
          </div>
          <div>
            <Label className="text-xs">Black Captured:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {capturedPieces.black.length > 0 ? 
                capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-lg">{piece}</span>
                )) : 
                <span className="text-gray-400 text-xs">None</span>
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-amber-600" />
            <span>Game Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Game Mode</Label>
            <Select value={gameMode} onValueChange={setGameMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-vs-human">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Human vs Human</span>
                  </div>
                </SelectItem>
                <SelectItem value="human-vs-ai">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4" />
                    <span>Human vs AI</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gameMode === 'human-vs-ai' && (
            <div className="space-y-2">
              <Label>AI Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
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
          )}

          <Button onClick={resetGame} className="w-full" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </CardContent>
      </Card>

      {/* Board Customization */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Board Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Board Theme</Label>
            <Select value={customization.boardTheme} onValueChange={(value) => handleCustomizationChange('boardTheme', value)}>
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

          <div className="space-y-2">
            <Label>Piece Set</Label>
            <Select value={customization.pieceSet} onValueChange={(value) => handleCustomizationChange('pieceSet', value)}>
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
            <Label>Show Coordinates</Label>
            <Switch
              checked={customization.showCoordinates}
              onCheckedChange={(checked) => handleCustomizationChange('showCoordinates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Highlight Moves</Label>
            <Switch
              checked={customization.highlightMoves}
              onCheckedChange={(checked) => handleCustomizationChange('highlightMoves', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Animations</Label>
            <Switch
              checked={customization.animations}
              onCheckedChange={(checked) => handleCustomizationChange('animations', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
