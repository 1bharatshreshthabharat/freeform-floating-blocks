import { ColoringOutline } from './types';

export const outlineDatabase: ColoringOutline[] = [
  {
    id: 'elephant',
    name: 'Elephant',
    category: 'animals', 
    difficulty: 1,
    viewBox: '0 0 400 300',
    animation: 'walk',
    sections: [
      {
        id: 'body',
        path: 'M80 180 C80 140 110 120 150 120 C200 120 250 140 280 160 C320 180 340 200 340 240 C340 270 320 280 280 280 L120 280 C90 280 80 260 80 240 Z',
        suggestedColor: '#808080',
        name: 'Body'
      },
      {
        id: 'head',
        path: 'M120 120 C120 80 140 60 180 60 C220 60 240 80 240 120 C240 160 220 180 180 180 C140 180 120 160 120 120 Z',
        suggestedColor: '#808080',
        name: 'Head'
      },
      {
        id: 'trunk',
        path: 'M140 160 C130 170 120 180 110 200 C100 220 90 240 100 260 C110 280 120 270 130 250 C140 230 150 210 160 190 C165 180 155 170 140 160 Z',
        suggestedColor: '#696969',
        name: 'Trunk'
      },
      {
        id: 'ear1',
        path: 'M120 100 C100 90 80 100 70 120 C60 140 70 160 90 170 C110 180 130 170 140 150 C150 130 140 110 120 100 Z',
        suggestedColor: '#A9A9A9',
        name: 'Left Ear'
      },
      {
        id: 'ear2',
        path: 'M240 100 C260 90 280 100 290 120 C300 140 290 160 270 170 C250 180 230 170 220 150 C210 130 220 110 240 100 Z',
        suggestedColor: '#A9A9A9',
        name: 'Right Ear'
      },
      {
        id: 'leg1',
        path: 'M120 260 L120 280 L140 280 L140 260 Z',
        suggestedColor: '#696969',
        name: 'Front Left Leg'
      },
      {
        id: 'leg2',
        path: 'M160 260 L160 280 L180 280 L180 260 Z',
        suggestedColor: '#696969',
        name: 'Front Right Leg'
      },
      {
        id: 'leg3',
        path: 'M220 260 L220 280 L240 280 L240 260 Z',
        suggestedColor: '#696969',
        name: 'Back Left Leg'
      },
      {
        id: 'leg4',
        path: 'M260 260 L260 280 L280 280 L280 260 Z',
        suggestedColor: '#696969',
        name: 'Back Right Leg'
      }
    ],
    missingParts: [
      {
        id: 'tail',
        name: 'Tail',
        description: 'Every elephant needs a tail! Choose the best tail for your elephant.',
        position: { x: 340, y: 200 },
        drawingOptions: [
          {
            id: 'long-tail',
            name: 'Long Tail',
            path: 'M0 0 C5 10 8 20 6 30 C4 25 2 15 0 0',
            suggestedColor: '#696969'
          },
          {
            id: 'short-tail',
            name: 'Short Tail',
            path: 'M0 0 C3 8 4 12 2 15 C1 10 0 5 0 0',
            suggestedColor: '#696969'
          }
        ]
      }
    ]
  },
  {
    id: 'bird',
    name: 'Flying Bird',
    category: 'animals',
    difficulty: 2,
    viewBox: '0 0 300 200',
    animation: 'fly',
    sections: [
      {
        id: 'body',
        path: 'M150 100 C140 90 130 95 125 105 C130 115 140 120 150 115 C160 120 170 115 175 105 C170 95 160 90 150 100 Z',
        suggestedColor: '#8B4513',
        name: 'Body'
      },
      {
        id: 'head',
        path: 'M150 100 C145 85 140 80 135 85 C140 90 145 95 150 100 C155 95 160 90 165 85 C160 80 155 85 150 100 Z',
        suggestedColor: '#A0522D',
        name: 'Head'
      },
      {
        id: 'wing1',
        path: 'M125 105 C100 95 80 100 75 110 C80 120 100 125 125 115 C120 110 122 107 125 105 Z',
        suggestedColor: '#654321',
        name: 'Left Wing'
      },
      {
        id: 'wing2',
        path: 'M175 105 C200 95 220 100 225 110 C220 120 200 125 175 115 C180 110 178 107 175 105 Z',
        suggestedColor: '#654321',
        name: 'Right Wing'
      },
      {
        id: 'beak',
        path: 'M150 90 C145 85 140 87 142 92 C145 90 148 88 150 90 Z',
        suggestedColor: '#FFA500',
        name: 'Beak'
      }
    ]
  },
  {
    id: 'car',
    name: 'Racing Car',
    category: 'vehicles',
    difficulty: 2,
    viewBox: '0 0 400 200',
    animation: 'run',
    sections: [
      {
        id: 'car-body',
        path: 'M60 140 L340 140 L340 100 L320 80 L300 70 L280 60 L120 60 L100 70 L80 80 L60 100 Z',
        suggestedColor: '#FF4500',
        name: 'Car Body'
      },
      {
        id: 'windshield',
        path: 'M90 100 L130 75 L270 75 L310 100 L280 95 L120 95 Z',
        suggestedColor: '#87CEEB',
        name: 'Windshield'
      },
      {
        id: 'side-window',
        path: 'M140 95 L180 80 L220 80 L260 95 L250 90 L150 90 Z',
        suggestedColor: '#B0E0E6',
        name: 'Side Window'
      },
      {
        id: 'wheel1',
        path: 'M110 140 C130 140 150 160 150 180 C150 200 130 220 110 220 C90 220 70 200 70 180 C70 160 90 140 110 140 Z',
        suggestedColor: '#2F4F4F',
        name: 'Front Wheel'
      },
      {
        id: 'wheel2',
        path: 'M290 140 C310 140 330 160 330 180 C330 200 310 220 290 220 C270 220 250 200 250 180 C250 160 270 140 290 140 Z',
        suggestedColor: '#2F4F4F',
        name: 'Back Wheel'
      },
      {
        id: 'wheel1-center',
        path: 'M110 165 C120 165 125 170 125 180 C125 190 120 195 110 195 C100 195 95 190 95 180 C95 170 100 165 110 165 Z',
        suggestedColor: '#C0C0C0',
        name: 'Front Wheel Center'
      },
      {
        id: 'wheel2-center',
        path: 'M290 165 C300 165 305 170 305 180 C305 190 300 195 290 195 C280 195 275 190 275 180 C275 170 280 165 290 165 Z',
        suggestedColor: '#C0C0C0',
        name: 'Back Wheel Center'
      },
      {
        id: 'headlight',
        path: 'M50 110 C55 105 65 105 70 110 C65 115 55 115 50 110 Z',
        suggestedColor: '#FFFF00',
        name: 'Headlight'
      }
    ]
  },
  {
    id: 'butterfly',
    name: 'Beautiful Butterfly',
    category: 'nature',
    difficulty: 3,
    viewBox: '0 0 300 300',
    animation: 'fly',
    sections: [
      {
        id: 'body',
        path: 'M150 80 L150 220 C152 220 154 218 154 215 L154 85 C154 82 152 80 150 80 Z',
        suggestedColor: '#8B4513',
        name: 'Body'
      },
      {
        id: 'antennae1',
        path: 'M150 80 C145 70 140 65 135 60 C133 58 135 56 137 58 C142 63 147 68 150 80 Z',
        suggestedColor: '#654321',
        name: 'Left Antenna'
      },
      {
        id: 'antennae2',
        path: 'M150 80 C155 70 160 65 165 60 C167 58 165 56 163 58 C158 63 153 68 150 80 Z',
        suggestedColor: '#654321',
        name: 'Right Antenna'
      },
      {
        id: 'left-top-wing',
        path: 'M150 120 C120 100 90 110 80 140 C70 170 90 180 120 160 C135 150 145 135 150 120 Z',
        suggestedColor: '#FF69B4',
        name: 'Left Top Wing'
      },
      {
        id: 'right-top-wing',
        path: 'M150 120 C180 100 210 110 220 140 C230 170 210 180 180 160 C165 150 155 135 150 120 Z',
        suggestedColor: '#FF69B4',
        name: 'Right Top Wing'
      },
      {
        id: 'left-bottom-wing',
        path: 'M150 140 C130 160 100 170 90 200 C80 230 100 240 130 220 C140 210 145 175 150 140 Z',
        suggestedColor: '#9370DB',
        name: 'Left Bottom Wing'
      },
      {
        id: 'right-bottom-wing',
        path: 'M150 140 C170 160 200 170 210 200 C220 230 200 240 170 220 C160 210 155 175 150 140 Z',
        suggestedColor: '#9370DB',
        name: 'Right Bottom Wing'
      },
      {
        id: 'left-wing-spots',
        path: 'M120 130 C125 130 130 135 130 140 C130 145 125 150 120 150 C115 150 110 145 110 140 C110 135 115 130 120 130 Z',
        suggestedColor: '#FFD700',
        name: 'Left Wing Spots'
      },
      {
        id: 'right-wing-spots',
        path: 'M180 130 C185 130 190 135 190 140 C190 145 185 150 180 150 C175 150 170 145 170 140 C170 135 175 130 180 130 Z',
        suggestedColor: '#FFD700',
        name: 'Right Wing Spots'
      }
    ]
  },
  {
    id: 'rabbit',
    name: 'Cute Rabbit',
    category: 'animals',
    difficulty: 2,
    viewBox: '0 0 300 350',
    animation: 'jump',
    sections: [
      {
        id: 'body',
        path: 'M150 200 C120 190 100 210 105 240 C110 270 130 280 150 275 C170 280 190 270 195 240 C200 210 180 190 150 200 Z',
        suggestedColor: '#FFFFFF',
        name: 'Body'
      },
      {
        id: 'head',
        path: 'M150 150 C130 140 120 160 125 180 C130 200 140 210 150 205 C160 210 170 200 175 180 C180 160 170 140 150 150 Z',
        suggestedColor: '#FFFFFF',
        name: 'Head'
      },
      {
        id: 'ear1',
        path: 'M130 140 C125 120 120 100 125 90 C130 85 135 90 140 100 C145 120 140 140 130 140 Z',
        suggestedColor: '#FFB6C1',
        name: 'Left Ear'
      },
      {
        id: 'ear2',
        path: 'M170 140 C175 120 180 100 175 90 C170 85 165 90 160 100 C155 120 160 140 170 140 Z',
        suggestedColor: '#FFB6C1',
        name: 'Right Ear'
      },
      {
        id: 'eye1',
        path: 'M140 170 C142 170 144 172 144 174 C144 176 142 178 140 178 C138 178 136 176 136 174 C136 172 138 170 140 170 Z',
        suggestedColor: '#000000',
        name: 'Left Eye'
      },
      {
        id: 'eye2',
        path: 'M160 170 C162 170 164 172 164 174 C164 176 162 178 160 178 C158 178 156 176 156 174 C156 172 158 170 160 170 Z',
        suggestedColor: '#000000',
        name: 'Right Eye'
      },
      {
        id: 'nose',
        path: 'M150 185 C148 183 152 183 150 185 C150 187 150 185 150 185 Z',
        suggestedColor: '#FF69B4',
        name: 'Nose'
      }
    ],
    missingParts: [
      {
        id: 'cotton-tail',
        name: 'Cotton Tail',
        description: 'Every rabbit needs a fluffy cotton tail!',
        position: { x: 200, y: 260 },
        drawingOptions: [
          {
            id: 'fluffy-tail',
            name: 'Fluffy Tail',
            path: 'M0 0 C-5 -5 -8 -8 -5 -12 C0 -10 5 -8 8 -5 C5 0 0 5 0 0 Z',
            suggestedColor: '#FFFFFF'
          },
          {
            id: 'round-tail',
            name: 'Round Tail',
            path: 'M0 0 C-6 0 -6 -6 0 -6 C6 -6 6 0 0 0 Z',
            suggestedColor: '#FFFFFF'
          }
        ]
      }
    ]
  }
];
