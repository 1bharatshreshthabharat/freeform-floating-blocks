
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Dice6, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LudoGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const LudoGame: React.FC<LudoGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [gameMode, setGameMode] = useState('classic');
  const [playerCount, setPlayerCount] = useState('4');
  const [difficulty, setDifficulty] = useState('easy');
  const [showConcepts, setShowConcepts] = useState(false);
  const [playerPositions, setPlayerPositions] = useState<number[][]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);

  const playerColors = ['red', 'blue', 'green', 'yellow'];
  const gameModes = ['classic', 'quick', 'tournament', 'team'];
  const playerCounts = ['2', '3', '4'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    initializeGame();
    setHints([
      "Try to get all pieces out of home base first",
      "Block opponents when possible",
      "Keep pieces together for safety",
      "Use strategy to capture opponent pieces"
    ]);
  }, [playerCount]);

  const initializeGame = () => {
    const count = parseInt(playerCount);
    const positions = Array(count).fill(null).map(() => Array(4).fill(-1));
    setPlayerPositions(positions);
    setCurrentPlayer(0);
    setDiceValue(1);
  };

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    
    // Auto-advance turn after a short delay
    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % parseInt(playerCount));
    }, 1000);
  };

  const randomizeSettings = () => {
    setGameMode(gameModes[Math.floor(Math.random() * gameModes.length)]);
    setPlayerCount(playerCounts[Math.floor(Math.random() * playerCounts.length)]);
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const concepts = [
    {
      title: "Ludo Strategy Basics",
      description: "Learn fundamental strategies for winning at Ludo",
      example: "1. Get all pieces out early\n2. Block opponents\n3. Keep pieces safe\n4. Time your moves",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Piece Movement", "Blocking", "Safety", "Timing"]
    },
    {
      title: "Advanced Tactics",
      description: "Master advanced Ludo tactics",
      example: "Creating barriers, safe house usage, endgame strategy",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Barriers", "Safe Houses", "Endgame", "Team Play"]
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
              Concepts
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
                    {gameModes.map(mode => (
                      <SelectItem key={mode} value={mode}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </SelectItem>
                    ))}
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
                <Button className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Turn
                </Button>
              </div>

              <div className="text-center">
                <Badge className={`bg-${playerColors[currentPlayer]}-500 text-white`}>
                  Player {currentPlayer + 1} Turn
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="aspect-square max-w-lg mx-auto bg-white border-4 border-gray-800 relative">
                {/* Ludo Board Visual */}
                <div className="grid grid-cols-15 gap-0 h-full w-full">
                  {/* Home areas for 4 players */}
                  <div className="col-span-6 row-span-6 bg-red-200 border-2 border-red-500 flex items-center justify-center">
                    <div className="text-4xl">🏠</div>
                  </div>
                  <div className="col-span-3 row-span-6 bg-white border border-gray-300"></div>
                  <div className="col-span-6 row-span-6 bg-blue-200 border-2 border-blue-500 flex items-center justify-center">
                    <div className="text-4xl">🏠</div>
                  </div>
                  
                  <div className="col-span-6 row-span-3 bg-white border border-gray-300"></div>
                  <div className="col-span-3 row-span-3 bg-yellow-300 border-2 border-yellow-500 flex items-center justify-center">
                    <div className="text-2xl">⭐</div>
                  </div>
                  <div className="col-span-6 row-span-3 bg-white border border-gray-300"></div>
                  
                  <div className="col-span-6 row-span-6 bg-green-200 border-2 border-green-500 flex items-center justify-center">
                    <div className="text-4xl">🏠</div>
                  </div>
                  <div className="col-span-3 row-span-6 bg-white border border-gray-300"></div>
                  <div className="col-span-6 row-span-6 bg-yellow-200 border-2 border-yellow-500 flex items-center justify-center">
                    <div className="text-4xl">🏠</div>
                  </div>
                </div>

                {/* Player pieces would be positioned absolutely */}
                {playerPositions.map((player, playerIndex) =>
                  player.map((position, pieceIndex) => (
                    <div
                      key={`${playerIndex}-${pieceIndex}`}
                      className={`absolute w-6 h-6 rounded-full bg-${playerColors[playerIndex]}-500 border-2 border-white`}
                      style={{
                        left: `${20 + playerIndex * 15}%`,
                        top: `${20 + pieceIndex * 10}%`,
                      }}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button onClick={rollDice} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Dice6 className="h-4 w-4 mr-2" />
                  Roll Dice
                </Button>
                <div className="mt-4 text-6xl">🎲</div>
                <div className="text-2xl font-bold">{diceValue}</div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Hint:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Player Status:</h4>
                <div className="space-y-2">
                  {Array.from({ length: parseInt(playerCount) }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full bg-${playerColors[index]}-500`}></div>
                      <span className="text-sm">Player {index + 1}</span>
                      {index === currentPlayer && <Badge>Active</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Mode: <Badge variant="secondary">{gameMode}</Badge></div>
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
