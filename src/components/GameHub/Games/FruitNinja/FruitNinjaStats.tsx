
import { useEffect } from 'react';

interface StatsProps {
  gameState: string;
  score: number;
  setHighScore: any;
  onStatsUpdate: any;
}

export const useFruitNinjaStats = ({ gameState, score, setHighScore, onStatsUpdate }: StatsProps) => {
  useEffect(() => {
    if (gameState === 'gameOver') {
      setHighScore((prev: number) => {
        const newHighScore = Math.max(prev, score);
        onStatsUpdate((prevStats: any) => ({ 
          ...prevStats, 
          totalScore: Math.max(prevStats.totalScore || 0, score),
          gamesPlayed: prevStats.gamesPlayed + 1
        }));
        return newHighScore;
      });
    }
  }, [gameState, score, setHighScore, onStatsUpdate]);
};
