
import React, { useRef, useEffect } from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Balloon } from './types';
import { getThemeColors } from './balloonPopUtils';

export const BalloonPopCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, popBalloon } = useBalloonPopGame();

  const drawBalloon = (ctx: CanvasRenderingContext2D, balloon: Balloon) => {
    const { x, y, size, color, content, popAnimation, rotation } = balloon;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    if (popAnimation) {
      // Enhanced pop animation with particles
      ctx.save();
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const particleX = Math.cos(angle) * size * 1.5;
        const particleY = Math.sin(angle) * size * 1.5;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.restore();
      return;
    }

    // Balloon shadow
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(3, 3, size * 0.8, size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Category-specific balloon styling
    const gradient = ctx.createRadialGradient(-size * 0.3, -size * 0.3, 0, 0, 0, size);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(1, color);

    // Main balloon body
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Balloon highlight
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-size * 0.3, -size * 0.3, size * 0.25, size * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Category-specific decorations
    if (state.category === 'animals') {
      // Add small paw prints
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(-size * 0.2, size * 0.3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.category === 'science') {
      // Add sparkle effect
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, 0);
      ctx.lineTo(size * 0.4, 0);
      ctx.moveTo(0, -size * 0.4);
      ctx.lineTo(0, size * 0.4);
      ctx.stroke();
    } else if (state.category === 'math') {
      // Add math symbols around balloon
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('+', -size * 0.6, -size * 0.2);
      ctx.fillText('×', size * 0.6, size * 0.2);
    }

    // Balloon string
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.bezierCurveTo(5, size + 10, -5, size + 20, 0, size + 30);
    ctx.stroke();

    // Content text with better styling
    ctx.fillStyle = content.length > 3 ? '#000' : '#FFF';
    const fontSize = Math.max(12, size * 0.4);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow for better readability
    ctx.strokeStyle = content.length > 3 ? '#FFF' : '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(content, 0, 0);
    ctx.fillText(content, 0, 0);

    ctx.restore();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    const themeColors = getThemeColors(state.theme);
    
    // Apply theme background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    switch (state.theme) {
      case 'jungle':
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        break;
      case 'space':
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(1, '#004e92');
        break;
      case 'underwater':
        gradient.addColorStop(0, '#36d1dc');
        gradient.addColorStop(1, '#5b86e5');
        break;
      case 'castle':
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#DAA520');
        break;
      case 'farm':
        gradient.addColorStop(0, '#228B22');
        gradient.addColorStop(1, '#ADFF2F');
        break;
      case 'ocean':
        gradient.addColorStop(0, '#006994');
        gradient.addColorStop(1, '#00A8CC');
        break;
      case 'forest':
        gradient.addColorStop(0, '#2F4F2F');
        gradient.addColorStop(1, '#8FBC8F');
        break;
      default: // rainbow
        gradient.addColorStop(0, '#FF6B9D');
        gradient.addColorStop(0.25, '#45B7D1');
        gradient.addColorStop(0.5, '#96CEB4');
        gradient.addColorStop(0.75, '#FFEAA7');
        gradient.addColorStop(1, '#DDA0DD');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated background elements
    const time = Date.now() * 0.001;
    
    // Theme-specific background elements
    if (state.theme === 'space') {
      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 40 + Math.sin(time + i) * 10) % canvas.width;
        const y = (i * 30 + Math.cos(time * 0.5 + i) * 20) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.sin(time + i) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (state.theme === 'underwater') {
      // Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 15; i++) {
        const x = (i * 60 + Math.sin(time + i) * 20) % canvas.width;
        const y = (i * 40 + Math.cos(time * 0.7 + i) * 30) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(time + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Default floating particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 15; i++) {
        const x = (i * 60 + Math.sin(time + i) * 20) % canvas.width;
        const y = (i * 40 + Math.cos(time * 0.7 + i) * 30) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check if click hit any balloon
    for (const balloon of state.balloons) {
      const distance = Math.sqrt(
        Math.pow(clickX - balloon.x, 2) + Math.pow(clickY - balloon.y, 2)
      );

      if (distance <= balloon.size && !balloon.popped) {
        popBalloon(balloon.id);
        break;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBackground(ctx);
      
      state.balloons.forEach(balloon => {
        if (!balloon.popped || balloon.popAnimation) {
          drawBalloon(ctx, balloon);
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();
  }, [state.balloons, state.theme, state.category]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        onClick={handleCanvasClick}
        className="border-4 border-white rounded-xl shadow-2xl cursor-crosshair transition-all duration-300"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};
