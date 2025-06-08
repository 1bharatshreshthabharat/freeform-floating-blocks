
export interface Position {
  x: number;
  y: number;
}

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export type Piece = {
  type: PieceType;
  color: PieceColor;
} | null;

export interface GameCustomization {
  boardTheme: string;
  pieceSet: string;
  showCoordinates: boolean;
  highlightMoves: boolean;
  animations: boolean;
}

export type GameMode = 'human-vs-ai' | 'human-vs-human';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface ChessGameState {
  board: Piece[][];
  selectedPiece: Position | null;
  validMoves: Position[];
  currentPlayer: PieceColor;
  capturedPieces: { white: string[], black: string[] };
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
