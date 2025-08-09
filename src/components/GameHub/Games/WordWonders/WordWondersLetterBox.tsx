
import React from 'react';
import { X } from 'lucide-react';

interface LetterBoxProps {
  letter?: string;
  index: number;
  lineColor: string;
  onRemoveLetter: (index: number) => void;
}

export const WordWondersLetterBox: React.FC<LetterBoxProps> = ({
  letter,
  index,
  lineColor,
  onRemoveLetter
}) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Position number */}
      <div className="text-xs text-gray-500 mb-1">{index + 1}</div>
      
      {/* Letter container */}
      <div className="relative flex items-center justify-center h-12 mb-2">
        {letter && (
          <>
            {/* Letter */}
            <div 
              className="text-2xl font-bold px-3 py-1 rounded transition-colors duration-300"
              style={{ color: lineColor }}
            >
              {letter}
            </div>

          </>
        )}
      </div>
      
      {/* Colorful line */}
      <div 
        className="w-12 h-1 rounded-full transition-all duration-300"
        style={{ backgroundColor: lineColor }}
      />
    </div>
  ); 
};
