
import { ColoringOutline } from './types';

export const outlineDatabase: ColoringOutline[] = [
  {
    id: 'lion',
    name: 'Friendly Lion',
    category: 'animals',
    difficulty: 1,
    viewBox: '0 0 300 300',
    sections: [
      {
        id: 'body',
        path: 'M150 200 C120 200 100 180 100 150 C100 120 120 100 150 100 C180 100 200 120 200 150 C200 180 180 200 150 200 Z',
        suggestedColor: '#F4A460',
        name: 'Body'
      },
      {
        id: 'mane',
        path: 'M150 100 C130 90 110 95 95 110 C80 125 85 145 100 150 C85 155 80 175 95 190 C110 205 130 210 150 200 C170 210 190 205 205 190 C220 175 215 155 200 150 C215 145 220 125 205 110 C190 95 170 90 150 100 Z',
        suggestedColor: '#DAA520',
        name: 'Mane'
      },
      {
        id: 'face',
        path: 'M150 150 C130 150 115 135 115 115 C115 95 130 80 150 80 C170 80 185 95 185 115 C185 135 170 150 150 150 Z',
        suggestedColor: '#F4A460',
        name: 'Face'
      },
      {
        id: 'nose',
        path: 'M150 125 C145 125 140 120 140 115 C140 110 145 105 150 105 C155 105 160 110 160 115 C160 120 155 125 150 125 Z',
        suggestedColor: '#8B4513',
        name: 'Nose'
      }
    ]
  },
  {
    id: 'apple',
    name: 'Juicy Apple',
    category: 'fruits',
    difficulty: 1,
    viewBox: '0 0 200 250',
    sections: [
      {
        id: 'apple-body',
        path: 'M100 50 C70 50 50 80 50 120 C50 180 70 220 100 220 C130 220 150 180 150 120 C150 80 130 50 100 50 Z',
        suggestedColor: '#FF0000',
        name: 'Apple Body'
      },
      {
        id: 'stem',
        path: 'M100 50 L100 30 C100 25 95 20 90 20 C95 20 100 25 100 30 Z',
        suggestedColor: '#8B4513',
        name: 'Stem'
      },
      {
        id: 'leaf',
        path: 'M90 35 C85 30 80 35 85 40 C90 35 95 40 90 35 Z',
        suggestedColor: '#32CD32',
        name: 'Leaf'
      }
    ]
  },
  {
    id: 'car',
    name: 'Racing Car',
    category: 'vehicles',
    difficulty: 2,
    viewBox: '0 0 400 200',
    sections: [
      {
        id: 'car-body',
        path: 'M50 120 L350 120 L350 80 L320 60 L280 50 L120 50 L80 60 L50 80 Z',
        suggestedColor: '#FF4500',
        name: 'Car Body'
      },
      {
        id: 'windshield',
        path: 'M80 80 L140 60 L260 60 L320 80 L280 80 L120 80 Z',
        suggestedColor: '#87CEEB',
        name: 'Windshield'
      },
      {
        id: 'wheel1',
        path: 'M100 140 C120 140 135 125 135 105 C135 125 120 140 100 140 C80 140 65 125 65 105 C65 125 80 140 100 140 Z',
        suggestedColor: '#000000',
        name: 'Front Wheel'
      },
      {
        id: 'wheel2',
        path: 'M300 140 C320 140 335 125 335 105 C335 125 320 140 300 140 C280 140 265 125 265 105 C265 125 280 140 300 140 Z',
        suggestedColor: '#000000',
        name: 'Back Wheel'
      }
    ]
  },
  {
    id: 'house',
    name: 'Cozy House',
    category: 'houses',
    difficulty: 2,
    viewBox: '0 0 300 300',
    sections: [
      {
        id: 'house-base',
        path: 'M50 200 L250 200 L250 120 L50 120 Z',
        suggestedColor: '#DEB887',
        name: 'House Base'
      },
      {
        id: 'roof',
        path: 'M40 120 L150 40 L260 120 Z',
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
      }
    ]
  },
  {
    id: 'butterfly',
    name: 'Beautiful Butterfly',
    category: 'nature',
    difficulty: 3,
    viewBox: '0 0 300 300',
    sections: [
      {
        id: 'body',
        path: 'M150 50 L150 250',
        suggestedColor: '#8B4513',
        name: 'Body'
      },
      {
        id: 'left-top-wing',
        path: 'M150 100 C120 80 90 90 80 120 C70 150 90 160 120 140 C135 130 145 115 150 100 Z',
        suggestedColor: '#FF69B4',
        name: 'Left Top Wing'
      },
      {
        id: 'right-top-wing',
        path: 'M150 100 C180 80 210 90 220 120 C230 150 210 160 180 140 C165 130 155 115 150 100 Z',
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
      }
    ]
  }
];
