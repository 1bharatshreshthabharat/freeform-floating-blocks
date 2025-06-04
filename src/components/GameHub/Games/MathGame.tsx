
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Calculator, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MathGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const MathGame: React.FC<MathGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentProblem, setCurrentProblem] = useState({ question: '', answer: 0, userAnswer: '' });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [operation, setOperation] = useState('addition');
  const [gameMode, setGameMode] = useState('practice');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [problemHistory, setProblemHistory] = useState<string[]>([]);

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const operations = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];
  const gameModes = ['practice', 'timed', 'challenge', 'word-problems'];

  const generateProblem = () => {
    let num1: number, num2: number, answer: number, question: string;
    
    const range = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : difficulty === 'hard' ? 100 : 500;
    
    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * range) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        question = `${num1} ÷ ${num2} = ?`;
        break;
      default:
        const ops = ['addition', 'subtraction', 'multiplication'];
        return generateProblemForOperation(ops[Math.floor(Math.random() * ops.length)]);
    }
    
    setCurrentProblem({ question, answer, userAnswer: '' });
  };

  const generateProblemForOperation = (op: string) => {
    const oldOperation = operation;
    setOperation(op);
    generateProblem();
    setOperation(oldOperation);
  };

  useEffect(() => {
    generateProblem();
    setHints([
      "Break down complex problems into smaller steps",
      "Use mental math shortcuts when possible",
      "Double-check your calculations",
      "Look for patterns in numbers"
    ]);
  }, [difficulty, operation]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && gameMode === 'timed') {
      timer = setTimeout(() => setTimeLeft(time => time - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameMode]);

  const handleSubmit = () => {
    if (!gameStarted) setGameStarted(true);
    
    const userNum = parseInt(currentProblem.userAnswer);
    const isCorrect = userNum === currentProblem.answer;
    
    if (isCorrect) {
      setScore(s => s + (streak + 1) * 10);
      setStreak(s => s + 1);
      setProblemHistory(prev => [...prev, `✅ ${currentProblem.question} = ${currentProblem.answer}`]);
    } else {
      setStreak(0);
      setProblemHistory(prev => [...prev, `❌ ${currentProblem.question} = ${currentProblem.answer} (You answered: ${userNum})`]);
    }
    
    generateProblem();
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameStarted(false);
    setProblemHistory([]);
    generateProblem();
  };

  const randomizeSettings = () => {
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    setOperation(operations[Math.floor(Math.random() * operations.length)]);
    setGameMode(gameModes[Math.floor(Math.random() * gameModes.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const concepts = [
    {
      title: "Mental Math Strategies",
      description: "Learn techniques for faster mental calculations",
      example: "1. Breaking down numbers\n2. Using multiples of 10\n3. Estimation first\n4. Pattern recognition",
      animation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      relatedTopics: ["Number Sense", "Estimation", "Patterns", "Quick Calculations"]
    },
    {
      title: "Problem Solving Steps",
      description: "Systematic approach to solving math problems",
      example: "1. Read carefully\n2. Identify what's asked\n3. Choose strategy\n4. Solve and check",
      animation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      relatedTopics: ["Problem Analysis", "Strategy Selection", "Verification", "Critical Thinking"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-orange-800">Math Master</h1>
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
                <label className="text-sm font-medium mb-2 block">Operation</label>
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operations.map(op => (
                      <SelectItem key={op} value={op}>
                        {op.charAt(0).toUpperCase() + op.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={gameMode} onValueChange={setGameMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameModes.map(mode => (
                      <SelectItem key={mode} value={mode}>
                        {mode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                <Button onClick={generateProblem} className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Problem
                </Button>
              </div>

              <div className="space-y-2 text-center">
                {gameMode === 'timed' && (
                  <div className="text-lg font-bold text-red-600">⏰ {timeLeft}s</div>
                )}
                <Badge className="bg-orange-500 text-white">Score: {score}</Badge>
                <Badge variant="outline">Streak: {streak}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="max-w-lg mx-auto text-center space-y-6">
                <div className="bg-orange-100 p-8 rounded-lg border-2 border-orange-300">
                  <div className="text-4xl font-bold text-orange-800 mb-4">
                    <Calculator className="h-12 w-12 mx-auto mb-4" />
                    {currentProblem.question}
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    type="number"
                    value={currentProblem.userAnswer}
                    onChange={(e) => setCurrentProblem(prev => ({ ...prev, userAnswer: e.target.value }))}
                    placeholder="Enter your answer"
                    className="text-center text-2xl h-16"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  
                  <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-4">
                    Submit Answer
                  </Button>
                </div>

                {streak > 0 && (
                  <div className="text-center">
                    <Badge className="bg-green-500 text-white text-lg py-2 px-4">
                      🔥 {streak} in a row!
                    </Badge>
                  </div>
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
                <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Problems:</h4>
                <div className="max-h-40 overflow-y-auto text-xs space-y-1">
                  {problemHistory.slice(-5).map((problem, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      {problem}
                    </div>
                  ))}
                  {problemHistory.length === 0 && (
                    <p className="text-gray-500 italic">No problems solved yet</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Difficulty: <Badge variant="secondary">{difficulty}</Badge></div>
                  <div>Operation: <Badge variant="secondary">{operation}</Badge></div>
                  <div>Mode: <Badge variant="secondary">{gameMode}</Badge></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Quick Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use estimation to check answers</li>
                  <li>• Break large numbers into smaller parts</li>
                  <li>• Practice times tables regularly</li>
                  <li>• Look for patterns in problems</li>
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
        gameTitle="Math"
      />
    </div>
  );
};
