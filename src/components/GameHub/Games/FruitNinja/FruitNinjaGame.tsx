
import React from 'react';
import { FruitNinjaProvider } from './FruitNinjaProvider';
import { FruitNinjaCanvas } from './FruitNinjaCanvas';
import { FruitNinjaControls } from './FruitNinjaControls';
import { FruitNinjaModals } from './FruitNinjaModals';
import { FruitNinjaHeader } from './FruitNinjaHeader';

interface FruitNinjaGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <FruitNinjaProvider onStatsUpdate={onStatsUpdate}>
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-4">
        <div className="max-w-6xl mx-auto">
          <FruitNinjaHeader onBack={onBack} />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <FruitNinjaCanvas />
            <FruitNinjaControls />
          </div>
          
          <FruitNinjaModals />
        </div>
      </div>
    </FruitNinjaProvider>
  );
};
