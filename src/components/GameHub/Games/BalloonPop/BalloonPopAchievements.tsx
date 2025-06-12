
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Trophy, Star, Target, Zap, Shield, Clock } from 'lucide-react';

export const BalloonPopAchievements: React.FC = () => {
  const { state, dispatch } = useBalloonPopGame();

  if (!state.showAchievements) return null;

  const closeAchievements = () => {
    dispatch({ type: 'TOGGLE_ACHIEVEMENTS' });
  };

  const getAchievementIcon = (id: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'first_pop': '🎈',
      'streak_master': '🔥',
      'speed_demon': '⚡',
      'perfect_level': '⭐',
      'powerup_master': '💪',
      'time_champion': '⏰',
      'category_expert': '🧠',
      'social_butterfly': '👥',
      'explorer': '🗺️',
      'persistent': '💎'
    };
    return iconMap[id] || <Trophy className="h-6 w-6" />;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 shadow-2xl relative">
        <Button
          onClick={closeAchievements}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Trophy className="mr-2 text-yellow-500" />
            Achievements
          </h2>
          <p className="text-gray-600">Track your learning progress and unlock rewards!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-2xl ${achievement.unlocked ? 'filter-none' : 'grayscale opacity-50'}`}>
                  {getAchievementIcon(achievement.id)}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-600'}`}>
                    {achievement.name}
                    {achievement.unlocked && <Star className="inline h-4 w-4 ml-1 text-yellow-500" />}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.target) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {achievement.unlocked && (
                    <div className="text-xs text-yellow-600 font-semibold">
                      🎉 UNLOCKED!
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-purple-700 mb-2">🎯 Achievement Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {state.achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-sm text-gray-600">Unlocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {state.achievements.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((state.achievements.filter(a => a.unlocked).length / state.achievements.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {state.gameStats.highScore}
                </div>
                <div className="text-sm text-gray-600">High Score</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
