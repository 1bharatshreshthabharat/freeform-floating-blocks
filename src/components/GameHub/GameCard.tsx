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
    gradient: string;
    difficulty: string;
    category: string;
    players: string;
    icon: string;
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2  bg-white/90 backdrop-blur-sm">
      <div className={`h-2 w-full bg-gradient-to-r ${game.gradient}`} />
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`text-2xl p-3 rounded-lg bg-gradient-to-br ${game.gradient} text-white`}>
            {game.icon}
          </div>
          <CardTitle className="text-lg font-bold text-gray-800">{game.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge className={getDifficultyColor(game.difficulty)}>
            {game.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            {game.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={onPlay} 
          className={`w-full bg-gradient-to-r ${game.gradient} hover:shadow-md text-white font-medium py-2 px-4 rounded-lg transition-all duration-300`}
        >
          <Play className="h-4 w-4 mr-2" />
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
};