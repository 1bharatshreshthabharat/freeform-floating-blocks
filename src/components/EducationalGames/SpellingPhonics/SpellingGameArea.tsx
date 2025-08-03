import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Target } from 'lucide-react';

type Props = {
  gameMode: string;
  currentWord: {
    word: string;
    definition: string;
    example: string;
    category: string;
    phonics: string[];
  };
  userInput: string;
  setUserInput: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  checkSpelling: () => void;
  showHint: boolean;
  setShowHint: (show: boolean) => void;
  selectedPhonics: string[];
  handlePhonicsSelection: (letter: string) => void;
  availableLetters: string[];
  feedback: string;
  playWord: () => void;
  playPhonics: () => void;
  playDefinition: () => void;
  setSelectedPhonics: (letters: string[]) => void;
};

const SpellingGameArea: React.FC<Props> = ({
  gameMode,
  currentWord,
  userInput,
  setUserInput,
  handleKeyPress,
  checkSpelling,
  showHint,
  setShowHint,
  selectedPhonics,
  setSelectedPhonics, // <-- add this line
  handlePhonicsSelection,
  availableLetters,
  feedback,
  playWord,
  playPhonics,
  playDefinition
}) => {

  return (
    <Card className="lg:col-span-3 p-6">
      {/* Instructions Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📋 How to Play</h3>
        <div className="text-sm text-blue-700">
          {gameMode === 'spelling' && (
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
          {gameMode === 'phonics' && (
            <div>
              <p className="mb-2"><strong>Phonics Mode:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click on letters below to build the word</li>
                <li>Letters will appear in order as you click them</li>
                <li>Use "Hear Phonics" to listen to letter sounds</li>
                <li>Complete the word to score points</li>
                <li>Click "Reset" to start over</li>
              </ul>
            </div>
          )}
          {gameMode === 'listening' && (
            <div>
              <p className="mb-2"><strong>Listening Mode:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click "Hear Word" to listen to the word</li>
                <li>The word is hidden - listen carefully!</li>
                <li>Type what you hear in the input box</li>
                <li>Use the definition clues to help you</li>
                <li>You can replay the word as many times as needed</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-bold mb-2">
            {gameMode === 'spelling' ? 'Spell the Word' : 
             gameMode === 'phonics' ? 'Build with Phonics' : 'Listen and Type'}
          </h2>
          <div className="text-lg">
            Category: <span className="font-semibold">{currentWord.category}</span>
          </div>
        </div>

        {/* Word Display */}
        <div className="mb-6">
          {gameMode !== 'listening' && (
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {currentWord.word.toUpperCase()}
            </div>
          )}

          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={playWord} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Hear Word
            </Button>
            <Button onClick={playPhonics} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Hear Sounds
            </Button>
            <Button onClick={playDefinition} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Definition
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <div className="font-semibold text-blue-800">Definition:</div>
            <div className="text-blue-700">{currentWord.definition}</div>
            <div className="text-sm text-blue-600 mt-1">
              <strong>Example:</strong> {currentWord.example}
            </div>
          </div>
        </div>

        {/* Game Interface */}
        {gameMode === 'spelling' || gameMode === 'listening' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type the word here..."
              className="w-full max-w-md mx-auto px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-center gap-4">
              <Button onClick={checkSpelling} className="bg-green-500 hover:bg-green-600">
                <Target className="h-4 w-4 mr-2" />
                Check Answer
              </Button>
              <Button onClick={() => setShowHint(!showHint)} variant="outline">
                💡 {showHint ? 'Hide' : 'Show'} Hint
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-lg font-semibold">Selected: {selectedPhonics.join('')}</div>
            <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
              {availableLetters.map((letter, index) => (
                <Button
                  key={index}
                  onClick={() => handlePhonicsSelection(letter)}
                  variant="outline"
                  className="aspect-square"
                >
                  {letter.toUpperCase()}
                </Button>
              ))}
            </div>
            <Button onClick={() => setSelectedPhonics([])} variant="outline" className="mt-4">
              Clear Selection
            </Button>
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4">
            <div className="text-yellow-800">
              <strong>Phonics:</strong> {currentWord.phonics.join(' - ')}
            </div>
            <div className="text-yellow-700 text-sm mt-1">
              Word length: {currentWord.word.length} letters
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${
            feedback.includes('Excellent') || feedback.includes('Perfect') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SpellingGameArea;
