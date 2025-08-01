import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Trophy, Target, Volume2, Heart, Zap, BookOpen, PenTool, Calculator, Shapes, Palette, Brain, Users, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedIntellectoKidsAcademyProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const EnhancedIntellectoKidsAcademy: React.FC<EnhancedIntellectoKidsAcademyProps> = ({ onBack, onStatsUpdate }) => {
  const [activeTab, setActiveTab] = useState('math');
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [gems, setGems] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Math game state
  const [mathGame, setMathGame] = useState({
    currentActivity: 'counting',
    level: 1,
    score: 0,
    question: 1,
    totalQuestions: 10,
    currentNumber: 1,
    selectedAnswer: null as number | null,
    showFeedback: false
  });

  // Letter game state
  const [letterGame, setLetterGame] = useState({
    currentLetter: 'A',
    currentIndex: 0,
    recognizedLetters: [] as string[],
    selectedAnswer: null as string | null,
    showTracing: false
  });

  // Shape game state
  const [shapeGame, setShapeGame] = useState({
    currentShape: 0,
    identifiedShapes: [] as string[],
    selectedAnswer: null as string | null,
    currentPattern: [] as string[]
  });

  // Color game state
  const [colorGame, setColorGame] = useState({
    currentStage: 0,
    mixedColors: [] as string[],
    selectedColors: [] as string[],
    targetColor: '',
    showResult: false
  });

  // Memory game state
  const [memoryGame, setMemoryGame] = useState({
    sequence: [] as number[],
    playerSequence: [] as number[],
    showingSequence: false,
    level: 1,
    currentStep: 0
  });

  const speak = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const addScore = (points: number) => {
    setTotalScore(prev => prev + points);
    setGems(prev => prev + Math.floor(points / 10));
    
    // Level up every 500 points
    if ((totalScore + points) >= level * 500) {
      setLevel(prev => prev + 1);
      setHearts(3); // Restore hearts
      toast.success(`🎉 Level ${level + 1} unlocked!`);
    }
  };

  const loseHeart = () => {
    setHearts(prev => Math.max(0, prev - 1));
    if (hearts <= 1) {
      toast.error("No hearts left! Take a break and try again.");
    }
  };

  // Math Activities
  const mathActivities = [
    { id: 'counting', name: 'Number Recognition', icon: '🔢', description: 'Learn numbers 1-20' },
    { id: 'addition', name: 'Simple Addition', icon: '➕', description: 'Add numbers together' },
    { id: 'subtraction', name: 'Simple Subtraction', icon: '➖', description: 'Take numbers away' },
    { id: 'patterns', name: 'Number Patterns', icon: '📈', description: 'Find the pattern' }
  ];

  const renderMathActivity = () => {
    const { currentActivity, currentNumber, question, totalQuestions } = mathGame;

    if (currentActivity === 'counting') {
      return (
        <div className="p-4 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Number Recognition</h3>
            <div className="text-sm text-gray-600">Question {question} of {totalQuestions}</div>
            <Progress value={(question / totalQuestions) * 100} className="w-full max-w-md mx-auto mt-2" />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4 animate-pulse">{currentNumber}</div>
            <div className="text-lg mb-4">Count the objects!</div>
            
            <div className="grid grid-cols-5 gap-2 justify-center mb-6 max-w-md mx-auto">
              {Array.from({length: currentNumber}, (_, i) => (
                <div key={i} className="text-3xl animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                  🌟
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
              {[currentNumber, currentNumber + 1, currentNumber - 1, currentNumber + 2]
                .filter(n => n > 0)
                .sort(() => Math.random() - 0.5)
                .map(num => (
                <Button
                  key={num}
                  onClick={() => {
                    if (num === currentNumber) {
                      addScore(10);
                      toast.success('Perfect! 🌟');
                      speak(`Correct! ${currentNumber}`);
                      
                      setTimeout(() => {
                        if (question < totalQuestions) {
                          setMathGame(prev => ({
                            ...prev,
                            question: prev.question + 1,
                            currentNumber: Math.floor(Math.random() * 20) + 1
                          }));
                        } else {
                          toast.success('Math activity completed! 🎉');
                          addScore(50);
                        }
                      }, 1000);
                    } else {
                      loseHeart();
                      toast.error('Try again!');
                      speak('Try again!');
                    }
                  }}
                  variant="outline"
                  className="text-xl py-3 hover:scale-105 transition-transform"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentActivity === 'addition') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const answer = a + b;

      return (
        <div className="p-4 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-green-600 mb-2">Simple Addition</h3>
            <div className="text-sm text-gray-600">Question {question} of {totalQuestions}</div>
            <Progress value={(question / totalQuestions) * 100} className="w-full max-w-md mx-auto mt-2" />
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-4 text-green-700">
              {a} + {b} = ?
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex gap-1">
                {Array.from({length: a}, (_, i) => (
                  <span key={i} className="text-2xl">🍎</span>
                ))}
              </div>
              <span className="text-2xl">+</span>
              <div className="flex gap-1">
                {Array.from({length: b}, (_, i) => (
                  <span key={i} className="text-2xl">🍎</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
              {[answer, answer + 1, answer - 1, answer + 2]
                .filter(n => n > 0)
                .sort(() => Math.random() - 0.5)
                .map(num => (
                <Button
                  key={num}
                  onClick={() => {
                    if (num === answer) {
                      addScore(15);
                      toast.success('Excellent! 🎉');
                      speak(`Correct! ${a} plus ${b} equals ${answer}`);
                      
                      setTimeout(() => {
                        if (question < totalQuestions) {
                          setMathGame(prev => ({ ...prev, question: prev.question + 1 }));
                        } else {
                          toast.success('Addition mastered! 🎉');
                          addScore(75);
                        }
                      }, 1000);
                    } else {
                      loseHeart();
                      toast.error('Try counting again!');
                      speak('Try counting again!');
                    }
                  }}
                  variant="outline"
                  className="text-xl py-3 hover:scale-105 transition-transform"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderLetterActivity = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const currentLetter = alphabet[letterGame.currentIndex];
    
    if (letterGame.currentIndex >= alphabet.length) {
      return (
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="text-4xl mb-3 animate-bounce">🎊</div>
          <h3 className="text-xl font-bold mb-2 text-purple-700">Alphabet Master!</h3>
          <div className="text-sm text-gray-600 mb-4">You've learned all 26 letters!</div>
          <Button onClick={() => addScore(200)} className="bg-purple-500 hover:bg-purple-600">
            Claim Reward! 🏆
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-600 mb-2">Learn the Alphabet</h3>
          <div className="text-sm text-gray-600">Letter {letterGame.currentIndex + 1} of 26</div>
          <Progress value={((letterGame.currentIndex + 1) / 26) * 100} className="w-full max-w-md mx-auto mt-2" />
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
          <div className="text-8xl font-bold text-purple-600 mb-4 animate-pulse">{currentLetter}</div>
          <div className="text-lg mb-4">This is the letter <strong>{currentLetter}</strong></div>
          
          <Button 
            onClick={() => speak(`Letter ${currentLetter}`)} 
            variant="outline" 
            className="mb-6 hover:scale-105 transition-transform"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Hear Letter
          </Button>

          <div className="space-y-4">
            <div className="text-lg">Find the letter <strong>{currentLetter}</strong>!</div>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {[currentLetter, alphabet[Math.floor(Math.random() * 26)], alphabet[Math.floor(Math.random() * 26)], alphabet[Math.floor(Math.random() * 26)]]
                .filter((letter, index, arr) => arr.indexOf(letter) === index)
                .sort(() => Math.random() - 0.5)
                .map((letter, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    if (letter === currentLetter) {
                      addScore(10);
                      toast.success('Perfect! 🌟');
                      speak(`Correct! Letter ${currentLetter}`);
                      
                      setTimeout(() => {
                        setLetterGame(prev => ({
                          ...prev,
                          recognizedLetters: [...prev.recognizedLetters, currentLetter],
                          currentIndex: prev.currentIndex + 1
                        }));
                      }, 1000);
                    } else {
                      loseHeart();
                      toast.error('Try again!');
                      speak('Try again!');
                    }
                  }}
                  variant="outline"
                  className="text-2xl py-4 hover:scale-105 transition-transform"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderShapeActivity = () => {
    const shapes = [
      { name: 'circle', emoji: '⭕', color: '#ef4444', description: 'Round like a ball' },
      { name: 'square', emoji: '🟦', color: '#3b82f6', description: 'Four equal sides' },
      { name: 'triangle', emoji: '🔺', color: '#10b981', description: 'Three sides and corners' },
      { name: 'rectangle', emoji: '🟨', color: '#f59e0b', description: 'Four sides, opposite sides equal' },
      { name: 'heart', emoji: '❤️', color: '#ec4899', description: 'Shape of love' },
      { name: 'star', emoji: '⭐', color: '#8b5cf6', description: 'Five pointed star' },
      { name: 'diamond', emoji: '💎', color: '#06b6d4', description: 'Sparkling gem shape' },
      { name: 'hexagon', emoji: '⬡', color: '#6366f1', description: 'Six equal sides' }
    ];
    
    const currentShape = shapes[shapeGame.currentShape];
    
    if (shapeGame.currentShape >= shapes.length) {
      return (
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-4xl mb-3 animate-bounce">🌟</div>
          <h3 className="text-xl font-bold mb-2 text-green-700">Shape Expert!</h3>
          <div className="text-sm text-gray-600 mb-4">You've mastered all shapes!</div>
          <Button onClick={() => addScore(200)} className="bg-green-500 hover:bg-green-600">
            Claim Reward! 🏆
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-green-600 mb-2">Learn Shapes</h3>
          <div className="text-sm text-gray-600">Shape {shapeGame.currentShape + 1} of {shapes.length}</div>
          <Progress value={((shapeGame.currentShape + 1) / shapes.length) * 100} className="w-full max-w-md mx-auto mt-2" />
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
          <div className="text-8xl mb-4 animate-pulse">{currentShape.emoji}</div>
          <div className="text-xl font-bold capitalize mb-2" style={{color: currentShape.color}}>
            {currentShape.name}
          </div>
          <div className="text-sm text-gray-600 mb-4">{currentShape.description}</div>
          
          <Button 
            onClick={() => speak(`This is a ${currentShape.name}. ${currentShape.description}`)} 
            variant="outline" 
            className="mb-6 hover:scale-105 transition-transform"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Learn About Shape
          </Button>

          <div className="space-y-4">
            <div className="text-lg">What shape is this?</div>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              {[currentShape.name, shapes[Math.floor(Math.random() * shapes.length)].name, shapes[Math.floor(Math.random() * shapes.length)].name]
                .filter((name, index, arr) => arr.indexOf(name) === index)
                .slice(0, 4)
                .sort(() => Math.random() - 0.5)
                .map((shapeName, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    if (shapeName === currentShape.name) {
                      addScore(15);
                      toast.success('Fantastic! 🎉');
                      speak(`Excellent! This is a ${currentShape.name}`);
                      
                      setTimeout(() => {
                        setShapeGame(prev => ({
                          ...prev,
                          identifiedShapes: [...prev.identifiedShapes, currentShape.name],
                          currentShape: prev.currentShape + 1
                        }));
                      }, 1000);
                    } else {
                      loseHeart();
                      toast.error('Look again!');
                      speak('Look again!');
                    }
                  }}
                  variant="outline"
                  className="text-sm py-3 capitalize hover:scale-105 transition-transform"
                >
                  {shapeName}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderColorActivity = () => {
    const primaryColors = ['red', 'blue', 'yellow'];
    const colorMixing = [
      { color1: 'red', color2: 'blue', result: 'purple', emoji: '🟣' },
      { color1: 'red', color2: 'yellow', result: 'orange', emoji: '🟠' },
      { color1: 'blue', color2: 'yellow', result: 'green', emoji: '🟢' }
    ];

    const currentMix = colorMixing[colorGame.currentStage];

    if (colorGame.currentStage >= colorMixing.length) {
      return (
        <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
          <div className="text-4xl mb-3 animate-bounce">🎨</div>
          <h3 className="text-xl font-bold mb-2 text-pink-700">Color Master!</h3>
          <div className="text-sm text-gray-600 mb-4">You've learned color mixing!</div>
          <Button onClick={() => addScore(200)} className="bg-pink-500 hover:bg-pink-600">
            Claim Reward! 🏆
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-pink-600 mb-2">Color Mixing Magic</h3>
          <div className="text-sm text-gray-600">Mix {colorGame.currentStage + 1} of {colorMixing.length}</div>
          <Progress value={((colorGame.currentStage + 1) / colorMixing.length) * 100} className="w-full max-w-md mx-auto mt-2" />
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 text-center">
          <div className="text-lg mb-4">Let's mix colors!</div>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg animate-pulse"
              style={{backgroundColor: currentMix.color1}}
            />
            <span className="text-2xl">+</span>
            <div 
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg animate-pulse"
              style={{backgroundColor: currentMix.color2}}
            />
            <span className="text-2xl">=</span>
            <span className="text-2xl">?</span>
          </div>

          <div className="text-lg mb-4">
            What color do you get when you mix <span style={{color: currentMix.color1}}>{currentMix.color1}</span> and <span style={{color: currentMix.color2}}>{currentMix.color2}</span>?
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {[currentMix.result, 'black', 'white']
              .sort(() => Math.random() - 0.5)
              .map((color, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (color === currentMix.result) {
                    addScore(20);
                    toast.success('Amazing color mixing! 🎨');
                    speak(`Perfect! ${currentMix.color1} and ${currentMix.color2} make ${currentMix.result}`);
                    
                    setTimeout(() => {
                      setColorGame(prev => ({
                        ...prev,
                        mixedColors: [...prev.mixedColors, currentMix.result],
                        currentStage: prev.currentStage + 1
                      }));
                    }, 1000);
                  } else {
                    loseHeart();
                    toast.error('Try a different color!');
                    speak('Try a different color!');
                  }
                }}
                variant="outline"
                className="text-sm py-6 capitalize hover:scale-105 transition-transform"
                style={{backgroundColor: color, color: color === 'white' ? 'black' : 'white'}}
              >
                {color}
              </Button>
            ))}
          </div>

          {colorGame.showResult && (
            <div className="mt-6 p-4 bg-white rounded-lg">
              <div className="text-4xl mb-2">{currentMix.emoji}</div>
              <div className="text-lg font-bold" style={{color: currentMix.result}}>
                {currentMix.result.toUpperCase()}!
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMemoryActivity = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    const startNewSequence = () => {
      const newSequence = Array.from({length: memoryGame.level + 2}, () => Math.floor(Math.random() * 4));
      setMemoryGame(prev => ({
        ...prev,
        sequence: newSequence,
        playerSequence: [],
        showingSequence: true,
        currentStep: 0
      }));
      
      // Show sequence
      newSequence.forEach((colorIndex, i) => {
        setTimeout(() => {
          // Highlight color logic would go here
        }, (i + 1) * 800);
      });
      
      setTimeout(() => {
        setMemoryGame(prev => ({ ...prev, showingSequence: false }));
      }, (newSequence.length + 1) * 800);
    };

    const handleColorClick = (colorIndex: number) => {
      if (memoryGame.showingSequence) return;
      
      const newPlayerSequence = [...memoryGame.playerSequence, colorIndex];
      const isCorrect = newPlayerSequence[newPlayerSequence.length - 1] === memoryGame.sequence[newPlayerSequence.length - 1];
      
      if (isCorrect) {
        if (newPlayerSequence.length === memoryGame.sequence.length) {
          addScore(memoryGame.level * 25);
          toast.success('Perfect memory! 🧠');
          speak('Perfect memory!');
          
          setTimeout(() => {
            setMemoryGame(prev => ({ ...prev, level: prev.level + 1 }));
            startNewSequence();
          }, 1000);
        } else {
          setMemoryGame(prev => ({ ...prev, playerSequence: newPlayerSequence }));
        }
      } else {
        loseHeart();
        toast.error('Wrong sequence! Try again!');
        speak('Wrong sequence! Try again!');
        setMemoryGame(prev => ({ ...prev, playerSequence: [] }));
      }
    };

    return (
      <div className="p-4 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">Memory Challenge</h3>
          <div className="text-sm text-gray-600">Level {memoryGame.level}</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
          <div className="text-lg mb-4">
            {memoryGame.showingSequence ? 'Watch the sequence!' : 'Repeat the sequence!'}
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
            {colors.map((color, index) => (
              <Button
                key={index}
                onClick={() => handleColorClick(index)}
                disabled={memoryGame.showingSequence}
                className="w-20 h-20 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: color,
                  opacity: memoryGame.showingSequence ? 0.5 : 1
                }}
              />
            ))}
          </div>

          <div className="text-sm text-gray-600">
            Progress: {memoryGame.playerSequence.length} / {memoryGame.sequence.length}
          </div>
          
          {memoryGame.sequence.length === 0 && (
            <Button onClick={startNewSequence} className="mt-4">
              Start Memory Game
            </Button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    onStatsUpdate({
      totalScore,
      level,
      completedActivities: letterGame.recognizedLetters.length + shapeGame.identifiedShapes.length + colorGame.mixedColors.length,
      hearts,
      gems
    });
  }, [totalScore, level, letterGame.recognizedLetters.length, shapeGame.identifiedShapes.length, colorGame.mixedColors.length, hearts, gems, onStatsUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Compact Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <h1 className="text-lg font-bold text-purple-700">Kids Academy</h1>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{totalScore}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-blue-500" />
                <span className="font-bold">L{level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-bold">{hearts}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="font-bold">{gems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="math" className="flex items-center gap-1 text-xs">
              <Calculator className="h-3 w-3" />
              Math
            </TabsTrigger>
            <TabsTrigger value="letters" className="flex items-center gap-1 text-xs">
              <BookOpen className="h-3 w-3" />
              ABC
            </TabsTrigger>
            <TabsTrigger value="shapes" className="flex items-center gap-1 text-xs">
              <Shapes className="h-3 w-3" />
              Shapes
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1 text-xs">
              <Palette className="h-3 w-3" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-1 text-xs">
              <Brain className="h-3 w-3" />
              Memory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="math" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-700">Numbers & Math</h2>
              </div>
              {renderMathActivity()}
            </Card>
          </TabsContent>

          <TabsContent value="letters" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-700">ABC & Writing</h2>
              </div>
              {renderLetterActivity()}
            </Card>
          </TabsContent>

          <TabsContent value="shapes" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shapes className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-bold text-green-700">Shapes & Patterns</h2>
              </div>
              {renderShapeActivity()}
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-pink-600" />
                <h2 className="text-lg font-bold text-pink-700">Colors & Art</h2>
              </div>
              {renderColorActivity()}
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-indigo-700">Memory Games</h2>
              </div>
              {renderMemoryActivity()}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};