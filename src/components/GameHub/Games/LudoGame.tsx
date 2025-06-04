
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
  homePosition: number;
  safePositions: number[];
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isDiceRolled: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: PlayerColor | null;
  board: (PlayerColor | null)[];
  moveHistory: string[];
}

export const LudoGame: React.FC<LudoGameProps> = ({ onBack, onStatsUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    isDiceRolled: false,
    gameStatus: 'waiting',
    winner: null,
    board: Array(52).fill(null),
    moveHistory: []
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

  const playerColors: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];
  
  const boardPositions = {
    red: { start: 1, home: [1, 2, 3, 4, 5], safe: [9, 22, 35, 48] },
    blue: { start: 14, home: [14, 15, 16, 17, 18], safe: [22, 35, 48, 9] },
    yellow: { start: 27, home: [27, 28, 29, 30, 31], safe: [35, 48, 9, 22] },
    green: { start: 40, home: [40, 41, 42, 43, 44], safe: [48, 9, 22, 35] }
  };

  const gameModes = [
    { value: 'vs-computer', label: 'vs Computer', icon: Bot },
    { value: 'vs-friends', label: 'vs Friends', icon: Users },
    { value: 'online', label: 'Online Match', icon: Zap }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ];

  const boardThemes = [
    { value: 'classic', label: 'Classic Board' },
    { value: 'royal', label: 'Royal Palace' },
    { value: 'modern', label: 'Modern Design' },
    { value: 'wooden', label: 'Wooden Classic' }
  ];

  const initializeGame = () => {
    const players: Player[] = playerColors.slice(0, gameSettings.numberOfPlayers).map((color, index) => ({
      id: `player-${index}`,
      color,
      name: color.charAt(0).toUpperCase() + color.slice(1),
      isHuman: gameSettings.mode === 'vs-friends' || index === 0,
      pieces: [0, 0, 0, 0], // All pieces start at home
      homePosition: boardPositions[color].start,
      safePositions: boardPositions[color].safe
    }));

    setGameState({
      players,
      currentPlayerIndex: 0,
      diceValue: null,
      isDiceRolled: false,
      gameStatus: 'playing',
      winner: null,
      board: Array(52).fill(null),
      moveHistory: []
    });
  };

  useEffect(() => {
    initializeGame();
  }, [gameSettings.numberOfPlayers, gameSettings.mode]);

  const rollDice = async () => {
    if (gameState.isDiceRolled) return;
    
    setIsRollingDice(true);
    
    // Simulate dice rolling animation
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
    }
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prev => ({
      ...prev,
      diceValue: finalValue,
      isDiceRolled: true
    }));
    
    setIsRollingDice(false);
    
    // Auto-play for computer players
    if (!gameState.players[gameState.currentPlayerIndex]?.isHuman) {
      setTimeout(() => makeComputerMove(finalValue), 1000);
    }
  };

  const makeComputerMove = (diceValue: number) => {
    // Simple AI logic - prioritize getting pieces out, then moving strategically
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const availablePieces = currentPlayer.pieces.map((pos, index) => ({ index, position: pos }));
    
    // Prioritize moving pieces that are out of home
    const movablePieces = availablePieces.filter(piece => 
      piece.position > 0 || diceValue === 6
    );
    
    if (movablePieces.length > 0) {
      const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
      movePiece(randomPiece.index, diceValue);
    } else {
      nextTurn();
    }
  };

  const movePiece = (pieceIndex: number, steps: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPosition = currentPlayer.pieces[pieceIndex];
    
    let newPosition;
    if (currentPosition === 0) {
      // Piece is at home, can only move out with 6
      if (steps === 6) {
        newPosition = currentPlayer.homePosition;
      } else {
        return; // Can't move
      }
    } else {
      newPosition = (currentPosition + steps) % 52;
      if (newPosition === 0) newPosition = 52;
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
    
    // Check for win condition
    if (currentPlayer.pieces.every(pos => pos >= 51)) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        winner: currentPlayer.color
      }));
      onStatsUpdate(prevStats => ({ ...prevStats, gamesPlayed: prevStats.gamesPlayed + 1 }));
      return;
    }
    
    // Next turn (unless rolled 6)
    if (steps !== 6) {
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
      diceValue: null
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

  const getBoardSquareColor = (index: number) => {
    if (index % 13 === 0) return '#ff4444'; // Red
    if (index % 13 === 1) return '#ffffff'; // White
    if (index % 13 === 6) return playerColors[Math.floor(index / 13)] || '#cccccc';
    return '#f0f0f0';
  };

  const renderLudoBoard = () => {
    return (
      <div className="relative w-full max-w-lg mx-auto aspect-square bg-white border-4 border-gray-800 rounded-lg overflow-hidden">
        {/* Center cross pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1/3 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-1/3 bg-gradient-to-b from-green-400 via-yellow-400 to-red-400"></div>
        </div>
        
        {/* Home areas */}
        <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-red-200 border-2 border-red-600 rounded flex items-center justify-center">
          <div className="text-red-800 font-bold text-lg">RED</div>
        </div>
        <div className="absolute top-2 right-2 w-1/3 h-1/3 bg-blue-200 border-2 border-blue-600 rounded flex items-center justify-center">
          <div className="text-blue-800 font-bold text-lg">BLUE</div>
        </div>
        <div className="absolute bottom-2 left-2 w-1/3 h-1/3 bg-green-200 border-2 border-green-600 rounded flex items-center justify-center">
          <div className="text-green-800 font-bold text-lg">GREEN</div>
        </div>
        <div className="absolute bottom-2 right-2 w-1/3 h-1/3 bg-yellow-200 border-2 border-yellow-600 rounded flex items-center justify-center">
          <div className="text-yellow-800 font-bold text-lg">YELLOW</div>
        </div>
        
        {/* Player pieces */}
        {gameState.players.map((player, playerIndex) => (
          <div key={player.id}>
            {player.pieces.map((position, pieceIndex) => {
              if (position === 0) {
                // Piece is at home
                const homePositions = {
                  red: { top: '20%', left: '15%' },
                  blue: { top: '20%', right: '15%' },
                  green: { bottom: '20%', left: '15%' },
                  yellow: { bottom: '20%', right: '15%' }
                };
                
                const homePos = homePositions[player.color];
                return (
                  <div
                    key={`${player.id}-${pieceIndex}`}
                    className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                      player.color === 'red' ? 'bg-red-500 border-red-700' :
                      player.color === 'blue' ? 'bg-blue-500 border-blue-700' :
                      player.color === 'green' ? 'bg-green-500 border-green-700' :
                      'bg-yellow-500 border-yellow-700'
                    }`}
                    style={{
                      ...homePos,
                      transform: `translate(${pieceIndex * 8}px, ${pieceIndex * 8}px)`
                    }}
                    onClick={() => handlePieceClick(pieceIndex)}
                  />
                );
              } else {
                // Piece is on the board
                const angle = (position - 1) * (360 / 52);
                const radius = 140;
                const x = 50 + (radius * Math.cos(angle * Math.PI / 180)) / 3;
                const y = 50 + (radius * Math.sin(angle * Math.PI / 180)) / 3;
                
                return (
                  <div
                    key={`${player.id}-${pieceIndex}`}
                    className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                      player.color === 'red' ? 'bg-red-500 border-red-700' :
                      player.color === 'blue' ? 'bg-blue-500 border-blue-700' :
                      player.color === 'green' ? 'bg-green-500 border-green-700' :
                      'bg-yellow-500 border-yellow-700'
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handlePieceClick(pieceIndex)}
                  />
                );
              }
            })}
          </div>
        ))}
        
        {/* Center triangle */}
        <div className="absolute inset-1/3 bg-white border-4 border-gray-800 flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-800">🏠</div>
        </div>
      </div>
    );
  };

  const renderDice = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    return (
      <div className="text-center space-y-4">
        <div 
          className={`w-20 h-20 mx-auto border-4 border-gray-800 rounded-lg flex items-center justify-center text-4xl font-bold cursor-pointer transition-all hover:scale-105 ${
            isRollingDice ? 'animate-bounce' : ''
          } ${currentPlayer ? `bg-${currentPlayer.color}-100` : 'bg-gray-100'}`}
          onClick={rollDice}
        >
          {gameState.diceValue || '🎲'}
        </div>
        <div className="text-sm font-medium">
          {gameState.isDiceRolled ? 'Select a piece to move' : 'Click to roll dice'}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-green-800">Ludo Master</h1>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={gameSettings.mode} onValueChange={(value: GameMode) => setGameSettings(prev => ({ ...prev, mode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameModes.map(mode => {
                      const Icon = mode.icon;
                      return (
                        <SelectItem key={mode.value} value={mode.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{mode.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
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

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={gameSettings.difficulty} onValueChange={(value) => setGameSettings(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Board Theme</label>
                <Select value={gameSettings.boardTheme} onValueChange={(value) => setGameSettings(prev => ({ ...prev, boardTheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {boardThemes.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button onClick={resetGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </div>

              {gameState.gameStatus === 'playing' && (
                <div className="text-center">
                  <Badge className={`${gameState.players[gameState.currentPlayerIndex]?.color === 'red' ? 'bg-red-500' : 
                                      gameState.players[gameState.currentPlayerIndex]?.color === 'blue' ? 'bg-blue-500' : 
                                      gameState.players[gameState.currentPlayerIndex]?.color === 'green' ? 'bg-green-500' : 
                                      'bg-yellow-500'} text-white`}>
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
              {/* Dice */}
              {renderDice()}

              {/* Player Status */}
              <div>
                <h4 className="font-semibold mb-2">Players:</h4>
                <div className="space-y-2">
                  {gameState.players.map((player, index) => (
                    <div key={player.id} className={`p-2 rounded ${index === gameState.currentPlayerIndex ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-${player.color}-600`}>
                          {player.name}
                        </span>
                        <Badge variant="outline">
                          {player.pieces.filter(pos => pos > 0).length}/4 out
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Home: {4 - player.pieces.filter(pos => pos > 0).length} | 
                        Finished: {player.pieces.filter(pos => pos >= 51).length}
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

              {/* Game Rules */}
              <div>
                <h4 className="font-semibold mb-2">Quick Rules:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Roll 6 to get pieces out</li>
                  <li>• Roll 6 to get extra turn</li>
                  <li>• Capture opponents by landing on them</li>
                  <li>• Get all 4 pieces home to win</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
