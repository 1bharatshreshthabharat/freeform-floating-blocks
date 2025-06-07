
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
    white: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' },
    black: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' }
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
  const [board, setBoard] = useState<Piece[][]>(JSON.parse(JSON.stringify(initialBoard)));
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

  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human'>('human-vs-human');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [showVictory, setShowVictory] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [capturedAnimation, setCapturedAnimation] = useState<{show: boolean, piece: string, position: {x: number, y: number}}>({
    show: false, piece: '', position: {x: 0, y: 0}
  });
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getValidMoves = useCallback((x: number, y: number): Position[] => {
    const piece = board[y][x];
    if (!piece) return [];

    const moves: Position[] = [];
    
    // Basic movement logic for each piece type
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward movement
        if (y + direction >= 0 && y + direction < 8 && !board[y + direction][x]) {
          moves.push({ x, y: y + direction });
          
          // Two squares from start
          if (y === startRow && !board[y + 2 * direction][x]) {
            moves.push({ x, y: y + 2 * direction });
          }
        }
        
        // Captures
        for (const dx of [-1, 1]) {
          const newX = x + dx;
          const newY = y + direction;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const targetPiece = board[newY][newX];
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
        break;

      case 'rook':
        // Horizontal and vertical movement
        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          for (let i = 1; i < 8; i++) {
            const newX = x + dx * i;
            const newY = y + dy * i;
            if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;
            
            const targetPiece = board[newY][newX];
            if (!targetPiece) {
              moves.push({ x: newX, y: newY });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ x: newX, y: newY });
              }
              break;
            }
          }
        }
        break;

      case 'bishop':
        // Diagonal movement
        for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          for (let i = 1; i < 8; i++) {
            const newX = x + dx * i;
            const newY = y + dy * i;
            if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;
            
            const targetPiece = board[newY][newX];
            if (!targetPiece) {
              moves.push({ x: newX, y: newY });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ x: newX, y: newY });
              }
              break;
            }
          }
        }
        break;

      case 'queen':
        // Combination of rook and bishop
        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          for (let i = 1; i < 8; i++) {
            const newX = x + dx * i;
            const newY = y + dy * i;
            if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;
            
            const targetPiece = board[newY][newX];
            if (!targetPiece) {
              moves.push({ x: newX, y: newY });
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ x: newX, y: newY });
              }
              break;
            }
          }
        }
        break;

      case 'king':
        // One square in any direction
        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const targetPiece = board[newY][newX];
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
        break;

      case 'knight':
        // L-shaped movement
        for (const [dx, dy] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const targetPiece = board[newY][newX];
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
        break;
    }

    return moves;
  }, [board]);

  const getPieceSymbol = useCallback((type: string, color: 'white' | 'black'): string => {
    const pieceSet = pieceSets[customization.pieceSet as keyof typeof pieceSets];
    return pieceSet[color][type as keyof typeof pieceSet.white] || '?';
  }, [customization.pieceSet]);

  const resetGame = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setCapturedPieces({ white: [], black: [] });
    setShowVictory(false);
    setWinner('');
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
