
import React from 'react';
import { Card } from '@/components/ui/card';
import { Palette, Sparkles } from 'lucide-react';
import { ColoringOutline, GameMode } from './types';

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  gameMode: GameMode;
  currentOutline: ColoringOutline;
  showHint: boolean;
}

const colorPalettes = {
  basic: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ],
  realistic: [
    '#8B4513', '#32CD32', '#FFD700', '#FF4500', '#4169E1',
    '#FF1493', '#00CED1', '#9ACD32', '#FF6347', '#1E90FF',
    '#FFA500', '#7FFF00', '#DC143C', '#00FFFF', '#FF69B4'
  ],
  creative: [
    '#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#8000FF',
    '#FF8000', '#0080FF', '#FF0040', '#40FF80', '#8040FF',
    '#FF4080', '#80FF40', '#4080FF', '#FF8040', '#40FF40'
  ]
};

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onColorSelect,
  gameMode,
  currentOutline,
  showHint
}) => {
  const currentPalette = gameMode === 'creative' 
    ? colorPalettes.creative 
    : [...colorPalettes.basic, ...colorPalettes.realistic];

  const suggestedColors = showHint && gameMode === 'realistic' 
    ? currentOutline.sections.map(s => s.suggestedColor)
    : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="h-4 w-4 text-purple-600" />
        <h3 className="text-base font-bold text-gray-800">Colors</h3>
        {gameMode === 'creative' && <Sparkles className="h-3 w-3 text-pink-500" />}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
        {currentPalette.map((color, index) => {
          const isSelected = selectedColor === color;
          const isHinted = suggestedColors.includes(color);
          
          return (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className={`
                w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 rounded-lg border-2 transition-all duration-200 transform
                ${isSelected 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-500 hover:scale-105'
                }
                ${isHinted ? 'animate-pulse ring-2 ring-yellow-300' : ''}
              `}
              style={{ backgroundColor: color }}
              title={isHinted ? 'Suggested color!' : color}
            >
              {isSelected && (
                <div className="w-full h-full rounded-md bg-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Card className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="text-xs text-purple-700">
          <div className="font-medium mb-1">Selected:</div>
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-full border-2 border-purple-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs font-mono">{selectedColor}</span>
          </div>
        </div>
      </Card>

      {gameMode === 'realistic' && (
        <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
          💡 Try realistic colors for bonus points!
        </div>
      )}

      {gameMode === 'creative' && (
        <div className="text-xs text-gray-600 bg-pink-50 p-2 rounded-lg border border-pink-200">
          🎨 Use any colors you like!
        </div>
      )}
    </div>
  );
};
