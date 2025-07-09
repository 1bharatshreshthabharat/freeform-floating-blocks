
import { ColoringOutline } from './types';

export const outlineDatabase: ColoringOutline[] = [
  {
    id: 'elephant',
    name: 'Elephant',
    category: 'animals',
    difficulty: 1,
    viewBox: '0 0 400 300',
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
    ]
  },
  {
    id: 'apple',
    name: 'Red Apple',
    category: 'fruits',
    difficulty: 1,
    viewBox: '0 0 200 250',
    sections: [
      {
        id: 'apple-body',
        path: 'M100 60 C70 60 50 90 50 130 C50 170 60 200 80 220 C100 240 120 240 140 220 C160 200 170 170 170 130 C170 90 150 60 120 60 C115 55 105 55 100 60 Z',
        suggestedColor: '#FF0000',
        name: 'Apple Body'
      },
      {
        id: 'apple-indent',
        path: 'M100 60 C105 50 115 50 120 60 C115 65 105 65 100 60 Z',
        suggestedColor: '#DC143C',
        name: 'Apple Indent'
      },
      {
        id: 'stem',
        path: 'M110 50 L110 30 C110 25 108 20 106 20 C104 20 102 25 102 30 L102 50 Z',
        suggestedColor: '#8B4513',
        name: 'Stem'
      },
      {
        id: 'leaf',
        path: 'M102 40 C95 35 90 38 88 45 C90 52 95 55 102 50 C105 45 105 42 102 40 Z',
        suggestedColor: '#228B22',
        name: 'Leaf'
      }
    ]
  },
  {
    id: 'car',
    name: 'Sports Car',
    category: 'vehicles',
    difficulty: 2,
    viewBox: '0 0 400 200',
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
    id: 'house',
    name: 'Family House',
    category: 'houses',
    difficulty: 2,
    viewBox: '0 0 300 300',
    sections: [
      {
        id: 'house-base',
        path: 'M50 200 L250 200 L250 120 L50 120 Z',
        suggestedColor: '#DEB887',
        name: 'House Walls'
      },
      {
        id: 'roof',
        path: 'M40 120 L150 40 L260 120 L230 120 L150 70 L70 120 Z',
        suggestedColor: '#8B0000',
        name: 'Roof'
      },
      {
        id: 'door',
        path: 'M120 200 L120 150 L180 150 L180 200 Z',
        suggestedColor: '#8B4513',
        name: 'Door'
      },
      {
        id: 'door-knob',
        path: 'M170 175 C172 175 174 177 174 179 C174 181 172 183 170 183 C168 183 166 181 166 179 C166 177 168 175 170 175 Z',
        suggestedColor: '#FFD700',
        name: 'Door Knob'
      },
      {
        id: 'window1',
        path: 'M70 160 L70 130 L100 130 L100 160 Z',
        suggestedColor: '#87CEEB',
        name: 'Left Window'
      },
      {
        id: 'window2',
        path: 'M200 160 L200 130 L230 130 L230 160 Z',
        suggestedColor: '#87CEEB',
        name: 'Right Window'
      },
      {
        id: 'window1-frame',
        path: 'M70 145 L100 145 M85 130 L85 160',
        suggestedColor: '#FFFFFF',
        name: 'Left Window Frame'
      },
      {
        id: 'window2-frame',
        path: 'M200 145 L230 145 M215 130 L215 160',
        suggestedColor: '#FFFFFF',
        name: 'Right Window Frame'
      },
      {
        id: 'chimney',
        path: 'M190 70 L190 40 L210 40 L210 70 Z',
        suggestedColor: '#A0522D',
        name: 'Chimney'
      }
    ]
  },
  {
    id: 'butterfly',
    name: 'Colorful Butterfly',
    category: 'nature',
    difficulty: 3,
    viewBox: '0 0 300 300',
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
    id: 'fish',
    name: 'Tropical Fish',
    category: 'animals',
    difficulty: 2,
    viewBox: '0 0 350 200',
    sections: [
      {
        id: 'fish-body',
        path: 'M80 100 C80 70 110 50 150 50 C200 50 240 70 250 100 C240 130 200 150 150 150 C110 150 80 130 80 100 Z',
        suggestedColor: '#FF8C00',
        name: 'Fish Body'
      },
      {
        id: 'fish-tail',
        path: 'M250 100 C280 80 320 70 340 80 C350 90 340 100 320 110 C340 110 350 120 340 130 C320 140 280 130 250 100 Z',
        suggestedColor: '#FF6347',
        name: 'Fish Tail'
      },
      {
        id: 'fish-eye',
        path: 'M120 90 C130 90 140 100 140 110 C140 120 130 130 120 130 C110 130 100 120 100 110 C100 100 110 90 120 90 Z',
        suggestedColor: '#FFFFFF',
        name: 'Fish Eye'
      },
      {
        id: 'fish-pupil',
        path: 'M120 100 C125 100 130 105 130 110 C130 115 125 120 120 120 C115 120 110 115 110 110 C110 105 115 100 120 100 Z',
        suggestedColor: '#000000',
        name: 'Fish Pupil'
      },
      {
        id: 'top-fin',
        path: 'M140 50 C150 30 170 25 180 30 C190 35 185 45 175 50 C165 55 155 50 140 50 Z',
        suggestedColor: '#FFA500',
        name: 'Top Fin'
      },
      {
        id: 'bottom-fin',
        path: 'M140 150 C150 170 170 175 180 170 C190 165 185 155 175 150 C165 145 155 150 140 150 Z',
        suggestedColor: '#FFA500',
        name: 'Bottom Fin'
      },
      {
        id: 'side-fin',
        path: 'M80 110 C60 120 55 140 65 150 C75 145 80 135 85 125 C85 120 83 115 80 110 Z',
        suggestedColor: '#FF7F50',
        name: 'Side Fin'
      }
    ]
  }
];
