
import { Position, Piece, PieceColor } from './types';

export const getValidMoves = (board: Piece[][], x: number, y: number): Position[] => {
  const piece = board[y][x];
  if (!piece) return [];

  const moves: Position[] = [];
  
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
};

export const evaluatePosition = (board: Piece[][]): number => {
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  let score = 0;
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        const value = pieceValues[piece.type];
        score += piece.color === 'white' ? value : -value;
      }
    }
  }
  
  return score;
};

export const minimax = (board: Piece[][], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): { score: number, move?: { from: Position, to: Position } } => {
  if (depth === 0) {
    return { score: evaluatePosition(board) };
  }

  const currentColor: PieceColor = isMaximizing ? 'black' : 'white';
  let bestMove;
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.color === currentColor) {
          const validMoves = getValidMoves(board, x, y);
          
          for (const move of validMoves) {
            // Make move
            const newBoard = board.map(row => [...row]);
            newBoard[move.y][move.x] = piece;
            newBoard[y][x] = null;
            
            const eval_ = minimax(newBoard, depth - 1, false, alpha, beta).score;
            
            if (eval_ > maxEval) {
              maxEval = eval_;
              bestMove = { from: { x, y }, to: move };
            }
            
            alpha = Math.max(alpha, eval_);
            if (beta <= alpha) break;
          }
        }
      }
    }
    
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.color === currentColor) {
          const validMoves = getValidMoves(board, x, y);
          
          for (const move of validMoves) {
            // Make move
            const newBoard = board.map(row => [...row]);
            newBoard[move.y][move.x] = piece;
            newBoard[y][x] = null;
            
            const eval_ = minimax(newBoard, depth - 1, true, alpha, beta).score;
            
            if (eval_ < minEval) {
              minEval = eval_;
              bestMove = { from: { x, y }, to: move };
            }
            
            beta = Math.min(beta, eval_);
            if (beta <= alpha) break;
          }
        }
      }
    }
    
    return { score: minEval, move: bestMove };
  }
};

export const getBestMove = (board: Piece[][], difficulty: string): { from: Position, to: Position } | null => {
  const depth = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
  const result = minimax(board, depth, true);
  return result.move || null;
};
