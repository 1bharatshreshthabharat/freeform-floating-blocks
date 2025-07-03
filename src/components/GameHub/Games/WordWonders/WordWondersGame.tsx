
import React from 'react';
import { WordWondersProvider } from './WordWondersProvider';
import { WordWondersHeader } from './WordWondersHeader';
import { WordWondersCanvas } from './WordWondersCanvas';
import { WordWondersControls } from './WordWondersControls';
import { useWordWonders } from './WordWondersProvider';

const GameContent: React.FC = () => {
  const { state } = useWordWonders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Clean header with game stats */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-purple-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">Word Wonders</h1>
            <p className="text-purple-600">Learn words through play!</p>
          </div>
          
          {/* Clean stats display */}
          {state.isGameActive && (
            <div className="flex gap-4 text-sm">
              <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                <div className="font-bold text-green-700">{state.score}</div>
                <div className="text-green-600">Score</div>
              </div>
              <div className="bg-yellow-100 px-3 py-2 rounded-lg border border-yellow-300">
                <div className="font-bold text-yellow-700">{'⭐'.repeat(state.stars)}</div>
                <div className="text-yellow-600">Stars</div>
              </div>
              <div className="bg-blue-100 px-3 py-2 rounded-lg border border-blue-300">
                <div className="font-bold text-blue-700">{state.timeLeft}s</div>
                <div className="text-blue-600">Time</div>
              </div>
              <div className="bg-red-100 px-3 py-2 rounded-lg border border-red-300">
                <div className="font-bold text-red-700">{'❤️'.repeat(state.lives)}</div>
                <div className="text-red-600">Lives</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Game instruction card */}
        {state.isGameActive && (
          <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-bold text-blue-700 mb-2">
                {state.mode === 'word-riddle' && '🧠 Solve the Riddle'}
                {state.mode === 'complete-verb' && '🏃 Complete the Action'}
                {state.mode === 'fix-word' && '🧩 Fix the Word'}
                {state.mode === 'make-words' && '🔤 Make Words'}
                {state.mode === 'magic-trays' && '🔮 Spell What You See'}
                {state.mode === 'sentence-picker' && '📚 Pick the Right Word'}
                {state.mode === 'hidden-word' && '🕵️ Find the Hidden Word'}
              </h2>
              
              {state.riddle && (
                <p className="text-purple-600 italic text-base mb-2">{state.riddle}</p>
              )}
              {state.sentence && (
                <p className="text-purple-600 italic text-base mb-2">{state.sentence}</p>
              )}
              
              <div className="text-lg font-bold text-gray-700">
                Spell: <span className="text-purple-700">{state.targetWord}</span>
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
            <WordWondersCanvas />
          </div>
        )}

        {/* Simple instructions */}
        {!state.isGameActive && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-200 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
              🎮 How to Play
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl mb-2">🖱️</div>
                <div className="font-semibold text-blue-700">Drag Letters</div>
                <div className="text-sm text-blue-600">Click and drag floating letters</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-green-700">Drop in Boxes</div>
                <div className="text-sm text-green-600">Place letters in correct order</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-semibold text-yellow-700">Earn Stars</div>
                <div className="text-sm text-yellow-600">Complete words to win!</div>
              </div>
            </div>
          </div>
        )}
      </div>
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
