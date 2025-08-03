import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpellingPhonicGame } from './SpellingPhonicGameProvider';

export const SpellingGameArea: React.FC = () => {
  const { state, checkSpelling, handleKeyPress, resetGame, speak } = useSpellingPhonicGame();

  return (
    <Card className="lg:col-span-3 p-6">
      {/* Instructions Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📋 How to Play</h3>
        <div className="text-sm text-blue-700">
          {state.gameMode === 'spelling' && (
            <div>
              <p className="mb-2"><strong>Spelling Mode:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Look at the word displayed above</li>
                <li>Type the word in the input box below</li>
                <li>Press Enter or click "Check Spelling" to submit</li>
                <li>Use the "Hear Word" button to listen to pronunciation</li>
                <li>Get hints by clicking the "Show Hint" button</li>
              </ul>
            </div>
          )}
          {/* ... add other mode instructions */}
        </div>
      </div>

      {/* Current Word Display */}
      {state.currentWord && (
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl mb-4">
            <h2 className="text-3xl font-bold mb-2">
              {state.gameMode === 'listening' ? '🔊 Listen to the word' : state.currentWord.word.toUpperCase()}
            </h2>
            {state.showHint && (
              <div className="text-sm opacity-90">
                💡 {state.currentWord.definition}
              </div>
            )}
          </div>
          
          {/* Audio Controls */}
          <div className="flex justify-center gap-3 mb-6">
            <Button onClick={() => speak(state.currentWord.word)} variant="outline">
              🔊 Hear Word
            </Button>
            <Button onClick={() => speak(state.currentWord.phonics.join(' '))} variant="outline">
              🔤 Hear Phonics
            </Button>
            <Button onClick={() => speak(state.currentWord.definition)} variant="outline">
              📖 Hear Definition
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="text-center mb-8">
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={state.userInput}
            onChange={(e) => {/* handle input change */}}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer here..."
            className="text-xl text-center p-4 mb-4"
            disabled={!state.currentWord}
          />
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={checkSpelling}
              disabled={!state.userInput.trim() || !state.currentWord}
              className="bg-green-500 hover:bg-green-600"
            >
              ✓ Check Spelling
            </Button>
            <Button onClick={resetGame} variant="outline">
              🔄 New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {state.feedback && (
        <div className="text-center">
          <div className={`p-4 rounded-lg ${
            state.feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {state.feedback}
          </div>
        </div>
      )}
    </Card>
  );
};