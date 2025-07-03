
import React from 'react';
import { WordWondersProvider } from './WordWondersProvider';
import { WordWondersGameArea } from './WordWondersGameArea';
import { WordWondersControls } from './WordWondersControls';
import { WordWondersGameTimer } from './WordWondersGameTimer';
import { WordWondersGameOverModal } from './WordWondersGameOverModal';
import { useWordWonders } from './WordWondersProvider';

const GameContent: React.FC = () => {
  const { state } = useWordWonders();

  const getGameInstruction = () => {
    switch (state.mode) {
      case 'complete-verb':
        return '🏃 Complete the Action Word';
      case 'make-words':
        return '🔤 Make as Many Words as Possible';
      case 'fix-word':
        return '🧩 Unscramble the Letters';
      case 'word-riddle':
        return '🧠 Solve the Riddle';
      case 'guess-word':
        return '📝 Complete the Sentence';
      case 'hidden-word':
        return '🕵️ Find the Hidden Word';
      default:
        return '🎮 Choose a Game Mode';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-purple-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">Word Wonders</h1>
            <p className="text-purple-600">Learn words through play!</p>
          </div>
          
          {/* Score Display */}
          {state.isGameActive && (
            <div className="flex gap-3 text-sm">
              <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                <div className="font-bold text-green-700">{state.score}</div>
                <div className="text-green-600 text-xs">Score</div>
              </div>
              <div className="bg-yellow-100 px-3 py-2 rounded-lg border border-yellow-300">
                <div className="font-bold text-yellow-700">{'⭐'.repeat(state.stars)}</div>
                <div className="text-yellow-600 text-xs">Stars</div>
              </div>
              {state.mode === 'make-words' && (
                <div className="bg-purple-100 px-3 py-2 rounded-lg border border-purple-300">
                  <div className="font-bold text-purple-700">{state.foundWords.length}</div>
                  <div className="text-purple-600 text-xs">Words Found</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Game Instruction */}
        {state.isGameActive && (
          <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-bold text-blue-700 mb-2">
                {getGameInstruction()}
              </h2>
              
              {state.riddle && (
                <p className="text-purple-600 italic text-base mb-2">
                  💡 {state.riddle}
                </p>
              )}
              
              {state.sentence && (
                <p className="text-purple-600 italic text-base mb-2">
                  📝 {state.sentence}
                </p>
              )}
              
              {state.mode === 'make-words' && state.possibleWords && (
                <p className="text-green-600 text-sm">
                  💡 Hint: You can make {state.possibleWords.length} words from these letters!
                </p>
              )}
              
              {state.mode === 'fix-word' && (
                <p className="text-orange-600 text-sm">
                  🔀 These letters are mixed up. Can you put them in the right order?
                </p>
              )}
              
              <div className="text-lg font-bold text-gray-700 mt-2">
                Target: <span className="text-purple-700">{state.targetWord.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="mb-6">
          <WordWondersControls />
        </div>
        
        {/* Game Canvas */}
        {state.isGameActive && (
          <div className="mb-6">
            <WordWondersGameArea />
          </div>
        )}

        {/* Instructions when not playing */}
        {!state.isGameActive && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-200 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
              🎮 Ready to Play Word Wonders?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl mb-2">👆</div>
                <div className="font-semibold text-blue-700">Click Letters</div>
                <div className="text-sm text-blue-600">Click on floating letters to select them</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl mb-2">📍</div>
                <div className="font-semibold text-green-700">Place on Lines</div>
                <div className="text-sm text-green-600">Letters will appear on colorful lines</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-3xl mb-2">⭐</div>
                <div className="font-semibold text-yellow-700">Earn Points</div>
                <div className="text-sm text-yellow-600">Complete words to score!</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                Choose a game mode above and it will start automatically! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Found Words Display for Make Words mode */}
        {state.mode === 'make-words' && state.foundWords.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
            <h3 className="text-lg font-bold text-green-700 mb-2">
              🎉 Words You Found ({state.foundWords.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.foundWords.map((word, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-300"
                >
                  {word.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Game Timer Component */}
      <WordWondersGameTimer />
      
      {/* Game Over Modal */}
      <WordWondersGameOverModal />
    </div>
  );
};

interface WordWondersGameProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const WordWondersGame: React.FC<WordWondersGameProps> = ({ onBack, onStatsUpdate }) => {
  return (
    <WordWondersProvider>
      <div className="relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-purple-700 font-bold py-2 px-4 rounded-lg border-2 border-purple-300 transition-colors"
        >
          ← Back to Games
        </button>
        <GameContent />
      </div>
    </WordWondersProvider>
  );
};
