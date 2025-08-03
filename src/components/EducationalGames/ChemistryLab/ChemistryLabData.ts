// src/data/ChemistryLabData.ts

export interface Atom {
  id: string;
  symbol: string;
  name: string;
  valency: number;
  color: string;
  position?: { x: number; y: number };
  electronConfig: string;
  atomicNumber: number;
  group: number;
  period: number;
  mass: number;
  description: string;
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  atoms: { symbol: string; count: number }[];
  bondType: 'ionic' | 'covalent' | 'polar';
  difficulty: number;
  description: string;
  realWorldUse: string;
  moleculeImage: string;
  structure: string;
  properties: {
    meltingPoint?: number;
    boilingPoint?: number;
    density?: number;
    solubility: string;
    color: string;
    state: string;
  };
}

export interface ChemicalReaction {
  id: string;
  name: string;
  equation: string;
  reactants: string[];
  products: string[];
  type: string;
  description: string;
  example: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  equipment: string[];
  procedure: string[];
  safetyTips: string[];
  expectedResult: string;
  difficulty: number;
  icon: string;
}

// ----------------------
// Data Arrays
// ----------------------

export const periodicTable: Atom[] = [
  { id: 'H', symbol: 'H', name: 'Hydrogen', valency: 1, color: '#FFFFFF', electronConfig: '1s¹', atomicNumber: 1, group: 1, period: 1, mass: 1.008, description: 'Lightest and most abundant element in the universe' },
  { id: 'He', symbol: 'He', name: 'Helium', valency: 0, color: '#D9FFFF', electronConfig: '1s²', atomicNumber: 2, group: 18, period: 1, mass: 4.003, description: 'Noble gas, second lightest element' },
  
    // Period 2
  { id: 'Li', symbol: 'Li', name: 'Lithium', valency: 1, color: '#CC80FF', electronConfig: '2s¹', atomicNumber: 3, group: 1, period: 2, mass: 6.941, description: 'Lightest metal, used in batteries' },
  { id: 'Be', symbol: 'Be', name: 'Beryllium', valency: 2, color: '#C2FF00', electronConfig: '2s²', atomicNumber: 4, group: 2, period: 2, mass: 9.012, description: 'Light, strong metal used in aerospace' },
  { id: 'B', symbol: 'B', name: 'Boron', valency: 3, color: '#FFB5B5', electronConfig: '2s²2p¹', atomicNumber: 5, group: 13, period: 2, mass: 10.811, description: 'Metalloid essential for plant growth' },
  { id: 'C', symbol: 'C', name: 'Carbon', valency: 4, color: '#909090', electronConfig: '2s²2p²', atomicNumber: 6, group: 14, period: 2, mass: 12.011, description: 'Basis of organic chemistry and life' },
  { id: 'N', symbol: 'N', name: 'Nitrogen', valency: 3, color: '#3050F8', electronConfig: '2s²2p³', atomicNumber: 7, group: 15, period: 2, mass: 14.007, description: 'Makes up 78% of atmospheric air' },
  { id: 'O', symbol: 'O', name: 'Oxygen', valency: 2, color: '#FF0D0D', electronConfig: '2s²2p⁴', atomicNumber: 8, group: 16, period: 2, mass: 15.999, description: 'Essential for respiration and combustion' },
  { id: 'F', symbol: 'F', name: 'Fluorine', valency: 1, color: '#90E050', electronConfig: '2s²2p⁵', atomicNumber: 9, group: 17, period: 2, mass: 18.998, description: 'Most electronegative element' },
  { id: 'Ne', symbol: 'Ne', name: 'Neon', valency: 0, color: '#B3E3F5', electronConfig: '2s²2p⁶', atomicNumber: 10, group: 18, period: 2, mass: 20.180, description: 'Noble gas used in signs and lighting' },
  
  // Period 3
  { id: 'Na', symbol: 'Na', name: 'Sodium', valency: 1, color: '#AB5CF2', electronConfig: '3s¹', atomicNumber: 11, group: 1, period: 3, mass: 22.990, description: 'Essential electrolyte in biological systems' },
  { id: 'Mg', symbol: 'Mg', name: 'Magnesium', valency: 2, color: '#8AFF00', electronConfig: '3s²', atomicNumber: 12, group: 2, period: 3, mass: 24.305, description: 'Important for enzyme function and bone health' },
  { id: 'Al', symbol: 'Al', name: 'Aluminum', valency: 3, color: '#BFA6A6', electronConfig: '3s²3p¹', atomicNumber: 13, group: 13, period: 3, mass: 26.982, description: 'Lightweight metal, third most abundant element' },
  { id: 'Si', symbol: 'Si', name: 'Silicon', valency: 4, color: '#F0C8A0', electronConfig: '3s²3p²', atomicNumber: 14, group: 14, period: 3, mass: 28.086, description: 'Metalloid essential for semiconductors' },
  { id: 'P', symbol: 'P', name: 'Phosphorus', valency: 5, color: '#FF8000', electronConfig: '3s²3p³', atomicNumber: 15, group: 15, period: 3, mass: 30.974, description: 'Essential for DNA, RNA, and ATP' },
  { id: 'S', symbol: 'S', name: 'Sulfur', valency: 6, color: '#FFFF30', electronConfig: '3s²3p⁴', atomicNumber: 16, group: 16, period: 3, mass: 32.065, description: 'Important for protein structure' },
  { id: 'Cl', symbol: 'Cl', name: 'Chlorine', valency: 1, color: '#1FF01F', electronConfig: '3s²3p⁵', atomicNumber: 17, group: 17, period: 3, mass: 35.453, description: 'Halogen used for disinfection' },
  { id: 'Ar', symbol: 'Ar', name: 'Argon', valency: 0, color: '#80D1E3', electronConfig: '3s²3p⁶', atomicNumber: 18, group: 18, period: 3, mass: 39.948, description: 'Noble gas, 1% of atmosphere' },
  
  // Period 4 (selected elements)
  { id: 'K', symbol: 'K', name: 'Potassium', valency: 1, color: '#8F40D4', electronConfig: '4s¹', atomicNumber: 19, group: 1, period: 4, mass: 39.098, description: 'Essential electrolyte for nerve function' },
  { id: 'Ca', symbol: 'Ca', name: 'Calcium', valency: 2, color: '#3DFF00', electronConfig: '4s²', atomicNumber: 20, group: 2, period: 4, mass: 40.078, description: 'Essential for bones and teeth' },
  { id: 'Fe', symbol: 'Fe', name: 'Iron', valency: 3, color: '#E06633', electronConfig: '[Ar]4s²3d⁶', atomicNumber: 26, group: 8, period: 4, mass: 55.845, description: 'Essential for oxygen transport in blood' },
  { id: 'Cu', symbol: 'Cu', name: 'Copper', valency: 2, color: '#C88033', electronConfig: '[Ar]4s¹3d¹⁰', atomicNumber: 29, group: 11, period: 4, mass: 63.546, description: 'Excellent conductor, antimicrobial properties' },
  { id: 'Zn', symbol: 'Zn', name: 'Zinc', valency: 2, color: '#7D80B0', electronConfig: '[Ar]4s²3d¹⁰', atomicNumber: 30, group: 12, period: 4, mass: 65.38, description: 'Essential trace element for immune function' }
];

