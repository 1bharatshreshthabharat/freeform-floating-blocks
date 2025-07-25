import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Volume2, Check, X, Star } from 'lucide-react';

interface SpellingPhonicGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

const wordsList = [
  // Easy words (3-4 letters)
  { word: 'CAT', phonics: 'C-A-T', category: 'Animals', difficulty: 1, hints: ['Has whiskers', 'Says meow'] },
  { word: 'DOG', phonics: 'D-O-G', category: 'Animals', difficulty: 1, hints: ['Best friend', 'Says woof'] },
  { word: 'SUN', phonics: 'S-U-N', category: 'Nature', difficulty: 1, hints: ['Bright and hot', 'In the sky'] },
  { word: 'TREE', phonics: 'T-R-E-E', category: 'Nature', difficulty: 1, hints: ['Has leaves', 'Grows tall'] },
  
  // Medium words (5-6 letters)
  { word: 'HOUSE', phonics: 'H-OU-S-E', category: 'Places', difficulty: 2, hints: ['Where you live', 'Has a roof'] },
  { word: 'APPLE', phonics: 'A-P-P-L-E', category: 'Food', difficulty: 2, hints: ['Red fruit', 'Grows on trees'] },
  { word: 'FLOWER', phonics: 'F-L-OW-E-R', category: 'Nature', difficulty: 2, hints: ['Beautiful and colorful', 'Bees love them'] },
  
  // Hard words (7+ letters)
  { word: 'ELEPHANT', phonics: 'E-L-E-PH-A-N-T', category: 'Animals', difficulty: 3, hints: ['Very big animal', 'Has a trunk'] },
  { word: 'RAINBOW', phonics: 'R-AI-N-B-OW', category: 'Nature', difficulty: 3, hints: ['Many colors', 'After rain'] }
];

type GameMode = 'spelling' | 'phonics' | 'listening';

export const SpellingPhonicGame: React.FC<SpellingPhonicGameProps> = ({ onBack, onStatsUpdate }) => {
  const [gameMode, setGameMode] = useState<GameMode>('spelling');
  const [currentWord, setCurrentWord] = useState(wordsList[0]);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  useEffect(() => {
    // Load random word
    loadNewWord();
  }, [gameMode]);

  const loadNewWord = () => {
    const availableWords = wordsList.filter(w => w.difficulty <= 2); // Start with easier words
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
    setUserInput('');
    setShowHint(false);
    setCurrentLetterIndex(0);
    setFeedback({ type: null, message: '' });
  };

  const playPhonics = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.phonics);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const playWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    const isCorrect = userInput.toUpperCase() === currentWord.word;
    
    if (isCorrect) {
      const points = currentWord.difficulty * 10 + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setWordsCompleted(prev => {
        const newCount = prev + 1;
        onStatsUpdate({
          totalScore: score + points,
          totalCompleted: newCount,
          currentStreak: streak + 1
        });
        return newCount;
      });
      
      setFeedback({ 
        type: 'success', 
        message: `Excellent! +${points} points ${streak > 0 ? `(${streak + 1}x streak!)` : ''}` 
      });
      
      setTimeout(() => {
        loadNewWord();
      }, 2000);
    } else {
      setStreak(0);
      setFeedback({ 
        type: 'error', 
        message: `Try again! The correct spelling is "${currentWord.word}"` 
      });
    }
  };

  const handleLetterClick = (letter: string) => {
    if (gameMode === 'phonics') {
      if (letter === currentWord.word[currentLetterIndex]) {
        setUserInput(prev => prev + letter);
        setCurrentLetterIndex(prev => prev + 1);
        
        if (currentLetterIndex + 1 === currentWord.word.length) {
          checkAnswer();
        }
      } else {
        setFeedback({ type: 'error', message: 'Try again! Listen to the sound.' });
      }
    }
  };

  const renderSpellingMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Spell the Word</h3>
        <p className="text-gray-600">Category: {currentWord.category}</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl text-center">
        <div className="flex justify-center gap-4 mb-4">
          <Button onClick={playWord} variant="outline" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Word
          </Button>
          <Button onClick={playPhonics} variant="outline" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Phonics
          </Button>
        </div>
        
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          className="w-full max-w-xs mx-auto p-3 text-2xl text-center border-2 border-blue-300 rounded-lg font-bold tracking-widest"
          placeholder="TYPE HERE"
          autoFocus
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600">
          <Check className="h-4 w-4 mr-2" />
          Check Answer
        </Button>
        <Button onClick={() => setShowHint(!showHint)} variant="outline">
          💡 {showHint ? 'Hide' : 'Show'} Hint
        </Button>
      </div>

      {showHint && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
          <p className="text-yellow-800 font-medium">{currentWord.hints[0]}</p>
        </div>
      )}
    </div>
  );

  const renderPhonicMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔤</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Sound It Out</h3>
        <p className="text-gray-600">Click the letters in order</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-xl text-center">
        <Button onClick={playPhonics} className="mb-4 bg-purple-500 hover:bg-purple-600">
          <Volume2 className="h-4 w-4 mr-2" />
          Play Sound: {currentWord.phonics}
        </Button>
        
        <div className="flex justify-center gap-2 mb-4">
          {currentWord.word.split('').map((letter, index) => (
            <div
              key={index}
              className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg ${
                index < currentLetterIndex
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : index === currentLetterIndex
                  ? 'bg-blue-100 border-blue-400 text-blue-800 animate-pulse'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {index < currentLetterIndex ? letter : '?'}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            variant="outline"
            className="h-12 text-lg font-bold hover:bg-blue-50"
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Header */}
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
                <h1 className="text-xl font-bold">Spelling & Phonics</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="font-medium text-yellow-800">Score: {score}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-medium text-green-800">Words: {wordsCompleted}</span>
              </div>
              {streak > 0 && (
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                  <span className="font-medium text-orange-800">🔥 {streak} streak</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Game Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 p-1 rounded-lg shadow-lg">
            <Button
              onClick={() => setGameMode('spelling')}
              variant={gameMode === 'spelling' ? 'default' : 'ghost'}
              size="sm"
            >
              Spelling
            </Button>
            <Button
              onClick={() => setGameMode('phonics')}
              variant={gameMode === 'phonics' ? 'default' : 'ghost'}
              size="sm"
            >
              Phonics
            </Button>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm">
          {gameMode === 'spelling' ? renderSpellingMode() : renderPhonicMode()}

          {/* Feedback */}
          {feedback.type && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              feedback.type === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800'
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {feedback.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <span className="font-medium">{feedback.message}</span>
              </div>
            </div>
          )}

          {/* Skip Button */}
          <div className="mt-6 text-center">
            <Button onClick={loadNewWord} variant="outline" size="sm">
              Skip Word
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};