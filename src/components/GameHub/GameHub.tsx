
import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { ChessGame } from './Games/ChessGame';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Trophy, User, Settings } from 'lucide-react';

export type GameType = 'chess' | null;

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
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'chess':
        return <ChessGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
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
                ♟️ Chess Master Hub
              </h1>
              <p className="text-gray-600 mt-2">Master Chess with advanced customization and AI opponents</p>
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
                  <div className="text-xs text-gray-600">Rating</div>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Playing Chess</h2>
          <p className="text-gray-600 text-lg">Experience chess with professional-grade customization and features!</p>
        </div>

        <div className="grid grid-cols-1 max-w-2xl mx-auto">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setCurrentGame(game.id)}
            />
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Chess Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold mb-2">Board Customization</h4>
              <p className="text-gray-600">Multiple themes, colors, and visual effects</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-2">AI Opponents</h4>
              <p className="text-gray-600">Various difficulty levels and playing styles</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-xl font-bold mb-2">Analysis & Learning</h4>
              <p className="text-gray-600">Move analysis, puzzles, and improvement tracking</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
