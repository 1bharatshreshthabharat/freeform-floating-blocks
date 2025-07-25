import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FlaskConical, Atom, Zap, BookOpen, Trophy } from 'lucide-react';

interface MolecularChemistryLabProps {
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
}

const availableAtoms: Atom[] = [
  { id: 'H', symbol: 'H', name: 'Hydrogen', valency: 1, color: '#FFFFFF', electronConfig: '1s¹', atomicNumber: 1 },
  { id: 'C', symbol: 'C', name: 'Carbon', valency: 4, color: '#000000', electronConfig: '2s²2p²', atomicNumber: 6 },
  { id: 'N', symbol: 'N', name: 'Nitrogen', valency: 3, color: '#3050F8', electronConfig: '2s²2p³', atomicNumber: 7 },
  { id: 'O', symbol: 'O', name: 'Oxygen', valency: 2, color: '#FF0D0D', electronConfig: '2s²2p⁴', atomicNumber: 8 },
  { id: 'F', symbol: 'F', name: 'Fluorine', valency: 1, color: '#90E050', electronConfig: '2s²2p⁵', atomicNumber: 9 },
  { id: 'Na', symbol: 'Na', name: 'Sodium', valency: 1, color: '#AB5CF2', electronConfig: '3s¹', atomicNumber: 11 },
  { id: 'Cl', symbol: 'Cl', name: 'Chlorine', valency: 1, color: '#1FF01F', electronConfig: '3s²3p⁵', atomicNumber: 17 },
  { id: 'Ca', symbol: 'Ca', name: 'Calcium', valency: 2, color: '#3DFF00', electronConfig: '4s²', atomicNumber: 20 }
];

const targetMolecules: Molecule[] = [
  {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    atoms: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }],
    bondType: 'polar',
    difficulty: 1,
    description: 'Essential for life, made of two hydrogen atoms bonded to one oxygen atom',
    realWorldUse: 'Drinking, cooking, cleaning, all biological processes'
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    atoms: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 2 }],
    bondType: 'covalent',
    difficulty: 2,
    description: 'A greenhouse gas produced by respiration and combustion',
    realWorldUse: 'Plant photosynthesis, carbonated drinks, fire extinguishers'
  },
  {
    id: 'NaCl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    atoms: [{ symbol: 'Na', count: 1 }, { symbol: 'Cl', count: 1 }],
    bondType: 'ionic',
    difficulty: 2,
    description: 'Common table salt formed by ionic bonding',
    realWorldUse: 'Food seasoning, food preservation, de-icing roads'
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    atoms: [{ symbol: 'C', count: 1 }, { symbol: 'H', count: 4 }],
    bondType: 'covalent',
    difficulty: 3,
    description: 'Simplest hydrocarbon, main component of natural gas',
    realWorldUse: 'Natural gas for heating and cooking, fuel for power plants'
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    atoms: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 3 }],
    bondType: 'polar',
    difficulty: 3,
    description: 'Important for making fertilizers and cleaning products',
    realWorldUse: 'Fertilizers, household cleaners, refrigeration'
  }
];

