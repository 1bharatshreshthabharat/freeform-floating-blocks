
import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Zap, Star, Search, Shield, Bomb } from 'lucide-react';

export const BalloonPopPowerUps: React.FC = () => {
  const { state, dispatch } = useBalloonPopGame();

  const usePowerUp = (type: string) => {
    dispatch({ type: 'USE_POWERUP', payload: type });
  };

  const getPowerUpIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      slowTime: <Clock className="h-5 w-5" />,
      targetHelper: <Target className="h-5 w-5" />,
      popAll: <Bomb className="h-5 w-5" />,
      doublePoints: <Star className="h-5 w-5" />,
      magnify: <Search className="h-5 w-5" />,
      extraTime: <Clock className="h-5 w-5" />,
      shield: <Shield className="h-5 w-5" />
    };
    return iconMap[type] || <Zap className="h-5 w-5" />;
  };

  const getPowerUpColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      slowTime: 'from-blue-400 to-blue-600',
      targetHelper: 'from-green-400 to-green-600',
      popAll: 'from-red-400 to-red-600',
      doublePoints: 'from-yellow-400 to-yellow-600',
      magnify: 'from-purple-400 to-purple-600',
      extraTime: 'from-cyan-400 to-cyan-600',
      shield: 'from-gray-400 to-gray-600'
    };
    return colorMap[type] || 'from-blue-400 to-blue-600';
  };

  const powerUpDescriptions = {
    slowTime: 'Slows down all balloons for 10 seconds',
    targetHelper: 'Highlights correct balloons with glow',
    popAll: 'Instantly pops all incorrect balloons',
    doublePoints: 'Double points for next 5 correct pops',
    magnify: 'Makes all balloons 50% bigger',
    extraTime: 'Adds 30 seconds to time challenge',
    shield: 'Protects from next 3 wrong answers'
  };

  const activePowerUps = state.powerUps.filter(p => p.active);

  return (
    <div className="space-y-4">
      {/* Active Power-ups Display */}
      {activePowerUps.length > 0 && (
        <Card className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
          <h4 className="font-bold text-yellow-800 mb-2 text-sm">⚡ Active Power-ups</h4>
          <div className="space-y-2">
            {activePowerUps.map((powerUp) => (
              <div key={powerUp.type} className="flex items-center space-x-2">
                <div className="text-yellow-600">
                  {getPowerUpIcon(powerUp.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium capitalize">{powerUp.type.replace(/([A-Z])/g, ' $1')}</span>
                    <span>{Math.ceil(powerUp.remaining)}s</span>
                  </div>
                  <Progress
                    value={(powerUp.remaining / powerUp.duration) * 100}
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Power-up Buttons */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <h4 className="font-bold text-purple-700 mb-3 flex items-center">
          <Zap className="mr-1 h-4 w-4" />
          Power-ups
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {state.powerUps.map((powerUp) => (
            <Button
              key={powerUp.type}
              onClick={() => usePowerUp(powerUp.type)}
              disabled={powerUp.active}
              className={`p-2 text-xs flex flex-col items-center space-y-1 bg-gradient-to-r ${getPowerUpColor(powerUp.type)} text-white hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
            >
              <div className="flex items-center space-x-1">
                {getPowerUpIcon(powerUp.type)}
                <span className="capitalize font-semibold">
                  {powerUp.type.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
              <span className="text-xs opacity-90 text-center leading-tight">
                {powerUpDescriptions[powerUp.type as keyof typeof powerUpDescriptions]}
              </span>
              {powerUp.active && (
                <span className="text-xs bg-white/20 px-1 rounded">ACTIVE</span>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-purple-600 text-center">
          💡 Power-ups recharge automatically as you play!
        </div>
      </Card>
    </div>
  );
};
