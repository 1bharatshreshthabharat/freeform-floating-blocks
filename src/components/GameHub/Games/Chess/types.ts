
export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
}

export type PieceColor = 'white' | 'black';

export interface ChessGameState {
  board: Piece[][];
  selectedPiece: Position | null;
  validMoves: Position[];
  currentPlayer: PieceColor;
  capturedPieces: { white: Piece[], black: Piece[] };
  customization: GameCustomization;
  gameMode: GameMode;
  difficulty: Difficulty;
  showVictory: boolean;
  winner: string;
  capturedAnimation: {show: boolean, piece: string, position: {x: number, y: number}};
  showCustomization: boolean;
  showHowToPlay: boolean;
  soundEnabled: boolean;
  isAiThinking: boolean;
}

export interface GameCustomization {
  boardTheme: string;
  pieceSet: string;
  showCoordinates: boolean;
  highlightMoves: boolean;
  animations: boolean;
}

export type GameMode = 'human-vs-human' | 'human-vs-ai';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface Move {
  from: Position;
  to: Position;
  capturedPiece?: Piece;
}
