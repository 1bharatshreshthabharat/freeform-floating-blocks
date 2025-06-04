
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, BookOpen, Dice6, Shuffle, Users, Bot, User } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LudoGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Player {
  id: number;
  color: string;
  name: string;
  pieces: number[];
  isComputer: boolean;
}

export const LudoGame: React.FC<LudoGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [gameMode, setGameMode] = useState('vs-computer');
  const [playerCount, setPlayerCount] = useState('4');
  const [difficulty, setDifficulty] = useState('easy');
  const [showConcepts, setShowConcepts] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const playerColors = [
    { color: 'red', bg: 'bg-red-500', light: 'bg-red-200', border: 'border-red-600' },
    { color: 'blue', bg: 'bg-blue-500', light: 'bg-blue-200', border: 'border-blue-600' },
    { color: 'green', bg: 'bg-green-500', light: 'bg-green-200', border: 'border-green-600' },
    { color: 'yellow', bg: 'bg-yellow-500', light: 'bg-yellow-200', border: 'border-yellow-600' }
  ];

  const gameModes = [
    { value: 'vs-computer', label: 'vs Computer', icon: Bot },
    { value: 'multiplayer', label: 'Multiplayer', icon: Users },
    { value: 'single-player', label: 'Practice', icon: User }
  ];

  const playerCounts = ['2', '3', '4'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    initializeGame();
    setHints([
      "Roll a 6 to move pieces out of home",
      "Capture opponent pieces to send them back home",
      "Create safe zones by keeping pieces together",
      "Focus on getting all pieces to the center",
      "Use strategy to block opponents' paths"
    ]);
  }, [playerCount, gameMode]);

  const initializeGame = () => {
    const count = parseInt(playerCount);
    const newPlayers: Player[] = [];
    
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i,
        color: playerColors[i].color,
        name: i === 0 ? 'You' : (gameMode === 'vs-computer' ? `Computer ${i}` : `Player ${i + 1}`),
        pieces: [-1, -1, -1, -1], // -1 means in home
        isComputer: gameMode === 'vs-computer' && i !== 0
      });
    }
    
    setPlayers(newPlayers);
    setCurrentPlayer(0);
    setDiceValue(1);
    setGameStarted(false);
  };

  const rollDice = async () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Animate dice roll
    for (let i = 0; i < 10; i++) {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalValue);
    setIsRolling(false);
    setGameStarted(true);
    
    // Auto-advance turn after a delay
    setTimeout(() => {
      if (players[currentPlayer]?.isComputer) {
        // Computer move logic here
        makeComputerMove(finalValue);
      }
    }, 1000);

    // Update stats
    onStatsUpdate(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
  };

  const makeComputerMove = (diceVal: number) => {
    // Simple AI logic for computer moves
    console.log(`Computer ${currentPlayer} rolled ${diceVal}`);
    nextTurn();
  };

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev + 1) % parseInt(playerCount));
  };

  const randomizeSettings = () => {
    const randomMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    setGameMode(randomMode.value);
    setPlayerCount(playerCounts[Math.floor(Math.random() * playerCounts.length)]);
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  // Create Ludo board path (simplified for display)
  const createBoardSquares = () => {
    const squares = [];
    
    // Top row (squares 0-5)
    for (let i = 0; i < 6; i++) {
      squares.push({ id: i, x: i + 6, y: 0, safe: i === 1 });
    }
    
    // Right column (squares 6-11)
    for (let i = 1; i < 6; i++) {
      squares.push({ id: i + 5, x: 14, y: i, safe: i === 2 });
    }
    
    // Continue around the board...
    return squares;
  };

  const concepts = [
    {
      title: "Ludo Strategy Basics",
      description: "Master the fundamental strategies of Ludo",
      example: "1. Roll 6 to get pieces out\n2. Capture opponents when possible\n3. Keep pieces safe in groups\n4. Race to the center finish",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Piece Movement", "Capturing", "Safe Zones", "Endgame Strategy"]
    },
    {
      title: "Advanced Tactics",
      description: "Learn advanced Ludo techniques",
      example: "Block opponents' paths, time your captures, manage risk vs reward",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Blocking", "Risk Management", "Timing", "Multi-piece Strategy"]
    }
  ];

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
            <Button onClick={() => setShowConcepts(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn Strategy
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={gameMode} onValueChange={setGameMode}>
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
                <Select value={playerCount} onValueChange={setPlayerCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {playerCounts.map(count => (
                      <SelectItem key={count} value={count}>
                        {count} Players
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={randomizeSettings} className="w-full" variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Random Settings
              </Button>

              <div className="space-y-2">
                <Button onClick={initializeGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
                <Button onClick={nextHint} className="w-full" variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Next Hint
                </Button>
              </div>

              <div className="text-center">
                <Badge className={`${playerColors[currentPlayer]?.bg} text-white`}>
                  {players[currentPlayer]?.name}'s Turn
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ludo Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto bg-white relative border-4 border-gray-800 rounded-lg">
                {/* Ludo Board Layout */}
                <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 gap-0">
                  
                  {/* Red Home Area (Top-Left) */}
                  <div className="col-span-6 row-span-6 bg-red-200 border-4 border-red-600 m-1 rounded-lg relative">
                    <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <div key={`red-${i}`} className="bg-red-500 rounded-full border-2 border-red-700 flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Track */}
                  <div className="col-span-3 row-span-6 grid grid-rows-6 gap-0">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={`top-${i}`} className={`border border-gray-400 ${i === 1 ? 'bg-red-300' : 'bg-white'} flex items-center justify-center`}>
                        {i === 1 && <div className="w-4 h-4 bg-red-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>

                  {/* Blue Home Area (Top-Right) */}
                  <div className="col-span-6 row-span-6 bg-blue-200 border-4 border-blue-600 m-1 rounded-lg relative">
                    <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <div key={`blue-${i}`} className="bg-blue-500 rounded-full border-2 border-blue-700 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Left Track */}
                  <div className="col-span-6 row-span-3 grid grid-cols-6 gap-0">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={`left-${i}`} className={`border border-gray-400 ${i === 4 ? 'bg-green-300' : 'bg-white'} flex items-center justify-center`}>
                        {i === 4 && <div className="w-4 h-4 bg-green-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>

                  {/* Center Victory Area */}
                  <div className="col-span-3 row-span-3 bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-600 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">🏆</div>
                  </div>

                  {/* Right Track */}
                  <div className="col-span-6 row-span-3 grid grid-cols-6 gap-0">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={`right-${i}`} className={`border border-gray-400 ${i === 1 ? 'bg-blue-300' : 'bg-white'} flex items-center justify-center`}>
                        {i === 1 && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>

                  {/* Green Home Area (Bottom-Left) */}
                  <div className="col-span-6 row-span-6 bg-green-200 border-4 border-green-600 m-1 rounded-lg relative">
                    <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <div key={`green-${i}`} className="bg-green-500 rounded-full border-2 border-green-700 flex items-center justify-center">
                          <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Track */}
                  <div className="col-span-3 row-span-6 grid grid-rows-6 gap-0">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={`bottom-${i}`} className={`border border-gray-400 ${i === 4 ? 'bg-yellow-300' : 'bg-white'} flex items-center justify-center`}>
                        {i === 4 && <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>

                  {/* Yellow Home Area (Bottom-Right) */}
                  <div className="col-span-6 row-span-6 bg-yellow-200 border-4 border-yellow-600 m-1 rounded-lg relative">
                    <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <div key={`yellow-${i}`} className="bg-yellow-500 rounded-full border-2 border-yellow-700 flex items-center justify-center">
                          <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={rollDice} 
                  disabled={isRolling}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4"
                >
                  <Dice6 className="h-4 w-4 mr-2" />
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </Button>
                <div className={`text-6xl transition-transform duration-200 ${isRolling ? 'animate-spin' : ''}`}>
                  🎲
                </div>
                <div className="text-3xl font-bold mt-2">{diceValue}</div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Hint:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Players:</h4>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${playerColors[index]?.bg}`}></div>
                        <span className="text-sm font-medium">{player.name}</span>
                      </div>
                      {index === currentPlayer && <Badge>Active</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Mode: <Badge variant="secondary">{gameMode.replace('-', ' ')}</Badge></div>
                  <div>Players: <Badge variant="secondary">{playerCount}</Badge></div>
                  <div>Difficulty: <Badge variant="secondary">{difficulty}</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConceptModal
        isOpen={showConcepts}
        onClose={() => setShowConcepts(false)}
        concepts={concepts}
        gameTitle="Ludo"
      />
    </div>
  );
};
