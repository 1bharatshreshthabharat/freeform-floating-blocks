
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Move } from 'lucide-react';
import { ColoringOutline } from './types';

interface ReferenceImageProps {
  outline: ColoringOutline;
  show: boolean;
  onToggle: () => void;
}

export const ReferenceImage: React.FC<ReferenceImageProps> = ({
  outline,
  show,
  onToggle
}) => {
  if (!show) {
    return (
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={onToggle}
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Eye className="h-4 w-4 mr-1" />
          Show Reference
        </Button>
      </div>
    );
  }

  return (
    <Card className="absolute bottom-4 right-4 w-48 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-purple-200">
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Move className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Reference</span>
          </div>
          <Button
            onClick={onToggle}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2 border border-purple-100">
          <svg
            viewBox={outline.viewBox}
            className="w-full h-auto max-h-32"
          >
            {outline.sections.map((section) => (
              <path
                key={section.id}
                d={section.path}
                fill={section.suggestedColor || '#e5e7eb'}
                stroke="#374151"
                strokeWidth="1"
                className="transition-colors duration-200"
              />
            ))}
          </svg>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-600 font-medium">
            {outline.name}
          </span>
          <div className="text-xs text-purple-600 mt-1">
            Use as color guide
          </div>
        </div>
      </div>
    </Card>
  );
};
