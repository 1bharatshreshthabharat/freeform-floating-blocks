
import { useEffect } from 'react';

interface EffectsProps {
  setSliceTrail: any;
  gameState: string;
}

export const useFruitNinjaEffects = ({ setSliceTrail, gameState }: EffectsProps) => {
  // Update slice trail fade
  useEffect(() => {
    const interval = setInterval(() => {
      setSliceTrail((prev: any) => ({
        ...prev,
        points: prev.points
          .map((point: any) => ({ ...point, time: point.time - 2 }))
          .filter((point: any) => point.time > 0)
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [setSliceTrail]);
};
