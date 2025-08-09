import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'kids' | 'adults' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
}

const games: Game[] = [
  { id: 'connect-dots', title: 'Connect the Dots', description: 'Connect dots to reveal amazing pictures!', category: 'kids', difficulty: 'easy', emoji: '🌟' },

  { id: 'office-sorting', title: 'Office Sorting', description: 'Sort items in an office setup.', category: 'adults', difficulty: 'medium', emoji: '📁' },
  { id: 'supermarket-sort', title: 'Supermarket Sorting', description: 'Organize groceries and products quickly!', category: 'adults', difficulty: 'medium', emoji: '🛒' },
  
  { id: 'ball-sort', title: 'Ball Sorting', description: 'Group colorful balls by color.', category: 'puzzle', difficulty: 'medium', emoji: '⚽' },
  { id: 'bicolor-ball-sort', title: 'Bicolor Ball Sorting', description: 'Sort dual-color balls strategically.', category: 'puzzle', difficulty: 'medium', emoji: '🔵' },
  
  { id: 'blocks-fusion', title: 'Blocks Fusion', description: 'Merge and sort blocks strategically', category: 'puzzle', difficulty: 'hard', emoji: '🧩' },
  { id: 'train-switch', title: 'Train Switch', description: 'Sort train cars in complex yard puzzles', category: 'puzzle', difficulty: 'hard', emoji: '🚂' },
];

const GameSelector: React.FC = () => {
  const navigate = useNavigate();

  const categories = {
    kids: games.filter(g => g.category === 'kids'),
    adults: games.filter(g => g.category === 'adults'),
    puzzle: games.filter(g => g.category === 'puzzle'),
  };

  const playGame = (gameId: string) => {
    navigate(`/games/${gameId}`);
  };

  const categoryTitles: Record<string, string> = {
    kids: '👶 Kids Games',
    adults: '👨‍💼 Adult Games',
    puzzle: '🧩 Puzzle Games',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md mb-4">
            🎮 Sorting Games Collection
          </h1>
          <p className="text-lg text-gray-700">Pick your challenge and test your skills!</p>
        </div>

        {Object.entries(categories).map(([category, categoryGames]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              {categoryTitles[category]}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryGames.map((game) => (
                <Card
                  key={game.id}
                  onClick={() => playGame(game.id)}
                  className="cursor-pointer bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-white/60 rounded-2xl"
                >
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-2 drop-shadow-sm">{game.emoji}</div>
                    <CardTitle className="text-xl font-semibold text-gray-800">{game.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center mt-2 space-y-3">
                    <div
                      className={clsx(
                        "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                        {
                          'bg-green-100 text-green-800': game.difficulty === 'easy',
                          'bg-yellow-100 text-yellow-800': game.difficulty === 'medium',
                          'bg-red-100 text-red-800': game.difficulty === 'hard',
                        }
                      )}
                    >
                      {game.difficulty.toUpperCase()}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all">
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;
