
import React, { useState } from 'react';
import { WordWondersProvider } from './WordWondersProvider';
import { WordWondersGameArea } from './WordWondersGameArea';
import { WordWondersControls } from './WordWondersControls';
import { WordWondersGameTimer } from './WordWondersGameTimer';
import { WordWondersGameOverModal } from './WordWondersGameOverModal';
import { WordWondersCustomizeModal } from './WordWondersCustomizeModal';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { HowToPlayModal } from './HowToPlayModal';
import { Card } from '@/components/ui/card';
import { Settings, ArrowLeft, Volume2, VolumeX, HelpCircle, Heart, Star, Timer, Trophy  } from 'lucide-react';

const GameContent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, dispatch, startGame, pauseGame, resetGame, speakText, playSound } = useWordWonders();
  const [showCustomize, setShowCustomize] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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

  const handleSoundToggle = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    if (state.soundEnabled) {
      speakText('Sound disabled');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Compact Header */}
     
     <div className="bg-white/95 backdrop-blur-sm border-b-2 border-purple-200 px-4 py-3">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
    {/* Left - Back + Title */}
    <div className="flex items-start sm:items-center gap-3">
      <Button onClick={onBack} variant="ghost" size="sm" className="text-purple-700">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div>
        <h1 className="text-xl font-bold text-purple-700 leading-tight">Word Wonders</h1>
        <p className="text-sm text-purple-600 -mt-1">Learn words through play!</p>
      </div>
    </div>

    {/* Right - Controls */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
      {state.isGameActive && (
        <>
          <Button
            onClick={handleSoundToggle}
            variant="outline"
            size="sm"
            className="bg-white/80 border-purple-300"
          >
            {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => setShowHowToPlay(true)}
            variant="outline"
            size="sm"
            className="bg-white/80 border-purple-300"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            How to Play
          </Button>

          <Button
            onClick={() => setShowCustomize(true)}
            variant="outline"
            size="sm"
            className="bg-white/80 border-purple-300"
          >
            <Settings className="h-4 w-4 mr-1" />
            Customize
          </Button>

          {/* Score Display */}
          <div className="flex gap-2 text-sm">
             {state.mode === 'make-words' && (
              <div className="bg-purple-100 px-2 py-1 rounded border border-purple-300 text-center min-w-[50px]">
                <div className="font-bold text-purple-700">{state.foundWords.length}</div>
                <div className="text-purple-600 text-xs">Words</div>
              </div>
            )}
            <div className="bg-green-100 px-2 py-1 rounded border border-green-300 text-center min-w-[50px]">
              <div className="font-bold text-green-700">{state.score}</div>
              <div className="text-green-600 text-xs">Score</div>
            </div>
            <div className="bg-yellow-100 px-2 py-1 rounded border border-yellow-300 text-center min-w-[50px]">
              <div className="font-bold text-yellow-700">{'⭐'.repeat(state.stars)}</div>
              <div className="text-yellow-600 text-xs">Stars</div>
            </div>
             <div className="bg-red-100 px-2 py-1 rounded border border-red-300 text-center min-w-[50px]">
              <div className="font-bold text-red-700">{state.level}</div>
              <div className="text-red-600 text-xs">Level</div>
            </div>
           
          </div>

<div>
           <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Heart 
                  key={i} 
                  size={16} 
                  className={i < state.lives ? "text-red-500 fill-current" : "text-gray-300"} 
                />
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1">
              <Timer size={16} className="text-blue-500" />
              <span className="font-semibold">{state.timeLeft}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  </div>

  {/* Modals (keep outside flex for cleaner structure) */}
  <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
</div>


      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Compact Game Instruction */}
        {state.isGameActive && (
          <div className="mb-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border-2 border-blue-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-base font-bold text-blue-700 mb-1">
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
        
        {/* Compact Controls */}
        {/* {!state.isGameActive && (
          <div className="mb-4">
            <WordWondersControls />
          </div>
        )} */}
        
        {/* Game Canvas */}
        {state.isGameActive && (
          <div className="mb-4">
            <WordWondersGameArea />
          </div>
        )}






<Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Choose Your Adventure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { mode: 'complete-verb' as const, title: 'Complete Verbs', icon: '📝', desc: 'Fill in missing letters' },
                { mode: 'make-words' as const, title: 'Make Words', icon: '🔤', desc: 'Create as many words as possible' },
                { mode: 'fix-word' as const, title: 'Fix Words', icon: '🔧', desc: 'Unscramble the letters' },
                { mode: 'word-riddle' as const, title: 'Word Riddles', icon: '🧩', desc: 'Solve word puzzles' },
                { mode: 'guess-word' as const, title: 'Guess Words', icon: '🎯', desc: 'Guess from clues' },
                { mode: 'hidden-word' as const, title: 'Hidden Words', icon: '🔍', desc: 'Find the hidden word' }
              ].map((game) => (
                <Button
                  key={game.mode}
                  variant="outline"
                  onClick={() => startGame(game.mode)}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                >
                  <span className="text-2xl">{game.icon}</span>
                  <span className="font-semibold text-sm">{game.title}</span>
                  <span className="text-xs text-gray-600 text-center">{game.desc}</span>
                </Button>
              ))}
            </div>

            {/* Quick Settings */}
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                className="flex items-center gap-2"
              >
                {state.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                Sound
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomize(true)}
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Customize
              </Button>
            </div>
          </Card>

          {/* Game Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Trophy className="text-yellow-500" />, label: 'Score', value: state.score },
              { icon: <Star className="text-purple-500" />, label: 'Level', value: state.level },
              { icon: <Heart className="text-red-500" />, label: 'Lives', value: state.lives },
              { icon: <Timer className="text-blue-500" />, label: 'Time', value: `${state.timeLeft}s` }
            ].map((stat, index) => (
              <Card key={index} className="p-4 text-center bg-white/60 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>




        {/* Instructions when not playing */}
        {/* {!state.isGameActive && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-1 border-yellow-200 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
              🎮 Ready to Play Word Wonders?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl mb-2">👆</div>
                <div className="font-semibold text-blue-700">Click Letters</div>
                <div className="text-sm text-blue-600">Click on floating letters to select theme</div>
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
        )} */}

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
      
      {/* Customize Modal */}
      <WordWondersCustomizeModal 
        isOpen={showCustomize} 
        onClose={() => setShowCustomize(false)} 
      />
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
      <GameContent onBack={onBack} />
    </WordWondersProvider>
  );
};
