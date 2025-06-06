import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Lightbulb, Eye, Brain, Trophy, Clock, Target, Users } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';

interface SquareProps {
  row: number;
  col: number;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isDraggedFrom: boolean;
  handleSquareClick: (row: number, col: number) => void;
  handleMouseDown: (e: React.MouseEvent, row: number, col: number) => void;
  customization: any;
  getPieceSymbol: (piece: ChessPiece) => string;
  dragState: DragState;
}

interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  position: string;
  hasMoved?: boolean;
}

interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: 'white' | 'black';
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  moves: string[];
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
}

interface EnhancedChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface DragState {
  isDragging: boolean;
  draggedPiece: ChessPiece | null;
  draggedFrom: { row: number; col: number } | null;
  dragPosition: { x: number; y: number };
}

interface ChessCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  customization: any;
  onCustomizationChange: (customization: any) => void;
}

// Chess Customization Component
const ChessCustomization: React.FC<ChessCustomizationProps> = ({
  isOpen,
  onClose,
  customization,
  onCustomizationChange
}) => {
  if (!isOpen) return null;

  const piecesets = [
    { id: 'classic', name: 'Classic', pieces: { white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' }, black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' } } },
    { id: 'modern', name: 'Modern', pieces: { white: { king: '🤴', queen: '👸', rook: '🏰', bishop: '⛪', knight: '🐎', pawn: '👨' }, black: { king: '🖤', queen: '👩‍🦱', rook: '🏚️', bishop: '🕌', knight: '🐴', pawn: '👤' } } },
    { id: 'fantasy', name: 'Fantasy', pieces: { white: { king: '🦄', queen: '🧚', rook: '🗼', bishop: '⭐', knight: '🦋', pawn: '🌟' }, black: { king: '🐲', queen: '🧙', rook: '🏯', bishop: '💀', knight: '🦇', pawn: '👻' } } }
  ];

  const boardThemes = [
    { id: 'classic', name: 'Classic', colors: { light: '#F0D9B5', dark: '#B58863' } },
    { id: 'blue', name: 'Ocean Blue', colors: { light: '#DEE3E6', dark: '#8CA2AD' } },
    { id: 'green', name: 'Forest Green', colors: { light: '#EEEED2', dark: '#769656' } },
    { id: 'purple', name: 'Royal Purple', colors: { light: '#E8E8FF', dark: '#9370DB' } }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Customize Chess</h2>
          <Button onClick={onClose} variant="outline" size="sm">×</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Piece Set</label>
              <div className="grid grid-cols-1 gap-2">
                {piecesets.map(set => (
                  <div
                    key={set.id}
                    className={`p-3 border rounded cursor-pointer ${customization.pieceSet === set.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => onCustomizationChange({ ...customization, pieceSet: set.id, pieces: set.pieces })}
                  >
                    <div className="font-medium">{set.name}</div>
                    <div className="text-xl mt-1">
                      {set.pieces.white.king}{set.pieces.white.queen}{set.pieces.white.rook} vs {set.pieces.black.king}{set.pieces.black.queen}{set.pieces.black.rook}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Board Theme</label>
              <div className="grid grid-cols-1 gap-2">
                {boardThemes.map(theme => (
                  <div
                    key={theme.id}
                    className={`p-3 border rounded cursor-pointer ${customization.boardTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => onCustomizationChange({ ...customization, boardTheme: theme.id, boardColors: theme.colors })}
                  >
                    <div className="font-medium">{theme.name}</div>
                    <div className="flex space-x-2 mt-1">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.light }}></div>
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.dark }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="coords"
                  checked={customization.showCoordinates}
                  onChange={(e) => onCustomizationChange({ ...customization, showCoordinates: e.target.checked })}
                />
                <label htmlFor="coords" className="text-sm font-medium">Show Coordinates</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lastmove"
                  checked={customization.highlightLastMove}
                  onChange={(e) => onCustomizationChange({ ...customization, highlightLastMove: e.target.checked })}
                />
                <label htmlFor="lastmove" className="text-sm font-medium">Highlight Last Move</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="validmoves"
                  checked={customization.showValidMoves}
                  onChange={(e) => onCustomizationChange({ ...customization, showValidMoves: e.target.checked })}
                />
                <label htmlFor="validmoves" className="text-sm font-medium">Show Valid Moves</label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Animation Speed</label>
              <select
                value={customization.animationSpeed}
                onChange={(e) => onCustomizationChange({ ...customization, animationSpeed: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Square Size</label>
              <select
                value={customization.squareSize}
                onChange={(e) => onCustomizationChange({ ...customization, squareSize: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="small">Small (50px)</option>
                <option value="medium">Medium (60px)</option>
                <option value="large">Large (70px)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EnhancedChessGame: React.FC<EnhancedChessGameProps> = ({ onBack, onStatsUpdate }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    currentPlayer: 'white',
    gameStatus: 'playing',
    moves: [],
    capturedPieces: { white: [], black: [] }
  });

  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
  const [gameMode, setGameMode] = useState<'vs-computer' | 'vs-friend' | 'analysis' | 'puzzles'>('vs-computer');
  const [aiDifficulty, setAiDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [timeControl, setTimeControl] = useState<{ white: number; black: number }>({ white: 600, black: 600 });
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Drag and drop state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedPiece: null,
    draggedFrom: null,
    dragPosition: { x: 0, y: 0 }
  });

  const [customization, setCustomization] = useState({
    boardTheme: 'classic',
    pieceSet: 'classic',
    animationSpeed: 'medium',
    showCoordinates: true,
    highlightLastMove: true,
    showValidMoves: true,
    boardBorder: 'wooden',
    squareSize: 'medium',
    pieces: {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    },
    boardColors: { light: '#F0D9B5', dark: '#B58863' }
  });

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  function initializeBoard(): (ChessPiece | null)[][] {
    const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place white pieces
    const whitePieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    whitePieces.forEach((piece, col) => {
      board[7][col] = { type: piece as any, color: 'white', position: `${String.fromCharCode(97 + col)}${8 - 7}` };
    });
    for (let col = 0; col < 8; col++) {
      board[6][col] = { type: 'pawn', color: 'white', position: `${String.fromCharCode(97 + col)}${8 - 6}` };
    }
    
    // Place black pieces
    const blackPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    blackPieces.forEach((piece, col) => {
      board[0][col] = { type: piece as any, color: 'black', position: `${String.fromCharCode(97 + col)}${8 - 0}` };
    });
    for (let col = 0; col < 8; col++) {
      board[1][col] = { type: 'pawn', color: 'black', position: `${String.fromCharCode(97 + col)}${8 - 1}` };
    }
    
    return board;
  }

  const getValidMoves = useCallback((piece: ChessPiece, fromRow: number, fromCol: number): { row: number; col: number }[] => {
    // Simplified move validation - in a real implementation, this would be much more complex
    const moves: { row: number; col: number }[] = [];
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (isValidPosition(fromRow + direction, fromCol) && !gameState.board[fromRow + direction][fromCol]) {
          moves.push({ row: fromRow + direction, col: fromCol });
          
          // Two squares from start
          if (fromRow === startRow && isValidPosition(fromRow + 2 * direction, fromCol) && !gameState.board[fromRow + 2 * direction][fromCol]) {
            moves.push({ row: fromRow + 2 * direction, col: fromCol });
          }
        }
        
        // Captures
        [-1, 1].forEach(colOffset => {
          const newCol = fromCol + colOffset;
          if (isValidPosition(fromRow + direction, newCol)) {
            const targetPiece = gameState.board[fromRow + direction]?.[newCol];
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push({ row: fromRow + direction, col: newCol });
            }
          }
        });
        break;
        
      case 'rook':
        // Horizontal and vertical moves
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        directions.forEach(([dRow, dCol]) => {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * dRow;
            const newCol = fromCol + i * dCol;
            
            if (!isValidPosition(newRow, newCol)) break;
            
            const targetPiece = gameState.board[newRow][newCol];
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        });
        break;
        
      case 'bishop':
        // Diagonal moves
        const diagonalDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        diagonalDirs.forEach(([dRow, dCol]) => {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * dRow;
            const newCol = fromCol + i * dCol;
            
            if (!isValidPosition(newRow, newCol)) break;
            
            const targetPiece = gameState.board[newRow][newCol];
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        });
        break;
        
      case 'queen':
        // Combination of rook and bishop moves
        const allDirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        allDirs.forEach(([dRow, dCol]) => {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * dRow;
            const newCol = fromCol + i * dCol;
            
            if (!isValidPosition(newRow, newCol)) break;
            
            const targetPiece = gameState.board[newRow][newCol];
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
        });
        break;
        
      case 'king':
        // One square in any direction
        for (let dRow = -1; dRow <= 1; dRow++) {
          for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue;
            
            const newRow = fromRow + dRow;
            const newCol = fromCol + dCol;
            
            if (isValidPosition(newRow, newCol)) {
              const targetPiece = gameState.board[newRow][newCol];
              if (!targetPiece || targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
        break;
        
      case 'knight':
        // L-shaped moves
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightMoves.forEach(([dRow, dCol]) => {
          const newRow = fromRow + dRow;
          const newCol = fromCol + dCol;
          
          if (isValidPosition(newRow, newCol)) {
            const targetPiece = gameState.board[newRow][newCol];
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        });
        break;
    }
    
    return moves;
  }, [gameState.board]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (dragState.isDragging) return;
    
    const clickedPiece = gameState.board[row][col];
    
    if (selectedSquare) {
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      
      if (isValidMove) {
        makeMove(selectedSquare.row, selectedSquare.col, row, col);
      } else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(clickedPiece, row, col));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
      setSelectedSquare({ row, col });
      setValidMoves(getValidMoves(clickedPiece, row, col));
    }
  }, [selectedSquare, validMoves, gameState, getValidMoves, dragState.isDragging]);

  // Drag and drop handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, row: number, col: number) => {
    const piece = gameState.board[row][col];
    if (!piece || piece.color !== gameState.currentPlayer) return;
    
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragState({
      isDragging: true,
      draggedPiece: piece,
      draggedFrom: { row, col },
      dragPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    });
    
    setValidMoves(getValidMoves(piece, row, col));
    e.preventDefault();
  }, [gameState.board, gameState.currentPlayer, getValidMoves]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }));
  }, [dragState.isDragging]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.draggedFrom || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const squareSize = customization.squareSize === 'small' ? 50 : customization.squareSize === 'large' ? 70 : 60;
    const col = Math.floor((e.clientX - rect.left) / squareSize);
    const row = Math.floor((e.clientY - rect.top) / squareSize);
    
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      if (isValidMove) {
        makeMove(dragState.draggedFrom.row, dragState.draggedFrom.col, row, col);
      }
    }
    
    setDragState({
      isDragging: false,
      draggedPiece: null,
      draggedFrom: null,
      dragPosition: { x: 0, y: 0 }
    });
    setValidMoves([]);
  }, [dragState, validMoves, customization.squareSize]);

  const makeMove = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    if (!piece) return;
    
    // Move the piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Update captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece);
    }
    
    // Update move notation
    const moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
      moves: [...prev.moves, moveNotation],
      capturedPieces: newCapturedPieces
    }));
    
    setSelectedSquare(null);
    setValidMoves([]);
  }, [gameState]);

  // AI move logic
  useEffect(() => {
    if (gameMode === 'vs-computer' && gameState.currentPlayer === 'black' && gameState.gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameMode, gameState.gameStatus]);

  const makeAIMove = useCallback(() => {
    // Simple AI: find all possible moves and pick one randomly
    const allMoves: { from: { row: number; col: number }; to: { row: number; col: number } }[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece.color === 'black') {
          const moves = getValidMoves(piece, row, col);
          moves.forEach(move => {
            allMoves.push({ from: { row, col }, to: move });
          });
        }
      }
    }
    
    if (allMoves.length > 0) {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      makeMove(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
    }
  }, [gameState.board, getValidMoves, makeMove]);

  const getPieceSymbol = (piece: ChessPiece): string => {
    return customization.pieces[piece.color][piece.type];
  };

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      gameStatus: 'playing',
      moves: [],
      capturedPieces: { white: [], black: [] }
    });
    setSelectedSquare(null);
    setValidMoves([]);
    setDragState({
      isDragging: false,
      draggedPiece: null,
      draggedFrom: null,
      dragPosition: { x: 0, y: 0 }
    });
  };

  const chessLearningConcepts = [
    {
      title: "Chess Fundamentals",
      description: "Chess is a strategic board game between two players. The objective is to checkmate the opponent's king, meaning the king is in a position to be captured and cannot escape.",
      example: "Each player starts with 16 pieces:\n- 1 King\n- 1 Queen\n- 2 Rooks\n- 2 Bishops\n- 2 Knights\n- 8 Pawns",
      relatedTopics: ["Piece Movement", "Board Setup", "Game Objective"]
    },
    {
      title: "Piece Movement",
      description: "Each chess piece has its own unique way of moving across the board. Understanding how each piece moves is fundamental to playing chess.",
      example: "King: One square in any direction\nQueen: Any number of squares in any direction\nRook: Any number of squares horizontally or vertically\nBishop: Any number of squares diagonally\nKnight: L-shape (2 squares in one direction, then 1 perpendicular)\nPawn: One square forward (two on first move), captures diagonally",
      relatedTopics: ["Special Moves", "Capturing", "Strategy"]
    },
    {
      title: "Special Moves",
      description: "Chess has several special moves that can dramatically change the game: castling, en passant, and pawn promotion.",
      example: "Castling: King moves 2 squares toward rook, rook moves to opposite side\nEn Passant: Capture a pawn that moved 2 squares\nPromotion: Pawn reaching end becomes any piece (usually Queen)",
      relatedTopics: ["King Safety", "Endgame", "Tactics"]
    },
    {
      title: "Check and Checkmate",
      description: "Check occurs when the king is under attack. Checkmate happens when the king is in check and has no legal moves to escape capture.",
      example: "Check: King is attacked, must move to safety\nCheckmate: King is attacked with no escape - game over\nStalemate: No legal moves but not in check - draw",
      relatedTopics: ["King Safety", "Game Endings", "Tactics"]
    }
  ];

  const ChessSquare: React.FC<SquareProps> = ({
    row,
    col,
    piece,
    isSelected,
    isValidMove,
    isDraggedFrom,
    handleSquareClick,
    handleMouseDown,
    customization,
    getPieceSymbol,
    dragState
  }) => {
    const isLight = (row + col) % 2 === 0;
    const squareSize = customization.squareSize === 'small' ? 50 : customization.squareSize === 'large' ? 70 : 60;
  
    return (
      <div
        key={`${row}-${col}`}
        className={`absolute flex items-center justify-center text-3xl cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-4 ring-blue-500' : ''
        } ${
          isValidMove ? 'ring-2 ring-green-400' : ''
        } ${isDraggedFrom && dragState.isDragging ? 'opacity-50' : ''}`}
        style={{
          left: `${col * squareSize}px`,
          top: `${row * squareSize}px`,
          width: `${squareSize}px`,
          height: `${squareSize}px`,
          backgroundColor: isLight ? customization.boardColors.light : customization.boardColors.dark,
        }}
        onClick={() => handleSquareClick(row, col)}
        onMouseDown={(e) => handleMouseDown(e, row, col)}
      >
        {piece && !isDraggedFrom && getPieceSymbol(piece)}
        {isValidMove && !piece && (
          <div className="w-4 h-4 bg-green-400 rounded-full opacity-70" />
        )}
        {customization.showCoordinates && col === 0 && (
          <span className="absolute top-1 left-1 text-xs text-gray-600">
            {8 - row}
          </span>
        )}
        {customization.showCoordinates && row === 7 && (
          <span className="absolute bottom-1 right-1 text-xs text-gray-600">
            {String.fromCharCode(97 + col)}
          </span>
        )}
      </div>
    );
  };

  const squareSize = customization.squareSize === 'small' ? 50 : customization.squareSize === 'large' ? 70 : 60;
  const boardSize = squareSize * 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-amber-800">♛ Enhanced Chess</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowLearnModal(true)} variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Learn
            </Button>
            <Button onClick={() => setShowCustomization(true)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Board */}
          <Card className="flex-1">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div 
                  ref={boardRef}
                  className="relative inline-block border-4 border-amber-800 rounded-lg bg-amber-200"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ 
                    width: `${boardSize}px`, 
                    height: `${boardSize}px`
                  }}
                >
                  {gameState.board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <ChessSquare
                        key={`${rowIndex}-${colIndex}`}
                        row={rowIndex}
                        col={colIndex}
                        piece={piece}
                        isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
                        isValidMove={validMoves.some(move => move.row === rowIndex && move.col === colIndex)}
                        isDraggedFrom={dragState.draggedFrom?.row === rowIndex && dragState.draggedFrom?.col === colIndex}
                        handleSquareClick={handleSquareClick}
                        handleMouseDown={handleMouseDown}
                        customization={customization}
                        getPieceSymbol={getPieceSymbol}
                        dragState={dragState}
                      />
                    ))
                  )}
                  
                  {/* Dragged piece */}
                  {dragState.isDragging && dragState.draggedPiece && (
                    <div
                      className="absolute pointer-events-none text-3xl z-50 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: dragState.dragPosition.x,
                        top: dragState.dragPosition.y,
                      }}
                    >
                      {getPieceSymbol(dragState.draggedPiece)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Turn:</span>
                  <Badge variant={gameState.currentPlayer === 'white' ? 'default' : 'secondary'}>
                    {gameState.currentPlayer === 'white' ? '♔ White' : '♛ Black'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <Badge variant="outline">{gameState.gameStatus}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Moves:</span>
                  <Badge variant="secondary">{gameState.moves.length}</Badge>
                </div>

                <div className="space-y-2">
                  <Button onClick={resetGame} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Game Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={gameMode === 'vs-computer' ? 'default' : 'outline'}
                    onClick={() => setGameMode('vs-computer')}
                    className="text-xs"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    vs Computer
                  </Button>
                  <Button 
                    variant={gameMode === 'vs-friend' ? 'default' : 'outline'}
                    onClick={() => setGameMode('vs-friend')}
                    className="text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    vs Friend
                  </Button>
                  <Button 
                    variant={gameMode === 'analysis' ? 'default' : 'outline'}
                    onClick={() => setGameMode('analysis')}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Analysis
                  </Button>
                  <Button 
                    variant={gameMode === 'puzzles' ? 'default' : 'outline'}
                    onClick={() => setGameMode('puzzles')}
                    className="text-xs"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Puzzles
                  </Button>
                </div>
                
                {gameMode === 'vs-computer' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Difficulty:</label>
                    <div className="grid grid-cols-2 gap-1">
                      {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map(level => (
                        <Button
                          key={level}
                          variant={aiDifficulty === level ? 'default' : 'outline'}
                          onClick={() => setAiDifficulty(level)}
                          className="text-xs"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Captured Pieces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium mb-1">White captured:</div>
                    <div className="text-xl">
                      {gameState.capturedPieces.white.map((piece, index) => (
                        <span key={index}>{getPieceSymbol(piece)}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Black captured:</div>
                    <div className="text-xl">
                      {gameState.capturedPieces.black.map((piece, index) => (
                        <span key={index}>{getPieceSymbol(piece)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChessCustomization
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        customization={customization}
        onCustomizationChange={setCustomization}
      />

      <ConceptModal
        isOpen={showLearnModal}
        onClose={() => setShowLearnModal(false)}
        concepts={chessLearningConcepts}
        gameTitle="Enhanced Chess"
      />
    </div>
  );
};
