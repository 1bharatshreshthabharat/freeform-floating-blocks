import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const allColors = [
  'red', 'blue', 'yellow', 'green', 'orange', 'purple', 'brown',
  'pink', 'white', 'black', 'cyan', 'magenta', 'lavender', 'teal',
  'lime', 'indigo', 'gray', 'maroon', 'navy', 'turquoise', 'gold',
];

const baseActivities = [
  { color1: 'red', color2: 'blue', result: 'purple' },
  { color1: 'red', color2: 'yellow', result: 'orange' },
  { color1: 'blue', color2: 'yellow', result: 'green' },
  { color1: 'cyan', color2: 'magenta', result: 'blue' },
  { color1: 'green', color2: 'red', result: 'brown' },
  { color1: 'pink', color2: 'blue', result: 'lavender' },
  { color1: 'white', color2: 'black', result: 'gray' },
  { color1: 'blue', color2: 'green', result: 'teal' },
  { color1: 'red', color2: 'black', result: 'maroon' },
  { color1: 'blue', color2: 'black', result: 'navy' },
  { color1: 'blue', color2: 'white', result: 'skyblue' },
  { color1: 'yellow', color2: 'green', result: 'lime' },
  { color1: 'red', color2: 'gold', result: 'orange' },
  { color1: 'cyan', color2: 'yellow', result: 'lime' },
  { color1: 'pink', color2: 'green', result: 'gray' },
  { color1: 'red', color2: 'black', result: 'maroon' },
  { color1: 'cyan', color2: 'white', result: 'teal' },
];

function shuffle(array: any[]) {
  return [...array].sort(() => 0.5 - Math.random());
}

const MixingAnimation = ({ color1, color2, result }: { color1: string; color2: string; result: string }) => {
  return (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <defs>
        <linearGradient id="mixGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color1} />
          <stop offset="50%" stopColor={color2} />
          <stop offset="100%" stopColor={result} />
        </linearGradient>
      </defs>
      <path
        d="M0,60 C50,20 150,100 200,60 L200,100 L0,100 Z"
        fill="url(#mixGradient)"
        className="animate-pulse"
      />
    </svg>
  );
};

