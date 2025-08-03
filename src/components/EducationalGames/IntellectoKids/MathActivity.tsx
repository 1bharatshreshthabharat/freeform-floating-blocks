// Updated MathActivity.tsx with adaptive learning and geometry icons
import React, { useEffect, useState, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MathGameState {
  currentActivity: string;
  currentNumber: number;
  question: number;
  totalQuestions: number;
}

interface Props {
  level: number;
  mathGame: MathGameState;
  setMathGame: React.Dispatch<React.SetStateAction<MathGameState>>;
  addScore: (points: number) => void;
  loseHeart: () => void;
  speak: (text: string) => void;
}

const MAX_LEVEL = 10;
const PAGE_SIZE = 4;
const QUESTIONS_PER_LEVEL = 5;

const shapeIcons: Record<string, string> = {
  triangle: '🔺',
  rectangle: '▭',
  circle: '⚫',
  square: '◼️',
};

const adaptiveWeights: Record<string, number> = {
  triangle: 1,
  rectangle: 1,
  circle: 1,
  square: 1,
  equation: 1,
  power: 1,
  fraction: 1,
  percentage: 1,
};

const recordMistake = (topic: string) => {
  adaptiveWeights[topic] = Math.min(adaptiveWeights[topic] + 1, 5);
};

const resetMistake = (topic: string) => {
  adaptiveWeights[topic] = Math.max(adaptiveWeights[topic] - 1, 1);
};

const weightedRandom = (topics: string[]) => {
  const weighted = topics.flatMap((topic) => Array(adaptiveWeights[topic]).fill(topic));
  return weighted[Math.floor(Math.random() * weighted.length)];
};

const generateMathProblem = (level: number, activity: string) => {
  let a, b, c;
  let display: string;
  let answer: number;
  let icon: string | undefined = undefined;

  const useNegative = level >= 4;
  const useMultiOp = level >= 5;
  const usePercentage = level >= 6;
  const useBigNumber = level >= 6;
  const useFractions = level >= 7;
  const usePowers = level >= 8;
  const useEquations = level >= 9;
  const useGeometry = level >= 10;

  const getNum = (range: number) => {
    const base = Math.floor(Math.random() * range) + 1;
    return useNegative && Math.random() > 0.5 ? -base : base;
  };

  const format = (x: number) => (x < 0 ? `(${x})` : x);
  const safeDivide = (x: number, y: number) => (y === 0 ? 1 : Math.floor(x / y));
  const operations = ['+', '-', '×', '÷'];

  if (useGeometry && Math.random() < 0.2) {
    const shape = weightedRandom(['triangle', 'rectangle', 'circle', 'square']);
    icon = shapeIcons[shape];
    switch (shape) {
      case 'triangle':
        a = getNum(10);
        b = getNum(10);
        answer = 0.5 * a * b;
        display = `${icon} Area of triangle with base ${a} and height ${b}`;
        break;
      case 'rectangle':
        a = getNum(15);
        b = getNum(15);
        answer = a * b;
        display = `${icon} Area of rectangle with length ${a} and breadth ${b}`;
        break;
      case 'circle':
        a = getNum(10);
        answer = Math.round(Math.PI * a * a);
        display = `${icon} Area of circle with radius ${a}`;
        break;
      case 'square':
        a = getNum(12);
        answer = a * a;
        display = `${icon} Area of square with side ${a}`;
        break;
    }
    return { display, answer: Math.round(answer), topic: shape };
  }

  if (useEquations && Math.random() < 0.2) {
    a = getNum(10);
    b = getNum(10);
    answer = getNum(10);
    c = a * answer + b;
    display = `Solve: ${a}x + ${b} = ${c}`;
    return { display, answer, topic: 'equation' };
  }

  if (usePowers && Math.random() < 0.3) {
    a = getNum(5);
    b = 2;
    answer = Math.pow(a, b);
    display = `${a} squared`;
    return { display, answer, topic: 'power' };
  }

  if (useFractions && Math.random() < 0.3) {
    a = getNum(10);
    b = getNum(10);
    answer = +(a / b).toFixed(2);
    display = `${a} ÷ ${b} (Answer to 2 decimals)`;
    return { display, answer, topic: 'fraction' };
  }

  if (usePercentage && Math.random() < 0.3) {
    a = getNum(100);
    b = getNum(50);
    answer = Math.round((a * b) / 100);
    display = `${b}% of ${a}`;
    return { display, answer, topic: 'percentage' };
  }

  if (activity === 'division') {
    b = getNum(10);
    answer = getNum(10);
    a = answer * b;
    display = `${a} ÷ ${b}`;
  } else {
    a = getNum(useBigNumber ? 50 : 20);
    b = getNum(useBigNumber ? 50 : 20);
    let op1 = operations[Math.floor(Math.random() * operations.length)];
    let intermediate;
    switch (op1) {
      case '+': intermediate = a + b; break;
      case '-': intermediate = a - b; break;
      case '×': intermediate = a * b; break;
      case '÷': intermediate = safeDivide(a, b); a = intermediate * b; break;
    }

    if (useMultiOp) {
      c = getNum(useBigNumber ? 30 : 10);
      let op2 = operations[Math.floor(Math.random() * operations.length)];
      switch (op2) {
        case '+': answer = intermediate + c; break;
        case '-': answer = intermediate - c; break;
        case '×': answer = intermediate * c; break;
        case '÷': answer = safeDivide(intermediate, c); break;
      }
      display = `(${format(a)} ${op1} ${format(b)}) ${op2} ${format(c)}`;
    } else {
      answer = intermediate;
      display = `${format(a)} ${op1} ${format(b)}`;
    }
  }

  return { display, answer };
};

const getHint = (topic: string, question: string) => {
  switch (topic) {
    case 'triangle': return 'Area = ½ × base × height';
    case 'rectangle': return 'Area = length × breadth';
    case 'circle': return 'Area = π × r² (use 3.14)';
    case 'square': return 'Area = side × side';
    case 'equation': return 'Use reverse operations to isolate x';
    case 'power': return 'Power means multiplication, e.g., a² = a × a';
    case 'fraction': return 'Divide numerator by denominator';
    case 'percentage': return 'Find % by (number × percent) ÷ 100';
    default: return 'Break down and solve step-by-step';
  }
};

const ShapeDiagram: React.FC<{ shape: string }> = ({ shape }) => {
  if (shape === 'triangle') {
    return <svg width="60" height="50"><polygon points="0,50 30,0 60,50" fill="#4ade80" /></svg>;
  }
  if (shape === 'rectangle') {
    return <svg width="80" height="50"><rect width="80" height="50" fill="#60a5fa" /></svg>;
  }
  if (shape === 'square') {
    return <svg width="50" height="50"><rect width="50" height="50" fill="#facc15" /></svg>;
  }
  if (shape === 'circle') {
    return <svg width="60" height="60"><circle cx="30" cy="30" r="25" fill="#f87171" /></svg>;
  }
  return null;
};


const MathActivity: React.FC<Props> = ({
  level,
  mathGame,
  setMathGame,
  addScore,
  loseHeart,
  speak,
}) => {
  const { currentActivity, question, totalQuestions } = mathGame;
  const [correctStreak, setCorrectStreak] = useState(0);
  const [challengeLevel, setChallengeLevel] = useState(level || 1);
  const [currentProblem, setCurrentProblem] = useState(() => generateMathProblem(1, currentActivity));
  const [showResult, setShowResult] = useState(false);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [questionResolved, setQuestionResolved] = useState(false);

  const baseTimeLimit = 10;
  const timeLimit = Math.max(baseTimeLimit - challengeLevel, 3);
  const delayForLevel = challengeLevel >= 6 ? 5000 : challengeLevel >= 5 ? 6000 : challengeLevel >= 3 ? 8000 : 2500;

  useEffect(() => {
    if (gameOver || gameCompleted || answerLocked) return;

    const answerTimeout = setTimeout(() => {
      if (!answerLocked) {
        setLives(l => {
          const newLives = Math.max(l - 1, 0);
          if (newLives === 0) {
            setGameOver(true);
            setGameCompleted(false);
          }
          return newLives;
        });
        loseHeart();
        if (soundEnabled) speak("Time's up!");
        toast.error("⏰ Time's up!");
        setAnswerLocked(true);

        setHistory(h => [
          ...h,
          {
            question: currentProblem.display,
            userAnswer: null,
            correctAnswer: currentProblem.answer,
            isCorrect: false,
          },
        ]);

        setTimeout(() => {
          if (!gameOver) {
            setCurrentProblem(generateMathProblem(challengeLevel, currentActivity));
            setTimeLeft(timeLimit);
            setShowResult(false);
            setAnswerLocked(false);
            setQuestionResolved(false);
            setMathGame(prev => ({ ...prev, question: prev.question + 1 }));
          }
        }, 1500);
      }
    }, timeLimit * 1000);

    return () => clearTimeout(answerTimeout);
  }, [currentProblem, timeLimit, gameOver, gameCompleted, answerLocked, currentActivity, challengeLevel]);

  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      setGameOver(true);
      setGameCompleted(false);
    }
  }, [lives, gameOver]);

  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (gameOver || gameCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, gameCompleted]);

  const generateOptions = (correct: number) => {
    const deltas = [-10, -5, -1, 1, 5, 10];
    const uniqueOptions = new Set<number>([correct]);
    while (uniqueOptions.size < 4) {
      const wrong = correct + deltas[Math.floor(Math.random() * deltas.length)] + Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
      uniqueOptions.add(wrong);
    }
    return Array.from(uniqueOptions).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (num: number) => {
    if (answerLocked || questionResolved || gameOver) return;
    setAnswerLocked(true);
    setQuestionResolved(true);

    const isCorrect = num === currentProblem.answer;
    setUserAnswer(num);

    setHistory(h => [...h, {
      question: currentProblem.display,
      userAnswer: num,
      correctAnswer: currentProblem.answer,
      isCorrect
    }]);

    setShowResult(true);

    if (isCorrect) {
      addScore(15 + timeLeft * 2 + challengeLevel * 5);
      if (soundEnabled) speak(`Correct! ${currentProblem.display} equals ${currentProblem.answer}`);
      confetti();
      toast.success('🎉 Correct!');
      setCorrectStreak(s => {
        const newStreak = s + 1;
        if (newStreak % 5 === 0) {
          setChallengeLevel(l => Math.min(l + 1, MAX_LEVEL));
        }
        return newStreak;
      });
    } else {
      setLives(l => Math.max(l - 1, 0));
      loseHeart();
      if (soundEnabled) speak('Try again!');
      toast.error('❌ Try again!');
      setCorrectStreak(0);
    }

    setTimeout(() => {
      if (question < totalQuestions && lives > 0) {
        setMathGame(prev => ({ ...prev, question: prev.question + 1 }));
        setCurrentProblem(generateMathProblem(challengeLevel, currentActivity));
        setTimeLeft(timeLimit);
        setShowResult(false);
        setAnswerLocked(false);
        setQuestionResolved(false);
      } else if (question >= totalQuestions && lives > 0) {
        toast.success('🎓 Math mastery achieved!');
        addScore(100);
        setGameCompleted(true);
        setGameOver(true);
      }
    }, delayForLevel);
  };

  const handlePlayAgain = () => {
    const resetLevel = 1;
    const newProblem = generateMathProblem(resetLevel, currentActivity);
    const newTimeLimit = Math.max(baseTimeLimit - resetLevel, 3);

    setLives(3);
    setCorrectStreak(0);
    setChallengeLevel(resetLevel);
    setCurrentProblem(newProblem);
    setTimeLeft(newTimeLimit);
    setShowResult(false);
    setAnswerLocked(false);
    setGameCompleted(false);
    setGameOver(false);
    setMathGame(prev => ({ ...prev, question: 1 }));
    setHistory([]);
    setPage(0);
  };

  const options = useMemo(() => generateOptions(currentProblem.answer), [currentProblem]);
  const paginatedHistory = history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // UI rendering remains same, ensure history uses bg-green-50 / bg-red-50 and disable answers until feedback
  return (
    <div className={`grid p-4 gap-4 ${gameOver ? 'grid-cols-1' : 'lg:grid-cols-4'}`}>
      <div className={`${gameOver ? 'col-span-1' : 'lg:col-span-3'} space-y-6`}>
        {/* Game UI and logic retained */}

         <div className="lg:col-span-3 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-emerald-700">
            {currentActivity === 'addition' && 'Addition & Subtraction'}
            {currentActivity === 'multiplication' && 'Times Tables'}
            {currentActivity === 'division' && 'Division'}
            {currentActivity === 'mixed' && 'Mixed Operations'}
          </h3>
           <div className="font-semibold text-sm text-emerald-800">Level {challengeLevel}</div>
          <Progress value={(question / totalQuestions) * 100} className="max-w-md mx-auto mt-2" />
          <br></br>
              <div className="font-semibold text-sm text-gray-600">Question {question} / {totalQuestions}</div>
        </div>

         {/* Controls */}
        <div className="flex justify-center gap-6 items-center text-xl">
          <span className={`px-4 py-2 rounded-full shadow ${
            timeLeft <= 3 ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'
          }`}>
            ⏰ {timeLeft}s
          </span>
          <span className="text-red-600 text-2xl">{'❤️'.repeat(lives)}</span>
          <button onClick={() => setSoundEnabled(p => !p)}>{soundEnabled ? '🔊' : '🔇'}</button>
        </div>

        {/* MAIN QUESTION */}
       {!gameOver && (
        <div className="bg-emerald-100 rounded-xl p-6 text-center shadow">
            {['triangle', 'rectangle', 'circle', 'square'].includes(currentProblem.topic) && (
  <div className="flex justify-center mb-2">
    <ShapeDiagram shape={currentProblem.topic} />
  </div>
)}
          <div className="text-4xl font-black text-emerald-800 mb-4">{currentProblem.display} = ?</div>
          {showResult && (
            <div className="text-2xl font-bold text-green-700 animate-fade-in">
              🎯 {currentProblem.answer}
            </div>
          )}
          {!gameOver && (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {options.map((num) => (
                
  <motion.button
    key={num}
    onClick={() => handleAnswer(num)}
    disabled={answerLocked}
    className={`py-3 rounded-xl text-xl font-bold shadow transition-all
  ${answerLocked
    ? num === currentProblem.answer
      ? 'bg-green-200'
      : num === userAnswer
        ? 'bg-red-200'
        : 'bg-gray-200'
    : 'bg-white hover:bg-green-100'}`}

    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {num}
  </motion.button>
))}

          </div>
          )}
        </div>
         )}

        {/* Game Over / Completion */}
       {gameOver && (
          <div className="bg-emerald-100 rounded-xl p-6 text-center shadow">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              {gameCompleted ? '🎉 You Completed the Game!' : '💀 Game Over'}
            </h2>
            <Button onClick={handlePlayAgain}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl">Play Again</Button>
          </div>
        )}
      </div>

      </div>
      <div className="bg-white p-4 rounded-xl shadow max-h-[80vh] overflow-auto">
        <h4 className="text-lg font-semibold mb-2">🕓 History</h4>
        <AnimatePresence mode="wait">
          {paginatedHistory.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-2 rounded-lg mb-2 ${item.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <div className="font-semibold">{item.question}</div>
              <div className="text-sm">
                You: <b>{item.userAnswer ?? '⏰'}</b> | Correct: <b>{item.correctAnswer}</b>
              </div>
              <div className="text-xs text-gray-600 mt-1 italic">Solved as: {item.question} = {item.correctAnswer}</div>
            </motion.div>
          ))}
        </AnimatePresence>


  <div className="flex justify-between items-center mt-4">
    <Button disabled={page === 0} onClick={() => setPage(p => p - 1)} variant="ghost" size="sm">
      <ChevronLeft className="w-4 h-4" /> Prev
    </Button>
    <Button
      disabled={(page + 1) * PAGE_SIZE >= history.length}
      onClick={() => setPage(p => p + 1)}
      variant="ghost"
      size="sm"
    >
      Next <ChevronRight className="w-4 h-4" />
    </Button>
  </div>


      </div>
    </div>
  );
};

export default MathActivity;
