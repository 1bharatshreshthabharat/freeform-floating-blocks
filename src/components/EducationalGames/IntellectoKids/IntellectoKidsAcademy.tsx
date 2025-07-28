import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, BookOpen, Calculator, Palette, Shapes, 
  Star, Trophy, Play, Lock, Check, Brain, 
  Clock, Target, Award, Zap
} from 'lucide-react';

interface IntellectoKidsAcademyProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

type LessonCategory = 'numbers' | 'letters' | 'shapes' | 'colors' | 'worksheets' | 'phonics' | null;

const lessonCategories = [
  {
    id: 'numbers' as const,
    title: 'Numbers & Math',
    description: 'Learn counting, addition, subtraction, and number recognition',
    icon: Calculator,
    color: 'from-blue-400 to-blue-600',
    lessons: 150,
    completed: 45,
    level: 'Beginner'
  },
  {
    id: 'letters' as const,
    title: 'ABC & Writing',
    description: 'Alphabet recognition, letter tracing, and writing practice',
    icon: BookOpen,
    color: 'from-green-400 to-green-600',
    lessons: 200,
    completed: 78,
    level: 'Intermediate'
  },
  {
    id: 'shapes' as const,
    title: 'Shapes & Patterns',
    description: 'Geometric shapes, pattern recognition, and spatial skills',
    icon: Shapes,
    color: 'from-purple-400 to-purple-600',
    lessons: 80,
    completed: 25,
    level: 'Beginner'
  },
  {
    id: 'colors' as const,
    title: 'Colors & Art',
    description: 'Color identification, mixing, and creative expression',
    icon: Palette,
    color: 'from-pink-400 to-pink-600',
    lessons: 120,
    completed: 60,
    level: 'All Levels'
  },
  {
    id: 'phonics' as const,
    title: 'Phonics & Reading',
    description: 'Sound recognition, word building, and early reading skills',
    icon: Brain,
    color: 'from-orange-400 to-orange-600',
    lessons: 180,
    completed: 32,
    level: 'Intermediate'
  },
  {
    id: 'worksheets' as const,
    title: 'Practice Worksheets',
    description: 'Printable activities and interactive practice exercises',
    icon: Target,
    color: 'from-teal-400 to-teal-600',
    lessons: 300,
    completed: 125,
    level: 'All Levels'
  }
];

const achievements = [
  { title: 'First Steps', description: 'Complete your first lesson', unlocked: true },
  { title: 'Number Master', description: 'Complete 50 math lessons', unlocked: true },
  { title: 'ABC Hero', description: 'Master all letters', unlocked: false },
  { title: 'Shape Detective', description: 'Identify all basic shapes', unlocked: true },
  { title: 'Color Artist', description: 'Complete 30 color activities', unlocked: false },
  { title: 'Reading Star', description: 'Read 20 words correctly', unlocked: false }
];

