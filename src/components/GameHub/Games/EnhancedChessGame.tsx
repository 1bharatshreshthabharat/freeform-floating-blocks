
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Settings, Bot, Users, User, Clock, Zap } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChessCustomizationPanel, ChessCustomization } from './ChessCustomization';

interface EnhancedChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | null;
type PieceColor = 'white' | 'black' | null;

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

interface GameState {
  board: ChessPiece[][];
  currentPlayer: 'white' | 'black';
  selectedSquare: [number, number] | null;
  gameStatus: 'playing' | 'check' | 'checkmate' | 'draw';
  moveHistory: string[];
  capturedPieces: { white: PieceType[]; black: PieceType[] };
  timeRemaining: { white: number; black: number };
}

export const EnhancedChessGame: React.FC<EnhancedChessGameProps> = ({ onBack, onStatsUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentPlayer: 'white',
    selectedSquare: null,
    gameStatus: 'playing',
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
    timeRemaining: { white: 600, black: 600 }
  });

  const [gameSettings, setGameSettings] = useState({
    mode: 'vs-computer',
    difficulty: 'intermediate',
    timeControl: '10+0',
    aiPersonality: 'balanced'
  });

  const [customization, setCustomization] = useState<ChessCustomization>({
    boardTheme: 'classic',
    pieceSet: 'classical',
    boardColors: { light: '#f0d9b5', dark: '#b58863' },
    pieceColors: { white: '#ffffff', black: '#000000' },
    showCoordinates: true,
    highlightMoves: true,
    animationSpeed: 'normal',
    boardBorder: 'classic'
  });

  const [showCustomization, setShowCustomization] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [analysisMode, setAnalysisMode] = useState(false);

  const gameModes = [
    { value: 'vs-computer', label: 'vs Computer', icon: Bot },
    { value: 'vs-friend', label: 'vs Friend', icon: Users },
    { value: 'analysis', label: 'Analysis', icon: Zap },
    { value: 'puzzle', label: 'Puzzles', icon: Lightbulb }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner (800)' },
    { value: 'intermediate', label: 'Intermediate (1200)' },
    { value: 'advanced', label: 'Advanced (1600)' },
    { value: 'expert', label: 'Expert (2000)' },
    { value: 'master', label: 'Master (2400)' }
  ];

  const aiPersonalities = [
    { value: 'aggressive', label: 'Aggressive Attacker' },
    { value: 'defensive', label: 'Solid Defender' },
    { value: 'balanced', label: 'Balanced Player' },
    { value: 'tactical', label: 'Tactical Genius' },
    { value: 'positional', label: 'Positional Master' }
  ];

  const timeControls = [
    { value: '1+0', label: '1 min Bullet' },
    { value: '3+0', label: '3 min Blitz' },
    { value: '5+0', label: '5 min Blitz' },
    { value: '10+0', label: '10 min Rapid' },
    { value: '15+10', label: '15+10 Rapid' },
    { value: '30+0', label: '30 min Classical' },
    { value: 'unlimited', label: 'Unlimited' }
  ];

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
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      gameStatus: 'playing',
      moveHistory: [],
      selectedSquare: null,
      capturedPieces: { white: [], black: [] }
    }));
  };

  useEffect(() => {
    initializeBoard();
    setHints([
      "Control the center squares (e4, e5, d4, d5) early in the game",
      "Develop knights before bishops for better flexibility",
      "Castle early to protect your king and activate your rook",
      "Don't move the same piece twice in the opening without reason",
      "Look for tactical patterns: pins, forks, skewers, and discovered attacks",
      "Trade pieces when you're ahead in material",
      "Create pawn chains to control key squares",
      "Always check for opponent's threats before making your move"
    ]);
  }, []);

  const getPieceSymbol = (piece: ChessPiece) => {
    if (!piece.type || !piece.color) return '';
    
    const pieceSymbols = {
      classical: {
        white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
        black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
      },
      modern: {
        white: { king: '⚔', queen: '👑', rook: '🏰', bishop: '🗡', knight: '🐎', pawn: '⚫' },
        black: { king: '⚔', queen: '👑', rook: '🏰', bishop: '🗡', knight: '🐎', pawn: '⚪' }
      }
    };
    
    const symbolSet = pieceSymbols[customization.pieceSet as keyof typeof pieceSymbols] || pieceSymbols.classical;
    return symbolSet[piece.color][piece.type] || '';
  };

  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    return isLight ? customization.boardColors.light : customization.boardColors.dark;
  };

  const getBorderStyle = () => {
    const borderStyles = {
      none: '',
      classic: 'border-4 border-amber-800',
      ornate: 'border-8 border-gradient-to-r from-yellow-400 to-yellow-600',
      modern: 'border-2 border-gray-400 shadow-lg',
      glowing: 'border-4 border-blue-400 shadow-blue-400/50 shadow-lg'
    };
    return borderStyles[customization.boardBorder as keyof typeof borderStyles] || borderStyles.classic;
  };

  const getAnimationDuration = () => {
    const durations = {
      instant: '0ms',
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      cinematic: '800ms'
    };
    return durations[customization.animationSpeed as keyof typeof durations] || '400ms';
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameState.selectedSquare) {
      // Make move logic here
      const newBoard = [...gameState.board];
      const [fromRow, fromCol] = gameState.selectedSquare;
      const piece = newBoard[fromRow][fromCol];
      
      if (piece.color === gameState.currentPlayer) {
        // Capture piece if exists
        const capturedPiece = newBoard[row][col];
        if (capturedPiece.type && capturedPiece.color !== piece.color) {
          setGameState(prev => ({
            ...prev,
            capturedPieces: {
              ...prev.capturedPieces,
              [capturedPiece.color!]: [...prev.capturedPieces[capturedPiece.color!], capturedPiece.type!]
            }
          }));
        }
        
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = { type: null, color: null };
        
        const moveNotation = `${piece.type} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`;
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
          moveHistory: [...prev.moveHistory, moveNotation],
          selectedSquare: null
        }));
        
        onStatsUpdate(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
      }
    } else {
      if (gameState.board[row][col].color === gameState.currentPlayer) {
        setGameState(prev => ({ ...prev, selectedSquare: [row, col] }));
      }
    }
  };

  const resetGame = () => {
    initializeBoard();
    setGameState(prev => ({
      ...prev,
      currentPlayer: 'white',
      selectedSquare: null,
      moveHistory: [],
      capturedPieces: { white: [], black: [] }
    }));
    setCurrentHint(0);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const concepts = [
    {
      title: "Opening Principles",
      description: "Master the fundamental opening principles for strong starts",
      example: "1. Control the center\n2. Develop pieces quickly\n3. Castle early\n4. Don't move same piece twice",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Center Control", "Piece Development", "King Safety", "Time Management"]
    },
    {
      title: "Tactical Patterns",
      description: "Learn essential tactical motifs to win material",
      example: "Pin: Attack pieces that can't move\nFork: Attack two pieces simultaneously\nSkewer: Force valuable piece to move",
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
          <h1 className="text-3xl font-bold text-amber-800">Enhanced Chess Master</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowCustomization(!showCustomization)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button onClick={() => setShowConcepts(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Settings & Customization */}
          <div className="lg:col-span-1 space-y-4">
            {showCustomization ? (
              <ChessCustomizationPanel 
                customization={customization}
                onCustomizationChange={setCustomization}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Game Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Game Mode</label>
                    <Select value={gameSettings.mode} onValueChange={(value) => setGameSettings(prev => ({ ...prev, mode: value }))}>
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
                    <Select value={gameSettings.difficulty} onValueChange={(value) => setGameSettings(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(diff => (
                          <SelectItem key={diff.value} value={diff.value}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Personality</label>
                    <Select value={gameSettings.aiPersonality} onValueChange={(value) => setGameSettings(prev => ({ ...prev, aiPersonality: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiPersonalities.map(personality => (
                          <SelectItem key={personality.value} value={personality.value}>
                            {personality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Control</label>
                    <Select value={gameSettings.timeControl} onValueChange={(value) => setGameSettings(prev => ({ ...prev, timeControl: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeControls.map(time => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={resetGame} className="w-full" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Game
                    </Button>
                    <Button onClick={nextHint} className="w-full" variant="outline">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Next Hint
                    </Button>
                    <Button onClick={() => setAnalysisMode(!analysisMode)} className="w-full" variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      {analysisMode ? 'Exit Analysis' : 'Analysis Mode'}
                    </Button>
                  </div>

                  <div className="text-center space-y-2">
                    <Badge className={gameState.currentPlayer === 'white' ? 'bg-white text-black border-2' : 'bg-black text-white'}>
                      {gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move
                    </Badge>
                    {gameState.gameStatus !== 'playing' && (
                      <Badge variant="destructive">
                        {gameState.gameStatus === 'check' ? 'Check!' : 
                         gameState.gameStatus === 'checkmate' ? 'Checkmate!' : 'Draw!'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chess Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto">
                <div className={`grid grid-cols-8 gap-0 ${getBorderStyle()} rounded-lg overflow-hidden`}>
                  {gameState.board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square flex items-center justify-center text-4xl cursor-pointer
                          transition-all relative
                          ${gameState.selectedSquare && gameState.selectedSquare[0] === rowIndex && gameState.selectedSquare[1] === colIndex 
                            ? 'ring-4 ring-blue-500 ring-inset' : ''}
                          hover:brightness-110
                        `}
                        style={{ 
                          backgroundColor: getSquareColor(rowIndex, colIndex),
                          transitionDuration: getAnimationDuration()
                        }}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {getPieceSymbol(piece)}
                        
                        {/* Coordinate labels */}
                        {customization.showCoordinates && colIndex === 0 && (
                          <div className="absolute top-1 left-1 text-xs font-bold opacity-60">
                            {8 - rowIndex}
                          </div>
                        )}
                        {customization.showCoordinates && rowIndex === 7 && (
                          <div className="absolute bottom-1 right-1 text-xs font-bold opacity-60">
                            {String.fromCharCode(97 + colIndex)}
                          </div>
                        )}
                        
                        {/* Move highlighting */}
                        {customization.highlightMoves && gameState.selectedSquare && (
                          <div className="absolute inset-0 bg-yellow-400 opacity-20 pointer-events-none"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Game Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Black</span>
                  <Badge variant="outline">
                    {Math.floor(gameState.timeRemaining.black / 60)}:{(gameState.timeRemaining.black % 60).toString().padStart(2, '0')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">White</span>
                  <Badge variant="outline">
                    {Math.floor(gameState.timeRemaining.white / 60)}:{(gameState.timeRemaining.white % 60).toString().padStart(2, '0')}
                  </Badge>
                </div>
              </div>

              {/* Captured Pieces */}
              <div>
                <h4 className="font-semibold mb-2">Captured</h4>
                <div className="space-y-1">
                  <div className="text-sm">
                    White: {gameState.capturedPieces.white.join(', ') || 'None'}
                  </div>
                  <div className="text-sm">
                    Black: {gameState.capturedPieces.black.join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Current Hint */}
              <div>
                <h4 className="font-semibold mb-2">Strategic Hint:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              {/* Move History */}
              <div>
                <h4 className="font-semibold mb-2">Move History:</h4>
                <div className="max-h-32 overflow-y-auto text-sm bg-gray-50 p-2 rounded">
                  {gameState.moveHistory.length === 0 ? (
                    <p className="text-gray-500 italic">No moves yet</p>
                  ) : (
                    gameState.moveHistory.map((move, index) => (
                      <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                        {Math.floor(index / 2) + 1}. {move}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Current Settings Display */}
              <div>
                <h4 className="font-semibold mb-2">Active Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Mode: <Badge variant="secondary">{gameSettings.mode}</Badge></div>
                  <div>Level: <Badge variant="secondary">{gameSettings.difficulty}</Badge></div>
                  <div>Theme: <Badge variant="secondary">{customization.boardTheme}</Badge></div>
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
        gameTitle="Enhanced Chess"
      />
    </div>
  );
};
