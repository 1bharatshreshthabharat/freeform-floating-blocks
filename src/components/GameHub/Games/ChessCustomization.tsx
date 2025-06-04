
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Crown, Grid, Shuffle } from 'lucide-react';

export interface ChessCustomization {
  boardTheme: string;
  pieceSet: string;
  boardColors: {
    light: string;
    dark: string;
  };
  pieceColors: {
    white: string;
    black: string;
  };
  showCoordinates: boolean;
  highlightMoves: boolean;
  animationSpeed: string;
  boardBorder: string;
}

interface ChessCustomizationProps {
  customization: ChessCustomization;
  onCustomizationChange: (customization: ChessCustomization) => void;
}

export const ChessCustomizationPanel: React.FC<ChessCustomizationProps> = ({
  customization,
  onCustomizationChange
}) => {
  const boardThemes = [
    { value: 'classic', label: 'Classic Wood', colors: { light: '#f0d9b5', dark: '#b58863' } },
    { value: 'marble', label: 'Marble Luxury', colors: { light: '#f8f8ff', dark: '#708090' } },
    { value: 'glass', label: 'Glass Modern', colors: { light: '#e6f3ff', dark: '#4169e1' } },
    { value: 'metal', label: 'Steel Professional', colors: { light: '#f5f5f5', dark: '#2f4f4f' } },
    { value: 'tournament', label: 'Tournament Green', colors: { light: '#ffffcc', dark: '#769656' } },
    { value: 'vintage', label: 'Vintage Leather', colors: { light: '#deb887', dark: '#8b4513' } },
    { value: 'neon', label: 'Neon Gaming', colors: { light: '#00ffff', dark: '#ff00ff' } },
    { value: 'ocean', label: 'Ocean Blue', colors: { light: '#87ceeb', dark: '#4682b4' } }
  ];

  const pieceSets = [
    { value: 'classical', label: 'Classical Staunton' },
    { value: 'modern', label: 'Modern Minimalist' },
    { value: 'medieval', label: 'Medieval Fantasy' },
    { value: 'abstract', label: 'Abstract Geometric' },
    { value: '3d', label: '3D Rendered' },
    { value: 'cartoon', label: 'Cartoon Style' },
    { value: 'crystal', label: 'Crystal Clear' },
    { value: 'wooden', label: 'Hand-carved Wood' }
  ];

  const animationSpeeds = [
    { value: 'instant', label: 'Instant' },
    { value: 'fast', label: 'Fast (200ms)' },
    { value: 'normal', label: 'Normal (400ms)' },
    { value: 'slow', label: 'Slow (600ms)' },
    { value: 'cinematic', label: 'Cinematic (800ms)' }
  ];

  const boardBorders = [
    { value: 'none', label: 'No Border' },
    { value: 'classic', label: 'Classic Frame' },
    { value: 'ornate', label: 'Ornate Gold' },
    { value: 'modern', label: 'Modern Clean' },
    { value: 'glowing', label: 'Glowing Effect' }
  ];

  const updateCustomization = (updates: Partial<ChessCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const randomizeAll = () => {
    const randomTheme = boardThemes[Math.floor(Math.random() * boardThemes.length)];
    const randomPieces = pieceSets[Math.floor(Math.random() * pieceSets.length)];
    const randomAnimation = animationSpeeds[Math.floor(Math.random() * animationSpeeds.length)];
    const randomBorder = boardBorders[Math.floor(Math.random() * boardBorders.length)];

    onCustomizationChange({
      ...customization,
      boardTheme: randomTheme.value,
      boardColors: randomTheme.colors,
      pieceSet: randomPieces.value,
      animationSpeed: randomAnimation.value,
      boardBorder: randomBorder.value,
      showCoordinates: Math.random() > 0.5,
      highlightMoves: Math.random() > 0.3
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Board Theme */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
            <Grid className="h-4 w-4" />
            <span>Board Theme</span>
          </label>
          <Select 
            value={customization.boardTheme} 
            onValueChange={(value) => {
              const theme = boardThemes.find(t => t.value === value);
              updateCustomization({ 
                boardTheme: value,
                boardColors: theme?.colors || customization.boardColors
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {boardThemes.map(theme => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 border border-gray-300" 
                        style={{ backgroundColor: theme.colors.light }}
                      />
                      <div 
                        className="w-3 h-3 border border-gray-300" 
                        style={{ backgroundColor: theme.colors.dark }}
                      />
                    </div>
                    <span>{theme.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Piece Set */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Piece Set</span>
          </label>
          <Select 
            value={customization.pieceSet} 
            onValueChange={(value) => updateCustomization({ pieceSet: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pieceSets.map(set => (
                <SelectItem key={set.value} value={set.value}>
                  {set.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Animation Speed */}
        <div>
          <label className="text-sm font-medium mb-2 block">Animation Speed</label>
          <Select 
            value={customization.animationSpeed} 
            onValueChange={(value) => updateCustomization({ animationSpeed: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {animationSpeeds.map(speed => (
                <SelectItem key={speed.value} value={speed.value}>
                  {speed.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Board Border */}
        <div>
          <label className="text-sm font-medium mb-2 block">Board Border</label>
          <Select 
            value={customization.boardBorder} 
            onValueChange={(value) => updateCustomization({ boardBorder: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {boardBorders.map(border => (
                <SelectItem key={border.value} value={border.value}>
                  {border.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visual Options */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show Coordinates</span>
            <Button
              variant={customization.showCoordinates ? "default" : "outline"}
              size="sm"
              onClick={() => updateCustomization({ showCoordinates: !customization.showCoordinates })}
            >
              {customization.showCoordinates ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Highlight Moves</span>
            <Button
              variant={customization.highlightMoves ? "default" : "outline"}
              size="sm"
              onClick={() => updateCustomization({ highlightMoves: !customization.highlightMoves })}
            >
              {customization.highlightMoves ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {/* Randomize Button */}
        <Button onClick={randomizeAll} className="w-full" variant="outline">
          <Shuffle className="h-4 w-4 mr-2" />
          Randomize All
        </Button>

        {/* Current Settings Display */}
        <div className="pt-2 border-t">
          <h4 className="text-sm font-semibold mb-2">Current Settings:</h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{customization.boardTheme}</Badge>
            <Badge variant="secondary">{customization.pieceSet}</Badge>
            <Badge variant="secondary">{customization.animationSpeed}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
