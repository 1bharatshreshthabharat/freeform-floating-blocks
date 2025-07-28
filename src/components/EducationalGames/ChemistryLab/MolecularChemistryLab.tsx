import React from 'react';
import { EnhancedMolecularChemistryLab } from './EnhancedMolecularChemistryLab';

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
  return <EnhancedMolecularChemistryLab onBack={onBack} onStatsUpdate={onStatsUpdate} />;
};