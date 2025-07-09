
import React, { forwardRef, useState } from 'react';
import { ColoringOutline, GameMode } from './types';

interface DrawingCanvasProps {
  outline: ColoringOutline;
  selectedColor: string;
  onSectionFill: (sectionId: string, color: string) => void;
  completedSections: Set<string>;
  gameMode: GameMode;
  showHint: boolean;
}

export const DrawingCanvas = forwardRef<SVGSVGElement, DrawingCanvasProps>(({
  outline,
  selectedColor,
  onSectionFill,
  completedSections,
  gameMode,
  showHint
}, ref) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    onSectionFill(sectionId, selectedColor);
    
    // Create paint splash effect
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
      section.style.transform = 'scale(1.1)';
      setTimeout(() => {
        section.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const getSectionColor = (sectionId: string) => {
    if (completedSections.has(sectionId)) {
      return selectedColor; // This would be stored per section in a real implementation
    }
    return 'transparent';
  };

  const getSectionStyle = (section: any) => {
    const isCompleted = completedSections.has(section.id);
    const isHovered = hoveredSection === section.id;
    const isHinted = showHint && gameMode === 'realistic';
    
    let style: React.CSSProperties = {
      fill: isCompleted ? getSectionColor(section.id) : 'transparent',
      stroke: '#333',
      strokeWidth: '2',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    if (isHovered && !isCompleted) {
      style.fill = selectedColor;
      style.opacity = 0.7;
    }

    if (isHinted && section.suggestedColor) {
      style.stroke = '#FFD700';
      style.strokeWidth = '3';
      style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))';
    }

    return style;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{outline.name}</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
          <span className="text-sm font-medium text-purple-700 capitalize">
            {outline.category}
          </span>
          <span className="text-xs text-purple-600">
            Level {outline.difficulty}
          </span>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <svg
          ref={ref}
          viewBox={outline.viewBox}
          className="w-full h-auto max-h-96"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
        >
          {outline.sections.map((section) => (
            <path
              key={section.id}
              id={`section-${section.id}`}
              d={section.path}
              style={getSectionStyle(section)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => handleSectionClick(section.id)}
            >
              <title>
                {`${section.name}${gameMode === 'realistic' && showHint ? ` (Try ${section.suggestedColor})` : ''}`}
              </title>
              <animate
                attributeName="stroke-width"
                values="2;4;2"
                dur="2s"
                repeatCount="indefinite"
                begin={showHint && gameMode === 'realistic' ? '0s' : 'indefinite'}
              />
            </path>
          ))}
        </svg>

        {/* Paint splash effect overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from(completedSections).map((sectionId, index) => (
            <div
              key={sectionId}
              className="absolute w-8 h-8 opacity-0 animate-ping"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${20 + (index * 10) % 60}%`,
                backgroundColor: selectedColor,
                borderRadius: '50%',
                animationDelay: `${index * 100}ms`,
                animationDuration: '600ms',
                animationIterationCount: '1'
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 max-w-md">
        {completedSections.size === 0 ? (
          <p>🎨 Click on any section to start coloring! Choose your favorite color from the palette.</p>
        ) : completedSections.size < outline.sections.length ? (
          <p>✨ Great work! Keep going to complete your masterpiece.</p>
        ) : (
          <p>🎉 Amazing! You've completed the entire drawing!</p>
        )}
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
