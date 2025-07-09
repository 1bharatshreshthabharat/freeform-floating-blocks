
export type GameMode = 'realistic' | 'creative';

export type Category = 'animals' | 'fruits' | 'vehicles' | 'houses' | 'nature' | 'food' | 'toys';

export interface ColorSection {
  id: string;
  path: string;
  suggestedColor: string;
  name: string;
}

export interface ColoringOutline {
  id: string;
  name: string;
  category: Category;
  difficulty: number;
  sections: ColorSection[];
  viewBox: string;
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
