import React from 'react';
import { EnhancedMazeGameApp } from './EnhancedMazeGameApp';

interface MazeGameAppProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Position {
  x: number;
  y: number;
}

interface MazeCell {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isPath?: boolean;
}

const MAZE_SIZES = {
  easy: { width: 8, height: 8, name: 'Easy (8x8)' },
  medium: { width: 12, height: 12, name: 'Medium (12x12)' },
  hard: { width: 16, height: 16, name: 'Hard (16x16)' }
};

export const MazeGameApp: React.FC<MazeGameAppProps> = ({ onBack, onStatsUpdate }) => {
  return <EnhancedMazeGameApp onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};