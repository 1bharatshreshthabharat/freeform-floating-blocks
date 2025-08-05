
import { ColoringOutline } from './types';

export function generateReferenceImageSVG(outline: ColoringOutline): string {
  const { viewBox, sections } = outline;

  const svgPaths = sections.map(section => `
    <path d="${section.path}" fill="${section.suggestedColor}" stroke="black" stroke-width="1" />
  `).join('\n');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="300" height="300">
      ${svgPaths}
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}



export const outlineDatabase: ColoringOutline[] = [
  {
    id: 'flower-1',
    name: 'Beautiful Rose',
    category: 'flowers',
    difficulty: 2,
    viewBox: '0 0 200 200',
    sections: [
      {
        id: 'petal-1',
        name: 'Rose Petals',
        path: 'M100,50 Q120,60 130,80 Q120,100 100,90 Q80,100 70,80 Q80,60 100,50 Z',
        suggestedColor: '#FF69B4'
      },
      {
        id: 'petal-2',
        name: 'Inner Petals',
        path: 'M100,70 Q110,75 115,85 Q110,95 100,90 Q90,95 85,85 Q90,75 100,70 Z',
        suggestedColor: '#FFB6C1'
      },
      {
        id: 'stem',
        name: 'Stem',
        path: 'M100,90 L98,150 L102,150 Z',
        suggestedColor: '#228B22'
      },
      {
        id: 'leaf-1',
        name: 'Left Leaf',
        path: 'M90,120 Q75,125 70,135 Q75,145 90,140 Z',
        suggestedColor: '#32CD32'
      },
      {
        id: 'leaf-2',
        name: 'Right Leaf',
        path: 'M110,120 Q125,125 130,135 Q125,145 110,140 Z',
        suggestedColor: '#32CD32'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop'
  },
  {
    id: 'horse-1',
    name: 'Galloping Horse',
    category: 'horses',
    difficulty: 3,
    viewBox: '0 0 300 200',
    sections: [
      {
        id: 'body',
        name: 'Horse Body',
        path: 'M50,100 Q100,80 150,90 Q180,95 200,110 Q190,140 150,135 Q100,140 50,130 Z',
        suggestedColor: '#8B4513'
      },
      {
        id: 'head',
        name: 'Horse Head',
        path: 'M200,110 Q220,100 240,105 Q250,120 240,135 Q220,140 200,130 Z',
        suggestedColor: '#A0522D'
      },
      {
        id: 'mane',
        name: 'Mane',
        path: 'M200,100 Q210,85 220,90 Q225,95 220,105 Q210,110 200,105 Z',
        suggestedColor: '#654321'
      },
      {
        id: 'legs',
        name: 'Horse Legs',
        path: 'M70,135 L68,170 L72,170 M120,135 L118,170 L122,170 M150,135 L148,170 L152,170 M180,130 L178,165 L182,165',
        suggestedColor: '#8B4513'
      },
      {
        id: 'tail',
        name: 'Tail',
        path: 'M50,120 Q30,125 25,140 Q30,155 50,150',
        suggestedColor: '#654321'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop'
  },
  {
    id: 'dinosaur-1',
    name: 'Friendly Dinosaur',
    category: 'dinosaurs',
    difficulty: 2,
    viewBox: '0 0 250 200',
    sections: [
      {
        id: 'body',
        name: 'Dinosaur Body',
        path: 'M80,120 Q120,100 160,110 Q180,125 170,150 Q130,160 80,150 Z',
        suggestedColor: '#32CD32'
      },
      {
        id: 'head',
        name: 'Dinosaur Head',
        path: 'M170,110 Q190,100 200,115 Q195,130 175,125 Z',
        suggestedColor: '#228B22'
      },
      {
        id: 'neck',
        name: 'Long Neck',
        path: 'M160,110 Q170,90 180,70 Q185,80 175,100 Z',
        suggestedColor: '#32CD32'
      },
      {
        id: 'tail',
        name: 'Tail',
        path: 'M80,130 Q50,135 30,145 Q35,155 60,150 Q80,145 80,130',
        suggestedColor: '#228B22'
      },
      {
        id: 'legs',
        name: 'Legs',
        path: 'M100,150 L98,180 L102,180 M130,155 L128,185 L132,185 M150,155 L148,185 L152,185',
        suggestedColor: '#32CD32'
      },
      {
        id: 'spots',
        name: 'Spots',
        path: 'M110,125 Q115,120 120,125 Q115,130 110,125 M140,130 Q145,125 150,130 Q145,135 140,130',
        suggestedColor: '#FFD700'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
  },
  {
    id: 'car-1',
    name: 'Race Car',
    category: 'cars',
    difficulty: 2,
    viewBox: '0 0 200 120',
    sections: [
      {
        id: 'body',
        name: 'Car Body',
        path: 'M30,60 Q50,45 150,45 Q170,50 170,70 Q165,85 30,85 Z',
        suggestedColor: '#FF0000'
      },
      {
        id: 'windshield',
        name: 'Windshield',
        path: 'M60,45 Q80,35 120,35 Q140,40 140,55 Q120,60 60,60 Z',
        suggestedColor: '#87CEEB'
      },
      {
        id: 'wheel-1',
        name: 'Front Wheel',
        path: 'M45,85 Q55,75 65,85 Q55,95 45,85 Z',
        suggestedColor: '#000000'
      },
      {
        id: 'wheel-2',
        name: 'Rear Wheel',
        path: 'M135,85 Q145,75 155,85 Q145,95 135,85 Z',
        suggestedColor: '#000000'
      },
      {
        id: 'stripe',
        name: 'Racing Stripe',
        path: 'M50,55 L150,55 L150,65 L50,65 Z',
        suggestedColor: '#FFFFFF'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop'
  },
  {
    id: 'christmas-tree',
    name: 'Christmas Tree',
    category: 'christmas',
    difficulty: 3,
    viewBox: '0 0 200 250',
    sections: [
      {
        id: 'tree-top',
        name: 'Tree Top',
        path: 'M100,30 L80,70 L120,70 Z',
        suggestedColor: '#228B22'
      },
      {
        id: 'tree-middle',
        name: 'Tree Middle',
        path: 'M100,50 L70,90 L130,90 Z',
        suggestedColor: '#32CD32'
      },
      {
        id: 'tree-bottom',
        name: 'Tree Bottom',
        path: 'M100,70 L60,110 L140,110 Z',
        suggestedColor: '#228B22'
      },
      {
        id: 'trunk',
        name: 'Tree Trunk',
        path: 'M90,110 L110,110 L110,140 L90,140 Z',
        suggestedColor: '#8B4513'
      },
      {
        id: 'star',
        name: 'Christmas Star',
        path: 'M100,20 L102,28 L110,28 L104,32 L106,40 L100,36 L94,40 L96,32 L90,28 L98,28 Z',
        suggestedColor: '#FFD700'
      },
      {
        id: 'ornament-1',
        name: 'Red Ornament',
        path: 'M90,60 Q95,55 100,60 Q95,65 90,60 Z',
        suggestedColor: '#FF0000'
      },
      {
        id: 'ornament-2',
        name: 'Blue Ornament',
        path: 'M110,80 Q115,75 120,80 Q115,85 110,80 Z',
        suggestedColor: '#0000FF'
      },
      {
        id: 'ornament-3',
        name: 'Gold Ornament',
        path: 'M85,95 Q90,90 95,95 Q90,100 85,95 Z',
        suggestedColor: '#FFD700'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=300&fit=crop'
  },
  {
    id: 'cat-1',
    name: 'Playful Cat',
    category: 'animals',
    difficulty: 2,
    viewBox: '0 0 200 180',
    sections: [
      {
        id: 'body',
        name: 'Cat Body',
        path: 'M60,100 Q100,80 140,100 Q150,130 100,140 Q50,130 60,100 Z',
        suggestedColor: '#FF8C00'
      },
      {
        id: 'head',
        name: 'Cat Head',
        path: 'M80,70 Q100,50 120,70 Q130,90 100,95 Q70,90 80,70 Z',
        suggestedColor: '#FF8C00'
      },
      {
        id: 'ears',
        name: 'Cat Ears',
        path: 'M85,65 L90,45 L95,65 M105,65 L110,45 L115,65',
        suggestedColor: '#FF6347'
      },
      {
        id: 'tail',
        name: 'Cat Tail',
        path: 'M140,110 Q160,100 170,120 Q165,140 145,130',
        suggestedColor: '#FF8C00'
      },
      {
        id: 'stripes',
        name: 'Cat Stripes',
        path: 'M70,85 L85,80 M110,80 L125,85 M75,110 L90,105 M110,105 L125,110',
        suggestedColor: '#DC143C'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop'
  },
  {
    id: 'butterfly-1',
    name: 'Beautiful Butterfly',
    category: 'insects',
    difficulty: 3,
    viewBox: '0 0 200 160',
    sections: [
      {
        id: 'body',
        name: 'Butterfly Body',
        path: 'M100,40 L100,120 L102,120 L102,40 Z',
        suggestedColor: '#654321'
      },
      {
        id: 'left-wing-top',
        name: 'Left Top Wing',
        path: 'M100,50 Q70,40 60,70 Q70,90 100,80 Z',
        suggestedColor: '#FF69B4'
      },
      {
        id: 'left-wing-bottom',
        name: 'Left Bottom Wing',
        path: 'M100,80 Q75,85 65,110 Q75,125 100,115 Z',
        suggestedColor: '#9370DB'
      },
      {
        id: 'right-wing-top',
        name: 'Right Top Wing',
        path: 'M100,50 Q130,40 140,70 Q130,90 100,80 Z',
        suggestedColor: '#FF69B4'
      },
      {
        id: 'right-wing-bottom',
        name: 'Right Bottom Wing',
        path: 'M100,80 Q125,85 135,110 Q125,125 100,115 Z',
        suggestedColor: '#9370DB'
      },
      {
        id: 'spots',
        name: 'Wing Spots',
        path: 'M75,65 Q80,60 85,65 Q80,70 75,65 M115,65 Q120,60 125,65 Q120,70 115,65',
        suggestedColor: '#FFD700'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop'
  },
  {
    id: 'sun-1',
    name: 'Bright Sun',
    category: 'nature',
    difficulty: 1,
    viewBox: '0 0 200 200',
    sections: [
      {
        id: 'center',
        name: 'Sun Center',
        path: 'M100,100 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0',
        suggestedColor: '#FFD700'
      },
      {
        id: 'rays',
        name: 'Sun Rays',
        path: 'M100,20 L100,40 M141,41 L129,53 M180,100 L160,100 M141,159 L129,147 M100,180 L100,160 M59,159 L71,147 M20,100 L40,100 M59,41 L71,53',
        suggestedColor: '#FFA500'
      },
      {
        id: 'face',
        name: 'Sun Face',
        path: 'M85,90 Q90,85 95,90 M105,90 Q110,85 115,90 M90,110 Q100,120 110,110',
        suggestedColor: '#FF8C00'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
  },
  {
    id: 'penguin-1',
    name: 'Cute Penguin',
    category: 'animals',
    difficulty: 2,
    viewBox: '0 0 150 200',
    sections: [
      {
        id: 'body',
        name: 'Penguin Body',
        path: 'M75,60 Q95,50 95,100 Q95,150 75,160 Q55,150 55,100 Q55,50 75,60 Z',
        suggestedColor: '#000000'
      },
      {
        id: 'belly',
        name: 'Penguin Belly',
        path: 'M75,70 Q85,65 85,110 Q85,145 75,150 Q65,145 65,110 Q65,65 75,70 Z',
        suggestedColor: '#FFFFFF'
      },
      {
        id: 'head',
        name: 'Penguin Head',
        path: 'M75,30 Q90,25 90,50 Q90,65 75,60 Q60,65 60,50 Q60,25 75,30 Z',
        suggestedColor: '#000000'
      },
      {
        id: 'beak',
        name: 'Penguin Beak',
        path: 'M75,45 Q80,50 75,55 Q70,50 75,45',
        suggestedColor: '#FFA500'
      },
      {
        id: 'feet',
        name: 'Penguin Feet',
        path: 'M65,160 L60,170 L70,170 M80,160 L85,170 L95,170',
        suggestedColor: '#FFA500'
      }
    ],
    referenceImage: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=300&h=300&fit=crop'
  }
];