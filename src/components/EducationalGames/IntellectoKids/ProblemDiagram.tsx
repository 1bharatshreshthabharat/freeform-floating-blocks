import React from 'react';

interface ProblemDiagramProps {
  diagram: string;
}

const ProblemDiagram: React.FC<ProblemDiagramProps> = ({ diagram }) => {
  if (!diagram) return null;
  const parts = diagram.split('-');
  const shape = parts[0];

  switch (shape) {
    case 'triangle': {
      const base = Number(parts[1]);
      const height = Number(parts[2]);
      return (
        <svg width="200" height="150" viewBox="0 0 200 150" style={{ margin: '1em auto', display: 'block' }}>
          <polygon 
            points={`20,130 180,130 20,${130 - height * 10}`} 
            fill="#4ade80" 
            stroke="#15803d" 
            strokeWidth="2" 
            style={{ transition: 'all 0.7s ease' }} 
          />
          {/* Base line */}
          <line x1="20" y1="130" x2="180" y2="130" stroke="#065f46" strokeWidth="3" />
          {/* Height line */}
          <line x1="20" y1="130" x2="20" y2={130 - height * 10} stroke="#065f46" strokeWidth="3" strokeDasharray="4 2" />
          {/* Base label */}
          <text x="100" y="145" fontSize="16" fill="#064e3b" textAnchor="middle">{base}</text>
          {/* Height label */}
          <text x="5" y={130 - (height * 10) / 2} fontSize="16" fill="#064e3b" textAnchor="middle">{height}</text>
          {/* Right angle mark */}
          <polyline points="20,130 30,130 30,120" fill="none" stroke="#065f46" strokeWidth="2" />
        </svg>
      );
    }
    case 'rectangle': {
      const length = Number(parts[1]);
      const breadth = Number(parts[2]);
      return (
        <svg width="220" height="150" viewBox="0 0 220 150" style={{ margin: '1em auto', display: 'block' }}>
          <rect x="20" y="40" width={length * 10} height={breadth * 10} fill="#60a5fa" stroke="#1e40af" strokeWidth="3" />
          {/* Length line */}
          <line x1="20" y1={breadth * 10 + 50} x2={20 + length * 10} y2={breadth * 10 + 50} stroke="#1e40af" strokeWidth="3" />
          <text x={20 + (length * 10) / 2} y={breadth * 10 + 70} fontSize="16" fill="#1e3a8a" textAnchor="middle">{length}</text>
          {/* Breadth line */}
          <line x1={length * 10 + 30} y1="40" x2={length * 10 + 30} y2={breadth * 10 + 40} stroke="#1e40af" strokeWidth="3" />
          <text x={length * 10 + 50} y={40 + (breadth * 10) / 2} fontSize="16" fill="#1e3a8a" textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90, ${length * 10 + 50}, ${40 + (breadth * 10) / 2})`}>{breadth}</text>
        </svg>
      );
    }
    case 'square': {
      const side = Number(parts[1]);
      return (
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ margin: '1em auto', display: 'block' }}>
          <rect x="40" y="40" width={side * 10} height={side * 10} fill="#facc15" stroke="#a16207" strokeWidth="3" />
          {/* Side lines */}
          <line x1="40" y1={side * 10 + 50} x2={40 + side * 10} y2={side * 10 + 50} stroke="#a16207" strokeWidth="3" />
          <text x={40 + (side * 10) / 2} y={side * 10 + 70} fontSize="16" fill="#854d0e" textAnchor="middle">{side}</text>
          <line x1={side * 10 + 50} y1="40" x2={side * 10 + 50} y2={side * 10 + 40} stroke="#a16207" strokeWidth="3" />
          <text x={side * 10 + 70} y={40 + (side * 10) / 2} fontSize="16" fill="#854d0e" textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90, ${side * 10 + 70}, ${40 + (side * 10) / 2})`}>{side}</text>
        </svg>
      );
    }
    case 'circle': {
      const radius = Number(parts[1]);
      const cx = 100;
      const cy = 100;
      return (
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ margin: '1em auto', display: 'block' }}>
          <circle cx={cx} cy={cy} r={radius * 10} fill="#f87171" stroke="#b91c1c" strokeWidth="3" />
          {/* Radius line */}
          <line x1={cx} y1={cy} x2={cx + radius * 10} y2={cy} stroke="#b91c1c" strokeWidth="3" strokeDasharray="6 3" />
          {/* Radius label */}
          <text x={cx + radius * 10 / 2} y={cy - 10} fontSize="16" fill="#7f1d1d" textAnchor="middle">{radius}</text>
        </svg>
      );
    }
    default:
      return null;
  }
};

export default ProblemDiagram;
