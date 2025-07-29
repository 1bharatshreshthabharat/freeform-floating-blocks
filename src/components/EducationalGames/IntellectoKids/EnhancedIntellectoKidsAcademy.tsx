import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Trophy, Target, Volume2, Heart, Zap, BookOpen, PenTool, Calculator, Shapes, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedIntellectoKidsAcademyProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: string;
}

interface LearningActivity {
  id: string;
  title: string;
  category: string;
  difficulty: number;
  description: string;
  icon: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: 'math' | 'letters' | 'shapes' | 'colors' | 'memory';
}

const achievements: Achievement[] = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🌟', unlocked: false, category: 'General' },
  { id: 'math_wizard', name: 'Math Wizard', description: 'Complete 10 math activities', icon: '🧮', unlocked: false, category: 'Math' },
  { id: 'letter_master', name: 'Letter Master', description: 'Learn all 26 letters', icon: '📚', unlocked: false, category: 'Letters' },
  { id: 'shape_detective', name: 'Shape Detective', description: 'Identify all basic shapes', icon: '🔷', unlocked: false, category: 'Shapes' },
  { id: 'color_artist', name: 'Color Artist', description: 'Complete color mixing activities', icon: '🎨', unlocked: false, category: 'Colors' },
  { id: 'memory_champion', name: 'Memory Champion', description: 'Perfect score in memory games', icon: '🧠', unlocked: false, category: 'Memory' },
  { id: 'daily_warrior', name: 'Daily Warrior', description: 'Complete 7 daily challenges', icon: '⚡', unlocked: false, category: 'Challenges' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Study every day for a week', icon: '💫', unlocked: false, category: 'Dedication' }
];

const learningActivities: LearningActivity[] = [
  // Numbers & Math
  { id: 'counting_1to10', title: 'Counting 1-10', category: 'Math', difficulty: 1, description: 'Learn to count from 1 to 10', icon: '1️⃣', unlocked: true, completed: false, stars: 0 },
  { id: 'counting_11to20', title: 'Counting 11-20', category: 'Math', difficulty: 2, description: 'Count higher numbers', icon: '🔢', unlocked: false, completed: false, stars: 0 },
  { id: 'simple_addition', title: 'Simple Addition', category: 'Math', difficulty: 2, description: 'Add numbers together', icon: '➕', unlocked: false, completed: false, stars: 0 },
  { id: 'simple_subtraction', title: 'Simple Subtraction', category: 'Math', difficulty: 3, description: 'Take numbers away', icon: '➖', unlocked: false, completed: false, stars: 0 },
  { id: 'number_patterns', title: 'Number Patterns', category: 'Math', difficulty: 3, description: 'Find patterns in numbers', icon: '🔗', unlocked: false, completed: false, stars: 0 },

  // Letters & Reading
  { id: 'alphabet_az', title: 'Alphabet A-Z', category: 'Letters', difficulty: 1, description: 'Learn all letters', icon: '🔤', unlocked: true, completed: false, stars: 0 },
  { id: 'letter_sounds', title: 'Letter Sounds', category: 'Letters', difficulty: 2, description: 'Phonics and pronunciation', icon: '🗣️', unlocked: false, completed: false, stars: 0 },
  { id: 'sight_words', title: 'Sight Words', category: 'Letters', difficulty: 2, description: 'Common words recognition', icon: '👁️', unlocked: false, completed: false, stars: 0 },
  { id: 'rhyming_words', title: 'Rhyming Words', category: 'Letters', difficulty: 3, description: 'Words that sound alike', icon: '🎵', unlocked: false, completed: false, stars: 0 },
  { id: 'word_building', title: 'Word Building', category: 'Letters', difficulty: 3, description: 'Combine letters to make words', icon: '🏗️', unlocked: false, completed: false, stars: 0 },

  // Shapes & Patterns
  { id: 'basic_shapes', title: 'Basic Shapes', category: 'Shapes', difficulty: 1, description: 'Circle, square, triangle, rectangle', icon: '⭕', unlocked: true, completed: false, stars: 0 },
  { id: 'shape_sorting', title: 'Shape Sorting', category: 'Shapes', difficulty: 2, description: 'Group shapes together', icon: '📊', unlocked: false, completed: false, stars: 0 },
  { id: 'pattern_recognition', title: 'Pattern Recognition', category: 'Shapes', difficulty: 2, description: 'Complete shape patterns', icon: '🔄', unlocked: false, completed: false, stars: 0 },
  { id: 'shape_puzzles', title: 'Shape Puzzles', category: 'Shapes', difficulty: 3, description: 'Solve shape-based puzzles', icon: '🧩', unlocked: false, completed: false, stars: 0 },

  // Colors & Art
  { id: 'primary_colors', title: 'Primary Colors', category: 'Colors', difficulty: 1, description: 'Red, blue, yellow', icon: '🔴', unlocked: true, completed: false, stars: 0 },
  { id: 'color_mixing', title: 'Color Mixing', category: 'Colors', difficulty: 2, description: 'Make new colors', icon: '🌈', unlocked: false, completed: false, stars: 0 },
  { id: 'color_matching', title: 'Color Matching', category: 'Colors', difficulty: 2, description: 'Find matching colors', icon: '🎯', unlocked: false, completed: false, stars: 0 },
  { id: 'color_patterns', title: 'Color Patterns', category: 'Colors', difficulty: 3, description: 'Complete color sequences', icon: '🎨', unlocked: false, completed: false, stars: 0 },

  // Memory & Logic
  { id: 'memory_cards', title: 'Memory Cards', category: 'Memory', difficulty: 1, description: 'Match pairs of cards', icon: '🃏', unlocked: true, completed: false, stars: 0 },
  { id: 'sequence_memory', title: 'Sequence Memory', category: 'Memory', difficulty: 2, description: 'Remember sequences', icon: '📝', unlocked: false, completed: false, stars: 0 },
  { id: 'logic_puzzles', title: 'Logic Puzzles', category: 'Memory', difficulty: 3, description: 'Think logically to solve', icon: '🧠', unlocked: false, completed: false, stars: 0 }
];