export default function ColorActivity({ addScore, loseHeart }: { addScore: (points: number) => void; loseHeart: () => void }) {
  const [activities, setActivities] = useState(() => shuffle(baseActivities));
  const [stage, setStage] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [lives, setLives] = useState(5);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const getOptions = () => {
  const distractors = allColors.filter(c => c !== current.result).sort(() => 0.5 - Math.random()).slice(0, 5);
  return shuffle([...distractors, current.result]);
};

  const current = activities[stage];
  if (!current) return null;

  const speak = (text: string) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isWaiting || stage >= activities.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("⏰ Time's up!");
          speak("Time's up!");
          handleWrongAnswer();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isWaiting]);


  useEffect(() => {
  setTimeLeft(10);
  setShuffledOptions([]); // clear options until timeout triggers

  const shuffleTimer = setTimeout(() => {
    setShuffledOptions(getOptions());
  }, 1000);

  return () => clearTimeout(shuffleTimer);
}, [stage]);


  const handleWrongAnswer = () => {
    loseHeart();
    setLives((prev) => prev - 1);
    setIsWaiting(false);
    if (lives - 1 <= 0) {
      toast.error("💔 Game Over");
    }
  };

  const handleAnswer = (color: string) => {
    if (isWaiting) return;
    setIsWaiting(true);

    const correct = color === current.result;
    const positive = ["Brilliant!", "You got it!", "Magical!", "Fantastic!", "Well done!"];
    const negative = ["Oops! Try again!", "That's not it!", "Try a different color!"];

    if (correct) {
      toast.success(positive[Math.floor(Math.random() * positive.length)]);
      speak(`Correct! ${current.color1} and ${current.color2} make ${current.result}`);
      addScore(20);
      confetti();
      setAnimateResult(true);

      setTimeout(() => {
        setAnimateResult(false);
        setStage(prev => prev + 1);
        setIsWaiting(false);
      }, 2500);
    } else {
      toast.error(negative[Math.floor(Math.random() * negative.length)]);
      speak(`Nope! That's not ${current.result}`);
      handleWrongAnswer();
    }
  };

  const getShuffledOptions = () => {
    const distractors = allColors.filter(c => c !== current.result).sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffle([...distractors, current.result]);
  };

  const handleReplay = () => {
    setActivities(shuffle(baseActivities));
    setStage(0);
    setLives(5);
    setIsWaiting(false);
  };

  if (stage >= activities.length || lives <= 0) {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-2xl shadow-lg">
        <div className="text-5xl mb-3 animate-bounce">🌈</div>
        <h3 className="text-2xl font-bold mb-2 text-purple-700">
          {lives <= 0 ? 'Game Over' : 'Color Wizard!'}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          {lives <= 0 ? 'You ran out of hearts!' : 'You’ve mastered all the color recipes!'}
        </div>
        <Button
          onClick={handleReplay}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 transition"
        >
          🔁 Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
      <h2 className="text-2xl font-bold text-pink-700">
        <span className="inline-block animate-bounce">🎨</span> Color Mixing Magic
      </h2>
        <div className="text-gray-600 text-sm mb-1">Mix {stage + 1} of {activities.length}</div>
        <Progress
          value={((stage + 1) / activities.length) * 100}
          className="w-full max-w-md mx-auto mt-2"
        />

         <div className="flex justify-center items-center gap-4 text-lg my-4">
          {/* Timer Styled Pill */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold shadow-sm">
            ⏰ {timeLeft}s
          </div>

          {/* Heart Display */}
          <div className="flex gap-1 text-2xl">
            {Array.from({ length: lives }, (_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-2xl hover:scale-110 transition-transform"
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
            >
              {soundEnabled ? '🔊' : '🔈'}
            </button>
          </div>

      </div>

      <div className="bg-gradient-to-br from-pink-50 to-purple-100 p-6 rounded-2xl shadow-md text-center">
        <div className="text-lg font-semibold mb-4">
          What color do you get when mixing{' '}
          <span style={{ color: current.color1 }}>{current.color1}</span> and{' '}
          <span style={{ color: current.color2 }}>{current.color2}</span>?
        </div>

       


        {/* Mixing Display */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full border-4 shadow-md" style={{ backgroundColor: current.color1 }} />
          <span className="text-2xl font-bold">+</span>
          <div className="w-14 h-14 rounded-full border-4 shadow-md" style={{ backgroundColor: current.color2 }} />
          <span className="text-2xl font-bold">=</span>
          <div
            className={`w-14 h-14 rounded-full border-4 shadow-md transition-all duration-700 ${animateResult ? 'scale-125 animate-ping bg-gradient-to-r from-white to-transparent' : ''}`}
            style={{ backgroundColor: animateResult ? current.result : 'transparent' }}
          />

     
        </div>

     


        {/* Options */}
       {shuffledOptions.length === 0 ? (
  <div className="text-sm text-gray-500 mt-4">🔄 Shuffling color...</div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto">
    {shuffledOptions.map((color, idx) => (
      <Button
        key={idx}
        onClick={() => handleAnswer(color)}
        disabled={isWaiting}
        className="py-5 capitalize shadow hover:scale-105 transition-transform duration-200"
        variant="outline"
        style={{
          backgroundColor: color,
          color: ['white', 'yellow', 'cyan', 'pink'].includes(color) ? 'black' : 'white'
        }}
      >
        {color}
      </Button>
    ))}
  </div>
)}


        {/* Fluid Mixing Animation */}
        {animateResult && (
          <div className="my-4 flex justify-center items-center">
            <MixingAnimation
              color1={current.color1}
              color2={current.color2}
              result={current.result}
            />
          </div>
        )}
      </div>
    </div>
  );
}
