import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { levels, itemDatabase, aisleData, gameModes, themes } from './SupermarketSortData';
import Confetti from 'canvas-confetti';

interface SupermarketSortGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Item {
  id: string;
  name: string;
  category: string;
  emoji: string;
  price: number;
  sorted: boolean;
}

interface GameLevel {
  level: number;
  timeLimit: number;
  itemCount: number;
  categories: string[];
  theme: string;
}



export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

const SupermarketSort: React.FC<SupermarketSortGameProps> = ({ onBack, onStatsUpdate }) => {
  const { toast } = useToast();
  const { gameId } = useParams<{ gameId: string }>();
  const { width, height } = useWindowSize();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showGameModes, setShowGameModes] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'supermarket' | 'office' | 'parking' | 'eggs'>(() => getGameModeFromUrl());
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [aisles, setAisles] = useState<{ [key: string]: Item[] }>({});
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameMode, setGameMode] = useState<'normal' | 'zen' | 'timed'>('normal');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState({
    itemsSorted: 0,
    perfectSorts: 0,
    wrongSorts: 0,
    shoppingItemsFound: 0
  });

  // Get game mode from URL
  function getGameModeFromUrl(): 'supermarket' | 'office' | 'parking' | 'eggs' {
    if (gameId === 'supermarket-sort') return 'supermarket';
    if (gameId === 'office-sort') return 'office';
    if (gameId === 'parking-sort') return 'parking';
    if (gameId === 'eggs-sort') return 'eggs';
    return 'supermarket';
  }

  // Load best score from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem(`bestScore-${selectedMode}`);
    if (savedBest) setBestScore(parseInt(savedBest));
  }, [selectedMode]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && gameMode !== 'zen') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && gameStarted && gameMode !== 'zen') {
      endGame();
    }
  }, [timeLeft, gameStarted, gameMode]);

  // Generate items for the level
  const generateItems = useCallback(() => {
    const level = levels[currentLevel - 1];
    const newItems: Item[] = [];
    const newAisles: { [key: string]: Item[] } = {};
    
    level.categories.forEach(category => {
      newAisles[category] = [];
    });

    for (let i = 0; i < level.itemCount; i++) {
      const category = level.categories[Math.floor(Math.random() * level.categories.length)];
      const categoryItems = itemDatabase[category];
      const itemData = categoryItems[Math.floor(Math.random() * categoryItems.length)];
      
      newItems.push({
        id: `item-${i}`,
        name: itemData.name,
        category,
        emoji: itemData.emoji,
        price: itemData.price,
        sorted: false
      });
    }

    const listSize = Math.min(8, Math.max(6, Math.floor(level.itemCount * 0.4)));
    const shuffled = [...newItems].sort(() => 0.5 - Math.random());
    const newShoppingList = shuffled.slice(0, listSize).map(item => item.name);

    setItems(newItems);
    setAisles(newAisles);
    setShoppingList(newShoppingList);
    setCart([]);
    setStats(prev => ({ ...prev, itemsSorted: 0 }));
  }, [currentLevel]);

  const startGame = useCallback(() => {
    const level = levels[currentLevel - 1];
    setGameStarted(true);
    setShowTutorial(false);
    setTimeLeft(gameMode === 'timed' ? Math.floor(level.timeLimit * 0.7) : level.timeLimit);
    setScore(0);
    generateItems();
    setShowConfetti(false);
  }, [currentLevel, gameMode, generateItems]);

  const playSound = (type: 'correct' | 'wrong' | 'complete' | 'click') => {
    if (!soundEnabled) return;
    // Inline sound implementation
    const audio = new Audio();
    audio.src = `data:audio/wav;base64,${getSoundBase64(type)}`;
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  // Simplified sound implementation (would need actual base64 sounds)
  const getSoundBase64 = (type: string) => {
    // Placeholder - in a real app you'd have actual sound files here
    return 'UklGRl9...'; // truncated base64 string
  };

  const addToCart = (item: Item) => {
    setCart(prev => [...prev, item]);
    setItems(prev => prev.filter(i => i.id !== item.id));
    
    const isOnList = shoppingList.includes(item.name);
    const points = isOnList ? 50 : 10;
    
    setScore(prev => prev + points);
    setStats(prev => ({
      ...prev,
      shoppingItemsFound: isOnList ? prev.shoppingItemsFound + 1 : prev.shoppingItemsFound
    }));

    playSound('correct');
    toast({
      title: isOnList ? "On the list! ✅" : "Extra item 📦",
      description: `Added ${item.name} to cart (+${points} pts)`,
    });
  };

  const sortItem = (item: Item, aisle: string) => {
    if (item.category === aisle) {
      setAisles(prev => ({
        ...prev,
        [aisle]: [...prev[aisle], item]
      }));
      
      setItems(prev => prev.filter(i => i.id !== item.id));
      setScore(prev => prev + 30);
      setStats(prev => ({
        ...prev,
        itemsSorted: prev.itemsSorted + 1,
        perfectSorts: prev.perfectSorts + 1
      }));

      playSound('correct');
      toast({
        title: "Perfect placement! 🎯",
        description: `${item.name} sorted correctly!`,
      });

      if (items.length === 1) {
        setTimeout(() => {
          checkShoppingCompletion();
        }, 1000);
      }
    } else {
      setScore(prev => Math.max(0, prev - 15));
      setStats(prev => ({
        ...prev,
        wrongSorts: prev.wrongSorts + 1
      }));

      playSound('wrong');
      toast({
        title: "Wrong aisle! 🤔",
        description: `${item.name} doesn't belong in ${aisleData[aisle]?.name}!`,
      });
    }
    setSelectedItem(null);
  };

  const checkShoppingCompletion = () => {
    const cartItemNames = cart.map(item => item.name);
    const foundListItems = shoppingList.filter(listItem => cartItemNames.includes(listItem));
    const completionBonus = foundListItems.length * 100;
    const perfectBonus = foundListItems.length === shoppingList.length ? 200 : 0;
    
    setScore(prev => prev + completionBonus + perfectBonus);
    
    if (foundListItems.length === shoppingList.length) {
      playSound('complete');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      toast({
        title: "Perfect Shopping! 🛒✨",
        description: `Found all ${shoppingList.length} items! +${completionBonus + perfectBonus} bonus!`,
      });
    } else {
      toast({
        title: "Shopping Done! 🛒",
        description: `Found ${foundListItems.length}/${shoppingList.length} list items. +${completionBonus} bonus!`,
      });
    }

    setTimeout(() => {
      setShowCompletion(true);
    }, 2000);
  };

  const nextLevel = () => {
    setCurrentLevel(prev => {
      const nextLevel = prev + 1;
      if (nextLevel > levels.length) {
        endGame();
        return prev;
      }
      return nextLevel;
    });
    
    toast({
      title: "Store Section Complete! 🎉",
      description: `Moving to ${levels[currentLevel]?.theme}!`,
    });
    
    setTimeout(() => {
      const nextLevelData = levels[currentLevel];
      setTimeLeft(gameMode === 'timed' ? Math.floor(nextLevelData.timeLimit * 0.7) : nextLevelData.timeLimit);
      generateItems();
      setShowCompletion(false);
    }, 1500);
  };

  const endGame = () => {
    setGameStarted(false);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(`bestScore-${selectedMode}`, score.toString());
    }
    
    toast({
      title: "Shopping Trip Complete! 🏆",
      description: `Final Score: ${score} points!`,
    });
  };

  // Auto-start based on URL
  useEffect(() => {
    if (gameId && gameId !== 'office-sorting') {
      setSelectedMode(getGameModeFromUrl());
      setShowGameModes(false);
      setShowTutorial(true);
    }
  }, [gameId]);

  if (showHowToPlay) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${themes[currentTheme].background}`}>
        <Card className="max-w-2xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">🎯 How to Play</h2>
              <Button variant="outline" onClick={() => setShowHowToPlay(false)}>✕</Button>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-bold mb-2">🎮 Game Modes</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Normal</strong>: Standard gameplay with time limit</li>
                  <li><strong>Zen</strong>: Relaxed mode with no time pressure</li>
                  <li><strong>Timed</strong>: Faster-paced with shorter time limits</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Scoring System</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Correct sorting: +30 points</li>
                  <li>Shopping list items: +50 points</li>
                  <li>Wrong placement: -15 points</li>
                  <li>Perfect completion: +200 bonus</li>
                  <li>Time bonus (normal mode): +1 point per second remaining</li>
                </ul>
              </div>
           
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showTutorial) {
    const mode = gameModes[selectedMode];
    return (
     <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${themes[currentTheme].background}`}>
  <Card className="w-full max-w-md text-center">
    <CardContent className="p-4 sm:p-8">
      <div className="text-4xl sm:text-6xl mb-4">{mode.emoji}</div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">{mode.title}</h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-6">{mode.description}</p>

      {/* Mode Selector */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Button 
            variant={gameMode === 'normal' ? 'default' : 'outline'} 
            onClick={() => setGameMode('normal')}
          >
            Normal
          </Button>
          <Button 
            variant={gameMode === 'zen' ? 'default' : 'outline'} 
            onClick={() => setGameMode('zen')}
          >
            Zen
          </Button>
          <Button 
            variant={gameMode === 'timed' ? 'default' : 'outline'} 
            onClick={() => setGameMode('timed')}
          >
            Timed
          </Button>
        </div>

        {/* Theme Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {Object.keys(themes).map((theme) => (
            <Button 
              key={theme}
              variant={currentTheme === theme ? 'default' : 'outline'}
              onClick={() => setCurrentTheme(theme)}
              className="capitalize"
            >
              {theme} Theme
            </Button>
          ))}
        </div>
      </div>

      {/* Start + Back Buttons */}
      <div className="space-y-3">
        <Button onClick={startGame} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-600 hover:to-pink-500 transition-all">
          Start Game! 🎮
        </Button>
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="w-full"
        >
          ← Choose Different Game
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

    );
  }

  if (showCompletion) {
    const level = levels[currentLevel - 1];
    const timeBonus = gameMode === 'normal' ? timeLeft : 0;
    const isPerfect = cart.map(i => i.name).filter(name => shoppingList.includes(name)).length === shoppingList.length;
    
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${themes[currentTheme].background}`}>
        {showConfetti && <Confetti width={width} height={height} recycle={false} />}
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">{isPerfect ? '🎉' : '👍'}</div>
            <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Best</div>
                <div className="text-xl font-bold">{Math.max(score, bestScore)}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Level</div>
                <div className="text-xl font-bold">{currentLevel}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Time Bonus</div>
                <div className="text-xl font-bold">+{timeBonus}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={() => {
                setScore(prev => prev + timeBonus);
                setShowCompletion(false);
                if (currentLevel < levels.length) {
                  nextLevel();
                } else {
                  endGame();
                }
              }} className="w-full">
                {currentLevel < levels.length ? 'Next Level 🎯' : 'Complete Game 🏆'}
              </Button>
              <Button variant="outline" onClick={() => {
                setCurrentLevel(1);
                setShowCompletion(false);
                startGame();
              }} className="w-full">
                Restart Game 🔄
              </Button>
              <Button variant="outline" onClick={() => setShowHowToPlay(true)} className="w-full">
                View Stats 📊
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${themes[currentTheme].background}`}>
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            
            <div className="mb-6 space-y-2">
              <p className="text-xl">Final Score: {score}</p>
              <p className="text-muted-foreground">Best Score: {bestScore}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-muted p-2 rounded">
                  <div className="text-sm">Items Sorted</div>
                  <div className="font-bold">{stats.itemsSorted}</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="text-sm">Perfect Sorts</div>
                  <div className="font-bold">{stats.perfectSorts}</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="text-sm">Wrong Sorts</div>
                  <div className="font-bold">{stats.wrongSorts}</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="text-sm">Items Found</div>
                  <div className="font-bold">{stats.shoppingItemsFound}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={() => { setCurrentLevel(1); startGame(); }} className="w-full">
                New Game 🔄
              </Button>
              <Button variant="outline" onClick={() => setShowTutorial(true)} className="w-full">
                Change Mode 🎮
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                 ← Choose Different Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const level = levels[currentLevel - 1];
  const progressValue = ((level.itemCount - items.length) / level.itemCount) * 100;

  return (
    <div className={`min-h-screen p-6 ${themes[currentTheme].background}`}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={onBack}>
              ← Games
            </Button>
            <h1 className="text-3xl font-bold">
              {gameModes[selectedMode].emoji} {level.theme} - Level {currentLevel}
              {gameMode === 'zen' && ' (Zen Mode)'}
              {gameMode === 'timed' && ' (Timed Mode)'}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowHowToPlay(true)}>
                ❓ Help
              </Button>
              <Button variant="outline" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? '🔊' : '🔇'}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="text-xl">🏆 Score: {score}</div>
            {gameMode !== 'zen' && (
              <div className="text-xl">⏰ Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            )}
            <div className="text-xl">📝 List: {shoppingList.length}</div>
            <div className="text-xl">🥇 Best: {bestScore}</div>
          </div>
          
          <Progress value={progressValue} className="w-64 mx-auto" />
          {progressValue > 0 && (
            <p className="text-sm mt-1">
              {Math.round(progressValue)}% complete ({level.itemCount - items.length}/{level.itemCount} items)
            </p>
          )}
        </div>

        {/* Game Area */}
        <div className="max-w-4xl mx-auto">
          {/* Aisles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {level.categories.map(category => (
              <Card 
                key={category}
                className={`min-h-40 cursor-pointer transition-transform hover:scale-105 ${themes[currentTheme].card}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => selectedItem && sortItem(selectedItem, category)}
                onClick={() => selectedItem && sortItem(selectedItem, category)}
              >
                <CardContent className="p-4">
                  <div className={`h-full rounded-lg p-4 ${themes[currentTheme].aisle}`}>
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">{aisleData[category]?.emoji}</div>
                      <div className="text-sm font-bold">{aisleData[category]?.name}</div>
                      <div className="text-xs">Items: {aisles[category]?.length || 0}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {aisles[category]?.slice(0, 6).map(item => (
                        <div key={item.id} className="text-lg text-center">
                          {item.emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Items to Sort */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">🏪 Items to Sort</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedItem?.id === item.id ? 'ring-4 ring-primary scale-105' : 'hover:shadow-lg'
                  } ${themes[currentTheme].itemCard}`}
                  draggable
                  onDragStart={() => setSelectedItem(item)}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">${item.price}</div>
                    {shoppingList.includes(item.name) && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-xs px-1 rounded-bl">
                        List
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Item Actions */}
          {selectedItem && (
            <div className="text-center mt-6 animate-bounce">
              <p className="text-lg mb-4">
                Sorting: {selectedItem.emoji} {selectedItem.name}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {level.categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => sortItem(selectedItem, category)}
                    variant="outline"
                    className="capitalize"
                  >
                    {aisleData[category]?.emoji} {aisleData[category]?.name}
                  </Button>
                ))}
                <Button
                  onClick={() => addToCart(selectedItem)}
                  variant="secondary"
                >
                  🛒 Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupermarketSort;