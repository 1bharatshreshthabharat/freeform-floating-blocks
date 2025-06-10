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

// Advanced evaluation function with positional awareness
export const evaluatePosition = (board: Piece[][], difficulty: string): number => {
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  // Positional value tables for advanced evaluation
  const pawnTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const knightTable = [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5]
  ];

  const bishopTable = [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2]
  ];

  let score = 0;
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        let value = pieceValues[piece.type];
        
        // Add positional bonuses for intermediate and expert levels
        if (difficulty !== 'beginner') {
          switch (piece.type) {
            case 'pawn':
              value += pawnTable[piece.color === 'white' ? 7 - y : y][x] / 10;
              break;
            case 'knight':
              value += knightTable[y][x] / 10;
              break;
            case 'bishop':
              value += bishopTable[y][x] / 10;
              break;
            case 'king':
              // King safety evaluation
              if (difficulty === 'expert') {
                const centerDistance = Math.abs(3.5 - x) + Math.abs(3.5 - y);
                value -= centerDistance / 10; // King should stay safer
              }
              break;
          }
        }
        
        // Advanced strategic considerations for expert level
        if (difficulty === 'expert') {
          // Control of center squares
          if ((x === 3 || x === 4) && (y === 3 || y === 4)) {
            value += 0.3;
          }
          
          // Piece mobility bonus
          const moves = getValidMoves(board, x, y);
          value += moves.length * 0.05;
          
          // Piece coordination
          if (piece.type === 'bishop' || piece.type === 'knight') {
            value += 0.2; // Encourage piece development
          }
        }
        
        score += piece.color === 'white' ? value : -value;
      }
    }
  }
  
  return score;
};

export const minimax = (
  board: Piece[][], 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number = -Infinity, 
  beta: number = Infinity,
  difficulty: string = 'intermediate'
): { score: number, move?: { from: Position, to: Position } } => {
  if (depth === 0) {
    return { score: evaluatePosition(board, difficulty) };
  }

  const currentColor: PieceColor = isMaximizing ? 'black' : 'white';
  let bestMove;
  
  // Get all possible moves and sort them for better alpha-beta pruning
  const allMoves: Array<{ from: Position, to: Position, priority: number }> = [];
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === currentColor) {
        const validMoves = getValidMoves(board, x, y);
        
        for (const move of validMoves) {
          let priority = 0;
          
          // Prioritize captures
          if (board[move.y][move.x]) {
            priority += pieceValues[board[move.y][move.x]!.type] * 10;
          }
          
          // Prioritize center control for higher difficulties
          if (difficulty !== 'beginner') {
            if ((move.x === 3 || move.x === 4) && (move.y === 3 || move.y === 4)) {
              priority += 2;
            }
          }
          
          allMoves.push({ from: { x, y }, to: move, priority });
        }
      }
    }
  }
  
  // Sort moves by priority for better pruning
  allMoves.sort((a, b) => b.priority - a.priority);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (const moveData of allMoves) {
      // Make move
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[moveData.from.y][moveData.from.x];
      newBoard[moveData.to.y][moveData.to.x] = piece;
      newBoard[moveData.from.y][moveData.from.x] = null;
      
      const eval_ = minimax(newBoard, depth - 1, false, alpha, beta, difficulty).score;
      
      if (eval_ > maxEval) {
        maxEval = eval_;
        bestMove = moveData;
      }
      
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    
    for (const moveData of allMoves) {
      // Make move
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[moveData.from.y][moveData.from.x];
      newBoard[moveData.to.y][moveData.to.x] = piece;
      newBoard[moveData.from.y][moveData.from.x] = null;
      
      const eval_ = minimax(newBoard, depth - 1, true, alpha, beta, difficulty).score;
      
      if (eval_ < minEval) {
        minEval = eval_;
        bestMove = moveData;
      }
      
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    
    return { score: minEval, move: bestMove };
  }
};

const pieceValues = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

export const getBestMove = (board: Piece[][], difficulty: string): { from: Position, to: Position } | null => {
  const depth = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4;
  const result = minimax(board, depth, true, -Infinity, Infinity, difficulty);
  return result.move || null;
};