export const MolecularChemistryLab: React.FC<MolecularChemistryLabProps> = ({ onBack, onStatsUpdate }) => {
  const [currentTarget, setCurrentTarget] = useState(targetMolecules[0]);
  const [placedAtoms, setPlacedAtoms] = useState<(Atom & { placed: boolean })[]>([]);
  const [score, setScore] = useState(0);
  const [moleculesBuilt, setMoleculesBuilt] = useState(0);
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [gameMode, setGameMode] = useState<'build' | 'learn'>('build');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
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
      const points = currentTarget.difficulty * 50 + (attempts === 0 ? 100 : 0); // Bonus for first try
      setScore(prev => prev + points);
      setMoleculesBuilt(prev => {
        const newCount = prev + 1;
        onStatsUpdate({
          totalScore: score + points,
          totalCompleted: newCount,
          difficulty: currentTarget.difficulty
        });
        return newCount;
      });
      
      // Move to next molecule
      const nextIndex = (targetMolecules.indexOf(currentTarget) + 1) % targetMolecules.length;
      setCurrentTarget(targetMolecules[nextIndex]);
      setPlacedAtoms([]);
      setAttempts(0);
      setShowHint(false);
      
      return true;
    } else {
      setAttempts(prev => prev + 1);
      return false;
    }
  };

  const addAtom = (atom: Atom) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.random() * (rect.width - 60) + 30;
      const y = Math.random() * (rect.height - 60) + 30;
      
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
      case 'ionic': return 'text-red-600 bg-red-50';
      case 'covalent': return 'text-blue-600 bg-blue-50';
      case 'polar': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Molecular Chemistry Lab</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools & Info */}
          <Card className="lg:col-span-1 p-4 bg-white/90 backdrop-blur-sm">
            {/* Mode Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg mb-4">
              <Button
                onClick={() => setGameMode('build')}
                variant={gameMode === 'build' ? 'default' : 'ghost'}
                size="sm"
                className="w-1/2"
              >
                Build
              </Button>
              <Button
                onClick={() => setGameMode('learn')}
                variant={gameMode === 'learn' ? 'default' : 'ghost'}
                size="sm"
                className="w-1/2"
              >
                Learn
              </Button>
            </div>

            {gameMode === 'build' && (
              <>
                {/* Target Molecule */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2">Target Molecule</h3>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">{currentTarget.formula}</div>
                    <div className="text-sm text-blue-700">{currentTarget.name}</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getBondTypeColor(currentTarget.bondType)}`}>
                      {currentTarget.bondType} bond
                    </div>
                  </div>
                </div>

                {/* Atom Palette */}
                <h3 className="font-bold text-gray-800 mb-2">Periodic Table</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {availableAtoms.map((atom) => (
                    <button
                      key={atom.symbol}
                      onClick={() => addAtom(atom)}
                      className="aspect-square border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-white font-bold text-sm transition-all hover:scale-105 shadow-md"
                      style={{ backgroundColor: atom.color, borderColor: atom.color }}
                      title={`${atom.name} (Valency: ${atom.valency})`}
                    >
                      <div className="text-base">{atom.symbol}</div>
                      <div className="text-xs opacity-80">{atom.valency}</div>
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="space-y-2 mb-4">
                  <Button onClick={checkMolecule} className="w-full bg-green-500 hover:bg-green-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Test Molecule
                  </Button>
                  <Button onClick={clearLab} variant="outline" className="w-full">
                    Clear Lab
                  </Button>
                  <Button 
                    onClick={() => setShowHint(!showHint)} 
                    variant="outline" 
                    className="w-full"
                  >
                    {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                    <div className="font-medium text-yellow-800 mb-1">Hint:</div>
                    <div className="text-yellow-700">{currentTarget.description}</div>
                    <div className="mt-2 text-xs text-yellow-600">
                      Need: {currentTarget.atoms.map(a => `${a.count} ${a.symbol}`).join(', ')}
                    </div>
                  </div>
                )}
              </>
            )}

            {gameMode === 'learn' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Chemical Knowledge
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800">Valency Rules</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Valency determines how many bonds an atom can form. 
                      H=1, O=2, N=3, C=4
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800">Bond Types</h4>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• <strong>Ionic:</strong> Metal + Non-metal</li>
                      <li>• <strong>Covalent:</strong> Non-metal + Non-metal</li>
                      <li>• <strong>Polar:</strong> Unequal electron sharing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800">Real World Uses</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {currentTarget.realWorldUse}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Main Lab Area */}
          <Card className="lg:col-span-3 p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Build {currentTarget.name} ({currentTarget.formula})
              </h2>
              <p className="text-gray-600">{currentTarget.description}</p>
              {attempts > 0 && (
                <p className="text-orange-600 text-sm mt-2">
                  Attempts: {attempts} (Hint: Check valency rules!)
                </p>
              )}
            </div>

            {/* Lab Canvas */}
            <div 
              ref={canvasRef}
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
              style={{ minHeight: '400px' }}
            >
              <div className="absolute inset-4 bg-white rounded-lg shadow-inner overflow-hidden">
                {placedAtoms.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Atom className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Click atoms from the periodic table to add them</p>
                    </div>
                  </div>
                )}
                
                {placedAtoms.map((atom) => (
                  <div
                    key={atom.id}
                    className="absolute cursor-pointer transition-all hover:scale-110"
                    style={{
                      left: atom.position?.x || 0,
                      top: atom.position?.y || 0,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => removeAtom(atom.id)}
                    title={`${atom.name} (Click to remove)`}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: atom.color, borderColor: atom.color }}
                    >
                      {atom.symbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Molecule Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Current Formula</h4>
                <div className="text-lg font-mono">
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
                <h4 className="font-medium text-gray-800 mb-2">Progress</h4>
                <div className="text-sm text-gray-600">
                  <div>Molecules Built: {moleculesBuilt}</div>
                  <div>Current Score: {score}</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getBondTypeColor(currentTarget.bondType)}`}>
                    {currentTarget.bondType} bonding
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};