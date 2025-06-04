
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | null;
type PieceColor = 'white' | 'black' | null;

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export const ChessGame: React.FC<ChessGameProps> = ({ onBack, onStatsUpdate }) => {
  const [board, setBoard] = useState<ChessPiece[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [gameLevel, setGameLevel] = useState('beginner');
  const [gameType, setGameType] = useState('classic');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const gameLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const gameTypes = ['classic', 'blitz', 'puzzle', 'endgame'];

  const initializeBoard = () => {
    const newBoard: ChessPiece[][] = Array(8).fill(null).map(() => Array(8).fill({ type: null, color: null }));
    
    // Initialize pawns
    for (let i = 0; i < 8; i++) {
      newBoard[1][i] = { type: 'pawn', color: 'black' };
      newBoard[6][i] = { type: 'pawn', color: 'white' };
    }
    
    // Initialize other pieces
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      newBoard[0][i] = { type: pieceOrder[i], color: 'black' };
      newBoard[7][i] = { type: pieceOrder[i], color: 'white' };
    }
    
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
    setHints([
      "Control the center squares with pawns and pieces",
      "Develop knights before bishops",
      "Castle early for king safety",
      "Don't move the same piece twice in opening"
    ]);
  }, []);

  const getPieceSymbol = (piece: ChessPiece) => {
    if (!piece.type || !piece.color) return '';
    
    const symbols = {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    };
    
    return symbols[piece.color][piece.type] || '';
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      // Move piece logic would go here
      setSelectedSquare(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    } else {
      if (board[row][col].color === currentPlayer) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const resetGame = () => {
    initializeBoard();
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setMoveHistory([]);
    setCurrentHint(0);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const randomizeSettings = () => {
    setGameLevel(gameLevels[Math.floor(Math.random() * gameLevels.length)]);
    setGameType(gameTypes[Math.floor(Math.random() * gameTypes.length)]);
  };

  const concepts = [
    {
      title: "Chess Opening Principles",
      description: "Learn the fundamental principles of chess openings",
      example: "1. Control the center\n2. Develop pieces\n3. Castle early\n4. Don't move same piece twice",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Piece Development", "King Safety", "Center Control"]
    },
    {
      title: "Tactical Patterns",
      description: "Master common tactical motifs",
      example: "Pins, forks, skewers, and discovered attacks",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Pins", "Forks", "Skewers", "Discovered Attacks"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-amber-800">Strategic Chess</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowConcepts(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Concepts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <Select value={gameLevel} onValueChange={setGameLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Game Type</label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={randomizeSettings} className="w-full" variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Random Settings
              </Button>

              <div className="space-y-2">
                <Button onClick={resetGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Game
                </Button>
                <Button onClick={nextHint} className="w-full" variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Next Hint
                </Button>
                <Button className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Move
                </Button>
              </div>

              <div className="text-center">
                <Badge className={currentPlayer === 'white' ? 'bg-white text-black' : 'bg-black text-white'}>
                  {currentPlayer === 'white' ? 'White' : 'Black'} to move
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chess Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto">
                <div className="grid grid-cols-8 gap-0 border-2 border-amber-800">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square flex items-center justify-center text-4xl cursor-pointer
                          border border-amber-300 transition-all duration-200
                          ${(rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-300'}
                          ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex 
                            ? 'ring-4 ring-blue-500' : ''}
                          hover:bg-amber-400
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {getPieceSymbol(piece)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Hint:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Move History:</h4>
                <div className="max-h-32 overflow-y-auto text-sm">
                  {moveHistory.length === 0 ? (
                    <p className="text-gray-500 italic">No moves yet</p>
                  ) : (
                    moveHistory.map((move, index) => (
                      <div key={index} className="py-1">
                        {Math.floor(index / 2) + 1}. {move}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Level: <Badge variant="secondary">{gameLevel}</Badge></div>
                  <div>Type: <Badge variant="secondary">{gameType}</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConceptModal
        isOpen={showConcepts}
        onClose={() => setShowConcepts(false)}
        concepts={concepts}
        gameTitle="Chess"
      />
    </div>
  );
};
