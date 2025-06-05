import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, BookOpen, Settings, Bot, Users, Clock, Zap } from 'lucide-react';
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
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      capturedPieces: { white: [], black: [] },
      currentPlayer: 'white'
    }));
  };

  // Enhanced piece symbol rendering with all piece sets
  const getPieceSymbol = (piece: ChessPiece) => {
    if (!piece.type || !piece.color) return '';
    
    const pieceSymbols = {
      classical: {
        white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
        black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
      },
      modern: {
        white: { king: '🤴', queen: '👸', rook: '🏰', bishop: '⛪', knight: '🐎', pawn: '⚪' },
        black: { king: '🤴🏿', queen: '👸🏿', rook: '🏯', bishop: '🕌', knight: '🐴', pawn: '⚫' }
      },
      medieval: {
        white: { king: '👑', queen: '💎', rook: '🛡️', bishop: '⚔️', knight: '🐎', pawn: '🗡️' },
        black: { king: '👑', queen: '💎', rook: '🛡️', bishop: '⚔️', knight: '🐴', pawn: '🗡️' }
      },
      abstract: {
        white: { king: '⬢', queen: '⬡', rook: '⬜', bishop: '◇', knight: '◈', pawn: '○' },
        black: { king: '⬣', queen: '⬢', rook: '⬛', bishop: '◆', knight: '◉', pawn: '●' }
      },
      '3d': {
        white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
        black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
      },
      cartoon: {
        white: { king: '🤴', queen: '👸', rook: '🏠', bishop: '👼', knight: '🦄', pawn: '😊' },
        black: { king: '🤴🏿', queen: '👸🏿', rook: '🏠', bishop: '👼🏿', knight: '🦄', pawn: '😈' }
      },
      crystal: {
        white: { king: '💎', queen: '💍', rook: '🔷', bishop: '🔹', knight: '💠', pawn: '⚪' },
        black: { king: '🖤', queen: '💜', rook: '🔶', bishop: '🔸', knight: '🔺', pawn: '⚫' }
      },
      wooden: {
        white: { king: '🌳', queen: '🌲', rook: '🏘️', bishop: '🌿', knight: '🦌', pawn: '🌰' },
        black: { king: '🌲', queen: '🌳', rook: '🏘️', bishop: '🍃', knight: '🦌', pawn: '🌰' }
      }
    };
    
    const symbolSet = pieceSymbols[customization.pieceSet as keyof typeof pieceSymbols] || pieceSymbols.classical;
    return symbolSet[piece.color][piece.type] || '';
  };

  // Computer AI move logic
  const makeComputerMove = () => {
    if (gameSettings.mode !== 'vs-computer' || gameState.currentPlayer !== 'black' || isComputerThinking) return;
    
    setIsComputerThinking(true);
    
    // AI thinking delay based on difficulty
    const thinkingTime = {
      beginner: 500,
      intermediate: 1000,
      advanced: 1500,
      expert: 2000,
      master: 2500
    }[gameSettings.difficulty] || 1000;

    setTimeout(() => {
      // Simple AI: find all possible moves and pick one
      const possibleMoves = [];
      
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = gameState.board[row][col];
          if (piece.color === 'black') {
            // Find valid moves for this piece
            for (let toRow = 0; toRow < 8; toRow++) {
              for (let toCol = 0; toCol < 8; toCol++) {
                if (isValidMove(row, col, toRow, toCol)) {
                  possibleMoves.push({ from: [row, col], to: [toRow, toCol] });
                }
              }
            }
          }
        }
      }

      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        makeMove(randomMove.from[0], randomMove.from[1], randomMove.to[0], randomMove.to[1]);
      }
      
      setIsComputerThinking(false);
    }, thinkingTime);
  };

  // Basic move validation
  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = gameState.board[fromRow][fromCol];
    const targetPiece = gameState.board[toRow][toCol];
    
    if (!piece.type || !piece.color) return false;
    if (targetPiece.color === piece.color) return false;
    if (fromRow === toRow && fromCol === toCol) return false;
    
    // Basic piece movement rules
    switch (piece.type) {
      case 'pawn':
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color);
      case 'rook':
        return isValidRookMove(fromRow, fromCol, toRow, toCol);
      case 'bishop':
        return isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case 'queen':
        return isValidQueenMove(fromRow, fromCol, toRow, toCol);
      case 'king':
        return isValidKingMove(fromRow, fromCol, toRow, toCol);
      case 'knight':
        return isValidKnightMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
  };

  const isValidPawnMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, color: PieceColor) => {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !gameState.board[toRow][toCol].type) return true;
      if (fromRow === startRow && toRow === fromRow + 2 * direction && !gameState.board[toRow][toCol].type && !gameState.board[fromRow + direction][toCol].type) return true;
    }
    
    // Capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      return gameState.board[toRow][toCol].type && gameState.board[toRow][toCol].color !== color;
    }
    
    return false;
  };

  const isValidRookMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
  };

  const isValidBishopMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
  };

  const isValidQueenMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
  };

  const isValidKingMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
  };

  const isValidKnightMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const isPathClear = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (gameState.board[currentRow][currentCol].type) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    // Update captured pieces
    let newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece.type && capturedPiece.color) {
      newCapturedPieces[capturedPiece.color] = [...newCapturedPieces[capturedPiece.color], capturedPiece.type];
    }
    
    // Make the move
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = { type: null, color: null };
    
    const moveNotation = `${piece.type} ${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
      moveHistory: [...prev.moveHistory, moveNotation],
      selectedSquare: null,
      capturedPieces: newCapturedPieces
    }));
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameSettings.mode === 'vs-computer' && gameState.currentPlayer === 'black') return;
    
    if (gameState.selectedSquare) {
      const [fromRow, fromCol] = gameState.selectedSquare;
      
      if (isValidMove(fromRow, fromCol, row, col)) {
        makeMove(fromRow, fromCol, row, col);
      } else {
        // Select new piece
        if (gameState.board[row][col].color === gameState.currentPlayer) {
          setGameState(prev => ({ ...prev, selectedSquare: [row, col] }));
        } else {
          setGameState(prev => ({ ...prev, selectedSquare: null }));
        }
      }
    } else {
      if (gameState.board[row][col].color === gameState.currentPlayer) {
        setGameState(prev => ({ ...prev, selectedSquare: [row, col] }));
      }
    }
  };

  // Update game settings in real-time
  useEffect(() => {
    // Apply time control
    const [minutes, increment] = gameSettings.timeControl.split('+').map(Number);
    if (minutes && !isNaN(minutes)) {
      setGameState(prev => ({
        ...prev,
        timeRemaining: { white: minutes * 60, black: minutes * 60 }
      }));
    }
  }, [gameSettings]);

  // Computer move trigger
  useEffect(() => {
    if (gameSettings.mode === 'vs-computer' && gameState.currentPlayer === 'black' && gameState.gameStatus === 'playing') {
      makeComputerMove();
    }
  }, [gameState.currentPlayer, gameSettings.mode]);

  useEffect(() => {
    initializeBoard();
    setHints([
      "Control the center squares (e4, e5, d4, d5) early in the game",
      "Develop knights before bishops for better flexibility",
      "Castle early to protect your king and activate your rook",
      "Don't move the same piece twice in the opening without reason",
      "Look for tactical patterns: pins, forks, skewers, and discovered attacks"
    ]);
  }, []);

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
      description: "Master the fundamental opening principles for strong game starts. Control the center with pawns and pieces, develop pieces quickly towards the center, ensure king safety through castling, and avoid moving the same piece multiple times without purpose.",
      example: "1. Control the center with e4/d4 or e5/d5\n2. Develop knights before bishops (Nf3, Nc3)\n3. Castle early (0-0 or 0-0-0)\n4. Don't move same piece twice\n5. Connect your rooks",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Center Control", "Piece Development", "King Safety", "Time Management"]
    },
    {
      title: "Tactical Patterns",
      description: "Essential tactical motifs every chess player must know. These patterns help you win material and create winning positions through forcing moves and combinations.",
      example: "Pin: Attack pieces that can't move without exposing more valuable pieces\n\nFork: Attack two pieces simultaneously with one piece\n\nSkewer: Force a valuable piece to move, exposing a less valuable piece behind it\n\nDiscovered Attack: Move one piece to reveal an attack from another piece",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Pins", "Forks", "Skewers", "Discovered Attacks", "Double Attacks"]
    },
    {
      title: "How to Play Chess",
      description: "Complete guide to chess rules and gameplay. Learn piece movements, special moves, win conditions, and basic strategies to start your chess journey.",
      example: "Board Setup:\n- 8x8 board with alternating light and dark squares\n- White pieces start on ranks 1-2\n- Black pieces start on ranks 7-8\n\nPiece Values:\n- Pawn = 1 point\n- Knight/Bishop = 3 points\n- Rook = 5 points\n- Queen = 9 points\n- King = Invaluable\n\nWin Conditions:\n- Checkmate (king under attack with no escape)\n- Resignation\n- Time forfeit",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Board Setup", "Piece Movement", "Special Moves", "Check & Checkmate", "Draw Conditions"]
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
          {/* Game Settings */}
          <div className="lg:col-span-1 space-y-4">
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
                  <Button onClick={() => initializeBoard()} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                  <Button onClick={() => setCurrentHint((prev) => (prev + 1) % hints.length)} className="w-full" variant="outline">
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
                  {isComputerThinking && (
                    <Badge variant="secondary">
                      Computer thinking...
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chess Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto">
                <div className={`grid grid-cols-8 gap-0 rounded-lg overflow-hidden`}>
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
                        <span style={{ color: piece.color === 'white' ? customization.pieceColors.white : customization.pieceColors.black }}>
                          {getPieceSymbol(piece)}
                        </span>
                        
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

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Chess</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            <ChessCustomizationPanel 
              customization={customization}
              onCustomizationChange={setCustomization}
            />
          </div>
        </div>
      )}

      <ConceptModal
        isOpen={showConcepts}
        onClose={() => setShowConcepts(false)}
        concepts={concepts}
        gameTitle="Enhanced Chess"
      />
    </div>
  );
};