export const advancedMolecules: Molecule[] = [
  {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    atoms: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }],
    bondType: 'polar',
    difficulty: 1,
    description: 'Universal solvent, essential for all life forms',
    realWorldUse: 'Drinking, cleaning, biological processes, industrial cooling',
    moleculeImage: '💧',
    structure: 'Bent molecular geometry, 104.5° angle',
    properties: {
      meltingPoint: 0,
      boilingPoint: 100,
      density: 1.0,
      solubility: 'N/A (universal solvent)',
      color: 'Colorless',
      state: 'Liquid at room temperature'
    }
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    atoms: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 2 }],
    bondType: 'covalent',
    difficulty: 2,
    description: 'Greenhouse gas, product of respiration',
    realWorldUse: 'Photosynthesis, carbonated drinks, fire extinguishers, dry ice',
    moleculeImage: '🌫️',
    structure: 'Linear molecular geometry, 180° angle',
    properties: {
      meltingPoint: -78.5,
      boilingPoint: -78.5,
      density: 1.98,
      solubility: 'Slightly soluble in water',
      color: 'Colorless',
      state: 'Gas at room temperature'
    }
  },
  {
    id: 'NaCl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    atoms: [{ symbol: 'Na', count: 1 }, { symbol: 'Cl', count: 1 }],
    bondType: 'ionic',
    difficulty: 2,
    description: 'Common table salt, essential electrolyte',
    realWorldUse: 'Food seasoning, preservation, de-icing, medical saline solutions',
    moleculeImage: '🧂',
    structure: 'Cubic crystal lattice structure',
    properties: {
      meltingPoint: 801,
      boilingPoint: 1465,
      density: 2.16,
      solubility: 'Highly soluble in water (360g/L)',
      color: 'White crystalline',
      state: 'Solid at room temperature'
    }
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    atoms: [{ symbol: 'C', count: 1 }, { symbol: 'H', count: 4 }],
    bondType: 'covalent',
    difficulty: 3,
    description: 'Simplest hydrocarbon, greenhouse gas',
    realWorldUse: 'Natural gas fuel, heating, electricity generation',
    moleculeImage: '🔥',
    structure: 'Tetrahedral geometry, 109.5° bond angles',
    properties: {
      meltingPoint: -182,
      boilingPoint: -162,
      density: 0.657,
      solubility: 'Slightly soluble in water',
      color: 'Colorless',
      state: 'Gas at room temperature'
    }
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    atoms: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 3 }],
    bondType: 'polar',
    difficulty: 3,
    description: 'Important industrial chemical and biological molecule',
    realWorldUse: 'Fertilizers, household cleaners, refrigeration, pharmaceuticals',
    moleculeImage: '🧴',
    structure: 'Trigonal pyramidal, 107° bond angle',
    properties: {
      meltingPoint: -78,
      boilingPoint: -33,
      density: 0.73,
      solubility: 'Highly soluble in water',
      color: 'Colorless',
      state: 'Gas at room temperature'
    }
  },
  {
    id: 'C2H6O',
    name: 'Ethanol',
    formula: 'C₂H₆O',
    atoms: [{ symbol: 'C', count: 2 }, { symbol: 'H', count: 6 }, { symbol: 'O', count: 1 }],
    bondType: 'covalent',
    difficulty: 4,
    description: 'Alcohol found in beverages, important solvent',
    realWorldUse: 'Alcoholic beverages, fuel additive, solvent, antiseptic',
    moleculeImage: '🍷',
    structure: 'Contains hydroxyl (-OH) functional group',
    properties: {
      meltingPoint: -114,
      boilingPoint: 78,
      density: 0.789,
      solubility: 'Miscible with water',
      color: 'Colorless',
      state: 'Liquid at room temperature'
    }
  },
  {
    id: 'C6H12O6',
    name: 'Glucose',
    formula: 'C₆H₁₂O₆',
    atoms: [{ symbol: 'C', count: 6 }, { symbol: 'H', count: 12 }, { symbol: 'O', count: 6 }],
    bondType: 'covalent',
    difficulty: 5,
    description: 'Simple sugar, primary energy source for cells',
    realWorldUse: 'Cellular energy, diabetes treatment, food production',
    moleculeImage: '🍯',
    structure: 'Ring structure with multiple hydroxyl groups',
    properties: {
      meltingPoint: 146,
      boilingPoint: 410,
      density: 1.54,
      solubility: 'Highly soluble in water',
      color: 'White crystalline',
      state: 'Solid at room temperature'
    }
  }
];

