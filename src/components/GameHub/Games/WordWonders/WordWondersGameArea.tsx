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
    
    // Check if word is complete with beautiful validation response
    const newPlacedLetters = [...state.placedLetters];
    newPlacedLetters[emptyBoxIndex] = letter.letter;
    
    if (!newPlacedLetters.includes('')) {
      const formedWord = newPlacedLetters.join('').toLowerCase();
      
      if (state.mode === 'make-words') {
        if (state.possibleWords?.includes(formedWord)) {
          // Beautiful success response
          dispatch({ type: 'ADD_FOUND_WORD', payload: formedWord });
          dispatch({ type: 'ADD_SCORE', payload: formedWord.length * 10 });
          speakText(`Amazing! You found ${formedWord}!`);
          playSound('complete');
          
          // Show success animation
          showSuccessValidation(true);
          
          setTimeout(() => {
            dispatch({ type: 'RESET_PLACEMENT' });
          }, 2000);
        } else {
          dispatch({ type: 'LOSE_LIFE' });
          showSuccessValidation(false);
          setTimeout(() => {
            dispatch({ type: 'RESET_PLACEMENT' });
          }, 1500);
        }
      } else if (state.mode === 'fix-word') {
        if (formedWord === state.targetWord.toLowerCase()) {
          dispatch({ type: 'COMPLETE_WORD' });
          dispatch({ type: 'ADD_SCORE', payload: 100 });
          speakText(`Perfect! You fixed the word ${state.targetWord}!`);
          playSound('complete');
          
          showSuccessValidation(true);
          
          setTimeout(() => {
            dispatch({ type: 'NEXT_QUESTION' });
          }, 2500);
        } else {
          dispatch({ type: 'LOSE_LIFE' });
          showSuccessValidation(false);
          setTimeout(() => {
            dispatch({ type: 'RESET_PLACEMENT' });
          }, 1500);
        }
      } else if (formedWord === state.targetWord.toLowerCase()) {
        dispatch({ type: 'COMPLETE_WORD' });
        dispatch({ type: 'ADD_SCORE', payload: 100 });
        speakText(`Excellent! You spelled ${state.targetWord}!`);
        playSound('complete');
        
        showSuccessValidation(true);
        
        setTimeout(() => {
          dispatch({ type: 'NEXT_QUESTION' });
        }, 2500);
      } else {
        dispatch({ type: 'LOSE_LIFE' });
        showSuccessValidation(false);
        setTimeout(() => {
          dispatch({ type: 'RESET_PLACEMENT' });
        }, 1500);
      }
    }
  };

  const showSuccessValidation = (isCorrect: boolean) => {
    const overlay = document.getElementById('validation-overlay');
    if (overlay) {
      overlay.className = `absolute inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
        isCorrect ? 'bg-green-400/90' : 'bg-red-400/90'
      }`;
      overlay.style.display = 'flex';
      
      const content = overlay.firstElementChild as HTMLElement;
      if (content) {
        content.innerHTML = isCorrect 
          ? `<div class="text-center"><div class="text-6xl mb-4">🎉</div><div class="text-2xl font-bold text-white">Perfect!</div><div class="text-lg text-white">Great job!</div></div>`
          : `<div class="text-center"><div class="text-6xl mb-4">😅</div><div class="text-2xl font-bold text-white">Try Again!</div><div class="text-lg text-white">You can do it!</div></div>`;
        
        // Animation
        content.style.transform = 'scale(0.5)';
        content.style.opacity = '0';
        
        setTimeout(() => {
          content.style.transform = 'scale(1)';
          content.style.opacity = '1';
        }, 100);
      }
      
      setTimeout(() => {
        overlay.style.display = 'none';
      }, isCorrect ? 2000 : 1500);
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
      className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-lg border-2"
      style={{ 
        background: themeStyles.background,
        borderColor: themeStyles.primaryColor 
      }}
    >
      
      {/* Letter Boxes - Centered */}
      <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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

      {/* Floating Letters - Properly Centered and Spaced */}
      <div className="absolute inset-0">
        {state.letters.map((letter) => (
          <WordWondersFloatingLetter
            key={letter.id}
            letter={letter}
            onClick={handleLetterClick}
            isHinted={state.showHint}
          />
        ))}
      </div>

      {/* Beautiful Validation Overlay */}
      <div 
        id="validation-overlay"
        className="absolute inset-0 flex items-center justify-center z-50 transition-all duration-500"
        style={{ display: 'none' }}
      >
        <div className="transition-all duration-300 transform"></div>
      </div>

      {/* Game Status Overlay */}
      {state.isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">⏸️ Game Paused</h3>
            <p className="text-gray-600">Click Resume to continue playing!</p>
          </div>
        </div>
      )}
    </div>
  );
};