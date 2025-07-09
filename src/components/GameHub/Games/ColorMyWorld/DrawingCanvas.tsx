
import React, { forwardRef, useState } from 'react';
import { ColoringOutline, GameMode } from './types';

interface DrawingCanvasProps {
  outline: ColoringOutline;
  selectedColor: string;
  onSectionFill: (sectionId: string, color: string) => void;
  completedSections: Map<string, string>;
  gameMode: GameMode;
  showHint: boolean;
  showOutlines?: boolean;
  outlineColor?: string;
}

export const DrawingCanvas = forwardRef<SVGSVGElement, DrawingCanvasProps>(({
  outline,
  selectedColor,
  onSectionFill,
  completedSections,
  gameMode,
  showHint,
  showOutlines = true,
  outlineColor = '#000000'
}, ref) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [paintSplashes, setPaintSplashes] = useState<Array<{id: string, x: number, y: number, color: string}>>([]);

  const handleSectionClick = (sectionId: string, event: React.MouseEvent<SVGPathElement>) => {
    onSectionFill(sectionId, selectedColor);
    
    // Create paint splash effect at click position
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = (event.currentTarget.closest('svg') as SVGSVGElement)?.getBoundingClientRect();
    
    if (svgRect) {
      const x = ((event.clientX - svgRect.left) / svgRect.width) * 100;
      const y = ((event.clientY - svgRect.top) / svgRect.height) * 100;
      
      const splash = {
        id: `${sectionId}-${Date.now()}`,
        x,
        y,
        color: selectedColor
      };
      
      setPaintSplashes(prev => [...prev, splash]);
      
      // Remove splash after animation
      setTimeout(() => {
        setPaintSplashes(prev => prev.filter(s => s.id !== splash.id));
      }, 1000);
    }
    
    // Create scale effect
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
      section.style.transform = 'scale(1.05)';
      setTimeout(() => {
        section.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const getSectionColor = (sectionId: string) => {
    return completedSections.get(sectionId) || 'transparent';
  };

  const getSectionStyle = (section: any) => {
    const isCompleted = completedSections.has(section.id);
    const isHovered = hoveredSection === section.id;
    const isHinted = showHint && gameMode === 'realistic';
    
    let style: React.CSSProperties = {
      fill: isCompleted ? getSectionColor(section.id) : 'transparent',
      stroke: showOutlines ? outlineColor : 'transparent',
      strokeWidth: showOutlines ? '2' : '0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    if (isHovered && !isCompleted) {
      style.fill = selectedColor;
      style.opacity = 0.7;
      style.strokeWidth = showOutlines ? '3' : '0';
    }

    if (isHinted && section.suggestedColor) {
      style.stroke = '#FFD700';
      style.strokeWidth = '4';
      style.filter = 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))';
    }

    return style;
  };

  const progress = (completedSections.size / outline.sections.length) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{outline.name}</h2>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
            <span className="text-sm font-medium text-purple-700 capitalize">
              {outline.category}
            </span>
            <span className="text-xs text-purple-600">
              Level {outline.difficulty}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
            <span className="text-xs text-blue-600">
              {completedSections.size}/{outline.sections.length} Complete
            </span>
          </div>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-full w-full overflow-hidden">
        <svg
          ref={ref}
          viewBox={outline.viewBox}
          className="w-full h-auto max-h-80 sm:max-h-96"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
        >
          {/* Background pattern for enhanced visual appeal */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {outline.sections.map((section) => (
            <path
              key={section.id}
              id={`section-${section.id}`}
              d={section.path}
              style={getSectionStyle(section)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={(e) => handleSectionClick(section.id, e)}
            >
              <title>
                {`${section.name}${gameMode === 'realistic' && showHint ? ` (Suggested: ${section.suggestedColor})` : ''}`}
              </title>
              {showHint && gameMode === 'realistic' && (
                <animate
                  attributeName="stroke-width"
                  values="2;6;2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          ))}

          {/* Paint splash effects */}
          {paintSplashes.map((splash) => (
            <g key={splash.id}>
              <circle
                cx={`${splash.x}%`}
                cy={`${splash.y}%`}
                r="0"
                fill={splash.color}
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="0;15;0"
                  dur="1s"
                  begin="0s"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.3;0"
                  dur="1s"
                  begin="0s"
                />
              </circle>
              {/* Multiple splash droplets */}
              {[...Array(6)].map((_, i) => (
                <circle
                  key={i}
                  cx={`${splash.x + (Math.random() - 0.5) * 10}%`}
                  cy={`${splash.y + (Math.random() - 0.5) * 10}%`}
                  r="0"
                  fill={splash.color}
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="0;5;0"
                    dur="0.8s"
                    begin={`${i * 0.1}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.2;0"
                    dur="0.8s"
                    begin={`${i * 0.1}s`}
                  />
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Enhanced Progress Section */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {completedSections.size} / {outline.sections.length} sections
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="mt-1 text-center">
          <span className="text-xs text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Enhanced Status Messages */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        {completedSections.size === 0 ? (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-blue-700">🎨 <strong>Get Started!</strong></p>
            <p className="text-xs mt-1">Click on any section to start coloring with your selected color.</p>
          </div>
        ) : completedSections.size < outline.sections.length ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-green-700">✨ <strong>Great Progress!</strong></p>
            <p className="text-xs mt-1">
              {outline.sections.length - completedSections.size} sections remaining. Keep going!
            </p>
          </div>
        ) : (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-purple-700">🎉 <strong>Masterpiece Complete!</strong></p>
            <p className="text-xs mt-1">Watch your creation come to life!</p>
          </div>
        )}
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
