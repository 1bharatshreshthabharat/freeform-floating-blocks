import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  instructions: string[];
  tips?: string[];
}

export const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
  open,
  onOpenChange,
  title,
  instructions,
  tips = []
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">How to Play {title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ul className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {tips.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Tips:</h3>
            <ul className="space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500">💡</span>
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

interface CustomizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CustomizationDialog: React.FC<CustomizationDialogProps> = ({
  open,
  onOpenChange,
  children
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>🎨 Customize Game</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {children}
      </div>
    </DialogContent>
  </Dialog>
);

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  score: number;
  stats?: { label: string; value: string | number }[];
  onNextLevel?: () => void;
  onRestart: () => void;
  onGoHome: () => void;
  isLastLevel?: boolean;
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({
  open,
  onOpenChange,
  title,
  score,
  stats = [],
  onNextLevel,
  onRestart,
  onGoHome,
  isLastLevel = false
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md text-center">
      <DialogHeader>
        <DialogTitle className="text-2xl">🎉 {title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-6xl">🏆</div>
        <div className="text-2xl font-bold">Score: {score}</div>
        
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-lg font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {onNextLevel && !isLastLevel && (
            <Button onClick={onNextLevel} className="w-full">
              ➡️ Next Level
            </Button>
          )}
          <Button onClick={onRestart} variant="outline" className="w-full">
            🔄 Play Again
          </Button>
          <Button onClick={onGoHome} variant="secondary" className="w-full">
            🏠 Back to Home
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);