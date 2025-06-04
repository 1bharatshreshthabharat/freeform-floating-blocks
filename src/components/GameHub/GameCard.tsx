
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Star } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    image: string;
    difficulty: string;
    category: string;
    players: string;
  };
  onPlay: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className={getDifficultyColor(game.difficulty)}>
            {game.difficulty}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {game.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">{game.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{game.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{game.players} Players</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>4.8/5</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onPlay} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Play className="h-4 w-4 mr-2" />
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
};
