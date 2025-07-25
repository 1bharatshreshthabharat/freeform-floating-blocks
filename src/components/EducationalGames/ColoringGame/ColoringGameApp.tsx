import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, Download, RotateCcw, Sparkles } from 'lucide-react';

interface ColoringGameAppProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

const coloringTemplates = [
  {
    id: 'butterfly',
    name: 'Beautiful Butterfly',
    category: 'Animals',
    difficulty: 1,
    paths: [
      { id: 'wing1', d: 'M50,50 Q30,30 20,50 Q30,70 50,50', name: 'Left Wing' },
      { id: 'wing2', d: 'M50,50 Q70,30 80,50 Q70,70 50,50', name: 'Right Wing' },
      { id: 'body', d: 'M50,30 L50,70 M48,35 L52,35 M48,65 L52,65', name: 'Body' }
    ]
  },
  {
    id: 'flower',
    name: 'Sunny Flower',
    category: 'Nature',
    difficulty: 2,
    paths: [
      { id: 'petal1', d: 'M50,40 Q40,30 35,40 Q40,50 50,40', name: 'Petal 1' },
      { id: 'petal2', d: 'M50,40 Q60,30 65,40 Q60,50 50,40', name: 'Petal 2' },
      { id: 'center', d: 'M45,40 A5,5 0 1,0 55,40 A5,5 0 1,0 45,40', name: 'Center' },
      { id: 'stem', d: 'M50,50 L50,80', name: 'Stem' }
    ]
  }
];

const colorPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#2E86AB', '#A23B72', '#F18F01'
];

export const ColoringGameApp: React.FC<ColoringGameAppProps> = ({ onBack, onStatsUpdate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(coloringTemplates[0]);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [coloredPaths, setColoredPaths] = useState<Map<string, string>>(new Map());
  const [score, setScore] = useState(0);
  const [completedArtworks, setCompletedArtworks] = useState(0);
  const canvasRef = useRef<SVGSVGElement>(null);

  const handlePathColor = (pathId: string) => {
    const newColored = new Map(coloredPaths);
    newColored.set(pathId, selectedColor);
    setColoredPaths(newColored);
    
    // Add score for coloring
    setScore(prev => prev + 10);
    
    // Check if artwork is complete
    if (newColored.size === selectedTemplate.paths.length) {
      setScore(prev => prev + 50); // Completion bonus
      setCompletedArtworks(prev => {
        const newCount = prev + 1;
        onStatsUpdate({
          totalScore: score + 50,
          totalCompleted: newCount,
          currentStreak: 1
        });
        return newCount;
      });
    }
  };

  const handleReset = () => {
    setColoredPaths(new Map());
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const svgData = new XMLSerializer().serializeToString(canvasRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        
        const link = document.createElement('a');
        link.download = `colored-${selectedTemplate.name}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
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
                <Palette className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Color & Draw</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="font-medium text-yellow-800">Score: {score}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-medium text-green-800">Completed: {completedArtworks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selection & Color Palette */}
          <Card className="lg:col-span-1 p-4 bg-white/90 backdrop-blur-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Choose Template
            </h3>
            
            <div className="space-y-3 mb-6">
              {coloringTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setColoredPaths(new Map());
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate.id === template.id
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="font-medium text-gray-800">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.category}</div>
                  <div className="text-xs text-purple-600">
                    Difficulty: {'★'.repeat(template.difficulty)}
                  </div>
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-800 mb-4">Color Palette</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="w-full bg-purple-500 hover:bg-purple-600">
                <Download className="h-4 w-4 mr-2" />
                Save Art
              </Button>
            </div>
          </Card>

          {/* Drawing Canvas */}
          <Card className="lg:col-span-3 p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</h2>
              <p className="text-gray-600">Tap the parts to color them!</p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                <svg
                  ref={canvasRef}
                  viewBox="0 0 100 100"
                  className="w-full h-full border-2 border-gray-200 rounded-lg"
                  style={{ minHeight: '300px' }}
                >
                  {selectedTemplate.paths.map((path) => (
                    <path
                      key={path.id}
                      d={path.d}
                      fill={coloredPaths.get(path.id) || 'transparent'}
                      stroke="#333"
                      strokeWidth="1"
                      className="cursor-pointer hover:stroke-purple-500 transition-all duration-200"
                      onClick={() => handlePathColor(path.id)}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{coloredPaths.size}/{selectedTemplate.paths.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(coloredPaths.size / selectedTemplate.paths.length) * 100}%` }}
                />
              </div>
            </div>

            {coloredPaths.size === selectedTemplate.paths.length && (
              <div className="mt-4 text-center p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="text-green-800 font-bold">🎉 Artwork Complete! 🎉</div>
                <div className="text-green-700 text-sm">Great job! You earned 50 bonus points!</div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};