export const chemicalReactions: ChemicalReaction[] = [
  {
    id: 'combustion_methane',
    name: 'Combustion of Methane',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactants: ['CH₄', 'O₂'],
    products: ['CO₂', 'H₂O'],
    type: 'Combustion',
    description: 'Exothermic reaction that releases energy',
    example: 'Natural gas burning in a stove'
  },
   {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    equation: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
    reactants: ['CO₂', 'H₂O'],
    products: ['C₆H₁₂O₆', 'O₂'],
    type: 'Endothermic',
    description: 'Plants convert CO₂ and water into glucose',
    example: 'Plants making sugar from sunlight'
  },
  {
    id: 'acid_base',
    name: 'Acid-Base Neutralization',
    equation: 'HCl + NaOH → NaCl + H₂O',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H₂O'],
    type: 'Neutralization',
    description: 'Acid and base react to form salt and water',
    example: 'Stomach acid neutralized by antacid'
  },
  {
    id: 'electrolysis',
    name: 'Electrolysis of Water',
    equation: '2H₂O → 2H₂ + O₂',
    reactants: ['H₂O'],
    products: ['H₂', 'O₂'],
    type: 'Decomposition',
    description: 'Electric current splits water into hydrogen and oxygen',
    example: 'Hydrogen fuel production'
  }
];

export const virtualExperiments: Experiment[] = [
  {
    id: 'acid_base_titration',
    name: 'Acid-Base Titration',
    description: 'Determine the concentration of an unknown acid using a base',
    equipment: ['Burette', 'Conical Flask', 'Pipette', 'Indicator'],
    procedure: [
      'Fill burette with NaOH solution',
      'Pipette acid into conical flask',
      'Add indicator to the acid',
      'Slowly add base until color change',
      'Record the volume used'
    ],
    safetyTips: ['Wear safety goggles', 'Handle acids with care', 'Work in ventilated area'],
    expectedResult: 'Color change from red to yellow at equivalence point',
    difficulty: 3,
    icon: '🧪'
  },
   {
    id: 'crystallization',
    name: 'Salt Crystallization',
    description: 'Grow beautiful salt crystals from solution',
    equipment: ['Beaker', 'Stirring Rod', 'Heat Source', 'String'],
    procedure: [
      'Heat water in beaker',
      'Add salt until saturated',
      'Cool the solution slowly',
      'Observe crystal formation',
      'Examine under microscope'
    ],
    safetyTips: ['Handle hot water carefully', 'Use heat-resistant glassware'],
    expectedResult: 'Formation of cubic salt crystals',
    difficulty: 1,
    icon: '💎'
  },
  {
    id: 'combustion_analysis',
    name: 'Combustion Analysis',
    description: 'Analyze the products of methane combustion',
    equipment: ['Combustion Chamber', 'Gas Tubes', 'Lime Water', 'Thermometer'],
    procedure: [
      'Set up combustion apparatus',
      'Ignite methane gas',
      'Collect combustion products',
      'Test for CO₂ with lime water',
      'Measure heat released'
    ],
    safetyTips: ['Work in fume hood', 'Keep fire extinguisher nearby', 'Monitor temperature'],
    expectedResult: 'CO₂ turns lime water milky, heat is released',
    difficulty: 4,
    icon: '🔥'
  }
];