export const IntellectoKidsAcademy: React.FC<IntellectoKidsAcademyProps> = ({ onBack, onStatsUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory>(null);
  const [userProgress, setUserProgress] = useState({
    totalLessons: 340,
    streak: 7,
    points: 2450,
    level: 12
  });

  const NumbersGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-600 mb-2">Numbers & Math</h3>
        <p className="text-gray-600">Interactive counting and math games</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-20 text-2xl font-bold hover:bg-blue-50 border-2 border-blue-200"
            onClick={() => {
              // Simple counting game logic
              setUserProgress(prev => ({ ...prev, points: prev.points + 10 }));
            }}
          >
            {num}
          </Button>
        ))}
      </div>
      
      <Card className="p-6 bg-blue-50">
        <h4 className="font-bold mb-2">Math Challenge</h4>
        <p className="text-gray-600 mb-4">Count the objects and click the correct number!</p>
        <div className="flex justify-center space-x-4 mb-4">
          <span className="text-4xl">🍎🍎🍎</span>
        </div>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant={num === 3 ? "default" : "outline"}
              onClick={() => {
                if (num === 3) {
                  setUserProgress(prev => ({ ...prev, points: prev.points + 50 }));
                }
              }}
            >
              {num}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  const LettersGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-green-600 mb-2">ABC & Writing</h3>
        <p className="text-gray-600">Learn letters and practice writing</p>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <Button
            key={letter}
            variant="outline"
            className="h-16 text-xl font-bold hover:bg-green-50 border-2 border-green-200"
            onClick={() => {
              setUserProgress(prev => ({ ...prev, points: prev.points + 5 }));
            }}
          >
            {letter}
          </Button>
        ))}
      </div>
      
      <Card className="p-6 bg-green-50">
        <h4 className="font-bold mb-2">Letter Tracing</h4>
        <p className="text-gray-600 mb-4">Practice writing the letter A</p>
        <div className="text-center">
          <div className="text-8xl font-bold text-green-300 mb-4">A</div>
          <Button className="bg-green-500 hover:bg-green-600">Start Tracing</Button>
        </div>
      </Card>
    </div>
  );

  const ShapesGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-2">Shapes & Patterns</h3>
        <p className="text-gray-600">Identify and learn geometric shapes</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-2"></div>
          <p className="font-bold">Circle</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-purple-200 mx-auto mb-2"></div>
          <p className="font-bold">Square</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-12 bg-purple-200 mx-auto mb-2" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          <p className="font-bold">Triangle</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-20 h-12 bg-purple-200 rounded-full mx-auto mb-2"></div>
          <p className="font-bold">Oval</p>
        </Card>
      </div>
      
      <Card className="p-6 bg-purple-50">
        <h4 className="font-bold mb-2">Shape Matching</h4>
        <p className="text-gray-600 mb-4">Match the shape with its name!</p>
        <div className="flex justify-center items-center space-x-8">
          <div className="w-20 h-20 bg-purple-300 rounded-full"></div>
          <span className="text-2xl">→</span>
          <div className="grid grid-cols-2 gap-2">
            {['Circle', 'Square', 'Triangle', 'Star'].map((shape) => (
              <Button key={shape} variant="outline" size="sm">
                {shape}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const ColorsGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-pink-600 mb-2">Colors & Art</h3>
        <p className="text-gray-600">Learn colors and create beautiful art</p>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { name: 'Red', color: 'bg-red-400' },
          { name: 'Blue', color: 'bg-blue-400' },
          { name: 'Yellow', color: 'bg-yellow-400' },
          { name: 'Green', color: 'bg-green-400' },
          { name: 'Purple', color: 'bg-purple-400' },
          { name: 'Orange', color: 'bg-orange-400' }
        ].map((colorObj) => (
          <Card key={colorObj.name} className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className={`w-12 h-12 ${colorObj.color} rounded-full mx-auto mb-2`}></div>
            <p className="font-bold text-sm">{colorObj.name}</p>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-pink-50">
        <h4 className="font-bold mb-2">Color Mixing</h4>
        <p className="text-gray-600 mb-4">What color do you get when you mix red and blue?</p>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-red-400 rounded-full"></div>
          <span className="text-xl">+</span>
          <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
          <span className="text-xl">=</span>
          <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-dashed"></div>
        </div>
        <div className="flex justify-center space-x-2">
          {['Purple', 'Green', 'Orange'].map((color) => (
            <Button
              key={color}
              variant={color === 'Purple' ? "default" : "outline"}
              onClick={() => {
                if (color === 'Purple') {
                  setUserProgress(prev => ({ ...prev, points: prev.points + 30 }));
                }
              }}
            >
              {color}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={() => setSelectedCategory(null)}
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academy
              </Button>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  {userProgress.points} points
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  {userProgress.streak} day streak
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {selectedCategory === 'numbers' && <NumbersGame />}
          {selectedCategory === 'letters' && <LettersGame />}
          {selectedCategory === 'shapes' && <ShapesGame />}
          {selectedCategory === 'colors' && <ColorsGame />}
          {selectedCategory === 'phonics' && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Phonics & Reading</h3>
              <p className="text-gray-600 mb-8">Interactive phonics games coming soon!</p>
              <Button onClick={() => setSelectedCategory(null)}>Back to Academy</Button>
            </div>
          )}
          {selectedCategory === 'worksheets' && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-teal-600 mb-4">Practice Worksheets</h3>
              <p className="text-gray-600 mb-8">Printable worksheets and activities coming soon!</p>
              <Button onClick={() => setSelectedCategory(null)}>Back to Academy</Button>
            </div>
          )}
        </div>
      </div>
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
                  Intellecto Kids Academy
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Trophy className="h-3 w-3 mr-1" />
                Level {userProgress.level}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                {userProgress.points} points
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Learning Journey! 🎓
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Over 1000+ interactive lessons covering all preschool topics. Perfect for ages 3-8!
          </p>
          
          <Card className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              <span className="text-sm font-bold text-primary">{Math.round((userProgress.totalLessons / 1000) * 100)}%</span>
            </div>
            <Progress value={(userProgress.totalLessons / 1000) * 100} className="mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userProgress.totalLessons}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{userProgress.streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{userProgress.level}</div>
                <div className="text-xs text-gray-500">Level</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {lessonCategories.map((category) => {
            const IconComponent = category.icon;
            const progress = (category.completed / category.lessons) * 100;
            
            return (
              <Card 
                key={category.id}
                className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {category.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    
                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{category.completed} completed</span>
                        <span>{category.lessons} total</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>

                  {/* Play Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${category.color} hover:shadow-lg transition-all duration-300 text-white font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category.id);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <Card 
                key={index}
                className={`p-4 text-center transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-300'
                }`}>
                  {achievement.unlocked ? (
                    <Trophy className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-purple-800">Daily Challenge</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Complete today's challenge to earn bonus points and extend your streak!
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Award className="h-4 w-4 mr-2" />
              Start Daily Challenge
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};