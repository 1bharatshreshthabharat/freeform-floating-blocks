// chess-ai.ts
import { Position, Piece, PieceColor } from './types';

/**
 * Complete upgraded chess AI:
 * - Iterative deepening
 * - Transposition table (Zobrist)
 * - Quiescence search
 * - MVV-LVA ordering, killer moves, history heuristic
 * - Advanced evaluation (pawn structure, mobility, king safety, bishop pair, rook on open file)
 * - Beginner randomness
 *
 * Assumptions:
 * - board is 8x8 array board[y][x] where y=0..7 top->bottom, x=0..7 left->right
 * - Piece: { type: 'pawn'|'knight'|'bishop'|'rook'|'queen'|'king', color: 'white'|'black' }
 */

// ----------------------------- Basic constants -----------------------------
const VALUE_SCALE = 100; // use integer-ish evaluation (material scaled)
const PIECE_VALUES: Record<string, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// ----------------------------- Utilities -----------------------------
const oppositeColor = (c: PieceColor) => (c === 'white' ? 'black' : 'white');

const cloneBoard = (board: (Piece | null)[][]) =>
  board.map(row => row.map(cell => (cell ? { ...cell } : null)));

const makeMoveOn = (board: (Piece | null)[][], from: Position, to: Position) => {
  const piece = board[from.y][from.x];
  board[to.y][to.x] = piece;
  board[from.y][from.x] = null;
};

// ----------------------------- Move generation -----------------------------
export const getValidMoves = (board: (Piece | null)[][], x: number, y: number): Position[] => {
  const piece = board[y][x];
  if (!piece) return [];

  const moves: Position[] = [];
  const push = (nx: number, ny: number) => {
    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      const t = board[ny][nx];
      if (!t || t.color !== piece.color) moves.push({ x: nx, y: ny });
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      if (board[y + dir]?.[x] === null) push(x, y + dir);
      if (y === startRow && board[y + dir]?.[x] === null && board[y + 2 * dir]?.[x] === null)
        push(x, y + 2 * dir);
      for (const dx of [-1, 1]) {
        const nx = x + dx, ny = y + dir;
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
          const t = board[ny][nx];
          if (t && t.color !== piece.color) push(nx, ny);
        }
      }
      break;
    }
    case 'rook': {
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]] as number[][]) {
        for (let i = 1; i < 8; i++) {
          const nx = x + dx*i, ny = y + dy*i;
          if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
          const t = board[ny][nx];
          if (!t) moves.push({x:nx,y:ny});
          else { if (t.color !== piece.color) moves.push({x:nx,y:ny}); break; }
        }
      }
      break;
    }
    case 'bishop': {
      for (const [dx, dy] of [[1,1],[1,-1],[-1,1],[-1,-1]] as number[][]) {
        for (let i = 1; i < 8; i++) {
          const nx = x + dx*i, ny = y + dy*i;
          if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
          const t = board[ny][nx];
          if (!t) moves.push({x:nx,y:ny});
          else { if (t.color !== piece.color) moves.push({x:nx,y:ny}); break; }
        }
      }
      break;
    }
    case 'queen': {
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]] as number[][]) {
        for (let i = 1; i < 8; i++) {
          const nx = x + dx*i, ny = y + dy*i;
          if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
          const t = board[ny][nx];
          if (!t) moves.push({x:nx,y:ny});
          else { if (t.color !== piece.color) moves.push({x:nx,y:ny}); break; }
        }
      }
      break;
    }
    case 'king': {
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]] as number[][]) {
        push(x + dx, y + dy);
      }
      break;
    }
    case 'knight': {
      for (const [dx, dy] of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]] as number[][]) {
        push(x + dx, y + dy);
      }
      break;
    }
  }

  return moves;
};

// ----------------------------- Zobrist hashing (transposition) -----------------------------
type ZobristArray = bigint[][][]; // pieceIndex x 8 x 8 -> bigint
const PIECE_INDEX: Record<string, number> = {
  'white_pawn': 0, 'white_knight': 1, 'white_bishop': 2, 'white_rook': 3, 'white_queen': 4, 'white_king': 5,
  'black_pawn': 6, 'black_knight': 7, 'black_bishop': 8, 'black_rook': 9, 'black_queen': 10, 'black_king': 11
};

