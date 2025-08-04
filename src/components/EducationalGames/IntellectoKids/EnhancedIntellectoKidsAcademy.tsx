import React, { useState, useEffect, useRef  } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Trophy, Target, Volume2, Heart, Zap, BookOpen, PenTool, Calculator, Shapes, Palette, Brain, Users, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';
import LetterActivity from './LetterActivity';
import ShapeActivity from './ShapeActivity';
import ColorActivity from './ColorActivity';
import MathActivity from './MathActivity';

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

    const [soundEnabled, setSoundEnabled] = useState(true);
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
          <TabsList className="grid w-full grid-cols-4 mb-4">
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
          </TabsList>

          <TabsContent value="math" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-700">Numbers & Math</h2>
              </div> 
              <MathActivity
                level={1}
                mathGame={mathGame}
                setMathGame={setMathGame}
                addScore={addScore}
                loseHeart={loseHeart}
                speak={speak}
              />

            </Card>
          </TabsContent>

          <TabsContent value="letters" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-700">ABC & Writing</h2>
              </div>
              <LetterActivity addScore={addScore} loseHeart={loseHeart} />
            </Card>
          </TabsContent>

          <TabsContent value="shapes" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shapes className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-bold text-green-700">Shapes & Patterns</h2>
              </div>
                 <ShapeActivity addScore={addScore} />
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-pink-600" />
                <h2 className="text-lg font-bold text-pink-700">Colors & Art</h2>
              </div>
              <ColorActivity addScore={addScore} loseHeart={loseHeart} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};