const dailyChallenges: DailyChallenge[] = [
  { id: 'math_challenge', title: 'Number Detective', description: 'Find the missing number in the sequence', points: 50, completed: false, type: 'math' },
  { id: 'letter_challenge', title: 'Letter Hunt', description: 'Find all words starting with "B"', points: 40, completed: false, type: 'letters' },
  { id: 'shape_challenge', title: 'Shape Builder', description: 'Create a house using basic shapes', points: 45, completed: false, type: 'shapes' },
  { id: 'color_challenge', title: 'Rainbow Master', description: 'Arrange colors in rainbow order', points: 35, completed: false, type: 'colors' },
  { id: 'memory_challenge', title: 'Memory Master', description: 'Remember 8 items in order', points: 60, completed: false, type: 'memory' }
];

export const EnhancedIntellectoKidsAcademy: React.FC<EnhancedIntellectoKidsAcademyProps> = ({ onBack, onStatsUpdate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activities, setActivities] = useState<LearningActivity[]>(learningActivities);
  const [challenges, setChallenges] = useState<DailyChallenge[]>(dailyChallenges);
  const [currentActivity, setCurrentActivity] = useState<LearningActivity | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game states for different activities
  const [mathGame, setMathGame] = useState({
    currentQuestion: 0,
    score: 0,
    questions: [] as any[],
    selectedAnswer: null as number | null
  });

  const [letterGame, setLetterGame] = useState({
    currentLetter: 'A',
    recognizedLetters: [] as string[],
    currentIndex: 0
  });

  const [shapeGame, setShapeGame] = useState({
    currentShape: 'circle',
    identifiedShapes: [] as string[],
    currentIndex: 0
  });

  const [colorGame, setColorGame] = useState({
    targetColor: 'red',
    mixedColors: [] as string[],
    currentStage: 0
  });

  const [memoryGame, setMemoryGame] = useState({
    sequence: [] as number[],
    playerSequence: [] as number[],
    showingSequence: false,
    currentStep: 0
  });

  useEffect(() => {
    // Initialize daily challenges
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    
    if (lastVisit !== today) {
      // Reset daily challenges
      setChallenges(prev => prev.map(challenge => ({ ...challenge, completed: false })));
      localStorage.setItem('lastVisit', today);
      
      // Update streak
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date();
        const dayDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          setStreakDays(prev => prev + 1);
        } else if (dayDiff > 1) {
          setStreakDays(1);
        }
      }
    }
  }, []);

  const generateMathQuestions = (activityId: string) => {
    const questions = [];
    switch (activityId) {
      case 'counting_1to10':
        for (let i = 0; i < 10; i++) {
          const num = Math.floor(Math.random() * 10) + 1;
          questions.push({
            question: `How many objects do you see?`,
            objects: Array(num).fill('🌟'),
            answer: num,
            options: [num, num + 1, num - 1, num + 2].sort(() => Math.random() - 0.5)
          });
        }
        break;
      case 'simple_addition':
        for (let i = 0; i < 10; i++) {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 5) + 1;
          questions.push({
            question: `${a} + ${b} = ?`,
            answer: a + b,
            options: [a + b, a + b + 1, a + b - 1, a + b + 2].sort(() => Math.random() - 0.5)
          });
        }
        break;
    }
    return questions;
  };

  const startActivity = (activity: LearningActivity) => {
    if (!activity.unlocked) {
      toast.error('Complete previous activities to unlock this one!');
      return;
    }

    setCurrentActivity(activity);
    
    // Initialize activity-specific game state
    switch (activity.category) {
      case 'Math':
        const questions = generateMathQuestions(activity.id);
        setMathGame({
          currentQuestion: 0,
          score: 0,
          questions,
          selectedAnswer: null
        });
        break;
      case 'Letters':
        setLetterGame({
          currentLetter: 'A',
          recognizedLetters: [],
          currentIndex: 0
        });
        break;
      case 'Shapes':
        setShapeGame({
          currentShape: 'circle',
          identifiedShapes: [],
          currentIndex: 0
        });
        break;
      case 'Colors':
        setColorGame({
          targetColor: 'red',
          mixedColors: [],
          currentStage: 0
        });
        break;
      case 'Memory':
        const sequence = Array.from({length: 4}, () => Math.floor(Math.random() * 4));
        setMemoryGame({
          sequence,
          playerSequence: [],
          showingSequence: true,
          currentStep: 0
        });
        break;
    }
  };

  const completeActivity = (stars: number) => {
    if (!currentActivity) return;

    const points = stars * 100 + currentActivity.difficulty * 50;
    setTotalScore(prev => prev + points);
    setExperiencePoints(prev => prev + points);
    setGems(prev => prev + stars);

    // Update activity
    setActivities(prev => prev.map(activity => 
      activity.id === currentActivity.id 
        ? { ...activity, completed: true, stars: Math.max(activity.stars, stars) }
        : activity
    ));

    // Unlock next activities
    const categoryActivities = activities.filter(a => a.category === currentActivity.category);
    const currentIndex = categoryActivities.findIndex(a => a.id === currentActivity.id);
    if (currentIndex < categoryActivities.length - 1) {
      const nextActivity = categoryActivities[currentIndex + 1];
      setActivities(prev => prev.map(activity =>
        activity.id === nextActivity.id
          ? { ...activity, unlocked: true }
          : activity
      ));
    }

    // Check for level up
    if (experiencePoints + points >= level * 1000) {
      setLevel(prev => prev + 1);
      setHearts(5); // Restore hearts on level up
      toast.success(`🎉 Level Up! You're now level ${level + 1}!`);
    }

    // Check achievements
    checkAchievements();

    toast.success(`🌟 Activity completed! +${points} points, +${stars} gems!`);
    setCurrentActivity(null);

    onStatsUpdate({
      totalScore: totalScore + points,
      level,
      completedActivities: activities.filter(a => a.completed).length,
      achievements: unlockedAchievements.length
    });
  };

  const checkAchievements = () => {
    const completedActivities = activities.filter(a => a.completed);
    const mathCompleted = completedActivities.filter(a => a.category === 'Math').length;
    const lettersCompleted = completedActivities.filter(a => a.category === 'Letters').length;
    
    // Check for new achievements
    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let shouldUnlock = false;
      switch (achievement.id) {
        case 'first_lesson':
          shouldUnlock = completedActivities.length >= 1;
          break;
        case 'math_wizard':
          shouldUnlock = mathCompleted >= 3;
          break;
        case 'letter_master':
          shouldUnlock = lettersCompleted >= 3;
          break;
        case 'daily_warrior':
          shouldUnlock = challenges.filter(c => c.completed).length >= 7;
          break;
      }

      if (shouldUnlock) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
      }
    });
  };

  const completeDailyChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setChallenges(prev => prev.map(c =>
      c.id === challengeId ? { ...c, completed: true } : c
    ));

    setTotalScore(prev => prev + challenge.points);
    setGems(prev => prev + Math.floor(challenge.points / 10));
    
    toast.success(`🎯 Daily Challenge completed! +${challenge.points} points!`);
  };

  const progressToNextLevel = () => {
    return ((experiencePoints % (level * 1000)) / (level * 1000)) * 100;
  };

  const speak = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const renderMathActivity = () => {
    if (mathGame.currentQuestion >= mathGame.questions.length) {
      const stars = Math.floor((mathGame.score / mathGame.questions.length) * 3);
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-4">Great Job!</h3>
          <div className="text-lg mb-4">You got {mathGame.score} out of {mathGame.questions.length} correct!</div>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({length: 3}).map((_, i) => (
              <Star key={i} className={`h-8 w-8 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <Button onClick={() => completeActivity(stars)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    const question = mathGame.questions[mathGame.currentQuestion];
    return (
      <div className="text-center p-6">
        <div className="mb-6">
          <div className="text-lg font-semibold mb-4">{question.question}</div>
          {question.objects && (
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {question.objects.map((obj: string, i: number) => (
                <span key={i} className="text-3xl">{obj}</span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {question.options.map((option: number) => (
            <Button
              key={option}
              onClick={() => setMathGame(prev => ({ ...prev, selectedAnswer: option }))}
              variant={mathGame.selectedAnswer === option ? 'default' : 'outline'}
              className="text-xl py-6"
            >
              {option}
            </Button>
          ))}
        </div>

        {mathGame.selectedAnswer !== null && (
          <Button
            onClick={() => {
              const isCorrect = mathGame.selectedAnswer === question.answer;
              if (isCorrect) {
                setMathGame(prev => ({ ...prev, score: prev.score + 1 }));
                toast.success('Correct! 🎉');
                speak('Correct! Great job!');
              } else {
                toast.error(`Not quite! The answer is ${question.answer}`);
                speak(`Not quite! The answer is ${question.answer}`);
              }
              
              setTimeout(() => {
                setMathGame(prev => ({
                  ...prev,
                  currentQuestion: prev.currentQuestion + 1,
                  selectedAnswer: null
                }));
              }, 1500);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Submit Answer
          </Button>
        )}
      </div>
    );
  };

  const renderLetterActivity = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const currentLetter = alphabet[letterGame.currentIndex] || 'A';
    
    if (letterGame.currentIndex >= alphabet.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎊</div>
          <h3 className="text-2xl font-bold mb-4">Alphabet Master!</h3>
          <div className="text-lg mb-6">You've learned all 26 letters!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">{currentLetter}</div>
          <div className="text-2xl font-semibold mb-2">Letter {currentLetter}</div>
          <Button onClick={() => speak(`Letter ${currentLetter}`)} variant="outline" className="mb-4">
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Letter
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-lg">Can you find the letter <strong>{currentLetter}</strong>?</div>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {[currentLetter, alphabet[Math.floor(Math.random() * 26)], alphabet[Math.floor(Math.random() * 26)], alphabet[Math.floor(Math.random() * 26)]]
              .sort(() => Math.random() - 0.5)
              .map((letter, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (letter === currentLetter) {
                    toast.success('Correct! 🎉');
                    speak(`Correct! Letter ${currentLetter}`);
                    setLetterGame(prev => ({
                      ...prev,
                      recognizedLetters: [...prev.recognizedLetters, currentLetter],
                      currentIndex: prev.currentIndex + 1
                    }));
                  } else {
                    toast.error('Try again!');
                    speak('Try again!');
                  }
                }}
                className="text-3xl py-8"
                variant="outline"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Progress value={(letterGame.currentIndex / alphabet.length) * 100} className="w-full max-w-md mx-auto" />
          <div className="text-sm text-gray-600 mt-2">{letterGame.currentIndex} / {alphabet.length} letters</div>
        </div>
      </div>
    );
  };

  const renderShapeActivity = () => {
    const shapes = [
      { name: 'circle', emoji: '⭕', color: 'bg-red-500' },
      { name: 'square', emoji: '🟦', color: 'bg-blue-500' },
      { name: 'triangle', emoji: '🔺', color: 'bg-green-500' },
      { name: 'rectangle', emoji: '▭', color: 'bg-yellow-500' },
      { name: 'heart', emoji: '❤️', color: 'bg-pink-500' },
      { name: 'star', emoji: '⭐', color: 'bg-purple-500' },
      { name: 'diamond', emoji: '💎', color: 'bg-cyan-500' },
      { name: 'hexagon', emoji: '⬡', color: 'bg-indigo-500' }
    ];
    
    const currentShape = shapes[shapeGame.currentIndex] || shapes[0];
    
    if (shapeGame.currentIndex >= shapes.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-4">Shape Expert!</h3>
          <div className="text-lg mb-6">You've mastered all shapes!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div className="mb-8">
          <div className="text-8xl mb-4">{currentShape.emoji}</div>
          <div className="text-2xl font-semibold mb-2 capitalize">{currentShape.name}</div>
          <Button onClick={() => speak(`This is a ${currentShape.name}`)} variant="outline" className="mb-4">
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Shape Name
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-lg">What shape is this?</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[currentShape.name, shapes[Math.floor(Math.random() * shapes.length)].name, shapes[Math.floor(Math.random() * shapes.length)].name, shapes[Math.floor(Math.random() * shapes.length)].name]
              .filter((name, index, arr) => arr.indexOf(name) === index)
              .slice(0, 4)
              .sort(() => Math.random() - 0.5)
              .map((shapeName, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (shapeName === currentShape.name) {
                    toast.success('Excellent! 🎉');
                    speak(`Excellent! This is a ${currentShape.name}`);
                    setShapeGame(prev => ({
                      ...prev,
                      identifiedShapes: [...prev.identifiedShapes, currentShape.name],
                      currentIndex: prev.currentIndex + 1
                    }));
                  } else {
                    toast.error('Try again!');
                    speak('Try again!');
                  }
                }}
                className="text-lg py-6 capitalize"
                variant="outline"
              >
                {shapeName}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Progress value={(shapeGame.currentIndex / shapes.length) * 100} className="w-full max-w-md mx-auto" />
          <div className="text-sm text-gray-600 mt-2">{shapeGame.currentIndex} / {shapes.length} shapes</div>
        </div>
      </div>
    );
  };

  const renderColorActivity = () => {
    const colorMixing = [
      { primary1: 'red', primary2: 'blue', result: 'purple' },
      { primary1: 'red', primary2: 'yellow', result: 'orange' },
      { primary1: 'blue', primary2: 'yellow', result: 'green' }
    ];

    const currentMix = colorMixing[colorGame.currentStage];

    if (colorGame.currentStage >= colorMixing.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold mb-4">Color Master!</h3>
          <div className="text-lg mb-6">You've learned color mixing!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Color Mixing Lab 🧪</h3>
          <div className="text-lg mb-4">
            What happens when you mix {currentMix.primary1} and {currentMix.primary2}?
          </div>
        </div>

        {/* Color mixing visualization */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-full mb-2 border-4 border-gray-300"
              style={{ backgroundColor: currentMix.primary1 === 'red' ? '#FF0000' : currentMix.primary1 === 'blue' ? '#0000FF' : '#FFFF00' }}
            ></div>
            <span className="capitalize font-semibold">{currentMix.primary1}</span>
          </div>
          <div className="text-3xl">+</div>
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-full mb-2 border-4 border-gray-300"
              style={{ backgroundColor: currentMix.primary2 === 'red' ? '#FF0000' : currentMix.primary2 === 'blue' ? '#0000FF' : '#FFFF00' }}
            ></div>
            <span className="capitalize font-semibold">{currentMix.primary2}</span>
          </div>
          <div className="text-3xl">=</div>
          <div className="text-4xl">❓</div>
        </div>

        <div className="space-y-4">
          <div className="text-lg">Choose the result color:</div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[currentMix.result, 'brown', 'pink'].sort(() => Math.random() - 0.5).map((colorName, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (colorName === currentMix.result) {
                    toast.success('Perfect! 🎨');
                    speak(`Perfect! ${currentMix.primary1} and ${currentMix.primary2} make ${currentMix.result}`);
                    setColorGame(prev => ({
                      ...prev,
                      mixedColors: [...prev.mixedColors, currentMix.result],
                      currentStage: prev.currentStage + 1
                    }));
                  } else {
                    toast.error('Try again!');
                    speak('Try again!');
                  }
                }}
                className={`py-8 text-lg capitalize text-white`}
                style={{ 
                  backgroundColor: colorName === 'purple' ? '#800080' : 
                                  colorName === 'orange' ? '#FFA500' :
                                  colorName === 'green' ? '#00FF00' :
                                  colorName === 'brown' ? '#964B00' :
                                  colorName === 'pink' ? '#FFC0CB' : '#000000'
                }}
                variant="outline"
              >
                {colorName}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Progress value={(colorGame.currentStage / colorMixing.length) * 100} className="w-full max-w-md mx-auto" />
          <div className="text-sm text-gray-600 mt-2">{colorGame.currentStage} / {colorMixing.length} mixes</div>
        </div>
      </div>
    );
  };

  const renderMemoryActivity = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    if (memoryGame.playerSequence.length >= memoryGame.sequence.length && !memoryGame.showingSequence) {
      const isCorrect = memoryGame.playerSequence.every((color, i) => color === memoryGame.sequence[i]);
      
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">{isCorrect ? '🎉' : '😅'}</div>
          <h3 className="text-2xl font-bold mb-4">
            {isCorrect ? 'Perfect Memory!' : 'Good Try!'}
          </h3>
          <div className="text-lg mb-6">
            {isCorrect ? 'You remembered the sequence perfectly!' : 'Practice makes perfect!'}
          </div>
          <Button onClick={() => completeActivity(isCorrect ? 3 : 1)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Memory Challenge 🧠</h3>
          <div className="text-lg mb-4">
            {memoryGame.showingSequence ? 'Watch the sequence!' : 'Repeat the sequence!'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {colors.map((color, i) => (
            <Button
              key={i}
              onClick={() => {
                if (!memoryGame.showingSequence) {
                  const newPlayerSequence = [...memoryGame.playerSequence, i];
                  setMemoryGame(prev => ({ ...prev, playerSequence: newPlayerSequence }));
                }
              }}
              className={`w-24 h-24 text-white ${
                memoryGame.showingSequence && memoryGame.currentStep === i ? 'ring-4 ring-white' : ''
              }`}
              style={{ 
                backgroundColor: color === 'red' ? '#FF0000' : 
                               color === 'blue' ? '#0000FF' :
                               color === 'green' ? '#00FF00' : '#FFFF00'
              }}
              disabled={memoryGame.showingSequence}
            >
              {color}
            </Button>
          ))}
        </div>

        <div className="text-sm text-gray-600">
          Sequence length: {memoryGame.sequence.length} | Your progress: {memoryGame.playerSequence.length}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Intellecto Kids Academy</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {Array.from({length: 5}).map((_, i) => (
                  <Heart key={i} className={`h-5 w-5 ${i < hearts ? 'text-red-500 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-yellow-600">💎</span>
                <span className="font-bold text-yellow-800">{gems}</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-blue-800">Level {level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {currentActivity ? (
          <Card className="p-6">
            <div className="mb-4">
              <Button onClick={() => setCurrentActivity(null)} variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Activities
              </Button>
              <h2 className="text-2xl font-bold mb-2">{currentActivity.title}</h2>
              <p className="text-gray-600">{currentActivity.description}</p>
            </div>
            
            {currentActivity.category === 'Math' && renderMathActivity()}
            {currentActivity.category === 'Letters' && renderLetterActivity()}
            {currentActivity.category === 'Shapes' && renderShapeActivity()}
            {currentActivity.category === 'Colors' && renderColorActivity()}
            {currentActivity.category === 'Memory' && renderMemoryActivity()}
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="math">Numbers & Math</TabsTrigger>
              <TabsTrigger value="letters">ABC & Writing</TabsTrigger>
              <TabsTrigger value="shapes">Shapes & Patterns</TabsTrigger>
              <TabsTrigger value="colors">Colors & Art</TabsTrigger>
              <TabsTrigger value="memory">Memory Games</TabsTrigger>
              <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Level {level}</h3>
                    <Progress value={progressToNextLevel()} className="bg-white/20" />
                    <p className="text-sm mt-2">{experiencePoints % (level * 1000)}/{level * 1000} XP</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Total Score</h3>
                    <p className="text-3xl font-bold">{totalScore}</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white">
                  <div className="text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Streak Days</h3>
                    <p className="text-3xl font-bold">{streakDays}</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Start Activities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activities.filter(a => a.unlocked && !a.completed).slice(0, 4).map(activity => (
                    <Button
                      key={activity.id}
                      onClick={() => startActivity(activity)}
                      variant="outline"
                      className="h-24 flex flex-col gap-2"
                    >
                      <span className="text-2xl">{activity.icon}</span>
                      <span className="text-sm">{activity.title}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="math" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.filter(a => a.category === 'Math').map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <h3 className="font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Button
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        variant={activity.completed ? 'secondary' : 'default'}
                        className="w-full"
                      >
                        {activity.completed ? 'Play Again' : activity.unlocked ? 'Start' : 'Locked'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="letters" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.filter(a => a.category === 'Letters').map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <h3 className="font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Button
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        variant={activity.completed ? 'secondary' : 'default'}
                        className="w-full"
                      >
                        {activity.completed ? 'Play Again' : activity.unlocked ? 'Start' : 'Locked'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shapes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.filter(a => a.category === 'Shapes').map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <h3 className="font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Button
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        variant={activity.completed ? 'secondary' : 'default'}
                        className="w-full"
                      >
                        {activity.completed ? 'Play Again' : activity.unlocked ? 'Start' : 'Locked'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.filter(a => a.category === 'Colors').map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <h3 className="font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Button
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        variant={activity.completed ? 'secondary' : 'default'}
                        className="w-full"
                      >
                        {activity.completed ? 'Play Again' : activity.unlocked ? 'Start' : 'Locked'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="memory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.filter(a => a.category === 'Memory').map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <h3 className="font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Button
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        variant={activity.completed ? 'secondary' : 'default'}
                        className="w-full"
                      >
                        {activity.completed ? 'Play Again' : activity.unlocked ? 'Start' : 'Locked'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Daily Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map(challenge => (
                    <Card key={challenge.id} className={`p-4 ${challenge.completed ? 'bg-green-50 border-green-200' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                          <p className="text-sm font-semibold text-blue-600">+{challenge.points} points</p>
                        </div>
                        <Button
                          onClick={() => completeDailyChallenge(challenge.id)}
                          disabled={challenge.completed}
                          variant={challenge.completed ? 'secondary' : 'default'}
                        >
                          {challenge.completed ? '✓ Done' : 'Complete'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
