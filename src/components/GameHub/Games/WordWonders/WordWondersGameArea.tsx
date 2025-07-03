
import React from 'react';
import { useWordWonders } from './WordWondersProvider';
import { WordWondersLetterBox } from './WordWondersLetterBox';
import { WordWondersFloatingLetter } from './WordWondersFloatingLetter';

const lineColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

export const WordWondersGameArea: React.FC = () => {
  const { 
    state, 
    dispatch, 
    playSound, 
    speakText,
    placeLetterInBox,
    removeLetterFromBox 
  } = useWordWonders();

  const getThemeStyles = () => {
    switch (state.theme) {
      case 'forest':
        return {
          background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)',
          primaryColor: '#4a7c59',
          accentColor: '#81c784'
        };
      case 'sky':
        return {
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
          primaryColor: '#1976d2',
          accentColor: '#42a5f5'
        };
      case 'candyland':
        return {
          background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%)',
          primaryColor: '#e91e63',
          accentColor: '#f06292'
        };
      case 'underwater':
        return {
          background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 50%, #80cbc4 100%)',
          primaryColor: '#00695c',
          accentColor: '#4db6ac'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%)',
          primaryColor: '#7b1fa2',
          accentColor: '#ab47bc'
        };
    }
  };

  const handleLetterClick = (letterId: string) => {
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter || letter.isPlaced) return;

    // Find the first empty box
    const emptyBoxIndex = state.placedLetters.findIndex(l => l === '');
    if (emptyBoxIndex === -1) return;

    placeLetterInBox(letterId, emptyBoxIndex);
    playSound('correct');
    
    // Check if word is complete
    const newPlacedLetters = [...state.placedLetters];
    newPlacedLetters[emptyBoxIndex] = letter.letter;
    
    if (!newPlacedLetters.includes('')) {
      const formedWord = newPlacedLetters.join('').toLowerCase();
      
      if (state.mode === 'make-words') {
        // Check if it's one of the possible words
        if (state.possibleWords?.includes(formedWord)) {
          dispatch({ type: 'ADD_FOUND_WORD', payload: formedWord });
          dispatch({ type: 'ADD_SCORE', payload: formedWord.length * 10 });
          speakText(`Great! You found ${formedWord}!`);
          playSound('complete');
          
          // Reset for next word
          setTimeout(() => {
            dispatch({ type: 'RESET_PLACEMENT' });
          }, 1500);
        }
      } else if (state.mode === 'fix-word') {
        // For fix-word mode, check if the formed word matches the target
        if (formedWord === state.targetWord.toLowerCase()) {
          dispatch({ type: 'COMPLETE_WORD' });
          dispatch({ type: 'ADD_SCORE', payload: 100 });
          speakText(`Excellent! You fixed the word ${state.targetWord}!`);
          playSound('complete');
          
          // Start next question automatically
          setTimeout(() => {
            dispatch({ type: 'NEXT_QUESTION' });
          }, 2000);
        } else {
          speakText('Not quite right! Try again!');
          playSound('wrong');
          dispatch({ type: 'WRONG_ANSWER' });
          
          // Reset placement after a delay
          setTimeout(() => {
            dispatch({ type: 'RESET_PLACEMENT' });
          }, 1000);
        }
      } else if (formedWord === state.targetWord.toLowerCase()) {
        dispatch({ type: 'COMPLETE_WORD' });
        dispatch({ type: 'ADD_SCORE', payload: 100 });
        speakText(`Excellent! You spelled ${state.targetWord}!`);
        playSound('complete');
        
        // Start next question automatically
        setTimeout(() => {
          dispatch({ type: 'NEXT_QUESTION' });
        }, 2000);
      } else {
        speakText('Try again!');
        playSound('wrong');
        dispatch({ type: 'WRONG_ANSWER' });
        
        // Reset placement after a delay for wrong answers
        setTimeout(() => {
          dispatch({ type: 'RESET_PLACEMENT' });
        }, 1000);
      }
    }
  };

  const handleRemoveLetter = (boxIndex: number) => {
    const letter = state.placedLetters[boxIndex];
    if (letter) {
      removeLetterFromBox(boxIndex);
      playSound('hint');
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg border-2"
      style={{ 
        background: themeStyles.background,
        borderColor: themeStyles.primaryColor 
      }}
    >
      
      {/* Letter Boxes */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex gap-4 justify-center items-center">
          {Array.from({ length: state.targetWord.length }, (_, index) => (
            <WordWondersLetterBox
              key={index}
              letter={state.placedLetters[index]}
              index={index}
              lineColor={lineColors[index % lineColors.length]}
              onRemoveLetter={handleRemoveLetter}
            />
          ))}
        </div>
      </div>

      {/* Floating Letters */}
      {state.letters.map((letter) => (
        <WordWondersFloatingLetter
          key={letter.id}
          letter={letter}
          onClick={handleLetterClick}
          isHinted={state.showHint}
        />
      ))}

      {/* Game Status Overlay */}
      {state.isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">⏸️ Game Paused</h3>
            <p className="text-gray-600">Click Resume to continue playing!</p>
          </div>
        </div>
      )}
    </div>
  );
};
