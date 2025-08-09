import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { themes } from './SortItRightData';

interface Item {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  items: Item[];
}

const GAME_DURATION = 180;

const SortItRight: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'fridge' | 'office' | 'toolbox'>('fridge');
  const [mode, setMode] = useState<'normal' | 'timed' | 'zen'>('normal');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showThemeSelect, setShowThemeSelect] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [bestScores, setBestScores] = useState<{ [key: string]: number }>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  // Sound effects
  const playSound = useCallback((type: 'correct' | 'wrong' | 'complete') => {
    if (!soundEnabled) return;
    const audio = new Audio();
    switch (type) {
      case 'correct':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxOquL0ul0RGHfN8N2QQQoRXrTp66hUGwxOquL0ul0RGHfF8N2QQQoRXrTp66hUGwxGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxOquL0ul0RGHfF8N2QQQoRXrTp66hUGwxGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxGp+PwtmMcBjiRzf3l';
        break;
      case 'wrong':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxOquL0ul0RGHfN8N2QQQoRXrTp66hUGwxOquL0ul0RGHfF8N2QQQoRXrTp66hUGwxGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxOquL0ul0RGHfF8N2QQQoRXrTp66hUGwxGn+DyvmUQJH3N8duMOQkQYrXs6aRTGwxGp+PwtmMcBjiRzf3l';
        break;
      case 'complete':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;
    }
    audio.play().catch(() => {});
  }, [soundEnabled]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && mode === 'timed' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted && mode === 'timed') {
      endGame();
    }
  }, [timeLeft, gameStarted, mode]);

  // Load best scores
  useEffect(() => {
    const stored = localStorage.getItem('sortitright_scores');
    if (stored) setBestScores(JSON.parse(stored));
  }, []);

  const startGame = useCallback(() => {
    const { items, categories } = themes[theme];
    
    // Adjust difficulty
    let gameItems = [...items];
    if (difficulty === 'easy') {
      gameItems = gameItems.slice(0, Math.floor(gameItems.length * 0.7));
    } else if (difficulty === 'hard') {
      // Add more complex items or duplicate some
      const extraItems = items.slice(0, Math.floor(items.length * 0.3)).map((item, index) => ({
        ...item,
        id: `${item.id}_extra_${index}`,
        name: `${item.name} (2)`
      }));
      gameItems = [...gameItems, ...extraItems];
    }

    setItems(gameItems);
    setCategories(categories.map(c => ({ ...c, items: [] })));
    setMoves(0);
    setScore(0);
    
    // Adjust time based on difficulty
    let gameTime = mode === 'timed' ? GAME_DURATION : 0;
    if (mode === 'timed') {
      if (difficulty === 'easy') gameTime = Math.floor(gameTime * 1.5);
      else if (difficulty === 'hard') gameTime = Math.floor(gameTime * 0.7);
    }
    
    setTimeLeft(gameTime);
    setGameStarted(true);
    setShowThemeSelect(false);
    setShowCustomization(false);
  }, [theme, mode, difficulty]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    const finalScore = calculateScore();
    const key = `${theme}_${mode}_${difficulty}`;
    const isBest = !bestScores[key] || finalScore > bestScores[key];
    
    if (isBest) {
      const updatedScores = { ...bestScores, [key]: finalScore };
      setBestScores(updatedScores);
      localStorage.setItem('sortitright_scores', JSON.stringify(updatedScores));
      playSound('complete');
      toast({ 
        title: 'New Best Score! 🏆', 
        description: `Score: ${finalScore}` 
      });
    } else {
      toast({ 
        title: 'Game Over', 
        description: `Score: ${finalScore}` 
      });
    }
    
    setShowCompletion(true);
  }, [bestScores, theme, mode, difficulty, playSound, toast]);

  const calculateScore = useCallback(() => {
    const correct = categories.reduce(
      (acc, cat) => acc + cat.items.filter(i => i.category === cat.id).length,
      0
    );
    const totalItems = themes[theme].items.length;
    const accuracy = (correct / totalItems) * 100;
    const efficiency = moves > 0 ? Math.max(0, 100 - moves) : 100;
    
    let multiplier = 1;
    if (difficulty === 'easy') multiplier = 0.8;
    else if (difficulty === 'hard') multiplier = 1.5;
    
    return Math.round((accuracy + efficiency + (mode === 'timed' ? timeLeft : 0)) * multiplier);
  }, [categories, theme, moves, difficulty, mode, timeLeft]);

  const onDrop = useCallback((categoryId: string, item?: Item) => {
    const itemToSort = item || draggedItem || selectedItem;
    if (!itemToSort) return;
    
    setMoves(m => m + 1);
    const correct = itemToSort.category === categoryId;
    
    if (correct) {
      setItems(i => i.filter(it => it.id !== itemToSort.id));
      setCategories(c =>
        c.map(cat =>
          cat.id === categoryId ? { ...cat, items: [...cat.items, itemToSort] } : cat
        )
      );
      
      const baseScore = difficulty === 'easy' ? 8 : difficulty === 'hard' ? 15 : 10;
      setScore(s => s + baseScore);
      playSound('correct');
      
      if (items.length === 1) {
        setTimeout(endGame, 1000);
      }
    } else {
      const penalty = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 8 : 5;
      setScore(s => Math.max(0, s - penalty));
      playSound('wrong');
      toast({ 
        title: 'Wrong Category!', 
        description: 'Try again!',
        variant: "destructive"
      });
    }
    
    setDraggedItem(null);
    setSelectedItem(null);
  }, [draggedItem, selectedItem, items.length, difficulty, endGame, playSound, toast]);

  const restartGame = useCallback(() => {
    setShowCompletion(false);
    setShowThemeSelect(true);
    setGameStarted(false);
    setMoves(0);
    setScore(0);
    setTimeLeft(GAME_DURATION);
  }, []);

  if (showCompletion) {
    const finalScore = calculateScore();
    const key = `${theme}_${mode}_${difficulty}`;
    const isBestScore = bestScores[key] === finalScore;
    
    return (
      <div className="p-4 min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center">
        <Card className="max-w-md text-center animate-scale-in">
          <CardContent className="p-8">
            <div className="text-6xl mb-4 animate-bounce">
              {isBestScore ? "🏆" : "🎉"}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              {isBestScore ? "New Best Score!" : "Game Complete!"}
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl font-bold text-secondary">Score: {finalScore}</p>
              <p className="text-lg">Moves: {moves}</p>
              <p className="text-muted-foreground">Theme: {theme}</p>
              <p className="text-muted-foreground">Mode: {mode}</p>
              <p className="text-muted-foreground">Difficulty: {difficulty}</p>
              {bestScores[key] && (
                <Badge variant="outline" className="mt-2">
                  Best: {bestScores[key]}
                </Badge>
              )}
            </div>
            <div className="space-y-3">
              <Button onClick={restartGame} className="w-full hover-scale">
                Play Again 🔄
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full hover-scale">
               ← Choose Different Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCustomization) {
    return (
      <div className="p-4 min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center">
        <Card className="max-w-md animate-scale-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">🎛️ Customize Game</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Theme</label>
                <Select value={theme} onValueChange={(value: 'fridge' | 'office' | 'toolbox') => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fridge">🧊 Fridge Organization</SelectItem>
                    <SelectItem value="office">📁 Office Supplies</SelectItem>
                    <SelectItem value="toolbox">🔧 Toolbox Sorting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Game Mode</label>
                <Select value={mode} onValueChange={(value: 'normal' | 'timed' | 'zen') => setMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">🎯 Normal (Standard)</SelectItem>
                    <SelectItem value="zen">🧘 Zen (Relaxed)</SelectItem>
                    <SelectItem value="timed">⏱️ Timed (Challenge)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy (Fewer items, more time)</SelectItem>
                    <SelectItem value="medium">🟡 Medium (Standard)</SelectItem>
                    <SelectItem value="hard">🔴 Hard (More items, less time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sound Effects</label>
                <Button
                  variant={soundEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="hover-scale"
                >
                  {soundEnabled ? "🔊 On" : "🔇 Off"}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Best Scores</label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {Object.entries(bestScores).map(([key, score]) => (
                    <Badge key={key} variant="secondary" className="justify-between">
                      <span className="text-xs">{key.replace(/_/g, ' ')}</span>
                      <span className="font-bold">{score}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={startGame} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all">
                  Start Game! 🎮
                </Button>
                <Button variant="outline" onClick={() => setShowCustomization(false)} className="w-full hover-scale">
                  ← Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showThemeSelect) {
    return (
      <div className="p-4 min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center">
        <Card className="max-w-md text-center animate-scale-in">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-primary">🎯 Sort It Right</h1>
            <p className="text-muted-foreground mb-6">
              Sort items into their correct categories as quickly and accurately as possible!
            </p>
            <div className="space-y-4">
              <Button onClick={() => setShowCustomization(true)} className="w-full text-lg py-6 hover-scale">
                ⚙️ Customize Game
              </Button>
              <Button onClick={startGame} variant="secondary" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all">
                Quick Start 🚀
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full hover-scale">
                 ← Choose Different Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="hover-scale">
            ← Games
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
            🎯 Sort It Right - {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </h1>
          <Button variant="outline" onClick={() => setShowCustomization(true)} className="hover-scale">
            ⚙️
          </Button>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <Badge variant="default" className="text-lg px-4 py-2">
            🏆 Score: {score}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🎯 Moves: {moves}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            📦 Items: {themes[theme].items.length - items.length}/{themes[theme].items.length}
          </Badge>
          {mode === 'timed' && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Badge>
          )}
        </div>

        {mode === 'timed' && (
          <Progress value={(timeLeft / GAME_DURATION) * 100} className="w-full max-w-md mx-auto mb-6 h-3" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items to Sort */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center text-primary">📦 Items to Sort</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {items.map(item => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedItem?.id === item.id ? 'ring-4 ring-primary scale-105' : ''
                  } ${draggedItem?.id === item.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  onDragEnd={() => setDraggedItem(null)}
                  onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                  title={item.name}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-bold">{item.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Item Actions */}
            {selectedItem && (
              <Card className="mt-4 animate-fade-in">
                <CardContent className="p-4">
                  <p className="text-center mb-3 font-medium">
                    🎯 Selected: <span className="font-bold text-primary">{selectedItem.name}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        onClick={() => onDrop(cat.id, selectedItem)}
                        variant="outline"
                        size="sm"
                        className="hover-scale text-xs"
                      >
                        {cat.emoji} {cat.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center text-primary">🎯 Categories</h3>
            <div className="space-y-4 ">
              {categories.map(cat => (
                <Card
                  key={cat.id}
                  className="min-h-24 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => onDrop(cat.id)}
                  onClick={() => selectedItem && onDrop(cat.id, selectedItem)}
                >
                  <CardContent className="p-4">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="font-bold text-foreground">{cat.name}</span>
                        </div>
                        <Badge variant="outline">
                          {cat.items.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map(i => (
                          <span key={i.id} title={i.name} className="text-lg animate-scale-in">
                            {i.emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {!gameStarted && (
          <div className="text-center mt-6">
            <Button onClick={startGame} className="text-lg px-8 py-3 hover-scale">
              Restart 🔁
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortItRight;