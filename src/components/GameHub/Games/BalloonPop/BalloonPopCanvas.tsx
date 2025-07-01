
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
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const particleX = Math.cos(angle) * size * 1.2;
        const particleY = Math.sin(angle) * size * 1.2;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.restore();
      return;
    }

    // Balloon shadow
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(2, 2, size * 0.9, size * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Main balloon body with gradient
    const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.4, color);
    gradient.addColorStop(1, color);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Balloon highlight
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, -size * 0.25, size * 0.2, size * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Balloon string
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.bezierCurveTo(3, size + 8, -3, size + 16, 0, size + 24);
    ctx.stroke();

    // Content text
    ctx.fillStyle = content.length > 3 ? '#333' : '#FFF';
    const fontSize = Math.max(14, size * 0.35);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text outline for better readability
    ctx.strokeStyle = content.length > 3 ? '#FFF' : '#333';
    ctx.lineWidth = 2;
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
      case 'space':
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        break;
      case 'underwater':
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        break;
      case 'forest':
        gradient.addColorStop(0, '#56ab2f');
        gradient.addColorStop(1, '#a8e6cf');
        break;
      default:
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated background elements
    const time = Date.now() * 0.001;
    
    if (state.theme === 'space') {
      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (let i = 0; i < 25; i++) {
        const x = (i * 45 + Math.sin(time + i) * 8) % canvas.width;
        const y = (i * 35 + Math.cos(time * 0.6 + i) * 15) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.sin(time + i) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (state.theme === 'underwater') {
      // Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 12; i++) {
        const x = (i * 70 + Math.sin(time + i) * 25) % canvas.width;
        const y = (i * 50 + Math.cos(time * 0.8 + i) * 35) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(time + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (state.theme === 'forest') {
      // Floating leaves
      ctx.fillStyle = 'rgba(139, 195, 74, 0.3)';
      for (let i = 0; i < 10; i++) {
        const x = (i * 80 + Math.sin(time + i) * 30) % canvas.width;
        const y = (i * 60 + Math.cos(time * 0.5 + i) * 40) % canvas.height;
        ctx.beginPath();
        ctx.ellipse(x, y, 3, 1.5, time + i, 0, Math.PI * 2);
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

    // Set canvas size based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        canvas.width = Math.min(containerWidth - 32, 1000);
        canvas.height = 500;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [state.balloons, state.theme, state.category]);

  return (
    <div className="flex justify-center p-4">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border-4 border-white rounded-2xl shadow-2xl cursor-crosshair bg-gradient-to-br from-blue-100 to-purple-100 transition-all duration-300 hover:shadow-3xl"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};
