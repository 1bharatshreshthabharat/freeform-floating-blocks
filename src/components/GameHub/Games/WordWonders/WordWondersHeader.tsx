
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useWordWonders } from './WordWondersProvider';

interface WordWondersHeaderProps {
  onBack: () => void;
}

export const WordWondersHeader: React.FC<WordWondersHeaderProps> = ({ onBack }) => {
  const { speakText } = useWordWonders();
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      speakText('Sound is now on!');
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="text-4xl animate-bounce">📚</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Word Wonders
                </h1>
                <p className="text-sm md:text-base opacity-90">
                  Learn Words While You Play! 🌟
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sound Toggle */}
            <Button
              onClick={handleSoundToggle}
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>

            {/* Floating decorative elements */}
            <div className="hidden md:flex items-center space-x-2 text-2xl">
              <span className="animate-pulse">🎈</span>
              <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🌈</span>
              <span className="animate-pulse" style={{animationDelay: '0.4s'}}>⭐</span>
              <span className="animate-bounce" style={{animationDelay: '0.6s'}}>🎨</span>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-1/4 text-yellow-300 animate-pulse opacity-50">✨</div>
          <div className="absolute top-4 right-1/3 text-pink-300 animate-bounce opacity-50">🎭</div>
          <div className="absolute bottom-2 left-1/3 text-blue-300 animate-pulse opacity-50" style={{animationDelay: '1s'}}>🔤</div>
          <div className="absolute bottom-4 right-1/4 text-green-300 animate-bounce opacity-50" style={{animationDelay: '2s'}}>📖</div>
        </div>
      </div>
    </header>
  );
};
