// ./ChemistryLabHeader.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Beaker,
  FlaskConical,
  Target,
  Trophy,
} from "lucide-react";

interface ChemistryLabHeaderProps {
  onBack: () => void;
  score: number;
  level: number;
  moleculesBuilt: number;
  progressToNextLevel: () => number;
}

const ChemistryLabHeader: React.FC<ChemistryLabHeaderProps> = ({
  onBack,
  score,
  level,
  moleculesBuilt,
  progressToNextLevel,
}) => {
  return (
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
  );
};

export default ChemistryLabHeader;
