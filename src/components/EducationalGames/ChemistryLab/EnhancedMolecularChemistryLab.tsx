import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FlaskConical, Atom, Zap, BookOpen, Trophy, Target, Beaker, Microscope, Lightbulb, Flame, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedMolecularChemistryLabProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface Atom {
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

interface Molecule {
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

interface ChemicalReaction {
  id: string;
  name: string;
  equation: string;
  reactants: string[];
  products: string[];
  type: string;
  description: string;
  example: string;
}

interface Experiment {
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

const periodicTable: Atom[] = [
  // Period 1
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

const advancedMolecules: Molecule[] = [
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

const chemicalReactions: ChemicalReaction[] = [
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

const virtualExperiments: Experiment[] = [
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

export const EnhancedMolecularChemistryLab: React.FC<EnhancedMolecularChemistryLabProps> = ({ onBack, onStatsUpdate }) => {
  const [currentTarget, setCurrentTarget] = useState(advancedMolecules[0]);
  const [placedAtoms, setPlacedAtoms] = useState<(Atom & { placed: boolean })[]>([]);
  const [score, setScore] = useState(0);
  const [moleculesBuilt, setMoleculesBuilt] = useState(0);
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [activeTab, setActiveTab] = useState('build');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [level, setLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [unlockedMolecules, setUnlockedMolecules] = useState<string[]>(['H2O', 'CO2']);
  const [showMoleculeAnimation, setShowMoleculeAnimation] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [experimentProgress, setExperimentProgress] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const checkMolecule = () => {
    const atomCounts: { [key: string]: number } = {};
    
    placedAtoms.forEach(atom => {
      if (atom.placed) {
        atomCounts[atom.symbol] = (atomCounts[atom.symbol] || 0) + 1;
      }
    });

    const isCorrect = currentTarget.atoms.every(
      ({ symbol, count }) => atomCounts[symbol] === count
    ) && Object.keys(atomCounts).length === currentTarget.atoms.length;

    if (isCorrect) {
      const basePoints = currentTarget.difficulty * 100;
      const firstTryBonus = attempts === 0 ? 200 : 0;
      const levelBonus = level * 10;
      const totalPoints = basePoints + firstTryBonus + levelBonus;
      
      setScore(prev => prev + totalPoints);
      setExperiencePoints(prev => prev + totalPoints);
      setMoleculesBuilt(prev => {
        const newCount = prev + 1;
        
        // Level up check
        if (experiencePoints + totalPoints >= level * 500) {
          setLevel(prev => prev + 1);
          toast.success(`🎉 Level Up! You're now level ${level + 1}!`);
          
          // Unlock new molecules
          const nextMoleculeIndex = newCount;
          if (nextMoleculeIndex < advancedMolecules.length) {
            const nextMolecule = advancedMolecules[nextMoleculeIndex];
            setUnlockedMolecules(prev => [...prev, nextMolecule.id]);
            toast.success(`🔓 Unlocked: ${nextMolecule.name}!`);
          }
        }
        
        onStatsUpdate({
          totalScore: score + totalPoints,
          totalCompleted: newCount,
          difficulty: currentTarget.difficulty,
          level: level,
          accuracy: newCount > 0 ? ((newCount / (newCount + attempts)) * 100).toFixed(1) : 100
        });
        return newCount;
      });
      
      // Show molecule animation
      setShowMoleculeAnimation(true);
      setTimeout(() => setShowMoleculeAnimation(false), 3000);
      
      toast.success(`🧪 Created ${currentTarget.name}! +${totalPoints} points!`);
      
      // Move to next molecule after delay
      setTimeout(() => {
        const availableMolecules = advancedMolecules.filter(m => unlockedMolecules.includes(m.id) || m.difficulty <= level);
        const nextIndex = (availableMolecules.indexOf(currentTarget) + 1) % availableMolecules.length;
        setCurrentTarget(availableMolecules[nextIndex]);
        setPlacedAtoms([]);
        setAttempts(0);
        setShowHint(false);
      }, 2000);
      
      return true;
    } else {
      setAttempts(prev => prev + 1);
      toast.error(`Not quite right! Try again. (Attempt ${attempts + 1})`);
      return false;
    }
  };

  const addAtom = (atom: Atom) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.random() * (rect.width - 80) + 40;
      const y = Math.random() * (rect.height - 80) + 40;
      
      const newAtom = {
        ...atom,
        id: `${atom.symbol}_${Date.now()}_${Math.random()}`,
        position: { x, y },
        placed: true
      };
      
      setPlacedAtoms(prev => [...prev, newAtom]);
    }
  };

  const removeAtom = (atomId: string) => {
    setPlacedAtoms(prev => prev.filter(atom => atom.id !== atomId));
  };

  const clearLab = () => {
    setPlacedAtoms([]);
    setAttempts(0);
  };

  const getBondTypeColor = (bondType: string) => {
    switch (bondType) {
      case 'ionic': return 'text-red-600 bg-red-50 border-red-200';
      case 'covalent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'polar': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const progressToNextLevel = () => {
    return ((experiencePoints % (level * 500)) / (level * 500)) * 100;
  };

  const generate3DMoleculeGraphic = (molecule: Molecule) => {
    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-tr from-white to-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-4xl mb-1">{molecule.moleculeImage}</div>
            <div className="text-xs font-bold text-gray-700">{molecule.formula}</div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
          {molecule.difficulty}
        </div>
      </div>
    );
  };

  const runExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setExperimentProgress(0);
    
    // Simulate experiment progress
    const interval = setInterval(() => {
      setExperimentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success(`🧪 Experiment completed: ${experiment.name}`);
          setScore(prev => prev + experiment.difficulty * 50);
          return 100;
        }
        return prev + 10;
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Compact Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Advanced Chemistry Lab
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-700">{score}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-700">Lvl {level}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <Beaker className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-700">{moleculesBuilt}</span>
              </div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-2">
            <Progress value={progressToNextLevel()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content - Single Page Layout */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="build" className="text-xs">
              <Atom className="h-4 w-4 mr-1" />
              Build
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Zap className="h-4 w-4 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="reactions" className="text-xs">
              <Flame className="h-4 w-4 mr-1" />
              Reactions
            </TabsTrigger>
            <TabsTrigger value="experiments" className="text-xs">
              <TestTube className="h-4 w-4 mr-1" />
              Experiments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Atom Palette - Compact */}
              <Card className="p-3">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Atoms
                </h3>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {periodicTable.slice(0, 16).map((atom) => (
                    <Button
                      key={atom.id}
                      onClick={() => addAtom(atom)}
                      variant="outline"
                      size="sm"
                      className="h-12 p-1 text-xs font-bold transition-all hover:scale-105"
                      style={{ backgroundColor: atom.color + '20', borderColor: atom.color }}
                    >
                      <div className="text-center">
                        <div className="font-bold">{atom.symbol}</div>
                        <div className="text-xs">{atom.atomicNumber}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* 3D Molecule Canvas */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Molecular Builder</h3>
                  <div className="flex gap-2">
                    <Button onClick={clearLab} variant="outline" size="sm">Clear</Button>
                    <Button onClick={checkMolecule} size="sm">Check</Button>
                  </div>
                </div>
                
                <div 
                  ref={canvasRef}
                  className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
                >
                  {placedAtoms.map((atom) => (
                    <div
                      key={atom.id}
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer transform hover:scale-110 transition-transform shadow-lg"
                      style={{
                        left: atom.position?.x,
                        top: atom.position?.y,
                        backgroundColor: atom.color,
                        border: '2px solid white'
                      }}
                      onClick={() => removeAtom(atom.id)}
                    >
                      {atom.symbol}
                    </div>
                  ))}
                  
                  {showMoleculeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl animate-bounce">{currentTarget.moleculeImage}</div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Target Molecule Info */}
              <Card className="p-4">
                <h3 className="text-lg font-bold mb-3">Target Molecule</h3>
                {generate3DMoleculeGraphic(currentTarget)}
                
                <div className="space-y-2 text-sm">
                  <h4 className="font-bold text-gray-800">{currentTarget.name}</h4>
                  <div className="text-2xl font-bold text-blue-600">{currentTarget.formula}</div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs border ${getBondTypeColor(currentTarget.bondType)}`}>
                    {currentTarget.bondType} bond
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <div><strong>Need:</strong></div>
                    {currentTarget.atoms.map(({ symbol, count }) => (
                      <div key={symbol}>{symbol}: {count}</div>
                    ))}
                  </div>
                  
                  {showHint && (
                    <div className="p-2 bg-yellow-100 rounded text-xs">
                      💡 {currentTarget.description}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => setShowHint(!showHint)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedMolecules.map((molecule) => (
                <Card key={molecule.id} className="p-4 hover:shadow-lg transition-shadow">
                  {generate3DMoleculeGraphic(molecule)}
                  <h3 className="font-bold text-lg mb-2">{molecule.name}</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div><strong>Formula:</strong> {molecule.formula}</div>
                    <div><strong>Structure:</strong> {molecule.structure}</div>
                    <div><strong>Uses:</strong> {molecule.realWorldUse}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>State:</strong> {molecule.properties.state}</div>
                      <div><strong>Color:</strong> {molecule.properties.color}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-4">Periodic Table</h3>
              <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-2">
                {periodicTable.map((element) => (
                  <div
                    key={element.id}
                    className="aspect-square border-2 rounded-lg p-2 text-center hover:scale-105 transition-transform cursor-pointer"
                    style={{ backgroundColor: element.color + '15', borderColor: element.color }}
                    title={`${element.name} - ${element.description}`}
                  >
                    <div className="text-xs font-bold">{element.atomicNumber}</div>
                    <div className="text-lg font-bold">{element.symbol}</div>
                    <div className="text-xs">{element.mass}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reactions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chemicalReactions.map((reaction) => (
                <Card key={reaction.id} className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{reaction.name}</h3>
                  <div className="bg-gray-100 p-3 rounded-lg mb-3 font-mono text-center">
                    {reaction.equation}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {reaction.type}</div>
                    <div><strong>Description:</strong> {reaction.description}</div>
                    <div><strong>Example:</strong> {reaction.example}</div>
                  </div>
                  <Button className="w-full mt-3" variant="outline" size="sm">
                    View Animation
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {virtualExperiments.map((experiment) => (
                <Card key={experiment.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{experiment.icon}</div>
                    <h3 className="font-bold text-lg">{experiment.name}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div><strong>Difficulty:</strong> {'⭐'.repeat(experiment.difficulty)}</div>
                    <div className="text-gray-600">{experiment.description}</div>
                  </div>
                  
                  {selectedExperiment?.id === experiment.id && (
                    <div className="mb-3">
                      <Progress value={experimentProgress} className="h-2" />
                      <div className="text-center text-xs mt-1">{experimentProgress}% Complete</div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => runExperiment(experiment)}
                    className="w-full"
                    disabled={selectedExperiment?.id === experiment.id && experimentProgress < 100}
                  >
                    {selectedExperiment?.id === experiment.id && experimentProgress < 100 
                      ? 'Running...' 
                      : 'Start Experiment'
                    }
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};