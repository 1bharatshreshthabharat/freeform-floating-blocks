import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Volume2, VolumeX, Heart } from 'lucide-react';
import { useSpellingPhonicGame } from './SpellingPhonicGameProvider';

interface SpellingGameHeaderProps {
  onBack: () => void;
}

export const SpellingGameHeader: React.FC<SpellingGameHeaderProps> = ({ onBack }) => {
  const { state, toggleSound } = useSpellingPhonicGame();

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Advanced Spelling & Phonics</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {Array.from({length: 5}).map((_, i) => (
                <Heart key={i} className={`h-5 w-5 ${i < state.lives ? 'text-red-500' : 'text-gray-300'}`} />
              ))}
            </div>
            <Button
              onClick={toggleSound}
              variant="ghost"
              size="sm"
            >
              {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};