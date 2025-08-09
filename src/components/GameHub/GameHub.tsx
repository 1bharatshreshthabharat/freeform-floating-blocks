import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { ChessGame } from './Games/ChessGame';
import { SnakeGame } from './Games/SnakeGame';
import { FlappyGame } from './Games/FlappyGame';
import { FruitNinjaGame } from './Games/FruitNinjaGame';
import { BalloonPopGame } from './Games/BalloonPopGame';
import { WordWondersGame } from './Games/WordWondersGame';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, User } from 'lucide-react';
import { ColorMyWorldGame } from './Games/ColorMyWorldGame';
import { EducationalGameHub } from '../EducationalGames/EducationalGameHub';
import { EnhancedMazeGameApp } from './Games/MazeGame/EnhancedMazeGameApp';
import ConnectTheDots from './Games/ConnectTheDots/ConnectTheDots';
import SupermarketSort from './Games/SortingGames/SupermarketSort/SupermarketSort';
import SortItRight from './Games/SortingGames/SortItRight/SortItRight';
import BallSort from './Games/SortingGames/BallSort/BallSort';
import BallSortBicolor from './Games/SortingGames/BallSort/BallSortBicolor';
import BlocksFusion from './Games/BlocksFusion/BlocksFusion';
import TrainSwitch from './Games/SortingGames/TrainSwitch/TrainSwitch';

export type GameType = 
  | 'chess' | 'maze' | 'snake' | 'flappy' | 'fruitninja' | 'balloonpop' 
  | 'wordwonders' | 'colormyworld' | 'educational' | 'connectdots'
  | 'supermarket' | 'sortit' | 'ballsort' | 'ballsortbicolor'
  | 'blocksfusion' | 'trainswitch';

export const GameHub: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [playerStats, setPlayerStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    achievements: [] as string[]
  });

  const games = [
    {
      id: 'educational' as const,
      title: 'Educational Hub',
      description: 'Collection of educational games for all ages',
      gradient: 'from-indigo-500 to-purple-600',
      difficulty: 'Easy-Hard',
      category: 'Educational',
      players: '1+',
      icon: '🎓'
    },
    {
      id: 'colormyworld' as const,
      title: 'Color My World',
      description: 'Interactive coloring game with vibrant outlines',
      gradient: 'from-pink-500 to-rose-500',
      difficulty: 'Easy',
      category: 'Creative',
      players: '1',
      icon: '🎨'
    },
    {
      id: 'wordwonders' as const,
      title: 'Word Wonders',
      description: 'Interactive wordplay and literacy-building',
      gradient: 'from-blue-500 to-cyan-500',
      difficulty: 'Easy-Medium',
      category: 'Educational',
      players: '1',
      icon: '🔤'
    },
    {
      id: 'chess' as const,
      title: 'Master Chess',
      description: 'Play chess with extensive customization',
      gradient: 'from-amber-600 to-orange-600',
      difficulty: 'Advanced',
      category: 'Strategy',
      players: '1-2',
      icon: '♟️'
    },
    {
      id: 'maze' as const,
      title: 'Maze Adventures',
      description: 'Navigate through challenging mazes and puzzles',
      gradient: 'from-green-500 to-emerald-600',
      difficulty: 'Easy-Hard',
      category: 'Puzzle',
      players: '1',
      icon: '🧩'
    },
    {
      id: 'balloonpop' as const,
      title: 'Balloon Pop',
      description: 'Educational balloon popping game',
      gradient: 'from-red-500 to-pink-500',
      difficulty: 'Easy',
      category: 'Educational',
      players: '1',
      icon: '🎈'
    },
    {
      id: 'snake' as const,
      title: 'Advanced Snake',
      description: 'Classic snake with modern features',
      gradient: 'from-green-500 to-emerald-500',
      difficulty: 'Medium',
      category: 'Arcade',
      players: '1',
      icon: '🐍'
    },
    {
      id: 'flappy' as const,
      title: 'Flappy Bird',
      description: 'Enhanced flappy bird game',
      gradient: 'from-yellow-500 to-amber-500',
      difficulty: 'Hard',
      category: 'Arcade',
      players: '1',
      icon: '🐦'
    },
    {
      id: 'fruitninja' as const,
      title: 'Fruit Ninja',
      description: 'Slice fruits with precision',
      gradient: 'from-lime-500 to-green-500',
      difficulty: 'Medium',
      category: 'Arcade',
      players: '1',
      icon: '🍉'
    },
    {
      id: 'connectdots' as const,
      title: 'Connect Dots',
      description: 'Connect numbered dots to reveal pictures',
      gradient: 'from-purple-500 to-violet-500',
      difficulty: 'Easy',
      category: 'Educational',
      players: '1',
      icon: '🔗'
    },
    {
      id: 'supermarket' as const,
      title: 'Supermarket Sort',
      description: 'Organize grocery items by categories',
      gradient: 'from-cyan-500 to-blue-500',
      difficulty: 'Easy-Medium',
      category: 'Educational',
      players: '1',
      icon: '🛒'
    },
    {
      id: 'sortit' as const,
      title: 'Sort It Right',
      description: 'Sort items by color, shape and size',
      gradient: 'from-orange-500 to-red-500',
      difficulty: 'Easy',
      category: 'Educational',
      players: '1',
      icon: '🗂️'
    },
    {
      id: 'ballsort' as const,
      title: 'Ball Sort Puzzle',
      description: 'Sort colored balls into matching tubes',
      gradient: 'from-fuchsia-500 to-pink-500',
      difficulty: 'Medium',
      category: 'Puzzle',
      players: '1',
      icon: '🎱'
    },
    {
      id: 'ballsortbicolor' as const,
      title: 'Bicolor Ball Sort',
      description: 'Advanced sorting with two-color balls',
      gradient: 'from-violet-500 to-purple-500',
      difficulty: 'Hard',
      category: 'Puzzle',
      players: '1',
      icon: '🔴🔵'
    },
    {
      id: 'blocksfusion' as const,
      title: 'Blocks Fusion',
      description: 'Merge blocks to create powerful combos',
      gradient: 'from-rose-500 to-pink-500',
      difficulty: 'Medium',
      category: 'Puzzle',
      players: '1',
      icon: '🧩'
    },
    {
      id: 'trainswitch' as const,
      title: 'Train Switch',
      description: 'Sort train cars by color and type',
      gradient: 'from-sky-500 to-blue-500',
      difficulty: 'Medium-Hard',
      category: 'Puzzle',
      players: '1',
      icon: '🚂'
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'educational':
        return <EducationalGameHub onBack={() => setCurrentGame(null)} />;
      case 'colormyworld':
        return <ColorMyWorldGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'wordwonders':
        return <WordWondersGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'chess':
        return <ChessGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'balloonpop':
        return <BalloonPopGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'snake':
        return <SnakeGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'flappy':
        return <FlappyGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'fruitninja':
        return <FruitNinjaGame onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'connectdots':
        return <ConnectTheDots onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'supermarket':
        return <SupermarketSort onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'sortit':
        return <SortItRight onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'ballsort':
        return <BallSort onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'ballsortbicolor':
        return <BallSortBicolor onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'blocksfusion':
        return <BlocksFusion onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'trainswitch':
        return <TrainSwitch onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
      case 'maze':
        return <EnhancedMazeGameApp onBack={() => setCurrentGame(null)} onStatsUpdate={setPlayerStats} />;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ultimate Game Hub
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Choose Your Adventure</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover {games.length} amazing games across multiple categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setCurrentGame(game.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};