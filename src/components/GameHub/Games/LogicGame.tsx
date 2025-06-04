
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Brain, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogicGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const LogicGame: React.FC<LogicGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzleType, setPuzzleType] = useState('pattern');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [puzzleHistory, setPuzzleHistory] = useState<string[]>([]);

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const puzzleTypes = ['pattern', 'sequence', 'logic-grid', 'deduction'];

  const puzzles = {
    easy: {
      pattern: [
        {
          question: "What comes next in the pattern? 2, 4, 6, 8, ?",
          answer: "10",
          explanation: "Adding 2 each time",
          options: ["9", "10", "12", "14"]
        },
        {
          question: "Complete the pattern: A, C, E, G, ?",
          answer: "I",
          explanation: "Every other letter of the alphabet",
          options: ["H", "I", "J", "K"]
        }
      ],
      sequence: [
        {
          question: "What number comes next? 1, 1, 2, 3, 5, ?",
          answer: "8",
          explanation: "Fibonacci sequence: each number is the sum of the two preceding ones",
          options: ["6", "7", "8", "9"]
        }
      ]
    },
    medium: {
      pattern: [
        {
          question: "Find the missing number: 3, 7, 15, 31, ?",
          answer: "63",
          explanation: "Each number is double the previous plus 1",
          options: ["62", "63", "64", "65"]
        }
      ]
    }
  };

  const generatePuzzle = () => {
    const difficultyPuzzles = puzzles[difficulty as keyof typeof puzzles];
    if (!difficultyPuzzles) return;
    
    const typePuzzles = difficultyPuzzles[puzzleType as keyof typeof difficultyPuzzles];
    if (!typePuzzles) return;
    
    const randomPuzzle = typePuzzles[Math.floor(Math.random() * typePuzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    setUserAnswer('');
  };

  useEffect(() => {
    generatePuzzle();
    setHints([
      "Look for mathematical relationships between numbers",
      "Consider patterns in differences or ratios",
      "Think about common sequences (arithmetic, geometric, etc.)",
      "Try to identify the rule that connects all elements"
    ]);
  }, [difficulty, puzzleType]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(time => time - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const handleAnswerSelect = (answer: string) => {
    if (!gameStarted) setGameStarted(true);
    
    const isCorrect = answer === currentPuzzle.answer;
    
    if (isCorrect) {
      setScore(s => s + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) * (streak + 1));
      setStreak(s => s + 1);
      setPuzzleHistory(prev => [...prev, `✅ ${currentPuzzle.question} → ${answer}`]);
    } else {
      setStreak(0);
      setPuzzleHistory(prev => [...prev, `❌ ${currentPuzzle.question} → ${currentPuzzle.answer} (You chose: ${answer})`]);
    }
    
    setTimeout(generatePuzzle, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(120);
    setGameStarted(false);
    setPuzzleHistory([]);
    generatePuzzle();
  };

  const randomizeSettings = () => {
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    setPuzzleType(puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const concepts = [
    {
      title: "Pattern Recognition",
      description: "Learn to identify and extend patterns",
      example: "1. Look for arithmetic progression\n2. Check geometric progression\n3. Consider special sequences\n4. Analyze differences",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Arithmetic Sequences", "Geometric Sequences", "Fibonacci", "Prime Numbers"]
    },
    {
      title: "Logical Reasoning",
      description: "Develop systematic thinking skills",
      example: "Deduction, induction, elimination, hypothesis testing",
      animation: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      relatedTopics: ["Deductive Reasoning", "Inductive Reasoning", "Problem Solving", "Critical Thinking"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-indigo-800">Logic Puzzles</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowConcepts(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Concepts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Puzzle Type</label>
                <Select value={puzzleType} onValueChange={setPuzzleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {puzzleTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={randomizeSettings} className="w-full" variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Random Settings
              </Button>

              <div className="space-y-2">
                <Button onClick={resetGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
                <Button onClick={nextHint} className="w-full" variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Next Hint
                </Button>
                <Button onClick={generatePuzzle} className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Puzzle
                </Button>
              </div>

              <div className="space-y-2 text-center">
                <div className="text-lg font-bold text-indigo-600">⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                <Badge className="bg-indigo-500 text-white">Score: {score}</Badge>
                <Badge variant="outline">Streak: {streak}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="max-w-lg mx-auto text-center space-y-6">
                {currentPuzzle && (
                  <>
                    <div className="bg-indigo-100 p-8 rounded-lg border-2 border-indigo-300">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                      <div className="text-xl font-bold text-indigo-800 mb-4">
                        {currentPuzzle.question}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {currentPuzzle.options.map((option: string, index: number) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          className="h-16 text-xl bg-white border-2 border-indigo-300 text-indigo-800 hover:bg-indigo-50"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>

                    {streak > 0 && (
                      <div className="text-center">
                        <Badge className="bg-green-500 text-white text-lg py-2 px-4">
                          🧠 {streak} correct!
                        </Badge>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Hint:</h4>
                <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Puzzles:</h4>
                <div className="max-h-40 overflow-y-auto text-xs space-y-1">
                  {puzzleHistory.slice(-3).map((puzzle, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      {puzzle}
                    </div>
                  ))}
                  {puzzleHistory.length === 0 && (
                    <p className="text-gray-500 italic">No puzzles solved yet</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Difficulty: <Badge variant="secondary">{difficulty}</Badge></div>
                  <div>Type: <Badge variant="secondary">{puzzleType}</Badge></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Logic Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Look for patterns in numbers</li>
                  <li>• Consider multiple possibilities</li>
                  <li>• Work backwards if stuck</li>
                  <li>• Use process of elimination</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConceptModal
        isOpen={showConcepts}
        onClose={() => setShowConcepts(false)}
        concepts={concepts}
        gameTitle="Logic"
      />
    </div>
  );
};
