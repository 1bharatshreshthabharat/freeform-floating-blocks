
import { useCallback } from 'react';
import { fruitTypes } from './fruitNinjaUtils';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY } from './FruitNinjaProvider';

interface GameLogicProps {
  gameState: string;
  level: number;
  combo: number;
  customization: any;
  setFruits: any;
  setParticles: any;
  setScore: any;
  setLevel: any;
  setCombo: any;
  setLives: any;
  setGameState: any;
  score: number;
}

export const useFruitNinjaGameLogic = ({
  gameState,
  level,
  combo,
  customization,
  setFruits,
  setParticles,
  setScore,
  setLevel,
  setCombo,
  setLives,
  setGameState,
  score
}: GameLogicProps) => {

  const fruitTypesList = [
    'apple', 'orange', 'banana', 'watermelon', 'pineapple', 'strawberry', 'grape', 'kiwi',
    'carrot', 'broccoli', 'tomato', 'eggplant', 'corn', 'pepper', 'onion', 'potato'
  ];

  const getDifficultyParams = useCallback(() => {
    const baseParams = {
      beginner: { spawnRate: 0.008, bombChance: 0.03, speed: 0.7, specialChance: 0.12 },
      medium: { spawnRate: 0.012, bombChance: 0.08, speed: 1.0, specialChance: 0.09 },
      expert: { spawnRate: 0.018, bombChance: 0.12, speed: 1.4, specialChance: 0.06 }
    }[customization.difficulty];

    return {
      ...baseParams,
      spawnRate: baseParams.spawnRate * customization.fruitSpawnRate * (1 + level * 0.08),
      speed: baseParams.speed * customization.gameSpeed
    };
  }, [customization.difficulty, customization.fruitSpawnRate, customization.gameSpeed, level]);

  const createParticles = useCallback((x: number, y: number, color: string, type: 'juice' | 'spark' | 'explosion', count: number = 10) => {
    if (!customization.enableParticles) return;
    
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 25,
        y: y + (Math.random() - 0.5) * 25,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: type === 'explosion' ? 80 : 40,
        maxLife: type === 'explosion' ? 80 : 40,
        color,
        size: type === 'explosion' ? Math.random() * 10 + 5 : Math.random() * 5 + 3,
        type
      });
    }
    
    setParticles((prev: any) => [...prev, ...newParticles]);
  }, [customization.enableParticles, setParticles]);

  const sliceFruit = useCallback((fruitId: number) => {
    setFruits((prev: any) => {
      const fruitIndex = prev.findIndex((f: any) => f.id === fruitId);
      if (fruitIndex === -1) return prev;
      
      const fruit = prev[fruitIndex];
      if (fruit.sliced) return prev;
      
      const newFruits = [...prev];
      newFruits[fruitIndex] = { ...fruit, sliced: true, sliceTime: Date.now() };
      
      if (fruit.isBomb) {
        setLives((current: number) => {
          const newLives = current - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          }
          return newLives;
        });
        createParticles(fruit.x, fruit.y, '#FF0000', 'explosion', 25);
        setCombo(0);
      } else {
        const points = fruit.points * (combo > 0 ? 1 + combo * 0.1 : 1);
        setScore((prev: number) => prev + Math.floor(points));
        setCombo((prev: number) => prev + 1);
        
        if ((score + points) % 400 < points) {
          setLevel((prev: number) => prev + 1);
        }
        
        const fruitData = fruitTypes[fruit.type as keyof typeof fruitTypes];
        createParticles(fruit.x, fruit.y, fruitData?.juiceColor || '#FF6B6B', 'juice', 18);
        createParticles(fruit.x, fruit.y, '#FFFF00', 'spark', 12);
      }
      
      return newFruits;
    });
  }, [createParticles, score, combo, setCombo, setFruits, setGameState, setLevel, setLives, setScore]);

  const spawnFruit = useCallback(() => {
    const params = getDifficultyParams();
    
    if (Math.random() < params.spawnRate) {
      const availableFruits = fruitTypesList.filter(type => fruitTypes[type as keyof typeof fruitTypes]);
      const fruitType = availableFruits[Math.floor(Math.random() * availableFruits.length)];
      const fruitData = fruitTypes[fruitType as keyof typeof fruitTypes] || fruitTypes.apple;
      
      const isBomb = Math.random() < params.bombChance;
      const isSpecial = !isBomb && Math.random() < params.specialChance;
      
      const newFruit = {
        id: Date.now() + Math.random(),
        x: Math.random() * (CANVAS_WIDTH - 120) + 60,
        y: CANVAS_HEIGHT + 60,
        vx: (Math.random() - 0.5) * 5 * params.speed,
        vy: -(Math.random() * 10 + 12) * params.speed,
        type: isBomb ? 'bomb' : fruitType,
        size: isBomb ? 45 : (35 + Math.random() * 25),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        sliced: false,
        sliceTime: 0,
        isBomb,
        isSpecial,
        points: isSpecial ? fruitData.points * 2 : fruitData.points
      };
      
      setFruits((prev: any) => [...prev, newFruit]);
    }
  }, [getDifficultyParams, setFruits, fruitTypesList]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    setFruits((prev: any) => {
      const newFruits = prev
        .map((fruit: any) => ({
          ...fruit,
          x: fruit.x + fruit.vx,
          y: fruit.y + fruit.vy,
          vy: fruit.vy + GRAVITY,
          rotation: fruit.rotation + fruit.rotationSpeed
        }))
        .filter((fruit: any) => {
          if (fruit.sliced && Date.now() - fruit.sliceTime > 600) return false;
          if (!fruit.sliced && fruit.y > CANVAS_HEIGHT + 120) {
            if (!fruit.isBomb) {
              setLives((current: number) => {
                const newLives = current - 1;
                if (newLives <= 0) {
                  setGameState('gameOver');
                }
                return newLives;
              });
              setCombo(0);
            }
            return false;
          }
          return true;
        });
      
      return newFruits;
    });

    setParticles((prev: any) => {
      return prev
        .map((particle: any) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.4,
          life: particle.life - 1,
          vx: particle.vx * 0.97
        }))
        .filter((particle: any) => particle.life > 0);
    });

    spawnFruit();
  }, [gameState, spawnFruit, setFruits, setGameState, setLives, setCombo, setParticles]);

  return {
    sliceFruit,
    updateGame,
    createParticles
  };
};
