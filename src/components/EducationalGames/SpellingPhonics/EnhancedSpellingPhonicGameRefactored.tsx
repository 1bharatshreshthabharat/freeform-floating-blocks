import React from 'react';
import { SpellingPhonicGameProvider } from './SpellingPhonicGameProvider';
import { SpellingGameHeader } from './SpellingGameHeader';
import { SpellingGameSidebar } from './SpellingGameSidebar';
import { SpellingGameArea } from './SpellingGameArea';

interface EnhancedSpellingPhonicGameRefactoredProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const EnhancedSpellingPhonicGameRefactored: React.FC<EnhancedSpellingPhonicGameRefactoredProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <SpellingPhonicGameProvider onStatsUpdate={onStatsUpdate}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <SpellingGameHeader onBack={onBack} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SpellingGameSidebar />
            <SpellingGameArea />
          </div>
        </div>
      </div>
    </SpellingPhonicGameProvider>
  );
};