import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RotateCcw, Trophy, Crown, Sparkles, Settings, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface EnhancedChessGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Position {
  x: number;
  y: number;
}

type Piece = {
  type: string;
  color: 'white' | 'black';
} | null;

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

interface GameCustomization {
  boardTheme: string;
  pieceSet: string;
  showCoordinates: boolean;
  highlightMoves: boolean;
  animations: boolean;
}

export const EnhancedChessGame: React.FC<EnhancedChessGameProps> = ({ onBack, onStatsUpdate }) => {
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

  const boardThemes = {
    classic: { light: '#F0D9B5', dark: '#B58863', border: '#A0522D' },
    marble: { light: '#E3E3E3', dark: '#C8C8C8', border: '#778899' },
    metal: { light: '#D3D3D3', dark: '#A9A9A9', border: '#808080' },
    neon: { light: '#00FFFF', dark: '#FF00FF', border: '#FFFF00' }
  };

  const pieceSets = {
    classic: {
      white: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' },
      black: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' }
    },
    modern: {
      white: { pawn: '⬢', rook: '⬙', knight: '⬟', bishop: '⬣', queen: '⬨', king: 'Effects' },
      black: { pawn: '⬛', rook: '⛶', knight: ' గుర్', bishop: '⬖', queen: '⬔', king: '⬓' }
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

  const getHintsForDifficulty = () => {
    switch (difficulty) {
      case 'beginner': return ['Check protection', 'Look for forks', 'Control center', 'Develop pieces', 'Castle early'];
      case 'intermediate': return ['Consider tactics', 'Plan ahead'];
      case 'expert': return [];
      default: return [];
    }
  };

  const showCaptureAnimation = (piece: string, x: number, y: number) => {
    setCapturedAnimation({ show: true, piece, position: { x, y } });
    setTimeout(() => setCapturedAnimation({ show: false, piece: '', position: {x: 0, y: 0} }), 1000);
  };

  const checkGameEnd = useCallback(() => {
    // Enhanced game end detection with victory celebration
    const isCheckmate = false; // Simplified for demo
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
      // Move piece logic
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
        // Deselect piece
        setSelectedPiece(null);
        setValidMoves([]);
      } else {
        // Attempt to select a new piece
        if (board[y][x] && board[y][x]?.color === currentPlayer) {
          setSelectedPiece({ x, y });
          setValidMoves(getValidMoves(x, y));
        } else {
          setSelectedPiece(null);
          setValidMoves([]);
        }
      }
    } else {
      // Select piece logic
      if (board[y][x] && board[y][x]?.color === currentPlayer) {
        setSelectedPiece({ x, y });
        setValidMoves(getValidMoves(x, y));
      }
    }
  }, [board, selectedPiece, validMoves, currentPlayer, checkGameEnd]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Drag start logic
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Dragging logic
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Drag end logic
  };

  const getValidMoves = (x: number, y: number): Position[] => {
    // Simplified valid moves logic
    return [];
  };

  const getPieceSymbol = (type: string, color: 'white' | 'black'): string => {
    const pieceSet = pieceSets[customization.pieceSet as keyof typeof pieceSets];
    return pieceSet[color][type as keyof typeof pieceSet.white];
  };

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boardTheme = boardThemes[customization.boardTheme as keyof typeof boardThemes];
    const squareSize = canvas.width / 8;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLightSquare = (row + col) % 2 === 0;
        ctx.fillStyle = isLightSquare ? boardTheme.light : boardTheme.dark;
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);

        if (customization.showCoordinates) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#333';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          if (col === 0) ctx.fillText(`${8 - row}`, col * squareSize + 2, row * squareSize + 2);
          if (row === 7) ctx.fillText(`abcdefgh`[col], col * squareSize + 2, row * squareSize + squareSize - 14);
        }

        if (selectedPiece && customization.highlightMoves) {
          validMoves.forEach(move => {
            if (move.x === col && move.y === row) {
              ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
              ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
          });
        }

        const piece = board[row][col];
        if (piece) {
          const pieceSymbol = getPieceSymbol(piece.type, piece.color);
          ctx.font = `${squareSize * 0.7}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = piece.color === 'white' ? '#333' : '#000';
          ctx.fillText(pieceSymbol, col * squareSize + squareSize / 2, row * squareSize + squareSize / 2);
        }
      }
    }

    // Draw border
    ctx.strokeStyle = boardTheme.border;
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [board, selectedPiece, validMoves, customization]);

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setCapturedPieces({ white: [], black: [] });
  }, []);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ♛ Master Chess
          </h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowHowToPlay(true)} variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </Button>
            <Button onClick={() => setShowCustomization(true)} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="sm">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Board */}
          <Card className="flex-1 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={640}
                    className="border-4 border-amber-300 rounded-lg shadow-lg cursor-pointer"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onClick={handleCanvasClick}
                  />
                  
                  {/* Capture Animation */}
                  {capturedAnimation.show && (
                    <div 
                      className="absolute pointer-events-none animate-bounce text-3xl"
                      style={{
                        left: capturedAnimation.position.x,
                        top: capturedAnimation.position.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      ⚡ {capturedAnimation.piece} ⚡
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Game Controls */}
          <div className="lg:w-80 space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <span>Game Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value: any) => setGameMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human-vs-ai">Human vs AI</SelectItem>
                      <SelectItem value="human-vs-human">Human vs Human</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Current Turn:</span>
                    <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'}>
                      {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'}
                    </Badge>
                  </div>
                  
                  <Button onClick={resetGame} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hints for Difficulty */}
            {getHintsForDifficulty().length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">💡 Strategic Hints</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {getHintsForDifficulty().map((hint, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-amber-600">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Captured Pieces */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Captured Pieces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-600">White captured:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {capturedPieces.white.map((piece, index) => (
                        <span key={index} className="text-lg">{piece}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Black captured:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {capturedPieces.black.map((piece, index) => (
                        <span key={index} className="text-lg">{piece}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {showVictory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 text-center animate-scale-in">
            <div className="text-6xl mb-4 animate-bounce">
              {winner === 'Draw' ? '🤝' : '🏆'}
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {winner === 'Draw' ? 'Game Draw!' : `${winner} Wins!`}
            </h2>
            <div className="flex justify-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              <Crown className="h-8 w-8 text-amber-600" />
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <Button onClick={() => { setShowVictory(false); resetGame(); }} className="w-full">
                Play Again
              </Button>
              <Button onClick={() => setShowVictory(false)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Play Chess</h2>
              <Button onClick={() => setShowHowToPlay(false)} variant="outline" size="sm">×</Button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Basic Rules</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click to select a piece, then click destination</li>
                  <li>• Or drag and drop pieces to move</li>
                  <li>• Capture opponent pieces by moving to their square</li>
                  <li>• Protect your King from checkmate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Piece Movements</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• ♜ Rook: Horizontal and vertical lines</li>
                  <li>• ♝ Bishop: Diagonal lines</li>
                  <li>• ♞ Knight: L-shaped moves</li>
                  <li>• ♛ Queen: Any direction</li>
                  <li>• ♚ King: One square in any direction</li>
                  <li>• ♟ Pawn: Forward one square (two on first move)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Special Moves</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Castling: King and Rook special move</li>
                  <li>• En passant: Special pawn capture</li>
                  <li>• Promotion: Pawn reaches end, becomes Queen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Chess</h2>
              <Button onClick={() => setShowCustomization(false)} variant="outline" size="sm">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Board Theme</label>
                  <Select value={customization.boardTheme} onValueChange={(value) => setCustomization(prev => ({ ...prev, boardTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic Wood</SelectItem>
                      <SelectItem value="marble">Marble</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Piece Set</label>
                  <Select value={customization.pieceSet} onValueChange={(value) => setCustomization(prev => ({ ...prev, pieceSet: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="medieval">Medieval</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showCoordinates"
                      checked={customization.showCoordinates}
                      onChange={(e) => setCustomization(prev => ({ ...prev, showCoordinates: e.target.checked }))}
                    />
                    <label htmlFor="showCoordinates" className="text-sm font-medium">Show Coordinates</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="highlightMoves"
                      checked={customization.highlightMoves}
                      onChange={(e) => setCustomization(prev => ({ ...prev, highlightMoves: e.target.checked }))}
                    />
                    <label htmlFor="highlightMoves" className="text-sm font-medium">Highlight Valid Moves</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="animations"
                      checked={customization.animations}
                      onChange={(e) => setCustomization(prev => ({ ...prev, animations: e.target.checked }))}
                    />
                    <label htmlFor="animations" className="text-sm font-medium">Enable Animations</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
