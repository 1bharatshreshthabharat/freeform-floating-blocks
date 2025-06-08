
import React, { useCallback } from 'react';
import { fruitTypes, backgroundThemes } from './fruitNinjaUtils';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './FruitNinjaProvider';

interface CanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameState: string;
  fruits: any[];
  particles: any[];
  sliceTrail: any;
  score: number;
  level: number;
  combo: number;
  lives: number;
  customization: any;
}

// Custom hook to get the draw function
export const useFruitNinjaRenderer = (props: CanvasRendererProps) => {
  const draw = useCallback(() => {
    const canvas = props.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = backgroundThemes[props.customization.backgroundTheme as keyof typeof backgroundThemes];

    // Clear and draw background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (props.customization.backgroundTheme === 'dojo') {
      gradient.addColorStop(0, '#2C1810');
      gradient.addColorStop(1, '#8B4513');
    } else if (props.customization.backgroundTheme === 'sunset') {
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#FFE66D');
    } else if (props.customization.backgroundTheme === 'forest') {
      gradient.addColorStop(0, '#2ECC71');
      gradient.addColorStop(1, '#27AE60');
    } else if (props.customization.backgroundTheme === 'ocean') {
      gradient.addColorStop(0, '#3498DB');
      gradient.addColorStop(1, '#2980B9');
    } else if (props.customization.backgroundTheme === 'space') {
      gradient.addColorStop(0, '#2C3E50');
      gradient.addColorStop(1, '#4A90E2');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background pattern
    ctx.save();
    ctx.globalAlpha = 0.1;
    if (theme.pattern === 'bamboo') {
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(100 + i * 150, 0);
        ctx.lineTo(100 + i * 150, CANVAS_HEIGHT);
        ctx.stroke();
      }
    }
    ctx.restore();

    if (props.gameState !== 'menu') {
      // Draw particles
      if (props.customization.enableParticles) {
        props.particles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.life / particle.maxLife;
          
          if (particle.type === 'explosion') {
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = particle.color;
          }
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Draw fruits
      props.fruits.forEach(fruit => {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.rotate(fruit.rotation);
        
        if (fruit.sliced) {
          ctx.globalAlpha = Math.max(0, 1 - (Date.now() - fruit.sliceTime) / 500);
          ctx.scale(1.2, 0.8);
        }
        
        if (fruit.isBomb) {
          ctx.font = `${fruit.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('💣', 0, fruit.size / 3);
        } else {
          const fruitData = fruitTypes[fruit.type as keyof typeof fruitTypes];
          if (fruitData) {
            ctx.font = `${fruit.size}px Arial`;
            ctx.textAlign = 'center';
            
            if (fruit.isSpecial) {
              ctx.shadowColor = '#FFD700';
              ctx.shadowBlur = 15;
            }
            
            ctx.fillText(fruitData.emoji, 0, fruit.size / 3);
          }
        }
        
        ctx.restore();
      });

      // Draw slice trail with proper blade customization and alignment
      if (props.customization.enableTrails && props.sliceTrail.points.length > 1) {
        ctx.save();
        
        // Apply blade type styling
        if (props.customization.bladeType === 'fire') {
          ctx.strokeStyle = '#FF4500';
          ctx.shadowColor = '#FF4500';
          ctx.shadowBlur = 15;
          ctx.lineWidth = props.sliceTrail.width + 2;
        } else if (props.customization.bladeType === 'ice') {
          ctx.strokeStyle = '#00FFFF';
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 10;
          ctx.lineWidth = props.sliceTrail.width;
        } else if (props.customization.bladeType === 'lightning') {
          ctx.strokeStyle = '#FFFF00';
          ctx.shadowColor = '#FFFF00';
          ctx.shadowBlur = 20;
          ctx.lineWidth = props.sliceTrail.width;
        } else {
          ctx.strokeStyle = props.customization.bladeColor;
          ctx.shadowColor = props.customization.bladeColor;
          ctx.shadowBlur = 10;
          ctx.lineWidth = props.sliceTrail.width;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        props.sliceTrail.points.forEach((point, index) => {
          ctx.globalAlpha = point.time / 30;
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw UI
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    if (props.gameState === 'menu') {
      ctx.save();
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      ctx.strokeText('Fruit Ninja', CANVAS_WIDTH/2, 200);
      ctx.fillText('Fruit Ninja', CANVAS_WIDTH/2, 200);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click or Touch to Start!', CANVAS_WIDTH/2, 250);
      ctx.font = '18px Arial';
      ctx.fillText('Slice fruits to score!', CANVAS_WIDTH/2, 280);
      ctx.restore();
    } else if (props.gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', CANVAS_WIDTH/2, 250);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${props.score}`, CANVAS_WIDTH/2, 290);
      ctx.fillText(`Level Reached: ${props.level}`, CANVAS_WIDTH/2, 320);
      ctx.fillText('Click to Play Again', CANVAS_WIDTH/2, 360);
    }

    // Game UI
    if (props.gameState === 'playing' || props.gameState === 'paused') {
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      
      ctx.fillText(`Score: ${props.score}`, 20, 40);
      ctx.fillText(`Level: ${props.level}`, 20, 70);
      ctx.fillText(`Combo: ${props.combo}x`, 20, 100);
      
      // Lives
      ctx.textAlign = 'right';
      ctx.fillText('Lives:', CANVAS_WIDTH - 100, 40);
      for (let i = 0; i < props.lives; i++) {
        ctx.fillText('❤️', CANVAS_WIDTH - 60 + i * 25, 40);
      }
      
      ctx.restore();
    }
  }, [props]);

  return { draw };
};
