
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

type Piece = {
  type: string;
  color: 'white' | 'black';
} | null;

interface GameCustomization {
  boardTheme: string;
  pieceSet: string;
  showCoordinates: boolean;
  highlightMoves: boolean;
  animations: boolean;
}

interface ChessGameState {
  board: Piece[][];
  selectedPiece: Position | null;
  validMoves: Position[];
  currentPlayer: 'white' | 'black';
  capturedPieces: { white: string[], black: string[] };
  customization: GameCustomization;
  gameMode: 'human-vs-ai' | 'human-vs-human';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  showVictory: boolean;
  winner: string;
  capturedAnimation: {show: boolean, piece: string, position: {x: number, y: number}};
  showCustomization: boolean;
  showHowToPlay: boolean;
  soundEnabled: boolean;
}

interface ChessGameActions {
  setBoard: React.Dispatch<React.SetStateAction<Piece[][]>>;
  setSelectedPiece: React.Dispatch<React.SetStateAction<Position | null>>;
  setValidMoves: React.Dispatch<React.SetStateAction<Position[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
  setCapturedPieces: React.Dispatch<React.SetStateAction<{ white: string[], black: string[] }>>;
  setCustomization: React.Dispatch<React.SetStateAction<GameCustomization>>;
  setGameMode: React.Dispatch<React.SetStateAction<'human-vs-ai' | 'human-vs-human'>>;
  setDifficulty: React.Dispatch<React.SetStateAction<'beginner' | 'intermediate' | 'expert'>>;
  setShowVictory: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<string>>;
  setCapturedAnimation: React.Dispatch<React.SetStateAction<{show: boolean, piece: string, position: {x: number, y: number}}>>;
  setShowCustomization: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetGame: () => void;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  getValidMoves: (x: number, y: number) => Position[];
  getPieceSymbol: (type: string, color: 'white' | 'black') => string;
  onStatsUpdate: (stats: any) => void;
}

const ChessGameContext = createContext<(ChessGameState & ChessGameActions) | null>(null);

const initialBoard: Piece[][] = [
  [
    { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
  ],
  [
    { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }
  ],
  [
    { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
  ]
];

const pieceSets = {
  classic: {
    white: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' },
    black: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' }
  },
  modern: {
    white: { pawn: '⬢', rook: '⬙', knight: '⬟', bishop: '⬣', queen: '⬨', king: '👑' },
    black: { pawn: '⬛', rook: '⛶', knight: '🐴', bishop: '⬖', queen: '⬔', king: '⬓' }
  },
  medieval: {
    white: { pawn: '🚶', rook: '🏰', knight: '🐴', bishop: '⛪', queen: '👑', king: '🤴' },
    black: { pawn: '🧎', rook: '🏯', knight: '🐎', bishop: '🕍', queen: '👸', king: '👲' }
  },
  fantasy: {
    white: { pawn: '🍄', rook: '🐉', knight: '🦄', bishop: '🧙', queen: '🧚', king: '🧝' },
    black: { pawn: '👹', rook: '👿', knight: '🧛', bishop: '🧟', queen: '🦹', king: '💀' }
  }
};

export const ChessGameProvider: React.FC<{ children: React.ReactNode, onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [capturedPieces, setCapturedPieces] = useState({ white: [] as string[], black: [] as string[] });

  const [customization, setCustomization] = useState<GameCustomization>({
    boardTheme: 'classic',
    pieceSet: 'classic',
    showCoordinates: true,
    highlightMoves: true,
    animations: true
  });

  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human'>('human-vs-ai');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [showVictory, setShowVictory] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [capturedAnimation, setCapturedAnimation] = useState<{show: boolean, piece: string, position: {x: number, y: number}}>({
    show: false, piece: '', position: {x: 0, y: 0}
  });
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const showCaptureAnimation = (piece: string, x: number, y: number) => {
    setCapturedAnimation({ show: true, piece, position: { x, y } });
    setTimeout(() => setCapturedAnimation({ show: false, piece: '', position: {x: 0, y: 0} }), 1000);
  };

  const checkGameEnd = useCallback(() => {
    const isCheckmate = false;
    const isStalemate = false;
    
    if (isCheckmate) {
      const winnerName = currentPlayer === 'white' ? 'Black' : 'White';
      setWinner(winnerName);
      setShowVictory(true);
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    } else if (isStalemate) {
      setWinner('Draw');
      setShowVictory(true);
    }
  }, [currentPlayer, onStatsUpdate]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (canvas.width / 8));
    const y = Math.floor((event.clientY - rect.top) / (canvas.height / 8));

    if (selectedPiece) {
      const isValidMove = validMoves.some(move => move.x === x && move.y === y);
      if (isValidMove) {
        const newBoard = board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            if (rowIndex === y && colIndex === x) {
              const movingPiece = board[selectedPiece.y][selectedPiece.x];
              if (piece) {
                setCapturedPieces(prev => ({
                  ...prev,
                  [piece.color]: [...prev[piece.color], getPieceSymbol(piece.type, piece.color)]
                }));
                showCaptureAnimation(getPieceSymbol(piece.type, piece.color), event.clientX - rect.left, event.clientY - rect.top);
              }
              return movingPiece;
            } else if (rowIndex === selectedPiece.y && colIndex === selectedPiece.x) {
              return null;
            } else {
              return piece;
            }
          })
        );
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        checkGameEnd();
      } else if (x === selectedPiece.x && y === selectedPiece.y) {
        setSelectedPiece(null);
        setValidMoves([]);
      } else {
        if (board[y][x] && board[y][x]?.color === currentPlayer) {
          setSelectedPiece({ x, y });
          setValidMoves(getValidMoves(x, y));
        } else {
          setSelectedPiece(null);
          setValidMoves([]);
        }
      }
    } else {
      if (board[y][x] && board[y][x]?.color === currentPlayer) {
        setSelectedPiece({ x, y });
        setValidMoves(getValidMoves(x, y));
      }
    }
  }, [board, selectedPiece, validMoves, currentPlayer, checkGameEnd]);

  const getValidMoves = (x: number, y: number): Position[] => {
    return [];
  };

  const getPieceSymbol = (type: string, color: 'white' | 'black'): string => {
    const pieceSet = pieceSets[customization.pieceSet as keyof typeof pieceSets];
    return pieceSet[color][type as keyof typeof pieceSet.white];
  };

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setCapturedPieces({ white: [], black: [] });
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
    canvasRef,
    resetGame,
    handleCanvasClick,
    getValidMoves,
    getPieceSymbol,
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