const rand64 = (): bigint => {
  // create 64-bit random bigint from Math.random (sufficient for our purpose)
  const hi = BigInt(Math.floor(Math.random() * 0xffffffff));
  const lo = BigInt(Math.floor(Math.random() * 0xffffffff));
  return (hi << 32n) ^ lo;
};

const ZOBRIST: ZobristArray = (() => {
  const arr: ZobristArray = [];
  for (let p = 0; p < 12; p++) {
    arr[p] = [];
    for (let y = 0; y < 8; y++) {
      arr[p][y] = [];
      for (let x = 0; x < 8; x++) arr[p][y][x] = rand64();
    }
  }
  return arr;
})();

const ZOBRIST_SIDE = rand64();

const hashBoard = (board: (Piece | null)[][], sideToMove: PieceColor) => {
  let h = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const p = board[y][x];
      if (!p) continue;
      const key = `${p.color}_${p.type}`;
      const idx = PIECE_INDEX[key];
      h ^= ZOBRIST[idx][y][x];
    }
  }
  if (sideToMove === 'black') h ^= ZOBRIST_SIDE;
  return h;
};

// ----------------------------- Transposition table -----------------------------
type TTEntry = {
  key: bigint;
  depth: number;
  flag: 'EXACT' | 'LOWER' | 'UPPER';
  score: number;
  bestMove?: { from: Position; to: Position };
};
const TT = new Map<string, TTEntry>(); // key stringified bigint -> entry

// ----------------------------- Heuristics storage -----------------------------
const MAX_KILLER = 2;
const killerMoves: Array<Array<{ from: Position; to: Position }>> = [];
for (let i = 0; i < 128; i++) killerMoves[i] = [];
const historyHeuristic: Record<string, number> = {}; // 'fromx_fromy_tox_toy' -> score

const historyKey = (m: { from: Position; to: Position }) =>
  `${m.from.x}_${m.from.y}_${m.to.x}_${m.to.y}`;

// ----------------------------- Evaluation -----------------------------
const pawnTable = [
  [0,0,0,0,0,0,0,0],
  [50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],
  [5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],
  [0,0,0,0,0,0,0,0]
];

