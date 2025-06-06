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
  const [aiMoveTimeout, setAiMoveTimeout] = useState<NodeJS.Timeout | null>(null);
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

  // Enhanced piece symbol rendering with proper piece set application
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
        black: { king: '🖤', queen: '💜', rook: '🛡️', bishop: '⚔️', knight: '🐴', pawn: '🗡️' }
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

  // Improved Computer AI move logic
  const makeComputerMove = () => {
    if (gameSettings.mode !== 'vs-computer' || gameState.currentPlayer !== 'black' || isComputerThinking) return;
    
    setIsComputerThinking(true);
    
    // AI thinking delay based on difficulty
    const thinkingTime = {
      beginner: 800,
      intermediate: 1200,
      advanced: 1800,
      expert: 2500,
      master: 3000
    }[gameSettings.difficulty] || 1200;

    const timeout = setTimeout(() => {
      const possibleMoves = getAllPossibleMoves('black');
      
      if (possibleMoves.length > 0) {
        let selectedMove;
        
        // AI personality-based move selection
        switch (gameSettings.aiPersonality) {
          case 'aggressive':
            selectedMove = selectAggressiveMove(possibleMoves);
            break;
          case 'defensive':
            selectedMove = selectDefensiveMove(possibleMoves);
            break;
          case 'tactical':
            selectedMove = selectTacticalMove(possibleMoves);
            break;
          default:
            selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        
        makeMove(selectedMove.from[0], selectedMove.from[1], selectedMove.to[0], selectedMove.to[1]);
      }
      
      setIsComputerThinking(false);
    }, thinkingTime);
    
    setAiMoveTimeout(timeout);
  };

  const getAllPossibleMoves = (color: 'white' | 'black') => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(row, col, toRow, toCol)) {
                moves.push({ from: [row, col], to: [toRow, toCol], piece: piece.type });
              }
            }
          }
        }
      }
    }
    return moves;
  };

  const selectAggressiveMove = (moves: any[]) => {
    // Prioritize captures and attacks on opponent king
    const captureMoves = moves.filter(move => gameState.board[move.to[0]][move.to[1]].type);
    const checkMoves = moves.filter(move => wouldGiveCheck(move));
    
    if (captureMoves.length > 0) return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    if (checkMoves.length > 0) return checkMoves[Math.floor(Math.random() * checkMoves.length)];
    return moves[Math.floor(Math.random() * moves.length)];
  };

  const selectDefensiveMove = (moves: any[]) => {
    // Prioritize protecting pieces and king safety
    const safeMoves = moves.filter(move => !wouldExposeKing(move));
    return safeMoves.length > 0 ? safeMoves[Math.floor(Math.random() * safeMoves.length)] : moves[Math.floor(Math.random() * moves.length)];
  };

  const selectTacticalMove = (moves: any[]) => {
    // Look for tactical patterns like forks, pins, etc.
    const tacticalMoves = moves.filter(move => isTacticalMove(move));
    return tacticalMoves.length > 0 ? tacticalMoves[Math.floor(Math.random() * tacticalMoves.length)] : moves[Math.floor(Math.random() * moves.length)];
  };

  const wouldGiveCheck = (move: any) => {
    // Simplified check detection
    return false; // Placeholder for actual implementation
  };

  const wouldExposeKing = (move: any) => {
    // Simplified king safety check
    return false; // Placeholder for actual implementation
  };

  const isTacticalMove = (move: any) => {
    // Simplified tactical move detection
    return false; // Placeholder for actual implementation
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
    
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !gameState.board[toRow][toCol].type) return true;
      if (fromRow === startRow && toRow === fromRow + 2 * direction && !gameState.board[toRow][toCol].type && !gameState.board[fromRow + direction][toCol].type) return true;
    }
    
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
    
    let newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece.type && capturedPiece.color) {
      newCapturedPieces[capturedPiece.color] = [...newCapturedPieces[capturedPiece.color], capturedPiece.type];
    }
    
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

  // Real-time settings application
  useEffect(() => {
    const [minutes, increment] = gameSettings.timeControl.split('+').map(Number);
    if (minutes && !isNaN(minutes) && gameSettings.timeControl !== 'unlimited') {
      setGameState(prev => ({
        ...prev,
        timeRemaining: { white: minutes * 60, black: minutes * 60 }
      }));
    }
  }, [gameSettings.timeControl]);

  // Computer move trigger with proper cleanup
  useEffect(() => {
    if (gameSettings.mode === 'vs-computer' && gameState.currentPlayer === 'black' && gameState.gameStatus === 'playing') {
      makeComputerMove();
    }
    
    return () => {
      if (aiMoveTimeout) {
        clearTimeout(aiMoveTimeout);
        setAiMoveTimeout(null);
      }
    };
  }, [gameState.currentPlayer, gameSettings.mode, gameSettings.difficulty, gameSettings.aiPersonality]);

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

  const getBoardThemeStyles = () => {
    const themes = {
      classic: { background: 'linear-gradient(45deg, #f0d9b5, #b58863)' },
      wood: { background: 'linear-gradient(45deg, #deb887, #8b4513)' },
      marble: { background: 'linear-gradient(45deg, #f5f5dc, #d3d3d3)' },
      glass: { background: 'linear-gradient(45deg, rgba(255,255,255,0.8), rgba(200,200,200,0.8))', backdropFilter: 'blur(10px)' },
      neon: { background: 'linear-gradient(45deg, #00ffff, #ff00ff)', boxShadow: '0 0 20px rgba(0,255,255,0.5)' },
      tournament: { background: 'linear-gradient(45deg, #ffffff, #000000)' }
    };
    return themes[customization.boardTheme as keyof typeof themes] || themes.classic;
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
    if (aiMoveTimeout) {
      clearTimeout(aiMoveTimeout);
      setAiMoveTimeout(null);
    }
    setIsComputerThinking(false);
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
      title: "How to Play Chess",
      description: "Learn the complete rules and mechanics of chess from board setup to winning conditions.",
      example: "**Board Setup:**\n• 8×8 board with alternating light and dark squares\n• White pieces on ranks 1-2, Black on ranks 7-8\n• Queen starts on her own color (white queen on light square)\n\n**Piece Values:**\n• Pawn = 1 point\n• Knight/Bishop = 3 points\n• Rook = 5 points\n• Queen = 9 points\n• King = Invaluable\n\n**How Pieces Move:**\n• **Pawn:** Forward one square, two on first move, captures diagonally\n• **Rook:** Any number of squares horizontally or vertically\n• **Bishop:** Any number of squares diagonally\n• **Queen:** Combines rook and bishop moves\n• **Knight:** L-shape: 2 squares in one direction, 1 perpendicular\n• **King:** One square in any direction\n\n**Special Moves:**\n• **Castling:** King and rook move simultaneously for safety\n• **En Passant:** Special pawn capture\n• **Promotion:** Pawn reaching end becomes any piece\n\n**Win Conditions:**\n• **Checkmate:** King under attack with no escape\n• **Resignation:** Player gives up\n• **Time Forfeit:** Clock runs out\n\n**Draw Conditions:**\n• **Stalemate:** No legal moves but not in check\n• **Threefold Repetition:** Same position occurs three times\n• **50-Move Rule:** 50 moves without pawn move or capture\n• **Insufficient Material:** Neither side can checkmate",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Board Setup", "Piece Movement", "Special Moves", "Check & Checkmate", "Draw Conditions"]
    },
    {
      title: "Opening Principles",
      description: "Master the fundamental opening principles for strong game starts.",
      example: "**The Four Key Opening Principles:**\n\n**1. Control the Center**\n• Move central pawns (e4, d4, e5, d5)\n• Place pieces to attack central squares\n• Central control gives more piece mobility\n\n**2. Develop Pieces Quickly**\n• Knights before bishops (Nf3, Nc3)\n• Develop toward the center\n• Don't move the same piece twice\n• Get pieces off the back rank\n\n**3. King Safety**\n• Castle early (usually by move 10)\n• Don't weaken king position unnecessarily\n• Keep pawns in front of castled king\n\n**4. Don't Waste Time**\n• Avoid unnecessary pawn moves\n• Don't bring queen out too early\n• Don't move already developed pieces\n• Each move should improve your position\n\n**Common Opening Sequence:**\n1. e4 e5\n2. Nf3 Nc6\n3. Bc4 Bc5\n4. 0-0 0-0\n\n**Opening Mistakes to Avoid:**\n• Scholar's Mate attempts\n• Moving same piece multiple times\n• Neglecting king safety\n• Premature attacks",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Center Control", "Piece Development", "King Safety", "Time Management"]
    },
    {
      title: "Tactical Patterns",
      description: "Essential tactical motifs every chess player must know.",
      example: "**Basic Tactical Patterns:**\n\n**Pin**\n• Attack a piece that can't move without exposing a more valuable piece behind it\n• Absolute pin: Against the king (piece legally can't move)\n• Relative pin: Against valuable piece (piece shouldn't move)\n\n**Fork**\n• Attack two or more enemy pieces simultaneously\n• Knight forks are especially powerful\n• Pawn forks can win material in endgames\n\n**Skewer**\n• Force a valuable piece to move, exposing less valuable piece behind\n• Reverse of a pin\n• Often involves rooks, bishops, or queen\n\n**Discovered Attack**\n• Move one piece to reveal attack from another\n• Moving piece can capture or attack something else\n• Very powerful when both pieces attack\n\n**Double Attack**\n• Attack two targets simultaneously\n• Forces opponent to choose what to save\n• Can be with same piece or different pieces\n\n**Deflection**\n• Force defending piece away from protection duty\n• Remove the defender to win material\n\n**Decoy**\n• Lure piece to unfavorable square\n• Often combined with other tactics\n\n**Practice Tips:**\n• Solve tactical puzzles daily\n• Look for opponent's undefended pieces\n• Check all captures and checks\n• Calculate variations completely",
      animation: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop",
      relatedTopics: ["Pins", "Forks", "Skewers", "Discovered Attacks", "Double Attacks"]
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
                <div 
                  className={`grid grid-cols-8 gap-0 rounded-lg overflow-hidden ${getBorderStyle()}`}
                  style={getBoardThemeStyles()}
                >
                  {gameState.board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square flex items-center justify-center text-4xl cursor-pointer
                          transition-all relative
                          ${gameState.selectedSquare && gameState.selectedSquare[0] === rowIndex && gameState.selectedSquare[1] === colIndex 
                            ? 'ring-4 ring-blue-500 ring-inset' : ''}
                          ${customization.highlightMoves ? 'hover:brightness-110' : ''}
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
              {gameSettings.timeControl !== 'unlimited' && (
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
              )}

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
                  <div>AI: <Badge variant="secondary">{gameSettings.aiPersonality}</Badge></div>
                  <div>Theme: <Badge variant="secondary">{customization.boardTheme}</Badge></div>
                  <div>Pieces: <Badge variant="secondary">{customization.pieceSet}</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
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
