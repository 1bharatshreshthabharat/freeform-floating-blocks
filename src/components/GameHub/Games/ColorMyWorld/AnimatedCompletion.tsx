
import React, { useEffect, useState } from 'react';
import { ColoringOutline } from './types';

interface AnimatedCompletionProps {
  outline: ColoringOutline;
  completedSections: Map<string, string>;
  onAnimationComplete: () => void;
}

export const AnimatedCompletion: React.FC<AnimatedCompletionProps> = ({
  outline,
  completedSections,
  onAnimationComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    // Animation duration based on type
    const duration = outline.animation === 'fly' ? 3000 : 2000;
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [outline, onAnimationComplete]);

  const getAnimationClass = () => {
    switch (outline.animation) {
      case 'fly':
        return 'animate-fly-away';
      case 'run':
        return 'animate-run-away';
      case 'walk':
        return 'animate-walk-away';
      case 'jump':
        return 'animate-jump-away';
      case 'spin':
        return 'animate-spin-away';
      case 'bounce':
        return 'animate-bounce-away';
      default:
        return 'animate-fade-away';
    }
  };

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center z-40">
      <div className="text-center">
        <div className={`transform transition-all duration-1000 ${getAnimationClass()}`}>
          <svg
            viewBox={outline.viewBox}
            className="w-64 h-64 mx-auto mb-4"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
          >
            {outline.sections.map((section) => (
              <path
                key={section.id}
                d={section.path}
                fill={completedSections.get(section.id) || 'transparent'}
                stroke="#333"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        
        <div className="text-2xl font-bold text-purple-700 mb-2 animate-bounce">
          🎉 Amazing Work! 🎉
        </div>
        
        <div className="text-lg text-gray-700">
          Your {outline.name} is {outline.animation === 'fly' ? 'flying' : outline.animation === 'run' ? 'running' : 'moving'} away!
        </div>
      </div>

      <style>
        {`
          @keyframes fly-away {
            0% { transform: translateY(0) scale(1) rotate(0deg); }
            50% { transform: translateY(-100px) scale(1.1) rotate(10deg); }
            100% { transform: translateY(-300px) scale(0.5) rotate(20deg); opacity: 0; }
          }
          
          @keyframes run-away {
            0% { transform: translateX(0) scale(1); }
            100% { transform: translateX(400px) scale(0.8); opacity: 0; }
          }
          
          @keyframes walk-away {
            0% { transform: translateX(0) scale(1); }
            100% { transform: translateX(300px) scale(0.9); opacity: 0; }
          }
          
          @keyframes jump-away {
            0% { transform: translateY(0) scale(1); }
            25% { transform: translateY(-50px) scale(1.1); }
            50% { transform: translateY(-100px) scale(1.2); }
            75% { transform: translateY(-150px) scale(1.1); }
            100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
          }
          
          @keyframes spin-away {
            0% { transform: rotate(0deg) scale(1); }
            100% { transform: rotate(720deg) scale(0.3); opacity: 0; }
          }
          
          @keyframes bounce-away {
            0% { transform: translateY(0) scale(1); }
            20% { transform: translateY(-30px) scale(1.1); }
            40% { transform: translateY(0) scale(1); }
            60% { transform: translateY(-60px) scale(1.2); }
            80% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
          }
          
          @keyframes fade-away {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.2); opacity: 0; }
          }
          
          .animate-fly-away { animation: fly-away 3s ease-in-out forwards; }
          .animate-run-away { animation: run-away 2s ease-in-out forwards; }
          .animate-walk-away { animation: walk-away 2.5s ease-in-out forwards; }
          .animate-jump-away { animation: jump-away 2s ease-in-out forwards; }
          .animate-spin-away { animation: spin-away 2s ease-in-out forwards; }
          .animate-bounce-away { animation: bounce-away 2.5s ease-in-out forwards; }
          .animate-fade-away { animation: fade-away 2s ease-in-out forwards; }
        `}
      </style>
    </div>
  );
};
