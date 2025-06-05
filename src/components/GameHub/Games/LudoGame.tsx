import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Shuffle, Users, Bot, Zap, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LudoGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

type PlayerColor = 'red' | 'blue' | 'yellow' | 'green';
type GameMode = 'vs-computer' | 'vs-friends' | 'online';

interface Player {
  id: string;
  color: PlayerColor;
  name: string;
  isHuman: boolean;
  pieces: number[];
  homeSquares: number[];
  safeSquares: number[];
  startSquare: number;
  homeTrack: number[];
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isDiceRolled: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: PlayerColor | null;
  moveHistory: string[];
  consecutiveSixes: number;
}

export const LudoGame: React.FC<LudoGameProps> = ({ onBack, onStatsUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    isDiceRolled: false,
    gameStatus: 'waiting',
    winner: null,
    moveHistory: [],
    consecutiveSixes: 0
  });

  const [gameSettings, setGameSettings] = useState({
    mode: 'vs-computer' as GameMode,
    numberOfPlayers: 4,
    difficulty: 'medium',
    boardTheme: 'classic',
    enableAnimations: true
  });

  const [isRollingDice, setIsRollingDice] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  // Ludo board layout - 15x15 grid with cross pattern
  const boardSize = 15;
  const centerSize = 6; // 6x6 center area
  const trackWidth = 3; // 3 squares wide for each arm

  // Player configurations
  const playerConfigs = {
    red: {
      homeSquares: [1, 2, 13, 14], // Top-left home area positions in 15x15 grid
      startSquare: 52, // Position on the track (0-51)
      color: '#ef4444',
      homeTrack: [1, 2, 3, 4, 5], // Final approach to center
      safeSquares: [8, 21, 34, 47]
    },
    blue: {
      homeSquares: [1, 2, 13, 14], // Top-right (mirrored)
      startSquare: 13,
      color: '#3b82f6',
      homeTrack: [14, 15, 16, 17, 18],
      safeSquares: [21, 34, 47, 8]
    },
    yellow: {
      homeSquares: [1, 2, 13, 14], // Bottom-right
      startSquare: 26,
      color: '#eab308',
      homeTrack: [27, 28, 29, 30, 31],
      safeSquares: [34, 47, 8, 21]
    },
    green: {
      homeSquares: [1, 2, 13, 14], // Bottom-left
      startSquare: 39,
      color: '#22c55e',
      homeTrack: [40, 41, 42, 43, 44],
      safeSquares: [47, 8, 21, 34]
    }
  };

  const initializeGame = () => {
    const playerColors: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];
    const selectedColors = playerColors.slice(0, gameSettings.numberOfPlayers);
    
    const players: Player[] = selectedColors.map((color, index) => ({
      id: `player-${index}`,
      color,
      name: color.charAt(0).toUpperCase() + color.slice(1),
      isHuman: gameSettings.mode === 'vs-friends' || index === 0,
      pieces: [0, 0, 0, 0], // All pieces start at home (0 = home)
      homeSquares: playerConfigs[color].homeSquares,
      startSquare: playerConfigs[color].startSquare,
      homeTrack: playerConfigs[color].homeTrack,
      safeSquares: playerConfigs[color].safeSquares
    }));

    setGameState({
      players,
      currentPlayerIndex: 0,
      diceValue: null,
      isDiceRolled: false,
      gameStatus: 'playing',
      winner: null,
      moveHistory: [],
      consecutiveSixes: 0
    });
  };

  const rollDice = async () => {
    if (gameState.isDiceRolled) return;
    
    setIsRollingDice(true);
    
    // Animate dice rolling
    for (let i = 0; i < 8; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
    }
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prev => ({
      ...prev,
      diceValue: finalValue,
      isDiceRolled: true,
      consecutiveSixes: finalValue === 6 ? prev.consecutiveSixes + 1 : 0
    }));
    
    setIsRollingDice(false);
    
    // Auto-play for computer players
    if (!gameState.players[gameState.currentPlayerIndex]?.isHuman) {
      setTimeout(() => makeComputerMove(finalValue), 1000);
    }
  };

  const makeComputerMove = (diceValue: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const movablePieces = [];
    
    // Find movable pieces
    currentPlayer.pieces.forEach((position, index) => {
      if (position === 0 && diceValue === 6) {
        movablePieces.push(index); // Can move out of home
      } else if (position > 0) {
        movablePieces.push(index); // Can move on track
      }
    });
    
    if (movablePieces.length > 0) {
      // Simple AI: prioritize getting pieces out, then moving closest to finish
      let bestPiece;
      if (diceValue === 6 && currentPlayer.pieces.some(p => p === 0)) {
        bestPiece = currentPlayer.pieces.findIndex(p => p === 0);
      } else {
        bestPiece = movablePieces[0];
      }
      movePiece(bestPiece, diceValue);
    } else {
      nextTurn();
    }
  };

  const movePiece = (pieceIndex: number, steps: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPosition = currentPlayer.pieces[pieceIndex];
    
    let newPosition;
    if (currentPosition === 0) {
      if (steps === 6) {
        newPosition = 1; // Move to start of track
      } else {
        return; // Can't move
      }
    } else {
      newPosition = currentPosition + steps;
      // Handle reaching finish
      if (newPosition > 56) { // 52 track squares + 5 home track squares - 1
        return; // Can't move beyond finish
      }
    }
    
    // Update game state
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        pieces: currentPlayer.pieces.map((pos, idx) => 
          idx === pieceIndex ? newPosition : pos
        )
      };
      
      const moveNotation = `${currentPlayer.color} piece ${pieceIndex + 1}: ${currentPosition} → ${newPosition}`;
      
      return {
        ...prev,
        players: newPlayers,
        moveHistory: [...prev.moveHistory, moveNotation]
      };
    });
    
    // Check for win
    if (currentPlayer.pieces.every(pos => pos === 57)) { // All pieces finished
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        winner: currentPlayer.color
      }));
      onStatsUpdate(prevStats => ({ ...prevStats, gamesPlayed: prevStats.gamesPlayed + 1 }));
      return;
    }
    
    // Next turn logic
    if (steps !== 6 || gameState.consecutiveSixes >= 3) {
      nextTurn();
    } else {
      setGameState(prev => ({ ...prev, isDiceRolled: false, diceValue: null }));
    }
  };

  const nextTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      isDiceRolled: false,
      diceValue: null,
      consecutiveSixes: 0
    }));
    setSelectedPiece(null);
  };

  const handlePieceClick = (pieceIndex: number) => {
    if (!gameState.isDiceRolled || !gameState.diceValue) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isHuman) return;
    
    movePiece(pieceIndex, gameState.diceValue);
  };

  const resetGame = () => {
    initializeGame();
    setSelectedPiece(null);
  };

  // Create authentic Ludo board layout
  const renderLudoBoard = () => {
    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-square bg-white border-4 border-gray-800 rounded-lg overflow-hidden">
        {/* Main board grid */}
        <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 gap-0">
          {Array.from({ length: 225 }, (_, index) => {
            const row = Math.floor(index / 15);
            const col = index % 15;
            
            // Determine cell type and color
            let cellClass = "border border-gray-300 aspect-square";
            let bgColor = "#f8f9fa";
            
            // Home areas (corners)
            if ((row < 6 && col < 6) || (row < 6 && col > 8) || 
                (row > 8 && col < 6) || (row > 8 && col > 8)) {
              if (row < 6 && col < 6) bgColor = "#fee2e2"; // Red home
              else if (row < 6 && col > 8) bgColor = "#dbeafe"; // Blue home
              else if (row > 8 && col < 6) bgColor = "#dcfce7"; // Green home
              else if (row > 8 && col > 8) bgColor = "#fef3c7"; // Yellow home
            }
            
            // Track areas
            else if ((row >= 6 && row <= 8) || (col >= 6 && col <= 8)) {
              bgColor = "#ffffff";
              
              // Safe squares
              if ((row === 6 && col === 2) || (row === 2 && col === 8) ||
                  (row === 8 && col === 12) || (row === 12 && col === 6)) {
                bgColor = "#f3f4f6";
              }
              
              // Starting squares
              if ((row === 6 && col === 1) || (row === 1 && col === 8) ||
                  (row === 8 && col === 13) || (row === 13 && col === 6)) {
                bgColor = "#e5e7eb";
              }
            }
            
            // Center area
            else if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
              bgColor = "#fbbf24"; // Center gold
            }
            
            return (
              <div
                key={index}
                className={cellClass}
                style={{ backgroundColor: bgColor }}
              />
            );
          })}
        </div>
        
        {/* Home area markers */}
        <div className="absolute top-2 left-2 w-20 h-20 flex items-center justify-center">
          <div className="text-red-700 font-bold text-sm">RED</div>
        </div>
        <div className="absolute top-2 right-2 w-20 h-20 flex items-center justify-center">
          <div className="text-blue-700 font-bold text-sm">BLUE</div>
        </div>
        <div className="absolute bottom-2 left-2 w-20 h-20 flex items-center justify-center">
          <div className="text-green-700 font-bold text-sm">GREEN</div>
        </div>
        <div className="absolute bottom-2 right-2 w-20 h-20 flex items-center justify-center">
          <div className="text-yellow-700 font-bold text-sm">YELLOW</div>
        </div>
        
        {/* Center triangle */}
        <div className="absolute inset-1/3 bg-gradient-to-br from-yellow-400 to-orange-400 border-4 border-gray-800 flex items-center justify-center">
          <div className="text-2xl">🏠</div>
        </div>
        
        {/* Player pieces */}
        {gameState.players.map((player, playerIndex) => (
          <div key={player.id}>
            {player.pieces.map((position, pieceIndex) => {
              let pieceStyle = {};
              
              if (position === 0) {
                // Piece is at home
                const homePositions = {
                  red: { top: '8%', left: '8%' },
                  blue: { top: '8%', right: '8%' },
                  green: { bottom: '8%', left: '8%' },
                  yellow: { bottom: '8%', right: '8%' }
                };
                
                const basePos = homePositions[player.color];
                pieceStyle = {
                  ...basePos,
                  transform: `translate(${(pieceIndex % 2) * 25}px, ${Math.floor(pieceIndex / 2) * 25}px)`
                };
              } else {
                // Piece is on track - calculate position based on track layout
                const trackPosition = calculateTrackPosition(position, player.color);
                pieceStyle = {
                  left: `${trackPosition.x}%`,
                  top: `${trackPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                };
              }
              
              return (
                <div
                  key={`${player.id}-${pieceIndex}`}
                  className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 z-10`}
                  style={{
                    backgroundColor: playerConfigs[player.color].color,
                    borderColor: '#000',
                    ...pieceStyle
                  }}
                  onClick={() => handlePieceClick(pieceIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Calculate piece position on track
  const calculateTrackPosition = (position: number, color: PlayerColor) => {
    // This is a simplified calculation - in a real implementation,
    // you'd map each track position to exact board coordinates
    const trackPositions = [
      // Bottom track (positions 1-6)
      { x: 46.7, y: 86.7 }, { x: 53.3, y: 86.7 }, { x: 60, y: 86.7 },
      { x: 66.7, y: 86.7 }, { x: 73.3, y: 86.7 }, { x: 80, y: 86.7 },
      // Right track (positions 7-12)
      { x: 86.7, y: 80 }, { x: 86.7, y: 73.3 }, { x: 86.7, y: 66.7 },
      { x: 86.7, y: 60 }, { x: 86.7, y: 53.3 }, { x: 86.7, y: 46.7 },
      // Top track (positions 13-18)
      { x: 80, y: 40 }, { x: 73.3, y: 40 }, { x: 66.7, y: 40 },
      { x: 60, y: 40 }, { x: 53.3, y: 40 }, { x: 46.7, y: 40 },
      // Left track (positions 19-24)
      { x: 40, y: 46.7 }, { x: 40, y: 53.3 }, { x: 40, y: 60 },
      { x: 40, y: 66.7 }, { x: 40, y: 73.3 }, { x: 40, y: 80 }
    ];
    
    const posIndex = (position - 1) % trackPositions.length;
    return trackPositions[posIndex] || { x: 50, y: 50 };
  };

  const renderDice = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    return (
      <div className="text-center space-y-4">
        <div 
          className={`w-20 h-20 mx-auto border-4 border-gray-800 rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer transition-all hover:scale-105 ${
            isRollingDice ? 'animate-bounce' : ''
          }`}
          style={{ backgroundColor: currentPlayer ? playerConfigs[currentPlayer.color].color : '#f3f4f6' }}
          onClick={rollDice}
        >
          {gameState.diceValue || '🎲'}
        </div>
        <div className="text-sm font-medium">
          {gameState.isDiceRolled ? 'Select a piece to move' : 'Click to roll dice'}
        </div>
        {gameState.consecutiveSixes > 0 && (
          <Badge variant="secondary">
            {gameState.consecutiveSixes} six{gameState.consecutiveSixes > 1 ? 'es' : ''} in a row!
          </Badge>
        )}
      </div>
    );
  };

  useEffect(() => {
    initializeGame();
  }, [gameSettings.numberOfPlayers, gameSettings.mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-green-800">Ludo King</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Settings */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ... keep existing code (game settings controls) */}
              <div>
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={gameSettings.mode} onValueChange={(value: GameMode) => setGameSettings(prev => ({ ...prev, mode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vs-computer">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <span>vs Computer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="vs-friends">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>vs Friends</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Players</label>
                <Select value={gameSettings.numberOfPlayers.toString()} onValueChange={(value) => setGameSettings(prev => ({ ...prev, numberOfPlayers: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Players</SelectItem>
                    <SelectItem value="3">3 Players</SelectItem>
                    <SelectItem value="4">4 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={resetGame} className="w-full" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Game
              </Button>

              {gameState.gameStatus === 'playing' && (
                <div className="text-center">
                  <Badge style={{ backgroundColor: playerConfigs[gameState.players[gameState.currentPlayerIndex]?.color]?.color || '#gray', color: 'white' }}>
                    {gameState.players[gameState.currentPlayerIndex]?.name || 'Unknown'}'s Turn
                  </Badge>
                </div>
              )}

              {gameState.winner && (
                <div className="text-center">
                  <Badge variant="destructive" className="text-lg">
                    🎉 {gameState.winner} Wins! 🎉
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {renderLudoBoard()}
            </CardContent>
          </Card>

          {/* Game Controls & Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderDice()}

              {/* Player Status */}
              <div>
                <h4 className="font-semibold mb-2">Players:</h4>
                <div className="space-y-2">
                  {gameState.players.map((player, index) => (
                    <div key={player.id} className={`p-2 rounded ${index === gameState.currentPlayerIndex ? 'ring-2 ring-blue-300' : ''}`}
                         style={{ backgroundColor: index === gameState.currentPlayerIndex ? '#f0f9ff' : '#f9fafb' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: playerConfigs[player.color].color }}>
                          {player.name}
                        </span>
                        <Badge variant="outline">
                          {player.pieces.filter(pos => pos > 0).length}/4 out
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Move History */}
              <div>
                <h4 className="font-semibold mb-2">Recent Moves:</h4>
                <div className="max-h-32 overflow-y-auto text-sm bg-gray-50 p-2 rounded">
                  {gameState.moveHistory.length === 0 ? (
                    <p className="text-gray-500 italic">No moves yet</p>
                  ) : (
                    gameState.moveHistory.slice(-5).map((move, index) => (
                      <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                        {move}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
