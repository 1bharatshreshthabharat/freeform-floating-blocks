
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Type, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WordGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const WordGame: React.FC<WordGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameType, setGameType] = useState('anagram');
  const [category, setCategory] = useState('general');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [currentWordHint, setCurrentWordHint] = useState('');

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const gameTypes = ['anagram', 'word-building', 'spelling', 'vocabulary'];
  const categories = ['general', 'animals', 'colors', 'food', 'science', 'history'];

  const wordLists = {
    easy: {
      general: [
        { word: 'HELLO', hint: 'A greeting' },
        { word: 'WORLD', hint: 'The Earth' },
        { word: 'HAPPY', hint: 'Feeling joy' },
        { word: 'SMILE', hint: 'Facial expression of happiness' }
      ],
      animals: [
        { word: 'CAT', hint: 'A feline pet' },
        { word: 'DOG', hint: 'Man\'s best friend' },
        { word: 'BIRD', hint: 'Flying creature' },
        { word: 'FISH', hint: 'Swimming creature' }
      ]
    },
    medium: {
      general: [
        { word: 'COMPUTER', hint: 'Electronic device for processing data' },
        { word: 'LEARNING', hint: 'Acquiring knowledge' },
        { word: 'RAINBOW', hint: 'Colorful arc in the sky' },
        { word: 'MOUNTAIN', hint: 'Large elevated landform' }
      ],
      science: [
        { word: 'GRAVITY', hint: 'Force that pulls objects down' },
        { word: 'OXYGEN', hint: 'Gas we breathe' },
        { word: 'MOLECULE', hint: 'Smallest unit of a compound' }
      ]
    }
  };

  const generateWord = () => {
    const difficultyWords = wordLists[difficulty as keyof typeof wordLists];
    if (!difficultyWords) return;
    
    const categoryWords = difficultyWords[category as keyof typeof difficultyWords] || difficultyWords.general;
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    setCurrentWord(randomWord.word);
    setCurrentWordHint(randomWord.hint);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserGuess('');
  };

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  useEffect(() => {
    generateWord();
    setHints([
      "Look for common letter patterns",
      "Try to identify prefixes and suffixes",
      "Sound out the letters to find familiar combinations",
      "Think about the word category for context clues"
    ]);
  }, [difficulty, category]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(time => time - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const handleSubmit = () => {
    if (!gameStarted) setGameStarted(true);
    
    const isCorrect = userGuess.toUpperCase() === currentWord;
    
    if (isCorrect) {
      setScore(s => s + (currentWord.length * (streak + 1)));
      setStreak(s => s + 1);
      setWordHistory(prev => [...prev, `✅ ${scrambledWord} → ${currentWord}`]);
    } else {
      setStreak(0);
      setWordHistory(prev => [...prev, `❌ ${scrambledWord} → ${currentWord} (You guessed: ${userGuess})`]);
    }
    
    generateWord();
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameStarted(false);
    setWordHistory([]);
    generateWord();
  };

  const randomizeSettings = () => {
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    setGameType(gameTypes[Math.floor(Math.random() * gameTypes.length)]);
    setCategory(categories[Math.floor(Math.random() * categories.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const concepts = [
    {
      title: "Vocabulary Building",
      description: "Strategies for expanding your vocabulary",
      example: "1. Read regularly\n2. Use context clues\n3. Study word roots\n4. Practice daily",
      animation: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      relatedTopics: ["Word Roots", "Context Clues", "Reading Comprehension", "Etymology"]
    },
    {
      title: "Spelling Strategies",
      description: "Techniques for better spelling",
      example: "Sound it out, break into syllables, use memory tricks",
      animation: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      relatedTopics: ["Phonics", "Syllables", "Memory Techniques", "Letter Patterns"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-teal-800">Word Wizard</h1>
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
                <label className="text-sm font-medium mb-2 block">Game Type</label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                <Button onClick={generateWord} className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Word
                </Button>
              </div>

              <div className="space-y-2 text-center">
                <div className="text-lg font-bold text-teal-600">⏰ {timeLeft}s</div>
                <Badge className="bg-teal-500 text-white">Score: {score}</Badge>
                <Badge variant="outline">Streak: {streak}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="max-w-lg mx-auto text-center space-y-6">
                <div className="bg-teal-100 p-8 rounded-lg border-2 border-teal-300">
                  <Type className="h-12 w-12 mx-auto mb-4 text-teal-600" />
                  <div className="text-4xl font-bold text-teal-800 mb-4 tracking-widest">
                    {scrambledWord}
                  </div>
                  <div className="text-sm text-teal-600 bg-white p-2 rounded">
                    Hint: {currentWordHint}
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Enter the unscrambled word"
                    className="text-center text-2xl h-16"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  
                  <Button onClick={handleSubmit} className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl py-4">
                    Submit Word
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
                <p className="text-sm text-gray-600 bg-teal-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Words:</h4>
                <div className="max-h-40 overflow-y-auto text-xs space-y-1">
                  {wordHistory.slice(-5).map((word, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      {word}
                    </div>
                  ))}
                  {wordHistory.length === 0 && (
                    <p className="text-gray-500 italic">No words solved yet</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Difficulty: <Badge variant="secondary">{difficulty}</Badge></div>
                  <div>Type: <Badge variant="secondary">{gameType}</Badge></div>
                  <div>Category: <Badge variant="secondary">{category}</Badge></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Word Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Look for common endings (-ing, -ed, -ly)</li>
                  <li>• Identify vowels first</li>
                  <li>• Think of word patterns</li>
                  <li>• Use the hint as a guide</li>
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
        gameTitle="Word Games"
      />
    </div>
  );
};
