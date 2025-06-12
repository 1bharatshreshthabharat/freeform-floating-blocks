
import React, { useRef, useEffect } from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Balloon } from './types';

export const BalloonPopCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, popBalloon } = useBalloonPopGame();

  const drawBalloon = (ctx: CanvasRenderingContext2D, balloon: Balloon) => {
    const { x, y, size, color, content, popAnimation } = balloon;

    if (popAnimation) {
      // Pop animation
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Balloon shadow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 3, size * 0.8, size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Balloon gradient
    const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(1, color);

    // Main balloon
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Balloon highlight
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x - size * 0.3, y - size * 0.3, size * 0.3, size * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Balloon string
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x, y + size + 30);
    ctx.stroke();

    // Content text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(16, size * 0.3)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeText(content, x, y);
    ctx.fillText(content, x, y);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200) + (Date.now() * 0.01) % 1000;
      const y = 50 + i * 30;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

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
        if (!balloon.popped) {
          drawBalloon(ctx, balloon);
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();
  }, [state.balloons]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleCanvasClick}
      className="border-2 border-white rounded-lg shadow-lg cursor-crosshair bg-gradient-to-b from-blue-200 to-blue-50"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
