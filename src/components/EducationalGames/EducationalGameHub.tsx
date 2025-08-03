import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Pencil, Lightbulb, Puzzle, BookOpen, FlaskConical, Brain, Star } from 'lucide-react';
import { EnhancedSpellingPhonicGame } from './SpellingPhonics/EnhancedSpellingPhonicGame';
import { EnhancedMazeGameApp } from '../GameHub/Games/MazeGame/EnhancedMazeGameApp';
import { EnhancedMolecularChemistryLab } from './ChemistryLab/EnhancedMolecularChemistryLab';
import { EnhancedIntellectoKidsAcademy } from './IntellectoKids/EnhancedIntellectoKidsAcademy';

export type EducationalGameType = 
  | 'spelling' 
  | 'maze' 
  | 'chemistry' 
  | 'intellecto'
  | null;

interface EducationalGameHubProps {
  onBack: () => void;
}

const educationalGames = [
  {
    id: 'spelling' as const,
    title: 'Spelling & Phonics',
    description: 'Learn spelling and phonics through interactive games',
    icon: BookOpen,
    color: 'from-blue-400 to-cyan-500',
    difficulty: 'Medium',
    ageRange: '4-10 years',
    skills: ['Reading', 'Spelling', 'Phonics', 'Vocabulary']
  },
  {
    id: 'maze' as const,
    title: 'Maze Adventures',
    description: 'Navigate through challenging mazes and puzzles',
    icon: Puzzle,
    color: 'from-green-400 to-emerald-500',
    difficulty: 'Easy-Hard',
    ageRange: '5-12 years',
    skills: ['Problem Solving', 'Spatial Awareness', 'Logic']
  },
  {
    id: 'chemistry' as const,
    title: 'Molecular Chemistry Lab',
    description: 'Build molecules and learn chemistry concepts',
    icon: FlaskConical,
    color: 'from-orange-400 to-red-500',
    difficulty: 'Hard',
    ageRange: '8-16 years',
    skills: ['Science', 'Chemistry', 'Molecular Structure', 'Bonding']
  },
  {
    id: 'intellecto' as const,
    title: 'Intellecto Kids Academy',
    description: 'Comprehensive learning with numbers, letters, shapes and more',
    icon: Brain,
    color: 'from-indigo-400 to-blue-500',
    difficulty: 'Easy-Medium',
    ageRange: '3-8 years',
    skills: ['Reading', 'Math', 'Logic', 'Memory', 'Creativity']
  }
];

export const EducationalGameHub: React.FC<EducationalGameHubProps> = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState<EducationalGameType>(null);
  const [gameStats, setGameStats] = useState<Record<string, any>>({});

  const handleGameSelect = (gameId: EducationalGameType) => {
    setSelectedGame(gameId);
  };

  const handleStatsUpdate = (gameId: string, stats: any) => {
    setGameStats(prev => ({ ...prev, [gameId]: stats }));
  };


  if (selectedGame === 'spelling') {
    return (
      <EnhancedSpellingPhonicGame 
        onBack={() => setSelectedGame(null)}
        onStatsUpdate={(stats) => handleStatsUpdate('spelling', stats)}
      />
    );
  }

  if (selectedGame === 'maze') {
    return (
      <EnhancedMazeGameApp 
        onBack={() => setSelectedGame(null)}
        onStatsUpdate={(stats) => handleStatsUpdate('maze', stats)}
      />
    );
  }

  if (selectedGame === 'chemistry') {
    return (
      <EnhancedMolecularChemistryLab 
        onBack={() => setSelectedGame(null)}
        onStatsUpdate={(stats) => handleStatsUpdate('chemistry', stats)}
      />
    );
  }

  if (selectedGame === 'intellecto') {
    return (
      <EnhancedIntellectoKidsAcademy 
        onBack={() => setSelectedGame(null)}
        onStatsUpdate={(stats) => handleStatsUpdate('intellecto', stats)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={onBack}
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Educational Games Hub
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Teacher Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Learn Through Play! 🎓
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover a world of educational games designed to make learning fun and engaging. 
            From creativity to science, develop essential skills through interactive play.
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {educationalGames.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card 
                key={game.id}
                className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleGameSelect(game.id)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${game.color} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-500 mb-1">Age Range</div>
                      <div className="text-sm font-bold text-gray-700">{game.ageRange}</div>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                    
                    {/* Difficulty Badge */}
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mb-3">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {game.difficulty}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Skills Developed:</div>
                    <div className="flex flex-wrap gap-1">
                      {game.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  {gameStats[game.id] && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 mb-1">Your Progress:</div>
                      <div className="text-sm text-gray-700">
                        Score: {gameStats[game.id].totalScore || 0} | 
                        Completed: {gameStats[game.id].totalCompleted || 0}
                      </div>
                    </div>
                  )}

                  {/* Play Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg transition-all duration-300 text-white font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameSelect(game.id);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Adaptive Learning</h3>
            <p className="text-sm text-gray-600">Games adjust difficulty based on your child's progress</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">Monitor learning achievements and skill development</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Educational Content</h3>
            <p className="text-sm text-gray-600">Curriculum-aligned content approved by educators</p>
          </div>
        </div>
      </div>
    </div>
  );
};