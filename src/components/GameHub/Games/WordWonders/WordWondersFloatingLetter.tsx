
import React, { useEffect, useState } from 'react';
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
  const [position, setPosition] = useState({ x: letter.x, y: letter.y });
  const [velocity, setVelocity] = useState({ vx: letter.vx, vy: letter.vy });

  useEffect(() => {
    if (letter.isPlaced) return;

    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocity.vx;
        let newY = prev.y + velocity.vy;
        let newVx = velocity.vx;
        let newVy = velocity.vy;

        // Bounce off walls
        if (newX < 20 || newX > 350) {
          newVx *= -0.8;
          newX = Math.max(20, Math.min(350, newX));
        }
        if (newY < 20 || newY > 150) {
          newVy *= -0.8;
          newY = Math.max(20, Math.min(150, newY));
        }

        // Add floating effect
        newY += Math.sin(Date.now() * 0.002 + parseInt(letter.id.replace('letter-', ''))) * 0.3;

        setVelocity({ vx: newVx, vy: newVy });
        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [letter.isPlaced, velocity, letter.id]);

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
        left: position.x,
        top: position.y,
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
