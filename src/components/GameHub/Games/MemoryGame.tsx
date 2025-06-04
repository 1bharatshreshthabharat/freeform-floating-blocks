
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, BookOpen, Timer, Shuffle } from 'lucide-react';
import { ConceptModal } from '../ConceptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MemoryGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onStatsUpdate }) => {
  const [cards, setCards] = useState<{ id: number; value: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameType, setGameType] = useState('classic');
  const [showConcepts, setShowConcepts] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const gameTypes = ['classic', 'time-attack', 'sequence', 'spatial'];

  const getGridSize = () => {
    switch (difficulty) {
      case 'easy': return { rows: 3, cols: 4 };
      case 'medium': return { rows: 4, cols: 4 };
      case 'hard': return { rows: 4, cols: 5 };
      case 'expert': return { rows: 5, cols: 6 };
      default: return { rows: 3, cols: 4 };
    }
  };

  const generateCards = () => {
    const { rows, cols } = getGridSize();
    const totalCards = rows * cols;
    const pairs = totalCards / 2;
    
    const emojis = ['🎯', '🎨', '🎭', '🎪', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎮', '🕹️', '🎲', '🧩', '🎳'];
    const selectedEmojis = emojis.slice(0, pairs);
    const cardValues = [...selectedEmojis, ...selectedEmojis];
    
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
  };

  useEffect(() => {
    generateCards();
    setHints([
      "Try to remember the positions of cards you've seen",
      "Look for patterns in card placement",
      "Focus on one area at a time",
      "Use visualization techniques to remember locations"
    ]);
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(time => time - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard?.value === secondCard?.value) {
        setScore(s => s + 10);
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    generateCards();
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(60);
    setGameStarted(false);
  };

  const randomizeSettings = () => {
    setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    setGameType(gameTypes[Math.floor(Math.random() * gameTypes.length)]);
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % hints.length);
  };

  const { rows, cols } = getGridSize();

  const concepts = [
    {
      title: "Memory Techniques",
      description: "Learn powerful memory enhancement techniques",
      example: "1. Visualization\n2. Association\n3. Chunking\n4. Repetition",
      animation: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      relatedTopics: ["Visual Memory", "Spatial Memory", "Working Memory", "Long-term Memory"]
    },
    {
      title: "Cognitive Training",
      description: "Understand how memory games improve cognition",
      example: "Pattern recognition, attention span, processing speed",
      animation: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      relatedTopics: ["Attention", "Processing Speed", "Pattern Recognition", "Executive Function"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
          <h1 className="text-3xl font-bold text-purple-800">Brain Memory</h1>
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
                <Button className="w-full" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Reveal Pair
                </Button>
              </div>

              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Timer className="h-4 w-4" />
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>
                <Badge variant="secondary">Score: {score}</Badge>
                <Badge variant="outline">Moves: {moves}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="max-w-lg mx-auto">
                <div 
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`
                        aspect-square flex items-center justify-center text-4xl cursor-pointer
                        rounded-lg border-2 transition-all duration-300 transform
                        ${card.isFlipped || card.isMatched 
                          ? 'bg-white border-purple-300 scale-105' 
                          : 'bg-purple-200 border-purple-400 hover:bg-purple-300 hover:scale-105'
                        }
                        ${card.isMatched ? 'opacity-75' : ''}
                      `}
                      onClick={() => handleCardClick(card.id)}
                    >
                      {card.isFlipped || card.isMatched ? card.value : '❓'}
                    </div>
                  ))}
                </div>
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
                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                  {hints[currentHint]}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Progress:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Matched:</span>
                    <Badge>{cards.filter(c => c.isMatched).length / 2} / {cards.length / 2}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(cards.filter(c => c.isMatched).length / cards.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Game Settings:</h4>
                <div className="space-y-1 text-sm">
                  <div>Difficulty: <Badge variant="secondary">{difficulty}</Badge></div>
                  <div>Type: <Badge variant="secondary">{gameType}</Badge></div>
                  <div>Grid: <Badge variant="secondary">{rows}×{cols}</Badge></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Start from corners</li>
                  <li>• Remember patterns</li>
                  <li>• Focus on one area</li>
                  <li>• Use associations</li>
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
        gameTitle="Memory"
      />
    </div>
  );
};
