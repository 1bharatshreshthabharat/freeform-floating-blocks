
import React from 'react';
import { WordWondersGame as MainWordWondersGame } from './WordWonders/WordWondersGame';

interface WordWondersGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const WordWondersGame: React.FC<WordWondersGameProps> = ({ onBack, onStatsUpdate }) => {
  return <MainWordWondersGame onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};
