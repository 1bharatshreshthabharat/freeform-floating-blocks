
import React from 'react';
import { FloatingLetter } from './types';

interface FloatingLetterProps {
  letter: FloatingLetter;
  onClick: (letterId: string) => void;
  isHinted?: boolean;
}

export const WordWondersFloatingLetter: React.FC<FloatingLetterProps> = ({
  letter,
  onClick,
  isHinted = false
}) => {
  const handleClick = () => {
    if (!letter.isPlaced) {
      onClick(letter.id);
    }
  };

  if (letter.isPlaced) return null;

  return (
    <button
      onClick={handleClick}
      className={`absolute rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
        isHinted && letter.isCorrect
          ? 'bg-yellow-200 border-yellow-400 shadow-lg animate-pulse'
          : 'bg-white border-purple-300 hover:border-purple-400 shadow-md'
      }`}
      style={{
        left: letter.x,
        top: letter.y,
        width: 50,
        height: 50,
      }}
    >
      <span className="text-xl font-bold text-purple-700">
        {letter.letter}
      </span>
    </button>
  );
};
