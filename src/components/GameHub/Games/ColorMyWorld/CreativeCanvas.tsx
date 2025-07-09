
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ColoringOutline, GameMode, MissingPart } from './types';
import { Pencil, Undo2, CheckCircle } from 'lucide-react';

interface CreativeCanvasProps {
  outline: ColoringOutline;
  selectedColor: string;
  onComplete: () => void;
  completedSections: Map<string, string>;
  onSectionFill: (sectionId: string, color: string) => void;
}

export const CreativeCanvas: React.FC<CreativeCanvasProps> = ({
  outline,
  selectedColor,
  onComplete,
  completedSections,
  onSectionFill
}) => {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [sectionPositions, setSectionPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentMissingPart, setCurrentMissingPart] = useState<MissingPart | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Scramble parts positions for creative mode
    const newPositions = new Map();
    outline.sections.forEach((section, index) => {
      const angle = (index * 60) * (Math.PI / 180);
      const radius = 80 + Math.random() * 40;
      newPositions.set(section.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    });
    setSectionPositions(newPositions);
  }, [outline]);

  const handleSectionMouseDown = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedSection(sectionId);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setSectionPositions(prev => new Map(prev.set(sectionId, { x, y })));
    };
    
    const handleMouseUp = () => {
      setDraggedSection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSectionClick = (sectionId: string) => {
    if (!isDrawingMode) {
      onSectionFill(sectionId, selectedColor);
    }
  };

  const checkIfComplete = () => {
    const allColored = outline.sections.every(section => completedSections.has(section.id));
    const allMissingPartsDrawn = !outline.missingParts || outline.missingParts.length === 0;
    
    if (allColored && allMissingPartsDrawn) {
      onComplete();
    }
  };

  const handleDrawingOptionSelect = (partId: string, optionPath: string, color: string) => {
    // Add the drawn part to completed sections
    onSectionFill(`missing-${partId}`, color);
    setCurrentMissingPart(null);
    setIsDrawingMode(false);
    checkIfComplete();
  };

  const progress = (completedSections.size / outline.sections.length) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{outline.name}</h2>
        <div className="text-sm text-purple-600 mb-2">
          🎨 Creative Mode: Drag parts to build your {outline.name}!
        </div>
      </div>

      {/* Drawing Tools */}
      {outline.missingParts && outline.missingParts.length > 0 && (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            variant={isDrawingMode ? "default" : "outline"}
            size="sm"
            className="bg-purple-100 hover:bg-purple-200"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Draw Missing Parts
          </Button>
        </div>
      )}

      {/* Main Canvas */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 min-h-96">
        <svg
          ref={svgRef}
          viewBox={outline.viewBox}
          className="w-full h-full"
        >
          {/* Scattered parts for creative mode */}
          {outline.sections.map((section) => {
            const position = sectionPositions.get(section.id) || { x: 0, y: 0 };
            const isCompleted = completedSections.has(section.id);
            
            return (
              <g
                key={section.id}
                transform={`translate(${position.x}, ${position.y})`}
                onMouseDown={(e) => handleSectionMouseDown(section.id, e)}
                style={{ cursor: draggedSection === section.id ? 'grabbing' : 'grab' }}
              >
                <path
                  d={section.path}
                  fill={isCompleted ? completedSections.get(section.id) : 'transparent'}
                  stroke="#333"
                  strokeWidth="2"
                  onClick={() => handleSectionClick(section.id)}
                  className="hover:stroke-purple-500 transition-all duration-200"
                />
                <text
                  x="0"
                  y="-10"
                  textAnchor="middle"
                  className="fill-gray-600 text-xs font-medium pointer-events-none"
                >
                  {section.name}
                </text>
              </g>
            );
          })}

          {/* Missing parts drawing areas */}
          {outline.missingParts?.map((part) => (
            <g key={part.id}>
              <circle
                cx={part.position.x}
                cy={part.position.y}
                r="20"
                fill="rgba(255, 0, 0, 0.1)"
                stroke="red"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse cursor-pointer"
                onClick={() => setCurrentMissingPart(part)}
              />
              <text
                x={part.position.x}
                y={part.position.y + 35}
                textAnchor="middle"
                className="fill-red-600 text-xs font-medium"
              >
                Draw {part.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 rounded-lg p-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{completedSections.size}/{outline.sections.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Options Modal */}
      {currentMissingPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Draw the {currentMissingPart.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{currentMissingPart.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentMissingPart.drawingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDrawingOptionSelect(currentMissingPart.id, option.path, option.suggestedColor)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-2">
                    <path
                      d={option.path}
                      fill={option.suggestedColor}
                      stroke="#333"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="text-sm font-medium">{option.name}</div>
                </button>
              ))}
            </div>
            
            <Button onClick={() => setCurrentMissingPart(null)} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
