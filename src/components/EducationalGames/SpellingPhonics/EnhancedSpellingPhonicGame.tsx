import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Volume2, VolumeX, Trophy, Star, Zap, Heart, Target } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedSpellingPhonicGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Word {
  word: string;
  phonics: string[];
  category: string;
  difficulty: number;
  definition: string;
  example: string;
  image?: string;
  rhymes?: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const wordDatabase: Word[] = [
  // Easy words (Level 1)
  { word: 'cat', phonics: ['c', 'a', 't'], category: 'Animals', difficulty: 1, definition: 'A small furry pet animal', example: 'The cat is sleeping.' },
  { word: 'dog', phonics: ['d', 'o', 'g'], category: 'Animals', difficulty: 1, definition: 'A loyal pet animal', example: 'The dog barks loudly.' },
  { word: 'sun', phonics: ['s', 'u', 'n'], category: 'Nature', difficulty: 1, definition: 'The bright star in our sky', example: 'The sun is shining today.' },
  { word: 'red', phonics: ['r', 'e', 'd'], category: 'Colors', difficulty: 1, definition: 'A warm color like fire', example: 'The apple is red.' },
  { word: 'big', phonics: ['b', 'i', 'g'], category: 'Adjectives', difficulty: 1, definition: 'Large in size', example: 'The elephant is big.' },
  
  // Medium words (Level 2)
  { word: 'house', phonics: ['h', 'ou', 's', 'e'], category: 'Objects', difficulty: 2, definition: 'A building where people live', example: 'We live in a house.' },
  { word: 'chair', phonics: ['ch', 'ai', 'r'], category: 'Furniture', difficulty: 2, definition: 'Something to sit on', example: 'Please sit on the chair.' },
  { word: 'phone', phonics: ['ph', 'o', 'n', 'e'], category: 'Technology', difficulty: 2, definition: 'Device for talking to people', example: 'Answer the phone please.' },
  { word: 'snake', phonics: ['s', 'n', 'a', 'k', 'e'], category: 'Animals', difficulty: 2, definition: 'A long reptile without legs', example: 'The snake slithers on the ground.' },
  { word: 'smile', phonics: ['s', 'm', 'i', 'l', 'e'], category: 'Actions', difficulty: 2, definition: 'Happy expression on face', example: 'She has a beautiful smile.' },
  
  // Hard words (Level 3)
  { word: 'elephant', phonics: ['e', 'l', 'e', 'ph', 'a', 'n', 't'], category: 'Animals', difficulty: 3, definition: 'Large gray mammal with trunk', example: 'The elephant has big ears.' },
  { word: 'beautiful', phonics: ['b', 'eau', 't', 'i', 'f', 'u', 'l'], category: 'Adjectives', difficulty: 3, definition: 'Very pretty or attractive', example: 'The flower is beautiful.' },
  { word: 'butterfly', phonics: ['b', 'u', 'tt', 'er', 'f', 'l', 'y'], category: 'Insects', difficulty: 3, definition: 'Colorful flying insect', example: 'The butterfly landed on the flower.' },
  { word: 'playground', phonics: ['p', 'l', 'ay', 'g', 'r', 'ou', 'n', 'd'], category: 'Places', difficulty: 3, definition: 'Place where children play', example: 'We go to the playground.' },
  { word: 'adventure', phonics: ['a', 'd', 'v', 'e', 'n', 't', 'u', 'r', 'e'], category: 'Activities', difficulty: 3, definition: 'Exciting journey or experience', example: 'We had a great adventure.' }
];

const initialAchievements: Achievement[] = [
  { id: 'first_word', name: 'First Word', description: 'Spell your first word correctly', icon: '🌟', unlocked: false },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Get 100% on any level', icon: '🏆', unlocked: false },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a word in under 5 seconds', icon: '⚡', unlocked: false },
  { id: 'phonics_master', name: 'Phonics Master', description: 'Master all phonics sounds', icon: '🎓', unlocked: false },
  { id: 'streak_master', name: 'Streak Master', description: 'Get 10 words correct in a row', icon: '🔥', unlocked: false }
];

