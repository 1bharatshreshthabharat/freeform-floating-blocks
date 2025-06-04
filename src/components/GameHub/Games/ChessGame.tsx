
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Shuffle, Users, Bot, User } from 'lucide-react';
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
  const [gameMode, setGameMode] = useState('vs-computer');
  const [difficulty, setDifficulty] = useState('beginner');
  const [timeControl, setTimeControl] = useState('10+0');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');

  const gameModes = [
    { value: 'vs-computer', label: 'vs Computer', icon: Bot },
    { value: 'vs-friend', label: 'vs Friend', icon: Users },
    { value: 'single-player', label: 'Practice', icon: User }
  ];
  
  const difficulties = ['beginner', 'intermediate', 'advanced', 'master'];
  const timeControls = ['1+0', '3+0', '5+0', '10+0', '15+10', '30+0', 'unlimited'];

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
    setGameStatus('playing');
  };

  useEffect(() => {
    initializeBoard();
    setHints([
      "Control the center with your pawns and pieces",
      "Develop knights before bishops in the opening",
      "Castle early to keep your king safe",
      "Don't move the same piece twice in the opening",
      "Look for tactics like pins, forks, and skewers"
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
      // Make move
      const newBoard = [...board];
      const [fromRow, fromCol] = selectedSquare;
      const piece = newBoard[fromRow][fromCol];
      
      // Simple move validation (basic implementation)
      if (piece.color === currentPlayer) {
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = { type: null, color: null };
        
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setMoveHistory(prev => [...prev, `${piece.type} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        
        // Update stats
        onStatsUpdate(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
      }
      
      setSelectedSquare(null);
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
    const randomMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    setGameMode(randomMode.value);
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    setTimeControl(timeControls[Math.floor(Math.random() * timeControls.length)]);
  };

  const concepts = [
    {
      title: "Chess Opening Principles",
      description: "Master the fundamental opening principles",
      example: "1. Control the center (e4, d4, Nf3, Nc3)\n2. Develop pieces quickly\n3. Castle early for safety\n4. Don't move same piece twice",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Italian Game", "Queen's Gambit", "Sicilian Defense", "King's Safety"]
    },
    {
      title: "Tactical Patterns",
      description: "Learn essential tactical motifs",
      example: "Pin: Attack a piece that can't move\nFork: Attack two pieces at once\nSkewer: Force a valuable piece to move",
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
          <h1 className="text-3xl font-bold text-amber-800">Master Chess</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowConcepts(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn Concepts
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
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={gameMode} onValueChange={setGameMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameModes.map(mode => {
                      const Icon = mode.icon;
                      return (
                        <SelectItem key={mode.value} value={mode.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{mode.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Control</label>
                <Select value={timeControl} onValueChange={setTimeControl}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeControls.map(time => (
                      <SelectItem key={time} value={time}>
                        {time === 'unlimited' ? 'Unlimited' : `${time} minutes`}
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
                  New Game
                </Button>
                <Button onClick={nextHint} className="w-full" variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Next Hint
                </Button>
              </div>

              <div className="text-center space-y-2">
                <Badge className={currentPlayer === 'white' ? 'bg-white text-black border-2' : 'bg-black text-white'}>
                  {currentPlayer === 'white' ? 'White' : 'Black'} to move
                </Badge>
                {gameStatus !== 'playing' && (
                  <Badge variant="destructive">
                    {gameStatus === 'check' ? 'Check!' : gameStatus === 'checkmate' ? 'Checkmate!' : 'Draw!'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chess Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto">
                <div className="grid grid-cols-8 gap-0 border-4 border-amber-800 rounded-lg overflow-hidden">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square flex items-center justify-center text-4xl cursor-pointer
                          transition-all duration-200 relative
                          ${(rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-600'}
                          ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex 
                            ? 'ring-4 ring-blue-500 ring-inset' : ''}
                          hover:brightness-110
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {getPieceSymbol(piece)}
                        {/* Coordinate labels */}
                        {colIndex === 0 && (
                          <div className="absolute top-1 left-1 text-xs font-bold text-amber-800">
                            {8 - rowIndex}
                          </div>
                        )}
                        {rowIndex === 7 && (
                          <div className="absolute bottom-1 right-1 text-xs font-bold text-amber-800">
                            {String.fromCharCode(97 + colIndex)}
                          </div>
                        )}
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
                <div className="max-h-32 overflow-y-auto text-sm bg-gray-50 p-2 rounded">
                  {moveHistory.length === 0 ? (
                    <p className="text-gray-500 italic">No moves yet</p>
                  ) : (
                    moveHistory.map((move, index) => (
                      <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                        {Math.floor(index / 2) + 1}. {move}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Mode: <Badge variant="secondary">{gameMode.replace('-', ' ')}</Badge></div>
                  <div>Level: <Badge variant="secondary">{difficulty}</Badge></div>
                  <div>Time: <Badge variant="secondary">{timeControl}</Badge></div>
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
