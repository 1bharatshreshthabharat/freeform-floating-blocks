import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const colorMixingActivities = [
  { id: 'palette', name: 'Palette Mix', color1: 'red', color2: 'blue', result: 'purple', emoji: '🟣', method: 'palette' },
  { id: 'glass', name: 'Glass Mix', color1: 'red', color2: 'yellow', result: 'orange', emoji: '🟠', method: 'glass' },
  { id: 'flask', name: 'Flask Mix', color1: 'blue', color2: 'yellow', result: 'green', emoji: '🟢', method: 'flask' },
  { id: 'brush', name: 'Brush Mix', color1: 'yellow', color2: 'red', result: 'orange', emoji: '🧡', method: 'brush' },
  { id: 'watercolor', name: 'Watercolor Blend', color1: 'blue', color2: 'red', result: 'purple', emoji: '💜', method: 'watercolor' },
  { id: 'digital', name: 'Digital Mix', color1: 'cyan', color2: 'magenta', result: 'blue', emoji: '🔷', method: 'digital' },
  { id: 'spray', name: 'Spray Mix', color1: 'green', color2: 'red', result: 'brown', emoji: '🟤', method: 'spray' },
  { id: 'bubble', name: 'Bubble Mix', color1: 'pink', color2: 'blue', result: 'lavender', emoji: '💠', method: 'bubble' },
];

export default function ColorActivity({ addScore, loseHeart }: { addScore: (points: number) => void; loseHeart: () => void }) {
  const [colorGame, setColorGame] = useState({ currentStage: 0, mixedColors: [], showResult: false });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showMixingAnimation, setShowMixingAnimation] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const currentMix = colorMixingActivities[colorGame.currentStage];

  const [soundEnabled, setSoundEnabled] = useState(true);
const speak = (text: string) => {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};


  if (!currentMix) return null;

  if (colorGame.currentStage >= colorMixingActivities.length) {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
        <div className="text-4xl mb-3 animate-bounce">🎨</div>
        <h3 className="text-xl font-bold mb-2 text-pink-700">Color Master!</h3>
        <div className="text-sm text-gray-600 mb-4">You've mastered all color mixing methods!</div>
        <Button
          onClick={() =>
            setColorGame({ currentStage: 0, mixedColors: [], showResult: false })
          }
          className="bg-pink-500 hover:bg-pink-600"
        >
          Play Again 🔁
        </Button>
      </div>
    );
  }

  const handleAnswer = (color: string) => {
    if (isWaiting) return;
    setIsWaiting(true);
    setShowMixingAnimation(true);
    setTimeout(() => {
      setShowMixingAnimation(false);
      const correct = color === currentMix.result;

      const positiveFeedbacks = ["Great job!", "Nice!", "Perfect! 🌟", "You nailed it!", "Amazing color mixing! 🎨"];
const negativeFeedbacks = ["Try again!", "Wrong one!", "Try a different color!"];
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      if (correct) {
        addScore(20);
        toast.success(getRandom(positiveFeedbacks));
        speak(`Perfect! ${currentMix.color1} and ${currentMix.color2} make ${currentMix.result}`);
        setColorGame(prev => ({
          ...prev,
          mixedColors: [...prev.mixedColors, currentMix.result],
          currentStage: prev.currentStage + 1,
          showResult: true
        }));
      } else {
        loseHeart();
        toast.error(getRandom(negativeFeedbacks));
        speak('Try a different color!');
      }
      setIsWaiting(false);
    }, 4000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-pink-600 mb-2">Color Mixing Magic</h3>
        <div className="text-sm text-gray-600">
          Mix {colorGame.currentStage + 1} of {colorMixingActivities.length}
        </div>
        <Progress value={((colorGame.currentStage + 1) / colorMixingActivities.length) * 100} className="w-full max-w-md mx-auto mt-2" />
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 text-center">
        <div className="text-lg mb-4">Let's mix colors!</div>

        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ backgroundColor: currentMix.color1 }} />
          <span className="text-2xl">+</span>
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ backgroundColor: currentMix.color2 }} />
          <span className="text-2xl">=</span>
          {showMixingAnimation ? <span className="text-2xl animate-bounce">🎨</span> : <span className="text-2xl">?</span>}
        </div>

        <div className="text-lg mb-4">
          What color do you get when you mix{' '}
          <span style={{ color: currentMix.color1 }}>{currentMix.color1}</span> and{' '}
          <span style={{ color: currentMix.color2 }}>{currentMix.color2}</span>?
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          {[currentMix.result, 'black', 'white', 'brown', 'lavender', 'blue']
            .filter((c, i, a) => a.indexOf(c) === i)
            .sort(() => Math.random() - 0.5)
            .map((color, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(color)}
                variant="outline"
                disabled={isWaiting}
                className="text-sm py-6 capitalize hover:scale-105 transition-transform"
                style={{ backgroundColor: color, color: color === 'white' ? 'black' : 'white' }}
              >
                {color}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
