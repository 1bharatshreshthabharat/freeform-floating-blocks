
export type GameMode = 'realistic' | 'creative';

export type Category = 'animals' | 'fruits' | 'vehicles' | 'houses' | 'nature' | 'food' | 'toys';

export interface ColorSection {
  id: string;
  path: string;
  suggestedColor: string;
  name: string;
  x?: number;
  y?: number;
  originalX?: number;
  originalY?: number;
  isConnected?: boolean;
}

export interface ColoringOutline {
  id: string;
  name: string;
  category: Category;
  difficulty: number;
  sections: ColorSection[];
  viewBox: string;
  animation?: 'fly' | 'run' | 'walk' | 'jump' | 'spin' | 'bounce';
  missingParts?: MissingPart[];
}

export interface MissingPart {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  drawingOptions: DrawingOption[];
}

export interface DrawingOption {
  id: string;
  name: string;
  path: string;
  suggestedColor: string;
}

export interface GameStats {
  totalOutlinesCompleted: number;
  totalScore: number;
  fastestCompletion: number;
  perfectRounds: number;
  hintsUsed: number;
}

export interface ColorPalette {
  name: string;
  colors: string[];
}
