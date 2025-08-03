import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FlaskConical, Atom, Zap, BookOpen, Trophy, Target, Beaker, Microscope, Lightbulb, Flame, TestTube } from 'lucide-react';
import { toast } from 'sonner';
import {
  periodicTable,
  advancedMolecules,
  chemicalReactions,
  virtualExperiments,
  Atom as AtomType,
  Molecule,
  ChemicalReaction,
  Experiment
} from './ChemistryLabData'; 
import ChemistryLabMainArea from "./ChemistryLabMainArea";
import ChemistryLabHeader from "./ChemistryLabHeader";

interface EnhancedMolecularChemistryLabProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

export const EnhancedMolecularChemistryLab: React.FC<EnhancedMolecularChemistryLabProps> = ({ onBack, onStatsUpdate }) => {
  const [currentTarget, setCurrentTarget] = useState(advancedMolecules[0]);
  const [placedAtoms, setPlacedAtoms] = useState<(AtomType & { placed: boolean })[]>([]);
  const [score, setScore] = useState(0);
  const [moleculesBuilt, setMoleculesBuilt] = useState(0);
  const [selectedAtom, setSelectedAtom] = useState<AtomType | null>(null);
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

  const addAtom = (atom: AtomType) => {
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

<ChemistryLabHeader
  onBack={onBack}
  score={score}
  level={level}
  moleculesBuilt={moleculesBuilt}
  progressToNextLevel={progressToNextLevel}
/>

      {/* Main Content - Single Page Layout */}

<ChemistryLabMainArea
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  periodicTable={periodicTable}
  addAtom={addAtom}
  canvasRef={canvasRef}
  placedAtoms={placedAtoms}
  removeAtom={removeAtom}
  showMoleculeAnimation={showMoleculeAnimation}
  currentTarget={currentTarget}
  clearLab={clearLab}
  checkMolecule={checkMolecule}
  showHint={showHint}
  setShowHint={setShowHint}
  generate3DMoleculeGraphic={generate3DMoleculeGraphic}
  getBondTypeColor={getBondTypeColor}
  advancedMolecules={advancedMolecules}
  chemicalReactions={chemicalReactions}
  virtualExperiments={virtualExperiments}
  runExperiment={runExperiment}
  selectedExperiment={selectedExperiment}
  experimentProgress={experimentProgress}
/>


    </div>
  );
};