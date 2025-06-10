
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ChessGameState, Position, Piece, GameCustomization, GameMode, Difficulty, PieceColor } from './types';
import { initialBoard, pieceSets } from './constants';
import { getValidMoves, getBestMove } from './chessLogic';

interface ChessGameActions {
  setBoard: React.Dispatch<React.SetStateAction<Piece[][]>>;
  setSelectedPiece: React.Dispatch<React.SetStateAction<Position | null>>;
  setValidMoves: React.Dispatch<React.SetStateAction<Position[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<PieceColor>>;
  setCapturedPieces: React.Dispatch<React.SetStateAction<{ white: Piece[], black: Piece[] }>>;
  setCustomization: React.Dispatch<React.SetStateAction<GameCustomization>>;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  setShowVictory: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<string>>;
  setCapturedAnimation: React.Dispatch<React.SetStateAction<{show: boolean, piece: string, position: {x: number, y: number}}>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAiThinking: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetGame: () => void;
  getValidMoves: (x: number, y: number) => Position[];
  getPieceSymbol: (type: string, color: PieceColor) => string;
  makeAiMove: () => void;
  onStatsUpdate: (stats: any) => void;
}

const ChessGameContext = createContext<(ChessGameState & ChessGameActions) | null>(null);

export const ChessGameProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Piece[][]>(JSON.parse(JSON.stringify(initialBoard)));
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [capturedPieces, setCapturedPieces] = useState({ white: [] as Piece[], black: [] as Piece[] });
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    boardTheme: 'classic',
    pieceSet: 'classic',
    showCoordinates: true,
    highlightMoves: true,
    animations: true
  });

  const [gameMode, setGameMode] = useState<GameMode>('human-vs-ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [showVictory, setShowVictory] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [capturedAnimation, setCapturedAnimation] = useState<{show: boolean, piece: string, position: {x: number, y: number}}>({
    show: false, piece: '', position: {x: 0, y: 0}
  });
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getPieceSymbol = useCallback((type: string, color: PieceColor): string => {
    const pieceSet = pieceSets[customization.pieceSet as keyof typeof pieceSets];
    return pieceSet[color][type as keyof typeof pieceSet.white] || '?';
  }, [customization.pieceSet]);

  const makeAiMove = useCallback(() => {
    if (gameMode !== 'human-vs-ai' || currentPlayer !== 'black' || isAiThinking) return;
    
    setIsAiThinking(true);
    
    setTimeout(() => {
      const allMoves = [];
      
      // Get all possible moves for AI (black)
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const piece = board[y][x];
          if (piece && piece.color === 'black') {
            const moves = getValidMoves(board, x, y);
            moves.forEach(move => {
              allMoves.push({
                from: { x, y },
                to: move
              });
            });
          }
        }
      }
      
      let bestMove;
      
      if (difficulty === 'beginner') {
        // Random move for beginner
        bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      } else {
        // Get best move but add randomness
        const calculatedBest = getBestMove(board, difficulty);
        
        if (difficulty === 'intermediate') {
          // 70% chance to play best move, 30% random
          if (Math.random() < 0.7 && calculatedBest) {
            bestMove = calculatedBest;
          } else {
            bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
          }
        } else {
          // Expert: 90% best move, 10% random
          if (Math.random() < 0.9 && calculatedBest) {
            bestMove = calculatedBest;
          } else {
            bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
          }
        }
      }
      
      if (bestMove) {
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[bestMove.from.y][bestMove.from.x];
        const capturedPiece = newBoard[bestMove.to.y][bestMove.to.x];
        
        if (capturedPiece) {
          setCapturedPieces(prev => ({
            ...prev,
            [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
          }));
        }
        
        newBoard[bestMove.to.y][bestMove.to.x] = piece;
        newBoard[bestMove.from.y][bestMove.from.x] = null;
        
        setBoard(newBoard);
        setCurrentPlayer('white');
      }
      
      setIsAiThinking(false);
    }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
  }, [board, gameMode, currentPlayer, difficulty, isAiThinking]);

  useEffect(() => {
    if (gameMode === 'human-vs-ai' && currentPlayer === 'black' && !showVictory) {
      makeAiMove();
    }
  }, [gameMode, currentPlayer, makeAiMove, showVictory]);

  const resetGame = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setCapturedPieces({ white: [], black: [] });
    setShowVictory(false);
    setWinner('');
    setIsAiThinking(false);
  }, []);

  const value = {
    board,
    selectedPiece,
    validMoves,
    currentPlayer,
    capturedPieces,
    customization,
    gameMode,
    difficulty,
    showVictory,
    winner,
    capturedAnimation,
    showCustomization,
    showHowToPlay,
    soundEnabled,
    isAiThinking,
    setBoard,
    setSelectedPiece,
    setValidMoves,
    setCurrentPlayer,
    setCapturedPieces,
    setCustomization,
    setGameMode,
    setDifficulty,
    setShowVictory,
    setWinner,
    setCapturedAnimation,
    setShowCustomization,
    setShowHowToPlay,
    setSoundEnabled,
    setIsAiThinking,
    canvasRef,
    resetGame,
    getValidMoves: (x: number, y: number) => getValidMoves(board, x, y),
    getPieceSymbol,
    makeAiMove,
    onStatsUpdate
  };

  return (
    <ChessGameContext.Provider value={value}>
      {children}
    </ChessGameContext.Provider>
  );
};

export const useChessGame = () => {
  const context = useContext(ChessGameContext);
  if (!context) {
    throw new Error('useChessGame must be used within ChessGameProvider');
  }
  return context;
};
