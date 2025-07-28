import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Trophy, Target, Volume2, Heart, Zap, BookOpen, PenTool, Calculator, Shapes, Palette, Music, Award } from 'lucide-react';
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
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const currentLetter = letters[letterGame.currentIndex];

    if (letterGame.currentIndex >= letters.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📚</div>
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
        <div className="text-8xl font-bold mb-6 text-blue-600">{currentLetter}</div>
        <div className="text-2xl mb-4">Letter: {currentLetter}</div>
        
        <div className="space-y-4 mb-6">
          <Button
            onClick={() => speak(currentLetter)}
            variant="outline"
            className="w-full max-w-md"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Letter Sound
          </Button>
          
          <Button
            onClick={() => speak(`${currentLetter} is for ${currentLetter === 'A' ? 'Apple' : currentLetter === 'B' ? 'Ball' : currentLetter === 'C' ? 'Cat' : 'Dog'}`)}
            variant="outline"
            className="w-full max-w-md"
          >
            📝 Hear Example Word
          </Button>
        </div>

        <Button
          onClick={() => {
            setLetterGame(prev => ({
              ...prev,
              recognizedLetters: [...prev.recognizedLetters, currentLetter],
              currentIndex: prev.currentIndex + 1
            }));
            toast.success(`Great! You learned the letter ${currentLetter}!`);
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          I Know This Letter! ✓
        </Button>
      </div>
    );
  };

  const renderShapeActivity = () => {
    const shapes = [
      { name: 'Circle', emoji: '⭕', description: 'Round like a ball' },
      { name: 'Square', emoji: '⬜', description: 'Four equal sides' },
      { name: 'Triangle', emoji: '🔺', description: 'Three sides and three corners' },
      { name: 'Rectangle', emoji: '▭', description: 'Four sides, two long and two short' }
    ];

    const currentShape = shapes[shapeGame.currentIndex];

    if (shapeGame.currentIndex >= shapes.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔷</div>
          <h3 className="text-2xl font-bold mb-4">Shape Detective!</h3>
          <div className="text-lg mb-6">You've identified all basic shapes!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div className="text-8xl mb-6">{currentShape.emoji}</div>
        <div className="text-2xl font-bold mb-2">{currentShape.name}</div>
        <div className="text-lg text-gray-600 mb-6">{currentShape.description}</div>
        
        <div className="space-y-4 mb-6">
          <Button
            onClick={() => speak(currentShape.name)}
            variant="outline"
            className="w-full max-w-md"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Shape Name
          </Button>
          
          <Button
            onClick={() => speak(currentShape.description)}
            variant="outline"
            className="w-full max-w-md"
          >
            📝 Hear Description
          </Button>
        </div>

        <Button
          onClick={() => {
            setShapeGame(prev => ({
              ...prev,
              identifiedShapes: [...prev.identifiedShapes, currentShape.name],
              currentIndex: prev.currentIndex + 1
            }));
            toast.success(`Excellent! You identified the ${currentShape.name}!`);
          }}
          className="bg-purple-500 hover:bg-purple-600"
        >
          I Know This Shape! ✓
        </Button>
      </div>
    );
  };

  const renderColorActivity = () => {
    const colors = [
      { name: 'Red', hex: '#EF4444', emoji: '🔴', examples: ['Apple', 'Fire truck', 'Rose'] },
      { name: 'Blue', hex: '#3B82F6', emoji: '🔵', examples: ['Sky', 'Ocean', 'Blueberry'] },
      { name: 'Yellow', hex: '#EAB308', emoji: '🟡', examples: ['Sun', 'Banana', 'Lemon'] },
      { name: 'Green', hex: '#22C55E', emoji: '🟢', examples: ['Grass', 'Frog', 'Leaf'] }
    ];

    const currentColor = colors[colorGame.currentStage];

    if (colorGame.currentStage >= colors.length) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌈</div>
          <h3 className="text-2xl font-bold mb-4">Color Master!</h3>
          <div className="text-lg mb-6">You've learned all primary colors!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <div 
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300"
          style={{ backgroundColor: currentColor.hex }}
        />
        <div className="text-2xl font-bold mb-2">{currentColor.name}</div>
        <div className="text-lg text-gray-600 mb-6">
          {currentColor.name} like: {currentColor.examples.join(', ')}
        </div>
        
        <div className="space-y-4 mb-6">
          <Button
            onClick={() => speak(currentColor.name)}
            variant="outline"
            className="w-full max-w-md"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Color Name
          </Button>
          
          <Button
            onClick={() => speak(`${currentColor.name} like ${currentColor.examples.join(', ')}`)}
            variant="outline"
            className="w-full max-w-md"
          >
            📝 Hear Examples
          </Button>
        </div>

        <Button
          onClick={() => {
            setColorGame(prev => ({
              ...prev,
              mixedColors: [...prev.mixedColors, currentColor.name],
              currentStage: prev.currentStage + 1
            }));
            toast.success(`Wonderful! You learned the color ${currentColor.name}!`);
          }}
          className="bg-pink-500 hover:bg-pink-600"
        >
          I Know This Color! ✓
        </Button>
      </div>
    );
  };

  const renderMemoryActivity = () => {
    const buttons = [
      { color: 'bg-red-500', sound: 'Do' },
      { color: 'bg-blue-500', sound: 'Re' },
      { color: 'bg-green-500', sound: 'Mi' },
      { color: 'bg-yellow-500', sound: 'Fa' }
    ];

    if (memoryGame.currentStep >= memoryGame.sequence.length && !memoryGame.showingSequence) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold mb-4">Memory Champion!</h3>
          <div className="text-lg mb-6">Perfect memory! You remembered the sequence!</div>
          <Button onClick={() => completeActivity(3)} className="bg-green-500 hover:bg-green-600">
            Complete Activity
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold mb-4">Watch and Remember the Sequence</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`h-20 w-20 rounded-lg transition-all ${button.color} ${
                memoryGame.showingSequence && memoryGame.sequence[memoryGame.currentStep] === index
                  ? 'scale-110 ring-4 ring-white'
                  : ''
              }`}
              onClick={() => {
                if (!memoryGame.showingSequence) {
                  const newPlayerSequence = [...memoryGame.playerSequence, index];
                  if (newPlayerSequence[newPlayerSequence.length - 1] === memoryGame.sequence[newPlayerSequence.length - 1]) {
                    setMemoryGame(prev => ({ ...prev, playerSequence: newPlayerSequence }));
                    if (newPlayerSequence.length === memoryGame.sequence.length) {
                      setTimeout(() => {
                        setMemoryGame(prev => ({ ...prev, currentStep: prev.sequence.length }));
                      }, 500);
                    }
                  } else {
                    toast.error('Oops! Try again from the beginning');
                    setMemoryGame(prev => ({ ...prev, playerSequence: [] }));
                  }
                }
              }}
            />
          ))}
        </div>
        
        {memoryGame.showingSequence ? (
          <div className="text-lg text-blue-600">Watch carefully... Step {memoryGame.currentStep + 1}</div>
        ) : (
          <div className="text-lg text-green-600">Your turn! Repeat the sequence</div>
        )}
      </div>
    );
  };

  if (currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={() => setCurrentActivity(null)} 
                variant="ghost" 
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academy
              </Button>
              <div className="text-center">
                <h1 className="text-xl font-bold">{currentActivity.title}</h1>
                <div className="text-sm text-gray-600">{currentActivity.description}</div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({length: 5}).map((_, i) => (
                  <Heart key={i} className={`h-5 w-5 ${i < hearts ? 'text-red-500' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-4xl mx-auto p-6">
            {currentActivity.category === 'Math' && renderMathActivity()}
            {currentActivity.category === 'Letters' && renderLetterActivity()}
            {currentActivity.category === 'Shapes' && renderShapeActivity()}
            {currentActivity.category === 'Colors' && renderColorActivity()}
            {currentActivity.category === 'Memory' && renderMemoryActivity()}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg">
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
                  <Heart key={i} className={`h-5 w-5 ${i < hearts ? 'text-red-500' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="font-medium text-yellow-800">💎 {gems}</span>
              </div>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="sm"
              >
                <Volume2 className={`h-4 w-4 ${soundEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-2/3 mx-auto">
            <TabsTrigger value="dashboard">🏠 Home</TabsTrigger>
            <TabsTrigger value="activities">📚 Learn</TabsTrigger>
            <TabsTrigger value="challenges">🎯 Challenges</TabsTrigger>
            <TabsTrigger value="progress">📊 Progress</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Awards</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Player Stats */}
              <Card className="lg:col-span-1 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {level}
                  </div>
                  <h3 className="text-xl font-bold mb-2">Level {level} Learner</h3>
                  <Progress value={progressToNextLevel()} className="mb-2" />
                  <div className="text-sm text-gray-600">
                    {experiencePoints % (level * 1000)}/{level * 1000} XP to next level
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
                      <div className="text-sm text-gray-600">Total Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{streakDays}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Activities */}
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-xl font-bold mb-4">Continue Learning</h3>
                <div className="grid grid-cols-2 gap-4">
                  {activities.filter(a => a.unlocked && !a.completed).slice(0, 4).map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => startActivity(activity)}
                      className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border hover:shadow-md transition-all text-left"
                    >
                      <div className="text-2xl mb-2">{activity.icon}</div>
                      <div className="font-semibold text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-600">{activity.category}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {'⭐'.repeat(activity.difficulty)}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Daily Challenges Preview */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Today's Challenges</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challenges.slice(0, 3).map(challenge => (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-lg border ${challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{challenge.title}</h4>
                      <div className="text-xs text-yellow-600">+{challenge.points}</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">{challenge.description}</div>
                    {!challenge.completed ? (
                      <Button 
                        onClick={() => completeDailyChallenge(challenge.id)}
                        size="sm" 
                        className="w-full"
                      >
                        Start
                      </Button>
                    ) : (
                      <div className="text-green-600 text-center text-sm font-medium">✓ Completed</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Math', 'Letters', 'Shapes', 'Colors', 'Memory'].map(category => (
                <Card key={category} className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    {category === 'Math' && <Calculator className="h-5 w-5" />}
                    {category === 'Letters' && <PenTool className="h-5 w-5" />}
                    {category === 'Shapes' && <Shapes className="h-5 w-5" />}
                    {category === 'Colors' && <Palette className="h-5 w-5" />}
                    {category === 'Memory' && <Target className="h-5 w-5" />}
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {activities.filter(a => a.category === category).map(activity => (
                      <button
                        key={activity.id}
                        onClick={() => startActivity(activity)}
                        disabled={!activity.unlocked}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          activity.unlocked 
                            ? 'bg-white hover:shadow-md' 
                            : 'bg-gray-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-lg">{activity.icon}</div>
                          <div className="flex">
                            {Array.from({length: 3}).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < activity.stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="font-medium text-sm">{activity.title}</div>
                        <div className="text-xs text-gray-600">{activity.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Difficulty: {'⭐'.repeat(activity.difficulty)}
                        </div>
                      </button>
                    ))}
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
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-lg border ${challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <div className="text-yellow-600 font-bold">+{challenge.points}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">{challenge.description}</div>
                    {!challenge.completed ? (
                      <Button 
                        onClick={() => completeDailyChallenge(challenge.id)}
                        className="w-full"
                      >
                        Complete Challenge
                      </Button>
                    ) : (
                      <div className="text-green-600 text-center font-medium">✓ Completed Today!</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Learning Progress</h3>
                <div className="space-y-4">
                  {['Math', 'Letters', 'Shapes', 'Colors', 'Memory'].map(category => {
                    const categoryActivities = activities.filter(a => a.category === category);
                    const completed = categoryActivities.filter(a => a.completed).length;
                    const total = categoryActivities.length;
                    const progress = (completed / total) * 100;
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-gray-600">{completed}/{total}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{activities.filter(a => a.completed).length}</div>
                    <div className="text-sm text-gray-600">Activities Completed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{gems}</div>
                    <div className="text-sm text-gray-600">Gems Earned</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{streakDays}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      unlockedAchievements.includes(achievement.id)
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold">{achievement.name}</h4>
                        <div className="text-sm text-gray-600 mb-2">{achievement.description}</div>
                        <div className="text-xs text-blue-600">{achievement.category}</div>
                        {unlockedAchievements.includes(achievement.id) && (
                          <div className="text-green-600 text-sm font-medium mt-2">✓ Unlocked!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};