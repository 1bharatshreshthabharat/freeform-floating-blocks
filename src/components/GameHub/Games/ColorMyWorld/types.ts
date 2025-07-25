
export type GameMode = 'realistic' | 'creative';

export interface ColoringSection {
  id: string;
  name: string;
  path: string;
  suggestedColor: string;
}

export interface MissingPart {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  drawingTools: ('pencil' | 'brush' | 'eraser' | 'circle' | 'rectangle')[];
  suggestedShape?: string;
  description?: string;
  drawingOptions?: string[];
}

export interface ColoringOutline {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  viewBox: string;
  sections: ColoringSection[];
  missingParts?: MissingPart[];
  referenceImage?: string;
  animation?: {
    type: 'fly' | 'run' | 'walk' | 'jump' | 'spin' | 'bounce';
    duration: number;
    direction?: 'left' | 'right' | 'up' | 'down';
  };
}

export interface GameStats {
  totalOutlinesCompleted: number;
  totalScore: number;
  fastestCompletion: number;
  perfectRounds: number;
  hintsUsed: number;
}

export interface CreativePart {
  id: string;
  name: string;
  path: string;
  position: { x: number; y: number };
  originalPosition: { x: number; y: number };
  rotation: number;
  scale: number;
  color: string;
  isPlaced: boolean;
}
