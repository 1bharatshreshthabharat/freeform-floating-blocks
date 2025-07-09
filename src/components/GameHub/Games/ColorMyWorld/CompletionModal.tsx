
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Trophy, Zap, ArrowRight } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  score: number;
  timeBonus: number;
  hintsUsed: number;
  outlineName: string;
  level: number;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onNext,
  score,
  timeBonus,
  hintsUsed,
  outlineName,
  level
}) => {
  if (!isOpen) return null;

  const getPerformanceRating = () => {
    if (hintsUsed === 0 && timeBonus > 300) return { text: 'Perfect!', color: 'text-yellow-600', icon: Trophy };
    if (hintsUsed <= 1 && timeBonus > 200) return { text: 'Excellent!', color: 'text-purple-600', icon: Star };
    if (hintsUsed <= 2) return { text: 'Great!', color: 'text-blue-600', icon: Zap };
    return { text: 'Good Job!', color: 'text-green-600', icon: Star };
  };

  const rating = getPerformanceRating();
  const IconComponent = rating.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <Card className="max-w-md w-full mx-4 bg-white shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {outlineName} Complete!
            </h2>
            <div className={`text-xl font-semibold ${rating.color} flex items-center justify-center gap-2`}>
              <IconComponent className="h-6 w-6" />
              {rating.text}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700 mb-1">{score}</div>
              <div className="text-sm text-purple-600">Total Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-yellow-700 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">+{timeBonus}</span>
                </div>
                <div className="text-xs text-yellow-600">Speed Bonus</div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-700 font-bold mb-1">
                  {hintsUsed === 0 ? '🏆' : `${hintsUsed}`}
                </div>
                <div className="text-xs text-blue-600">Hints Used</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              size="lg"
            >
              Next Level {level + 1}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Continue Playing
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
