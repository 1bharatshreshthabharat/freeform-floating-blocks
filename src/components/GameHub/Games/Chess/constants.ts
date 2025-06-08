
import { Piece } from './types';

export const initialBoard: Piece[][] = [
  [
    { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
  ],
  [
    { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }
  ],
  [
    { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
  ]
];

export const pieceSets = {
  classic: {
    white: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' },
    black: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' }
  },
  modern: {
    white: { pawn: '⬢', rook: '⬙', knight: '⬟', bishop: '⬣', queen: '⬨', king: '👑' },
    black: { pawn: '⬛', rook: '⛶', knight: '🐴', bishop: '⬖', queen: '⬔', king: '⬓' }
  },
  medieval: {
    white: { pawn: '🚶', rook: '🏰', knight: '🐴', bishop: '⛪', queen: '👑', king: '🤴' },
    black: { pawn: '🧎', rook: '🏯', knight: '🐎', bishop: '🕍', queen: '👸', king: '👲' }
  },
  fantasy: {
    white: { pawn: '🍄', rook: '🐉', knight: '🦄', bishop: '🧙', queen: '🧚', king: '🧝' },
    black: { pawn: '👹', rook: '👿', knight: '🧛', bishop: '🧟', queen: '🦹', king: '💀' }
  },
  geometric: {
    white: { pawn: '▲', rook: '■', knight: '◆', bishop: '▼', queen: '★', king: '◉' },
    black: { pawn: '△', rook: '□', knight: '◇', bishop: '▽', queen: '☆', king: '○' }
  },
  animals: {
    white: { pawn: '🐕', rook: '🐘', knight: '🐎', bishop: '🦅', queen: '🦁', king: '🐅' },
    black: { pawn: '🐺', rook: '🦏', knight: '🦓', bishop: '🦉', queen: '🐆', king: '🐺' }
  }
};
