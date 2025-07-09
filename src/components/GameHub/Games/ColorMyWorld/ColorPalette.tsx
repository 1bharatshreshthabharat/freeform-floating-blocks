
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, ChevronDown, ChevronUp, Lightbulb, RotateCcw, Download, SkipForward, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { ColoringOutline, GameMode } from './types';

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  gameMode: GameMode;
  currentOutline: ColoringOutline;
  showHint: boolean;
  hintsUsed: number;
  completedSections: Map<string, string>;
  onHint: () => void;
  onReset: () => void;
  onDownload: () => void;
  onSkip: () => void;
  onNext: () => void;
  canSkip: boolean;
  canNext: boolean;
  showOutlines: boolean;
  onToggleOutlines: () => void;
  outlineColor: string;
  onOutlineColorChange: (color: string) => void;
}

const colorPalettes = {
  basic: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#000000', '#FFFFFF', '#8B4513', '#FFD700', '#FF4500'
  ],
  realistic: [
    '#8B4513', '#32CD32', '#FFD700', '#FF4500', '#4169E1',
    '#FF1493', '#00CED1', '#9ACD32', '#FF6347', '#1E90FF',
    '#FFA500', '#7FFF00', '#DC143C', '#00FFFF', '#FF69B4',
    '#808080', '#696969', '#A0522D', '#228B22', '#FF0000'
  ],
  creative: [
    '#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#8000FF',
    '#FF8000', '#0080FF', '#FF0040', '#40FF80', '#8040FF',
    '#FF4080', '#80FF40', '#4080FF', '#FF8040', '#40FF40',
    '#E6E6FA', '#FFB6C1', '#98FB98', '#F0E68C', '#DDA0DD'
  ]
};

const outlineColors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onColorSelect,
  gameMode,
  currentOutline,
  showHint,
  hintsUsed,
  completedSections,
  onHint,
  onReset,
  onDownload,
  onSkip,
  onNext,
  canSkip,
  canNext,
  showOutlines,
  onToggleOutlines,
  outlineColor,
  onOutlineColorChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customColor, setCustomColor] = useState('#FF6B6B');
  const [showOutlineColors, setShowOutlineColors] = useState(false);

  const currentPalette = gameMode === 'creative' 
    ? colorPalettes.creative 
    : [...colorPalettes.basic, ...colorPalettes.realistic];

  const suggestedColors = showHint && gameMode === 'realistic' 
    ? currentOutline.sections.map(s => s.suggestedColor)
    : [];

  const displayColors = isExpanded ? currentPalette : currentPalette.slice(0, 16);

  return (
    <div className="space-y-3">
      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-3 gap-1">
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-xs h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          
          <Button
            onClick={canNext ? onNext : onSkip}
            variant="outline"
            size="sm"
            className="text-xs h-8"
            disabled={!canSkip && !canNext}
          >
            {canNext ? (
              <>
                <ArrowRight className="h-3 w-3 mr-1" />
                Next
              </>
            ) : (
              <>
                <SkipForward className="h-3 w-3 mr-1" />
                Skip
              </>
            )}
          </Button>
          
          <Button
            onClick={onDownload}
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
            disabled={completedSections.size === 0}
          >
            <Download className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        {/* Hint Button for Realistic Mode */}
        {gameMode === 'realistic' && (
          <Button
            onClick={onHint}
            variant="outline"
            size="sm"
            className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300 text-xs h-8"
            disabled={hintsUsed >= 5}
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Hint ({5 - hintsUsed} left)
          </Button>
        )}
      </div>

      {/* Color Palette Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-gray-800">Fill Colors</h3>
          {gameMode === 'creative' && <Sparkles className="h-3 w-3 text-pink-500" />}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 p-0"
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-1">
        {displayColors.map((color, index) => {
          const isSelected = selectedColor === color;
          const isHinted = suggestedColors.includes(color);
          
          return (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className={`
                w-8 h-8 rounded-lg border-2 transition-all duration-200 transform active:scale-95
                ${isSelected 
                  ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-purple-300' 
                  : 'border-gray-300 hover:border-gray-500 active:border-gray-600'
                }
                ${isHinted ? 'animate-pulse ring-2 ring-yellow-300' : ''}
              `}
              style={{ backgroundColor: color }}
              title={isHinted ? 'Suggested color!' : color}
            >
              {isSelected && (
                <div className="w-full h-full rounded-md bg-white/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Color Picker */}
      {gameMode === 'creative' && (
        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onColorSelect(e.target.value);
            }}
            className="w-8 h-8 rounded-lg border-2 border-purple-300 cursor-pointer"
            title="Custom color picker"
          />
          <span className="text-xs text-purple-700 font-medium">Custom</span>
        </div>
      )}

      {/* Outline Controls */}
      <Card className="p-2 bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700">Outline Settings</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleOutlines}
              className="h-6 w-6 p-0"
            >
              {showOutlines ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-blue-600">Color:</span>
            <div className="flex gap-1">
              {outlineColors.slice(0, 5).map((color, index) => (
                <button
                  key={index}
                  onClick={() => onOutlineColorChange(color)}
                  className={`
                    w-5 h-5 rounded border-2 transition-all duration-200
                    ${outlineColor === color 
                      ? 'border-blue-600 scale-110' 
                      : 'border-gray-300 hover:border-gray-500'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOutlineColors(!showOutlineColors)}
                className="h-5 w-5 p-0 text-xs"
              >
                +
              </Button>
            </div>
          </div>

          {showOutlineColors && (
            <div className="grid grid-cols-5 gap-1">
              {outlineColors.slice(5).map((color, index) => (
                <button
                  key={index}
                  onClick={() => onOutlineColorChange(color)}
                  className={`
                    w-5 h-5 rounded border-2 transition-all duration-200
                    ${outlineColor === color 
                      ? 'border-blue-600 scale-110' 
                      : 'border-gray-300 hover:border-gray-500'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Selected Color Display */}
      <Card className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="text-xs text-purple-700">
          <div className="font-medium mb-1">Selected Fill:</div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-purple-300 flex-shrink-0"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs font-mono truncate">{selectedColor.toUpperCase()}</span>
          </div>
        </div>
      </Card>

      {/* Mode Tips */}
      {gameMode === 'realistic' && (
        <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
          💡 Use realistic colors to match the object for bonus points!
        </div>
      )}

      {gameMode === 'creative' && (
        <div className="text-xs text-gray-600 bg-pink-50 p-2 rounded-lg border border-pink-200">
          🎨 Drag parts to build your creation and use any colors you like!
        </div>
      )}
    </div>
  );
};