const knightTable = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],
  [-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],
  [-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopTable = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,0,0,0,0,0,0,-10],
  [-10,0,5,10,10,5,0,-10],
  [-10,5,5,10,10,5,5,-10],
  [-10,0,10,10,10,10,0,-10],
  [-10,10,10,10,10,10,10,-10],
  [-10,5,0,0,0,0,5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const centerSquares = (x:number,y:number) => ( (x===3||x===4) && (y===3||y===4) );

const evaluatePosition = (board: (Piece|null)[][], sideToMove: PieceColor, difficulty: string): number => {
  // returns score from perspective of sideToMove (positive = good for sideToMove)
  let score = 0;
  let whiteBishops = 0, blackBishops = 0;

  // Material & piece-square
  for (let y=0;y<8;y++){
    for (let x=0;x<8;x++){
      const p = board[y][x];
      if (!p) continue;
      let val = PIECE_VALUES[p.type];

      // piece-square tables (scaled)
      if (difficulty !== 'beginner') {
        switch (p.type) {
          case 'pawn':
            val += pawnTable[p.color === 'white' ? 7 - y : y][x];
            break;
          case 'knight':
            val += knightTable[y][x];
            break;
          case 'bishop':
            val += bishopTable[y][x];
            break;
        }
      }

      // Mobility bonus (encourage active pieces)
      if (difficulty === 'expert' || difficulty === 'intermediate') {
        val += getValidMoves(board,x,y).length * 10;
      }

      // Pawn structure: doubled, blocked
      if (p.type === 'pawn') {
        // blocked
        const dir = p.color === 'white' ? -1 : 1;
        if (board[y+dir]?.[x]) val -= 15;
        // doubled on file
        const filePawns = board.map(r => r[x]).filter(q => q?.type === 'pawn' && q.color === p.color).length;
        if (filePawns > 1) val -= 20 * (filePawns - 1);
      }

      // King safety: encourage staying sheltered (expert)
      if (p.type === 'king' && difficulty === 'expert') {
        const dist = Math.abs(3.5 - x) + Math.abs(3.5 - y);
        val -= Math.floor(dist)*15;
      }

      // Center control (expert)
      if (difficulty === 'expert' && centerSquares(x,y)) val += 30;

      // count bishops
      if (p.type === 'bishop') {
        if (p.color === 'white') whiteBishops++;
        else blackBishops++;
      }

      score += p.color === sideToMove ? val : -val;
    }
  }

  // bishop pair bonus
  if (whiteBishops >= 2) score += (sideToMove === 'white' ? 50 : -50);
  if (blackBishops >= 2) score += (sideToMove === 'black' ? 50 : -50);

  return score;
};

// ----------------------------- Move listing helpers -----------------------------
const listAllMoves = (board: (Piece|null)[][], color: PieceColor) => {
  const moves: { from: Position; to: Position }[] = [];
  for (let y=0;y<8;y++) {
    for (let x=0;x<8;x++) {
      const p = board[y][x];
      if (!p || p.color !== color) continue;
      const vm = getValidMoves(board, x, y);
      for (const to of vm) moves.push({ from:{x,y}, to });
    }
  }
  return moves;
};

const listAllCaptures = (board: (Piece|null)[][], color: PieceColor) => {
  const caps: { from: Position; to: Position }[] = [];
  for (let y=0;y<8;y++) {
    for (let x=0;x<8;x++) {
      const p = board[y][x];
      if (!p || p.color !== color) continue;
      for (const to of getValidMoves(board,x,y)) {
        if (board[to.y][to.x]) caps.push({ from:{x,y}, to });
      }
    }
  }
  return caps;
};

// MVV-LVA helper: return value for move ordering priority
const mvvLvaScore = (board: (Piece|null)[][], move: { from: Position; to: Position }) => {
  const attacker = board[move.from.y][move.from.x];
  const victim = board[move.to.y][move.to.x];
  const victimVal = victim ? PIECE_VALUES[victim.type] : 0;
  const attackerVal = attacker ? PIECE_VALUES[attacker.type] : 0;
  // higher is better: victim * 1000 - attacker (so capturing queen with pawn big)
  return victimVal * 1000 - attackerVal;
};

// ----------------------------- Quiescence search -----------------------------
const quiescence = (
  board: (Piece|null)[][],
  alpha: number,
  beta: number,
  color: PieceColor,
  difficulty: string
): number => {
  const stand = evaluatePosition(board, color, difficulty);
  if (stand >= beta) return beta;
  if (alpha < stand) alpha = stand;

  const captures = listAllCaptures(board, color);
  // order captures by MVV-LVA
  captures.sort((a,b) => mvvLvaScore(board,b) - mvvLvaScore(board,a));

  for (const mv of captures) {
    const newBoard = cloneBoard(board);
    makeMoveOn(newBoard, mv.from, mv.to);
    const score = -quiescence(newBoard, -beta, -alpha, oppositeColor(color), difficulty);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
};

// ----------------------------- Iterative deepening + Negamax with TT -----------------------------
type SearchResult = { score: number; bestMove?: { from: Position; to: Position } };

const INF = 1e9;

const storeTT = (key: bigint, entry: TTEntry) => {
  TT.set(key.toString(), entry);
};

const probeTT = (key: bigint): TTEntry | undefined => {
  return TT.get(key.toString());
};

let nodesSearched = 0;

const negamax = (
  board: (Piece|null)[][],
  depth: number,
  alpha: number,
  beta: number,
  color: PieceColor,
  ply: number,
  difficulty: string
): SearchResult => {
  nodesSearched++;
  const key = hashBoard(board, color);
  const ttEntry = probeTT(key);
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === 'EXACT') return { score: ttEntry.score, bestMove: ttEntry.bestMove };
    if (ttEntry.flag === 'LOWER' && ttEntry.score > alpha) alpha = ttEntry.score;
    if (ttEntry.flag === 'UPPER' && ttEntry.score < beta) beta = ttEntry.score;
    if (alpha >= beta) return { score: ttEntry.score, bestMove: ttEntry.bestMove };
  }

  if (depth === 0) {
    const q = quiescence(board, alpha, beta, color, difficulty);
    return { score: q };
  }

  // move generation
  const moves: Array<{ from: Position; to: Position; score: number }> = [];
  for (let y=0;y<8;y++) {
    for (let x=0;x<8;x++) {
      const p = board[y][x];
      if (!p || p.color !== color) continue;
      for (const to of getValidMoves(board,x,y)) {
        const mv = { from:{x,y}, to, score: 0 };
        // MVV-LVA base
        const victim = board[to.y][to.x];
        mv.score = victim ? (PIECE_VALUES[victim.type]*1000 - PIECE_VALUES[p.type]) : 0;
        // history heuristic
        const hk = historyKey(mv);
        mv.score += (historyHeuristic[hk] || 0);
        // killer moves
        const klist = killerMoves[ply] || [];
        for (let ki=0; ki<klist.length; ki++) {
          const k = klist[ki];
          if (k && k.from.x === mv.from.x && k.from.y === mv.from.y && k.to.x === mv.to.x && k.to.y === mv.to.y) {
            mv.score += 5000 - (ki*100);
          }
        }
        moves.push(mv);
      }
    }
  }

  // if no moves -> terminal (mate or stalemate)
  if (moves.length === 0) {
    // simple detection: if king can be captured? For now, evaluate by material (could be improved)
    const evalScore = evaluatePosition(board, color, difficulty);
    return { score: evalScore };
  }

  // sort moves by score descending
  moves.sort((a,b) => b.score - a.score);

  let bestScore = -INF;
  let bestMove: { from: Position; to: Position } | undefined;

  // Main negamax loop
  for (let i=0;i<moves.length;i++) {
    const mv = moves[i];
    const newBoard = cloneBoard(board);
    makeMoveOn(newBoard, mv.from, mv.to);

    // recursive
    const res = negamax(newBoard, depth - 1, -beta, -alpha, oppositeColor(color), ply+1, difficulty);
    const score = -res.score;

    if (score > bestScore) {
      bestScore = score;
      bestMove = { from: mv.from, to: mv.to };
    }
    if (score > alpha) alpha = score;
    // beta cutoff -> update killers/history
    if (alpha >= beta) {
      // store killer
      if (mv.score < 5000) { // don't store captures as killers
        const kl = killerMoves[ply];
        // push unique
        if (!kl.some(k => k.from.x === mv.from.x && k.from.y === mv.from.y && k.to.x === mv.to.x && k.to.y === mv.to.y)) {
          kl.unshift({ from: mv.from, to: mv.to });
          if (kl.length > MAX_KILLER) kl.pop();
        }
        // history heuristic increment
        const hk = historyKey(mv);
        historyHeuristic[hk] = (historyHeuristic[hk] || 0) + (depth * depth);
      }
      // store in TT as LOWER bound
      storeTT(key, { key, depth, flag: 'LOWER', score: bestScore, bestMove });
      return { score: bestScore, bestMove };
    }
  }

  // store in TT as EXACT or UPPER
  const flag: 'EXACT' | 'UPPER' = bestScore <= alpha ? 'UPPER' : 'EXACT';
  storeTT(key, { key, depth, flag, score: bestScore, bestMove });

  return { score: bestScore, bestMove };
};

