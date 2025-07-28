import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FlaskConical, Atom, Zap, BookOpen, Trophy, Target, Beaker, Microscope } from 'lucide-react';
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

  const generateMoleculeGraphic = (molecule: Molecule) => {
    // This would generate a visual representation of the molecule
    // For now, we'll use emoji and text
    return (
      <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
        <div className="text-6xl mb-2">{molecule.moleculeImage}</div>
        <div className="text-lg font-bold text-gray-800">{molecule.formula}</div>
        <div className="text-sm text-gray-600">{molecule.structure}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Advanced Molecular Chemistry Lab</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-purple-100 px-3 py-1 rounded-full">
                <span className="font-medium text-purple-800">Level: {level}</span>
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="font-medium text-yellow-800">Score: {score}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-medium text-green-800">Built: {moleculesBuilt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="build">🔬 Build</TabsTrigger>
            <TabsTrigger value="learn">📚 Learn</TabsTrigger>
            <TabsTrigger value="periodic">⚛️ Elements</TabsTrigger>
            <TabsTrigger value="reactions">⚡ Reactions</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Panel */}
              <Card className="lg:col-span-1 p-4 space-y-4">
                {/* Level Progress */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold">Level {level}</div>
                    <Progress value={progressToNextLevel()} className="mt-2 bg-white/20" />
                    <div className="text-xs mt-1">{experiencePoints % (level * 500)}/{level * 500} XP</div>
                  </div>
                </div>

                {/* Target Molecule */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Target Molecule</h3>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{currentTarget.moleculeImage}</div>
                      <div className="text-xl font-bold text-blue-800">{currentTarget.formula}</div>
                      <div className="text-sm text-blue-700">{currentTarget.name}</div>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getBondTypeColor(currentTarget.bondType)}`}>
                      {currentTarget.bondType} bond
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      Difficulty: {'⭐'.repeat(currentTarget.difficulty)}
                    </div>
                  </div>
                </div>

                {/* Available Atoms */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Available Elements</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {periodicTable.slice(0, 18).map((atom) => (
                      <button
                        key={atom.symbol}
                        onClick={() => addAtom(atom)}
                        className="aspect-square border-2 rounded-lg flex flex-col items-center justify-center text-white font-bold text-xs transition-all hover:scale-105 shadow-md"
                        style={{ 
                          backgroundColor: atom.color === '#FFFFFF' ? '#E5E7EB' : atom.color, 
                          borderColor: atom.color === '#FFFFFF' ? '#9CA3AF' : atom.color,
                          color: atom.color === '#FFFFFF' || atom.color === '#FFFF30' ? '#000000' : '#FFFFFF'
                        }}
                        title={`${atom.name} (${atom.symbol}) - Valency: ${atom.valency}`}
                      >
                        <div className="text-sm font-bold">{atom.symbol}</div>
                        <div className="text-xs opacity-80">{atom.atomicNumber}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  <Button onClick={checkMolecule} className="w-full bg-green-500 hover:bg-green-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Test Molecule
                  </Button>
                  <Button onClick={clearLab} variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Clear Lab
                  </Button>
                  <Button 
                    onClick={() => setShowHint(!showHint)} 
                    variant="outline" 
                    className="w-full"
                  >
                    💡 {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                    <div className="font-medium text-yellow-800 mb-1">Molecular Hint:</div>
                    <div className="text-yellow-700 mb-2">{currentTarget.description}</div>
                    <div className="text-xs text-yellow-600">
                      <strong>Formula:</strong> {currentTarget.formula}<br/>
                      <strong>Atoms needed:</strong> {currentTarget.atoms.map(a => `${a.count} ${a.symbol}`).join(', ')}<br/>
                      <strong>Bond type:</strong> {currentTarget.bondType}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">Lab Statistics</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Molecules Built:</span>
                      <span className="font-bold text-green-600">{moleculesBuilt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-bold text-blue-600">
                        {moleculesBuilt > 0 ? Math.round((moleculesBuilt / (moleculesBuilt + attempts)) * 100) : 100}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unlocked:</span>
                      <span className="font-bold text-purple-600">{unlockedMolecules.length}/{advancedMolecules.length}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Main Lab Area */}
              <Card className="lg:col-span-3 p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Build {currentTarget.name} ({currentTarget.formula})
                  </h2>
                  <p className="text-gray-600">{currentTarget.description}</p>
                  {attempts > 0 && (
                    <p className="text-orange-600 text-sm mt-2">
                      Attempts: {attempts} | Tip: Check valency and count!
                    </p>
                  )}
                </div>

                {/* Molecule Animation */}
                {showMoleculeAnimation && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center animate-bounce">
                      <div className="text-8xl mb-4">{currentTarget.moleculeImage}</div>
                      <div className="text-2xl font-bold text-green-600 mb-2">Molecule Created!</div>
                      <div className="text-lg text-gray-700">{currentTarget.name}</div>
                    </div>
                  </div>
                )}

                {/* Lab Canvas */}
                <div 
                  ref={canvasRef}
                  className="relative bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-xl"
                  style={{ minHeight: '500px' }}
                >
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner overflow-hidden">
                    {placedAtoms.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <Atom className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Click elements to add them to the lab</p>
                          <p className="text-sm">Build the target molecule: {currentTarget.formula}</p>
                        </div>
                      </div>
                    )}
                    
                    {placedAtoms.map((atom) => (
                      <div
                        key={atom.id}
                        className="absolute cursor-pointer transition-all hover:scale-125 hover:z-10"
                        style={{
                          left: atom.position?.x || 0,
                          top: atom.position?.y || 0,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => removeAtom(atom.id)}
                        title={`${atom.name} (${atom.symbol}) - Click to remove`}
                      >
                        <div
                          className="w-16 h-16 rounded-full border-3 flex flex-col items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all"
                          style={{ 
                            backgroundColor: atom.color === '#FFFFFF' ? '#E5E7EB' : atom.color, 
                            borderColor: atom.color === '#FFFFFF' ? '#9CA3AF' : atom.color,
                            color: atom.color === '#FFFFFF' || atom.color === '#FFFF30' ? '#000000' : '#FFFFFF'
                          }}
                        >
                          <div className="text-lg font-bold">{atom.symbol}</div>
                          <div className="text-xs opacity-80">{atom.atomicNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Molecule Information */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Current Formula</h4>
                    <div className="text-2xl font-mono text-center p-4 bg-white rounded border">
                      {placedAtoms.length === 0 ? 'No atoms placed' : 
                        Object.entries(
                          placedAtoms.reduce((acc, atom) => {
                            acc[atom.symbol] = (acc[atom.symbol] || 0) + 1;
                            return acc;
                          }, {} as { [key: string]: number })
                        ).map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`).join('')
                      }
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Target Properties</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>State:</strong> {currentTarget.properties.state}</div>
                      <div><strong>Color:</strong> {currentTarget.properties.color}</div>
                      <div><strong>Solubility:</strong> {currentTarget.properties.solubility}</div>
                      {currentTarget.properties.boilingPoint && (
                        <div><strong>Boiling Point:</strong> {currentTarget.properties.boilingPoint}°C</div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Molecule Library
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {advancedMolecules.map(molecule => (
                    <div key={molecule.id} className={`p-4 rounded-lg border-2 ${unlockedMolecules.includes(molecule.id) ? 'bg-white' : 'bg-gray-100 opacity-50'}`}>
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{unlockedMolecules.includes(molecule.id) ? molecule.moleculeImage : '🔒'}</div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">{molecule.name}</div>
                          <div className="text-sm text-gray-600">{molecule.formula}</div>
                          <div className="text-sm mt-2">{molecule.description}</div>
                          {unlockedMolecules.includes(molecule.id) && (
                            <div className="mt-2 text-xs text-blue-600">
                              <strong>Uses:</strong> {molecule.realWorldUse}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Chemical Concepts
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Valency Rules</h4>
                    <p className="text-sm text-blue-700">
                      Valency determines how many bonds an atom can form. Group 1: 1, Group 2: 2, Group 13: 3, Group 14: 4, etc.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Bond Types</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li><strong>Ionic:</strong> Metal + Non-metal (electron transfer)</li>
                      <li><strong>Covalent:</strong> Non-metal + Non-metal (electron sharing)</li>
                      <li><strong>Polar:</strong> Unequal electron sharing (partial charges)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Molecular Geometry</h4>
                    <p className="text-sm text-purple-700">
                      Shape depends on electron pairs: Linear (2), Trigonal (3), Tetrahedral (4), etc.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Real World Applications</h4>
                    <p className="text-sm text-orange-700">
                      Understanding molecular structure helps in drug design, materials science, and environmental chemistry.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="periodic" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Atom className="h-5 w-5" />
                Interactive Periodic Table
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                {periodicTable.map((element) => (
                  <div
                    key={element.symbol}
                    className="aspect-square border-2 rounded-lg flex flex-col items-center justify-center text-white font-bold text-xs transition-all hover:scale-105 shadow-md cursor-pointer"
                    style={{ 
                      backgroundColor: element.color === '#FFFFFF' ? '#E5E7EB' : element.color, 
                      borderColor: element.color === '#FFFFFF' ? '#9CA3AF' : element.color,
                      color: element.color === '#FFFFFF' || element.color === '#FFFF30' ? '#000000' : '#FFFFFF'
                    }}
                    title={`${element.name} - ${element.description}`}
                    onClick={() => setSelectedAtom(element)}
                  >
                    <div className="text-lg font-bold">{element.symbol}</div>
                    <div className="text-xs opacity-80">{element.atomicNumber}</div>
                    <div className="text-xs opacity-60">{element.mass.toFixed(1)}</div>
                  </div>
                ))}
              </div>
              
              {selectedAtom && (
                <div className="mt-6 bg-white p-6 rounded-lg border shadow-lg">
                  <h4 className="text-xl font-bold mb-4">{selectedAtom.name} ({selectedAtom.symbol})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div><strong>Atomic Number:</strong> {selectedAtom.atomicNumber}</div>
                      <div><strong>Atomic Mass:</strong> {selectedAtom.mass} u</div>
                      <div><strong>Valency:</strong> {selectedAtom.valency}</div>
                      <div><strong>Group:</strong> {selectedAtom.group}</div>
                      <div><strong>Period:</strong> {selectedAtom.period}</div>
                    </div>
                    <div>
                      <div><strong>Electron Configuration:</strong> {selectedAtom.electronConfig}</div>
                      <div className="mt-2"><strong>Description:</strong></div>
                      <div className="text-gray-600">{selectedAtom.description}</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reactions" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Chemical Reactions Database
              </h3>
              <div className="space-y-4">
                {chemicalReactions.map(reaction => (
                  <div key={reaction.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg">{reaction.name}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {reaction.type}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-center text-lg mb-3">
                      {reaction.equation}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>Description:</strong> {reaction.description}
                    </div>
                    <div className="text-sm text-blue-600">
                      <strong>Example:</strong> {reaction.example}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};