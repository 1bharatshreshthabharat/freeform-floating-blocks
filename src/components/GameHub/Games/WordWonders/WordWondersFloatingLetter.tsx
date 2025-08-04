import React, { useEffect, useRef, useState } from 'react';
import { FloatingLetter } from './types';

interface FloatingLetterProps {
  letter: FloatingLetter;
  onClick: (letterId: string) => void;
  isHinted?: boolean;
}

export const WordWondersFloatingLetter: React.FC<FloatingLetterProps> = ({
  letter,
  onClick,
  isHinted = false,
}) => {
  const [position, setPosition] = useState({ x: letter.x, y: letter.y });
  const [velocity, setVelocity] = useState({ vx: letter.vx, vy: letter.vy });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (letter.isPlaced) return;

    const updatePosition = () => {
      setPosition((prev) => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const padding = 10;
        const radius = 25;

        let newX = prev.x + velocity.vx;
        let newY = prev.y + velocity.vy;
        let newVx = velocity.vx;
        let newVy = velocity.vy;

        const minX = padding;
        const maxX = screenWidth - radius * 2 - padding;
        const minY = 80;
        const maxY = screenHeight * 0.4;

        if (newX < minX || newX > maxX) {
          newVx *= -0.85;
          newX = Math.max(minX, Math.min(maxX, newX));
        }

        if (newY < minY || newY > maxY) {
          newVy *= -0.85;
          newY = Math.max(minY, Math.min(maxY, newY));
        }

        // Add wave float
        newY += Math.sin(Date.now() * 0.002 + parseInt(letter.id.replace('letter-', ''))) * 0.3;

        setVelocity({ vx: newVx, vy: newVy });
        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(updatePosition);
    };

    animationRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [letter.isPlaced, letter.id, velocity]);

  const handleClick = () => {
    if (!letter.isPlaced) {
      onClick(letter.id);
    }
  };

  if (letter.isPlaced) return null;

  return (
    <button
      onClick={handleClick}
      className={`absolute rounded-full border-2 transition-transform duration-200 hover:scale-110 active:scale-95 ${
        isHinted && letter.isCorrect
          ? 'bg-yellow-200 border-yellow-400 shadow-lg animate-pulse'
          : 'bg-white border-purple-300 hover:border-purple-400 shadow-md'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: 50,
        height: 50,
        zIndex: 10,
      }}
    >
      <span className="text-xl font-bold text-purple-700">{letter.letter}</span>
    </button>
  );
};