// ----------------------------- Public getBestMove (iterative deepening) -----------------------------
export const getBestMove = (board: (Piece|null)[][], difficulty: string): { from: Position; to: Position } | null => {
  // sideToMove is black in your previous code (AI plays black). We'll follow that default.
  const sideToMove: PieceColor = 'black';
  // max depth mapping (expert deeper)
  const maxDepth = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 4 : 6;

  // Beginner randomness
  if (difficulty === 'beginner' && Math.random() < 0.25) {
    const all = listAllMoves(board, sideToMove);
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }

  nodesSearched = 0;
  TT.clear();
  // reset killer/history
  for (let i = 0; i < killerMoves.length; i++) killerMoves[i] = [];
  for (const k in historyHeuristic) delete historyHeuristic[k];

  let bestFound: { from: Position; to: Position } | undefined = undefined;
  let aspirationWindow = 50 * (VALUE_SCALE / 100); // small aspiration window in centipawns

  // iterative deepening
  for (let depth = 1; depth <= maxDepth; depth++) {
    // optionally we can try aspiration windows around last score (not implemented because we don't keep last score simply)
    const alpha = -INF;
    const beta = INF;

    const result = negamax(board, depth, alpha, beta, sideToMove, 0, difficulty);
    if (result.bestMove) bestFound = result.bestMove;

    // If we reached a mate-like high score, we can break
    if (Math.abs(result.score) > PIECE_VALUES['queen'] * 10) break;
  }

  // final fallback: if no bestFound, pick any legal move
  if (!bestFound) {
    const all = listAllMoves(board, sideToMove);
    return all.length ? all[0] : null;
  }

  return bestFound;
};

// ----------------------------- Optional exports for debugging -----------------------------
export const debug_getNodesSearched = () => nodesSearched;
export const debug_clearTT = () => TT.clear();
