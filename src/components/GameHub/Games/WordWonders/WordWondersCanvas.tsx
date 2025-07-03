import React, { useRef, useEffect, useState } from 'react';
import { useWordWonders } from './WordWondersProvider';
import { FloatingLetter } from './types';

export const WordWondersCanvas: React.FC = () => {
  const { state, dispatch, playSound, speakText } = useWordWonders();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [dropZones, setDropZones] = useState<Array<{x: number, y: number, width: number, height: number, filled: boolean, letter?: string}>>([]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize drop zones based on game mode and target word
    if (state.mode && state.targetWord) {
      const zones = [];
      const canvasWidth = canvas.width / window.devicePixelRatio;
      const wordLength = state.targetWord.length;
      
      if (state.mode === 'make-words') {
        // Create multiple rows for multiple words
        const possibleWords = state.possibleWords || [];
        let currentY = 250;
        
        possibleWords.slice(0, 5).forEach((word, wordIndex) => {
          const wordWidth = word.length * 50 + (word.length - 1) * 5;
          const startX = (canvasWidth - wordWidth) / 2;
          
          for (let i = 0; i < word.length; i++) {
            zones.push({
              x: startX + i * 55,
              y: currentY + wordIndex * 60,
              width: 50,
              height: 50,
              filled: false,
              wordIndex,
              letterIndex: i,
              expectedWord: word
            });
          }
        });
      } else {
        // Single word mode
        const boxWidth = 50;
        const spacing = 5;
        const totalWidth = wordLength * boxWidth + (wordLength - 1) * spacing;
        const startX = (canvasWidth - totalWidth) / 2;
        const startY = 280;
        
        for (let i = 0; i < wordLength; i++) {
          zones.push({
            x: startX + i * (boxWidth + spacing),
            y: startY,
            width: boxWidth,
            height: boxBoxWidth,
            filled: false
          });
        }
      }
      setDropZones(zones);
    }

    const animate = () => {
      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw drop zones
      const theme = getThemeStyles();
      dropZones.forEach((zone, index) => {
        // Drop zone shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(zone.x + 2, zone.y + 2, zone.width, zone.height);
        
        // Drop zone background
        ctx.fillStyle = zone.filled ? theme.accentColor : 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        
        // Drop zone border
        ctx.strokeStyle = theme.primaryColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        
        // Position number or letter
        ctx.fillStyle = theme.primaryColor;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        
        if (state.mode === 'make-words') {
          // Show word indicators
          const wordIndex = (zone as any).wordIndex || 0;
          ctx.fillText(`W${wordIndex + 1}`, zone.x + zone.width/2, zone.y - 8);
        } else {
          ctx.fillText((index + 1).toString(), zone.x + zone.width/2, zone.y - 8);
        }
        
        // Show placed letter
        if (zone.letter) {
          ctx.fillStyle = theme.primaryColor;
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(zone.letter, zone.x + zone.width/2, zone.y + zone.height/2);
        }
      });

      // Draw floating letters with slower movement
      state.letters.forEach((letter, index) => {
        if (letter.isPlaced) return;
        
        // Much slower physics
        if (!letter.isDragging) {
          letter.x += letter.vx * 0.2;
          letter.y += letter.vy * 0.1;
          
          // Gentle bounce
          if (letter.x < 20 || letter.x > canvasWidth - 80) {
            letter.vx *= -0.7;
            letter.x = Math.max(20, Math.min(canvasWidth - 80, letter.x));
          }
          if (letter.y < 20 || letter.y > canvasHeight - 200) {
            letter.vy *= -0.7;
            letter.y = Math.max(20, Math.min(canvasHeight - 200, letter.y));
          }
          
          // Gentle floating
          letter.y += Math.sin(Date.now() * 0.001 + index) * 0.2;
        }

        // Draw letter
        const radius = 25;
        const centerX = letter.x + radius;
        const centerY = letter.y + radius;
        
        // Letter shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(centerX + 2, centerY + 2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Letter background
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        
        if (letter.isCorrect && state.showHint) {
          gradient.addColorStop(0, '#fff9c4');
          gradient.addColorStop(1, '#ffd700');
        } else {
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(1, theme.accentColor);
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Letter border
        ctx.strokeStyle = theme.primaryColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Letter text
        ctx.fillStyle = theme.primaryColor;
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.letter, centerX, centerY);
      });

      // Celebration animation
      if (state.isComplete) {
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvasWidth;
          const y = (Date.now() * 0.003 + i * 40) % canvasHeight;
          const size = 3 + Math.random() * 3;
          
          ctx.fillStyle = [theme.accentColor, theme.primaryColor, '#ffd700', '#ffffff'][i % 4];
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.letters, state.showHint, state.isComplete, state.theme, state.mode, state.targetWord, state.possibleWords, dropZones]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedLetter = state.letters.find(letter => {
      if (letter.isPlaced) return false;
      const distance = Math.sqrt(Math.pow(x - (letter.x + 25), 2) + Math.pow(y - (letter.y + 25), 2));
      return distance < 25;
    });

    if (clickedLetter) {
      setDraggedLetter(clickedLetter.id);
      playSound('hint');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedLetter) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedLetters = state.letters.map(letter => 
      letter.id === draggedLetter 
        ? { ...letter, x: x - 25, y: y - 25, isDragging: true }
        : letter
    );

    dispatch({ type: 'UPDATE_LETTERS', payload: updatedLetters });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!draggedLetter) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const targetZone = dropZones.find(zone => 
      x >= zone.x && x <= zone.x + zone.width &&
      y >= zone.y && y <= zone.y + zone.height &&
      !zone.filled
    );

    if (targetZone) {
      const letter = state.letters.find(l => l.id === draggedLetter);
      if (letter) {
        const zoneIndex = dropZones.indexOf(targetZone);
        let isCorrect = false;

        if (state.mode === 'make-words') {
          // Check if letter can be used for this word position
          const expectedWord = (targetZone as any).expectedWord;
          const letterIndex = (targetZone as any).letterIndex;
          isCorrect = expectedWord && expectedWord[letterIndex] === letter.letter.toLowerCase();
        } else if (state.mode === 'fix-word') {
          // Any correct letter from the target word
          isCorrect = state.targetWord.includes(letter.letter.toLowerCase());
        } else {
          // Normal mode - check position
          const expectedLetter = state.targetWord[zoneIndex];
          isCorrect = letter.letter.toLowerCase() === expectedLetter.toLowerCase();
        }
        
        if (isCorrect) {
          dispatch({ type: 'PLACE_LETTER', payload: { letterId: draggedLetter, position: zoneIndex } });
          dispatch({ type: 'ADD_SCORE', payload: 10 });
          playSound('correct');
          speakText(letter.letter);
          
          const newZones = [...dropZones];
          newZones[zoneIndex].filled = true;
          newZones[zoneIndex].letter = letter.letter;
          setDropZones(newZones);
          
          // Check completion
          if (state.mode === 'make-words') {
            // Check if any word is complete
            const words = state.possibleWords || [];
            words.forEach(word => {
              const wordZones = newZones.filter((z: any) => z.expectedWord === word);
              if (wordZones.every(z => z.filled)) {
                dispatch({ type: 'ADD_FOUND_WORD', payload: word });
                speakText(`Great! You found ${word}!`);
              }
            });
          } else {
            // Check if main word is complete
            const mainWordZones = newZones.filter((z: any) => !z.wordIndex);
            if (mainWordZones.every(zone => zone.filled)) {
              dispatch({ type: 'COMPLETE_WORD' });
              playSound('complete');
              speakText(`Excellent! You spelled ${state.targetWord}!`);
            }
          }
        } else {
          playSound('wrong');
          speakText('Try again!');
          dispatch({ type: 'WRONG_ANSWER' });
        }
      }
    }

    const updatedLetters = state.letters.map(letter => 
      letter.id === draggedLetter 
        ? { ...letter, isDragging: false }
        : letter
    );

    dispatch({ type: 'UPDATE_LETTERS', payload: updatedLetters });
    setDraggedLetter(null);
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
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
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
