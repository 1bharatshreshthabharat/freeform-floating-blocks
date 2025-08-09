import React, { useEffect, useRef, useState } from 'react';
import { FloatingLetter } from './types';
import { X } from 'lucide-react';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ vx: letter.vx, vy: letter.vy });
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial random position (with slight clustering)
  useEffect(() => {
    const container = containerRef.current?.parentElement as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const letterIndex = parseInt(letter.id.replace('letter-', ''));

    const padding = 40;
    const maxX = rect.width - padding - 50;
    const maxY = rect.height - padding - 50;

    // Some randomness with overlap possible
    const baseX = (letterIndex * 77) % maxX;
    const offsetX = Math.random() * 40 - 20;
    const baseY = (letterIndex * 91) % maxY;
    const offsetY = Math.random() * 40 - 20;

    setPosition({
      x: Math.max(padding, baseX + offsetX),
      y: Math.max(padding, baseY + offsetY),
    });
  }, [letter.id]);

  // Floating animation inside container bounds
  useEffect(() => {
    if (letter.isPlaced) return;

    const updatePosition = () => {
      const container = containerRef.current?.parentElement as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const padding = 20;
      const radius = 25;
      const minX = padding;
      const maxX = rect.width - radius * 2 - padding;
      const minY = padding;
      const maxY = rect.height - radius * 2 - padding;

      setPosition((prev) => {
        let newX = prev.x + velocity.vx;
        let newY = prev.y + velocity.vy;
        let newVx = velocity.vx;
        let newVy = velocity.vy;

        if (newX < minX || newX > maxX) {
          newVx *= -0.9;
          newX = Math.max(minX, Math.min(maxX, newX));
        }

        if (newY < minY || newY > maxY) {
          newVy *= -0.9;
          newY = Math.max(minY, Math.min(maxY, newY));
        }

        // Subtle wave float
        const waveOffset = parseInt(letter.id.replace('letter-', '')) * 0.3;
        newY += Math.sin(Date.now() * 0.002 + waveOffset) * 0.4;
        newX += Math.cos(Date.now() * 0.0015 + waveOffset) * 0.3;

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
    onClick(letter.id);
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      <button
        onClick={handleClick}
        className={`absolute rounded-full border-2 transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg ${
          letter.isPlaced 
            ? 'bg-gray-200 border-gray-400 opacity-50 hover:opacity-75' // Dimmed style for placed letters
            : isHinted && letter.isCorrect
              ? 'bg-yellow-200 border-yellow-400 shadow-yellow-300 animate-pulse'
              : 'bg-white border-purple-300 hover:border-purple-400 hover:shadow-purple-300'
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: 50,
          height: 50,
          zIndex: letter.isPlaced ? 5 : 10, // Lower z-index for placed letters
        }}
      >
        <span className={`text-xl font-bold ${letter.isPlaced ? 'text-gray-500' : 'text-purple-700'}`}>
          {letter.letter}
        </span>
        { letter.isPlaced &&(
         <button
              className="absolute -top-1 -right-1 bg-red-300 hover:bg-red-500 text-white rounded-full p-1 text-xs transition-colors"
            >
              <X size={10} />
            </button>
      )
      }
      </button>

      
    </div>
  );
};