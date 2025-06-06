
import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { ChessGame } from './Games/ChessGame';
import { LudoGame } from './Games/LudoGame';
import { FlappyGame } from './Games/FlappyGame';
import { FruitNinjaGame } from './Games/FruitNinjaGame';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Trophy, User, Settings } from 'lucide-react';

export type GameType = 'chess' | 'ludo' | 'flappy' | 'fruitninja' | null;

export const GameHub: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [playerStats, setPlayerStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    achievements: [] as string[]
  });

  const games = [
    {
      id: 'chess' as const,
      title: 'Master Chess',
      description: 'Play chess with extensive customization, multiple AI opponents, and advanced features',
      image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=300&fit=crop',
      difficulty: 'Advanced',
      category: 'Strategy',
      players: '1-2'
    },
    {
      id: 'ludo' as const,
      title: 'Classic Ludo',
      description: 'Authentic Ludo experience with AI opponents, multiple game modes, and beautiful graphics',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
      difficulty: 'Easy',
      category: 'Board Game',
      players: '2-4'
    },
    {
      id: 'flappy' as const,
      title: 'Flappy Bird',
      description: 'Classic flappy bird game with smooth controls and challenging gameplay',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      difficulty: 'Hard',
      category: 'Arcade',
      players: '1'
    },
    {
      id: 'fruitninja' as const,
      title: 'Fruit Ninja',
      description: 'Slice fruits with precision and speed in this addictive arcade game',
      image: 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=400&h=300&fit=crop',
      difficulty: 'Medium',
      category: 'Arcade',
      players: '1'
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'chess':
        return <ChessGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'ludo':
        return <LudoGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'flappy':
        return <FlappyGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'fruitninja':
        return <FruitNinjaGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return (
      <div className="min-h-screen">
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎮 Ultimate Game Hub
              </h1>
              <p className="text-gray-600 mt-2">Master multiple games with advanced features and customization</p>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="px-4 py-2 bg-blue-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{playerStats.gamesPlayed}</div>
                  <div className="text-xs text-gray-600">Games Played</div>
                </div>
              </Card>
              <Card className="px-4 py-2 bg-purple-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{playerStats.totalScore}</div>
                  <div className="text-xs text-gray-600">Total Score</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <Button variant="ghost" className="flex items-center space-x-2 py-4">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 py-4">
              <Trophy className="h-5 w-5" />
              <span>Achievements</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 py-4">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 py-4">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Game</h2>
          <p className="text-gray-600 text-lg">Experience games with professional-grade features and customization!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setCurrentGame(game.id)}
            />
          ))}
        </div>

        {/* Featured Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Strategy Games</h3>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">♟️</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Chess Mastery</h4>
                    <p className="text-gray-600">Advanced AI, customization, analysis tools</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🎲</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Ludo Classic</h4>
                    <p className="text-gray-600">Authentic board game experience</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Arcade Games</h3>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🐦</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Flappy Challenge</h4>
                    <p className="text-gray-600">Test your reflexes and precision</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🍎</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Fruit Ninja</h4>
                    <p className="text-gray-600">Slice fruits with speed and accuracy</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
