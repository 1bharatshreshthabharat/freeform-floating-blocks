import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { wordDatabase, initialAchievements, Word, Achievement } from './SpellingPhonicsData';
import SpellingGameArea from './SpellingGameArea';
import SpellingGameSidebar from './SpellingGameSidebar';
import SpellingGameHeader from './SpellingGameHeader'; // adjust the path if needed

interface EnhancedSpellingPhonicGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

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
     <SpellingGameHeader
  onBack={onBack}
  lives={lives}
  soundEnabled={soundEnabled}
  setSoundEnabled={setSoundEnabled}
/>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
  
<SpellingGameSidebar
  gameMode={gameMode}
  setGameMode={setGameMode}
  difficulty={difficulty}
  setDifficulty={setDifficulty}
  score={score}
  streak={streak}
  correctWords={correctWords}
  totalWordsAttempted={totalWordsAttempted}
  gameLevel={gameLevel}
  experiencePoints={experiencePoints}
  progressToNextLevel={progressToNextLevel}
  achievements={achievements}
/>


          {/* Main Game Area */}
      <SpellingGameArea
  gameMode={gameMode}
  currentWord={currentWord}
  userInput={userInput}
  setUserInput={setUserInput}
  handleKeyPress={handleKeyPress}
  checkSpelling={checkSpelling}
  showHint={showHint}
  setShowHint={setShowHint}
  selectedPhonics={selectedPhonics}
  setSelectedPhonics={setSelectedPhonics}  
  handlePhonicsSelection={handlePhonicsSelection}
  availableLetters={availableLetters}
  feedback={feedback}
  playWord={playWord}
  playPhonics={playPhonics}
  playDefinition={playDefinition}
/>

        

        </div>
      </div>
    </div>
  );
};