export const EnhancedSpellingPhonicGame: React.FC<EnhancedSpellingPhonicGameProps> = ({ onBack, onStatsUpdate }) => {
  const [currentWord, setCurrentWord] = useState<Word>(wordDatabase[0]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameMode, setGameMode] = useState<'spelling' | 'phonics' | 'listening'>('spelling');
  const [difficulty, setDifficulty] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [totalWordsAttempted, setTotalWordsAttempted] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [wordStartTime, setWordStartTime] = useState(Date.now());
  const [gameLevel, setGameLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [selectedPhonics, setSelectedPhonics] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // Load new word based on difficulty
  const loadNewWord = useCallback(() => {
    const wordsOfDifficulty = wordDatabase.filter(w => w.difficulty === difficulty);
    const randomWord = wordsOfDifficulty[Math.floor(Math.random() * wordsOfDifficulty.length)];
    setCurrentWord(randomWord);
    setUserInput('');
    setSelectedPhonics([]);
    setShowHint(false);
    setWordStartTime(Date.now());
    
    // Generate available letters for phonics mode
    const wordLetters = randomWord.word.split('');
    const extraLetters = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    const shuffledExtra = extraLetters.filter(l => !wordLetters.includes(l)).sort(() => Math.random() - 0.5).slice(0, 8);
    setAvailableLetters([...wordLetters, ...shuffledExtra].sort(() => Math.random() - 0.5));
  }, [difficulty]);

  useEffect(() => {
    loadNewWord();
  }, [loadNewWord]);

  // Text-to-speech functions
  const speak = (text: string, rate: number = 1) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const playWord = () => speak(currentWord.word, 0.8);
  const playPhonics = () => speak(currentWord.phonics.join(' '), 0.6);
  const playDefinition = () => speak(currentWord.definition, 0.9);

  // Check spelling answer
  const checkSpelling = () => {
    const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase();
    const timeTaken = Date.now() - wordStartTime;
    
    setTotalWordsAttempted(prev => prev + 1);
    
    if (isCorrect) {
      const basePoints = difficulty * 10;
      const timeBonus = timeTaken < 5000 ? 20 : timeTaken < 10000 ? 10 : 0;
      const streakBonus = streak >= 5 ? 15 : 0;
      const totalPoints = basePoints + timeBonus + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setCorrectWords(prev => prev + 1);
      setExperiencePoints(prev => prev + totalPoints);
      setFeedback(`Excellent! +${totalPoints} points`);
      
      // Check for achievements
      checkAchievements(timeTaken, streak + 1);
      
      // Level progression
      if (experiencePoints + totalPoints >= gameLevel * 100) {
        setGameLevel(prev => prev + 1);
        toast.success(`Level Up! You're now level ${gameLevel + 1}!`);
        setLives(prev => Math.min(prev + 1, 5)); // Bonus life
      }
      
      setTimeout(() => {
        loadNewWord();
        setFeedback('');
      }, 2000);
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
      setFeedback(`Try again! The word is "${currentWord.word}"`);
      speak(`Try again! The word is ${currentWord.word}`);
      
      if (lives - 1 <= 0) {
        toast.error("Game Over! Starting new game...");
        resetGame();
      }
    }
    
    onStatsUpdate({
      totalScore: score,
      totalWordsAttempted,
      correctWords,
      streak,
      accuracy: totalWordsAttempted > 0 ? (correctWords / totalWordsAttempted * 100).toFixed(1) : 0
    });
  };

  // Check phonics answer
  const handlePhonicsSelection = (letter: string) => {
    const newSelected = [...selectedPhonics, letter];
    setSelectedPhonics(newSelected);
    
    if (newSelected.join('') === currentWord.word) {
      setScore(prev => prev + difficulty * 15);
      setStreak(prev => prev + 1);
      setCorrectWords(prev => prev + 1);
      setFeedback('Perfect phonics! Well done!');
      setTimeout(() => {
        loadNewWord();
        setFeedback('');
      }, 2000);
    } else if (newSelected.length >= currentWord.word.length) {
      setStreak(0);
      setLives(prev => prev - 1);
      setFeedback('Not quite right. Try again!');
      setSelectedPhonics([]);
    }
  };

  // Check achievements
  const checkAchievements = (timeTaken: number, currentStreak: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      switch (achievement.id) {
        case 'first_word':
          if (correctWords === 1) {
            toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`);
            return { ...achievement, unlocked: true };
          }
          break;
        case 'speed_demon':
          if (timeTaken < 5000) {
            toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`);
            return { ...achievement, unlocked: true };
          }
          break;
        case 'streak_master':
          if (currentStreak >= 10) {
            toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`);
            return { ...achievement, unlocked: true };
          }
          break;
        case 'perfect_score':
          if (totalWordsAttempted >= 10 && (correctWords / totalWordsAttempted) === 1) {
            toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`);
            return { ...achievement, unlocked: true };
          }
          break;
      }
      return achievement;
    }));
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setLives(5);
    setTotalWordsAttempted(0);
    setCorrectWords(0);
    setGameLevel(1);
    setExperiencePoints(0);
    loadNewWord();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  };

  const progressToNextLevel = () => {
    return ((experiencePoints % (gameLevel * 100)) / (gameLevel * 100)) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
                <h1 className="text-xl font-bold">Advanced Spelling & Phonics</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {Array.from({length: 5}).map((_, i) => (
                  <Heart key={i} className={`h-5 w-5 ${i < lives ? 'text-red-500' : 'text-gray-300'}`} />
                ))}
              </div>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="sm"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
          <Card className="lg:col-span-1 p-4 space-y-4">
            {/* Player Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">Level {gameLevel}</div>
                <Progress value={progressToNextLevel()} className="mt-2 bg-white/20" />
                <div className="text-sm mt-1">{experiencePoints % (gameLevel * 100)}/{gameLevel * 100} XP</div>
              </div>
            </div>

            {/* Game Mode Selection */}
            <div>
              <h3 className="font-bold mb-2">Game Mode</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setGameMode('spelling')}
                  variant={gameMode === 'spelling' ? 'default' : 'outline'}
                  className="w-full"
                >
                  ✏️ Spelling
                </Button>
                <Button
                  onClick={() => setGameMode('phonics')}
                  variant={gameMode === 'phonics' ? 'default' : 'outline'}
                  className="w-full"
                >
                  🔤 Phonics
                </Button>
                <Button
                  onClick={() => setGameMode('listening')}
                  variant={gameMode === 'listening' ? 'default' : 'outline'}
                  className="w-full"
                >
                  👂 Listening
                </Button>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="font-bold mb-2">Difficulty</h3>
              <div className="space-y-2">
                {[1, 2, 3].map(level => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {level === 1 ? '🌱 Easy' : level === 2 ? '🌳 Medium' : '🚀 Hard'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Game Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-blue-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak:</span>
                  <span className="font-bold text-green-600">{streak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold text-purple-600">
                    {totalWordsAttempted > 0 ? Math.round((correctWords / totalWordsAttempted) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="font-semibold mb-2">Achievements</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-2 rounded text-xs ${achievement.unlocked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{achievement.icon}</span>
                      <div>
                        <div className="font-semibold">{achievement.name}</div>
                        <div className="text-xs">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Main Game Area */}
          <Card className="lg:col-span-3 p-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold mb-2">
                  {gameMode === 'spelling' ? 'Spell the Word' : 
                   gameMode === 'phonics' ? 'Build with Phonics' : 'Listen and Type'}
                </h2>
                <div className="text-lg">
                  Category: <span className="font-semibold">{currentWord.category}</span>
                </div>
              </div>

              {/* Word Display */}
              <div className="mb-6">
                {gameMode !== 'listening' && (
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {currentWord.word.toUpperCase()}
                  </div>
                )}
                
                <div className="flex justify-center gap-4 mb-4">
                  <Button onClick={playWord} variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Hear Word
                  </Button>
                  <Button onClick={playPhonics} variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Hear Sounds
                  </Button>
                  <Button onClick={playDefinition} variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Definition
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="font-semibold text-blue-800">Definition:</div>
                  <div className="text-blue-700">{currentWord.definition}</div>
                  <div className="text-sm text-blue-600 mt-1">
                    <strong>Example:</strong> {currentWord.example}
                  </div>
                </div>
              </div>

              {/* Game Interface */}
              {gameMode === 'spelling' || gameMode === 'listening' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type the word here..."
                    className="w-full max-w-md mx-auto px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex justify-center gap-4">
                    <Button onClick={checkSpelling} className="bg-green-500 hover:bg-green-600">
                      <Target className="h-4 w-4 mr-2" />
                      Check Answer
                    </Button>
                    <Button onClick={() => setShowHint(!showHint)} variant="outline">
                      💡 {showHint ? 'Hide' : 'Show'} Hint
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-lg font-semibold">Selected: {selectedPhonics.join('')}</div>
                  <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
                    {availableLetters.map((letter, index) => (
                      <Button
                        key={index}
                        onClick={() => handlePhonicsSelection(letter)}
                        variant="outline"
                        className="aspect-square"
                      >
                        {letter.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    onClick={() => setSelectedPhonics([])} 
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}

              {/* Hint */}
              {showHint && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4">
                  <div className="text-yellow-800">
                    <strong>Phonics:</strong> {currentWord.phonics.join(' - ')}
                  </div>
                  <div className="text-yellow-700 text-sm mt-1">
                    Word length: {currentWord.word.length} letters
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  feedback.includes('Excellent') || feedback.includes('Perfect') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {feedback}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};