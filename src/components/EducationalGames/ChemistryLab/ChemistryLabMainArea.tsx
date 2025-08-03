 
 
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Atom,
  BookOpen,
  Zap,
  Flame,
  TestTube,
  Lightbulb,
} from "lucide-react";

// ./types.ts

export interface ChemistryLabMainAreaProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  periodicTable: any[];
  addAtom: (atom: any) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  placedAtoms: any[];
  removeAtom: (id: string) => void; 
  showMoleculeAnimation: boolean;
  currentTarget: any;
  clearLab: () => void;
  checkMolecule: () => void;
  showHint: boolean;
  setShowHint: (val: boolean) => void;
  generate3DMoleculeGraphic: (mol: any) => React.ReactNode;
  getBondTypeColor: (bond: string) => string;
  advancedMolecules: any[];
  chemicalReactions: any[];
  virtualExperiments: any[];
  runExperiment: (exp: any) => void;
  selectedExperiment: any;
  experimentProgress: number;
}


const ChemistryLabMainArea: React.FC<ChemistryLabMainAreaProps> = ({
  activeTab,
  setActiveTab,
  periodicTable,
  addAtom,
  canvasRef,
  placedAtoms,
  removeAtom,
  showMoleculeAnimation,
  currentTarget,
  clearLab,
  checkMolecule,
  showHint,
  setShowHint,
  generate3DMoleculeGraphic,
  getBondTypeColor,
  advancedMolecules,
  chemicalReactions,
  virtualExperiments,
  runExperiment,
  selectedExperiment,
  experimentProgress,
}) => {
  return (
 
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

       );
};

export default ChemistryLabMainArea;