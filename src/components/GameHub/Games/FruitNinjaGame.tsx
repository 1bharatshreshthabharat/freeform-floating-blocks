
import React from 'react';
import { FruitNinjaGame as RefactoredFruitNinjaGame } from './FruitNinja/FruitNinjaGame';

interface FruitNinjaGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
  return <RefactoredFruitNinjaGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
