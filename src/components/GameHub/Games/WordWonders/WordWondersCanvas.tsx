
import React, { useRef, useEffect, useState } from 'react';
import { useWordWonders } from './WordWondersProvider';
import { FloatingLetter } from './types';

export const WordWondersCanvas: React.FC = () => {
  const { state, dispatch, playSound, speakText } = useWordWonders();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [dropZones, setDropZones] = useState<Array<{x: number, y: number, width: number, height: number, filled: boolean}>>([]);

  // Theme backgrounds
  const getThemeStyles = () => {
    switch (state.theme) {
      case 'forest':
        return {
          background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 50%, #228B22 100%)',
          particles: ['🌲', '🍃', '🦋', '🌸']
        };
      case 'sky':
        return {
          background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
          particles: ['☁️', '🌤️', '🦅', '✨']
        };
      case 'candyland':
        return {
          background: 'linear-gradient(to bottom, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%)',
          particles: ['🍭', '🧁', '🍬', '🌈']
        };
      case 'underwater':
        return {
          background: 'linear-gradient(to bottom, #00CED1 0%, #0000FF 100%)',
          particles: ['🐠', '🌊', '🐙', '⭐']
        };
      default:
        return {
          background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
          particles: ['✨', '🌟', '💫', '🎨']
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

    // Initialize drop zones based on game mode
    if (state.mode && state.targetWord) {
      const zones = [];
      const startX = 100;
      const startY = 400;
      
      for (let i = 0; i < state.targetWord.length; i++) {
        zones.push({
          x: startX + i * 60,
          y: startY,
          width: 50,
          height: 50,
          filled: false
        });
      }
      setDropZones(zones);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      // Draw theme background particles
      const theme = getThemeStyles();
      const particles = theme.particles;
      
      for (let i = 0; i < 8; i++) {
        const x = (i * 100 + Date.now() * 0.001 * (i + 1)) % (canvas.width / window.devicePixelRatio);
        const y = 50 + Math.sin(Date.now() * 0.002 + i) * 20;
        ctx.font = '24px Arial';
        ctx.fillText(particles[i % particles.length], x, y);
      }

      // Draw drop zones
      dropZones.forEach((zone, index) => {
        ctx.fillStyle = zone.filled ? '#90EE90' : 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        
        // Draw letter index
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), zone.x + zone.width/2, zone.y - 5);
      });

      // Draw floating letters
      state.letters.forEach((letter) => {
        if (letter.isPlaced) return;
        
        // Physics simulation
        if (!letter.isDragging) {
          letter.x += letter.vx;
          letter.y += letter.vy;
          
          // Bounce off walls
          if (letter.x < 0 || letter.x > canvas.width / window.devicePixelRatio - 50) letter.vx *= -1;
          if (letter.y < 0 || letter.y > canvas.height / window.devicePixelRatio - 50) letter.vy *= -1;
          
          // Add floating motion
          letter.y += Math.sin(Date.now() * 0.003 + parseInt(letter.id.split('-')[1])) * 0.5;
        }

        // Draw letter bubble
        const radius = 35;
        const gradient = ctx.createRadialGradient(
          letter.x + radius/2, letter.y + radius/2, 0,
          letter.x + radius/2, letter.y + radius/2, radius
        );
        
        if (letter.isCorrect && state.showHint) {
          gradient.addColorStop(0, '#FFD700');
          gradient.addColorStop(1, '#FFA500');
        } else {
          gradient.addColorStop(0, '#FF69B4');
          gradient.addColorStop(1, '#FF1493');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(letter.x + radius/2, letter.y + radius/2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Letter shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw letter
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.letter, letter.x + radius/2, letter.y + radius/2);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Draw confetti if game is complete
      if (state.isComplete) {
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width / window.devicePixelRatio;
          const y = (Date.now() * 0.005 + i * 50) % (canvas.height / window.devicePixelRatio);
          ctx.fillStyle = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98'][i % 4];
          ctx.fillRect(x, y, 8, 8);
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
  }, [state.letters, state.showHint, state.isComplete, state.theme, state.mode, state.targetWord, dropZones]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked letter
    const clickedLetter = state.letters.find(letter => {
      if (letter.isPlaced) return false;
      const distance = Math.sqrt(Math.pow(x - (letter.x + 35), 2) + Math.pow(y - (letter.y + 35), 2));
      return distance < 35;
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
        ? { ...letter, x: x - 35, y: y - 35, isDragging: true }
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

    // Check if dropped in a valid zone
    const targetZone = dropZones.find(zone => 
      x >= zone.x && x <= zone.x + zone.width &&
      y >= zone.y && y <= zone.y + zone.height &&
      !zone.filled
    );

    if (targetZone) {
      const letter = state.letters.find(l => l.id === draggedLetter);
      if (letter) {
        const zoneIndex = dropZones.indexOf(targetZone);
        const expectedLetter = state.targetWord[zoneIndex];
        
        if (letter.letter === expectedLetter) {
          // Correct placement
          dispatch({ type: 'PLACE_LETTER', payload: { letterId: draggedLetter, position: zoneIndex } });
          dispatch({ type: 'ADD_SCORE', payload: 10 });
          playSound('correct');
          speakText(letter.letter);
          
          // Update drop zone
          const newZones = [...dropZones];
          newZones[zoneIndex].filled = true;
          setDropZones(newZones);
          
          // Check if word is complete
          if (newZones.every(zone => zone.filled)) {
            dispatch({ type: 'COMPLETE_WORD' });
            playSound('complete');
            speakText(`Excellent! You spelled ${state.targetWord}!`);
          }
        } else {
          // Wrong placement
          playSound('wrong');
          speakText('Try again!');
          dispatch({ type: 'WRONG_ANSWER' });
        }
      }
    }

    // Reset dragging state
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
      className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-400"
      style={{ background: themeStyles.background }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className="text-lg font-bold text-purple-600">
          {state.mode === 'word-riddle' && state.riddle && (
            <div className="mb-2 text-sm">{state.riddle}</div>
          )}
          {state.mode === 'complete-verb' && state.sentence && (
            <div className="mb-2 text-sm">{state.sentence}</div>
          )}
          <div>Target: {state.targetWord}</div>
        </div>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{state.score}</div>
          <div className="text-sm text-gray-600">Score</div>
          <div className="flex justify-center mt-1">
            {Array.from({ length: state.stars }, (_, i) => (
              <span key={i} className="text-yellow-500">⭐</span>
            ))}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className={`text-xl font-bold ${state.timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}`}>
          ⏰ {state.timeLeft}s
        </div>
      </div>

      {/* Lives */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className="flex">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`text-xl ${i < state.lives ? 'text-red-500' : 'text-gray-300'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
