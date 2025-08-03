// ShapeGame.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface Shape {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const shapes: Shape[] = [
  { name: 'circle', emoji: '⭕', color: '#ef4444', description: 'Round like a ball' },
  { name: 'square', emoji: '🟦', color: '#3b82f6', description: 'Four equal sides' },
  { name: 'triangle', emoji: '🔺', color: '#10b981', description: 'Three sides and corners' },
  { name: 'rectangle', emoji: '🟨', color: '#f59e0b', description: 'Four sides, opposite sides equal' },
  { name: 'heart', emoji: '❤️', color: '#ec4899', description: 'Shape of love' },
  { name: 'star', emoji: '⭐', color: '#8b5cf6', description: 'Five pointed star' },
  { name: 'diamond', emoji: '💎', color: '#06b6d4', description: 'Sparkling gem shape' },
  { name: 'hexagon', emoji: '⬡', color: '#6366f1', description: 'Six equal sides' },
  { name: 'pentagon', emoji: '🔷', color: '#0ea5e9', description: 'Five sided shape' },
  { name: 'crescent', emoji: '🌙', color: '#f43f5e', description: 'Moon-like shape' },
];

interface Props {
  addScore: (points: number) => void;
  loseHeart: () => void;
}

const ShapeGame: React.FC<Props> = ({ addScore, loseHeart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentShape = shapes[currentIndex];

  const speak = (text: string) => {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};


  useEffect(() => {
    if (currentIndex >= shapes.length) return;

    const distractors = shapes
      .map(s => s.name)
      .filter(name => name !== currentShape.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const mixed = [...distractors, currentShape.name]
      .sort(() => 0.5 - Math.random());

    setOptions(mixed);
    setAnswered(false);

    const timer = setTimeout(() => {
      if (!answered) {
        loseHeart();
        toast.error('Too slow! ⏳');
        setCurrentIndex(prev => prev + 1);
      }
    }, Math.floor(Math.random() * 2000 + 5000)); // 5–7 seconds

    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (currentIndex >= shapes.length) {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
        <div className="text-4xl mb-3 animate-bounce">🌟</div>
        <h3 className="text-xl font-bold mb-2 text-green-700">Shape Expert!</h3>
        <div className="text-sm text-gray-600 mb-4">You've mastered all shapes!</div>
        <Button onClick={() => {
          setCurrentIndex(0);
          setAnswered(false);
        }} className="bg-green-500 hover:bg-green-600">
          Play Again 🔁
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-green-600 mb-2">Learn Shapes</h3>
        <div className="text-sm text-gray-600">Shape {currentIndex + 1} of {shapes.length}</div>
        <Progress value={((currentIndex + 1) / shapes.length) * 100} className="w-full max-w-md mx-auto mt-2" />
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center shadow-lg">
        <div className="text-8xl mb-4 animate-pulse">{currentShape.emoji}</div>
        <div className="text-xl font-bold capitalize mb-2" style={{ color: currentShape.color }}>
          {currentShape.name}
        </div>
        <div className="text-sm text-gray-600 mb-4">{currentShape.description}</div>

        <Button
          onClick={() => speak(`This is a ${currentShape.name}. ${currentShape.description}`)}
          variant="outline"
          className="mb-6 hover:scale-105 transition-transform"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Hear Shape
        </Button>

        <div className="space-y-4">
          <div className="text-lg">What shape is this?</div>
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {options.map((shapeName, i) => (
              <Button
                key={i}
                onClick={() => {
                  setAnswered(true);
                  if (shapeName === currentShape.name) {
                    addScore(15);
                    toast.success('Fantastic! 🎉');
                    speak(`Excellent! This is a ${currentShape.name}`);
                    setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
                  } else {
                    loseHeart();
                    toast.error('Try again!');
                    speak('Oops! That’s not right.');
                  }
                }}
                variant="outline"
                className="text-sm py-3 capitalize hover:scale-105 transition-transform"
              >
                {shapeName}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeGame;
