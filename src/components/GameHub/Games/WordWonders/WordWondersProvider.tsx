
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameMode, FloatingLetter, WordData } from './types';
import { getRandomWord, generateLetters, getWordsByLetters } from './wordData';

interface WordWondersContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (mode: GameMode) => void;
  resetGame: () => void;
  speakText: (text: string) => void;
  playSound: (type: 'correct' | 'wrong' | 'hint' | 'complete') => void;
}

type GameAction = 
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'UPDATE_LETTERS'; payload: FloatingLetter[] }
  | { type: 'PLACE_LETTER'; payload: { letterId: string; position: number } }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'SHOW_HINT' }
  | { type: 'COMPLETE_WORD' }
  | { type: 'WRONG_ANSWER' }
  | { type: 'RESET_GAME' }
  | { type: 'START_GAME'; payload: { mode: GameMode; wordData: WordData; letters: FloatingLetter[] } }
  | { type: 'ADD_FOUND_WORD'; payload: string }
  | { type: 'UPDATE_INPUT'; payload: string }
  | { type: 'TICK_TIMER' };

const initialState: GameState = {
  mode: 'random',
  theme: 'forest',
  score: 0,
  stars: 0,
  level: 1,
  currentWord: '',
  targetWord: '',
  letters: [],
  placedLetters: [],
  isComplete: false,
  showHint: false,
  lives: 3,
  timeLeft: 60,
  isGameActive: false,
  foundWords: [],
  currentInput: ''
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload as any };
    case 'UPDATE_LETTERS':
      return { ...state, letters: action.payload };
    case 'PLACE_LETTER':
      const updatedLetters = state.letters.map(letter => 
        letter.id === action.payload.letterId 
          ? { ...letter, isPlaced: true } 
          : letter
      );
      return { ...state, letters: updatedLetters };
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'SHOW_HINT':
      return { ...state, showHint: true };
    case 'COMPLETE_WORD':
      return { 
        ...state, 
        isComplete: true, 
        score: state.score + 100,
        stars: state.stars + 1
      };
    case 'WRONG_ANSWER':
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case 'START_GAME':
      return {
        ...state,
        mode: action.payload.mode,
        targetWord: action.payload.wordData.word,
        riddle: action.payload.wordData.riddle,
        sentence: action.payload.wordData.sentence,
        letters: action.payload.letters,
        isGameActive: true,
        isComplete: false,
        showHint: false,
        placedLetters: [],
        currentInput: '',
        timeLeft: 60
      };
    case 'ADD_FOUND_WORD':
      if (!state.foundWords.includes(action.payload)) {
        return {
          ...state,
          foundWords: [...state.foundWords, action.payload],
          score: state.score + action.payload.length * 10
        };
      }
      return state;
    case 'UPDATE_INPUT':
      return { ...state, currentInput: action.payload };
    case 'TICK_TIMER':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    case 'RESET_GAME':
      return { ...initialState, theme: state.theme };
    default:
      return state;
  }
};

const WordWondersContext = createContext<WordWondersContextType | null>(null);

export const WordWondersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'hint' | 'complete') => {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case 'hint':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    const actualMode = mode === 'random' ? 
      (['complete-verb', 'make-words', 'fix-word', 'word-riddle', 'magic-trays', 'sentence-picker', 'hidden-word'] as GameMode[])[Math.floor(Math.random() * 7)] 
      : mode;
    
    const wordData = getRandomWord();
    const letterStrings = generateLetters(wordData.word, 8);
    
    const letters: FloatingLetter[] = letterStrings.map((letter, index) => ({
      id: `letter-${index}`,
      letter,
      x: Math.random() * 600 + 50,
      y: Math.random() * 200 + 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      isCorrect: wordData.word.includes(letter),
      isDragging: false,
      isPlaced: false
    }));

    dispatch({
      type: 'START_GAME',
      payload: { mode: actualMode, wordData, letters }
    });

    const gameText = `Let's play ${actualMode.replace('-', ' ')}! ${(wordData as any).riddle || (wordData as any).sentence || 'Find the word!'}`;
    speakText(gameText);
  }, [speakText]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isGameActive && state.timeLeft > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.isGameActive, state.timeLeft]);

  // Hint timer
  useEffect(() => {
    if (state.isGameActive && !state.showHint) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_HINT' });
        playSound('hint');
        speakText('Here\'s a hint! Look for the letters you need.');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [state.isGameActive, state.showHint, playSound, speakText]);

  return (
    <WordWondersContext.Provider value={{
      state,
      dispatch,
      startGame,
      resetGame,
      speakText,
      playSound
    }}>
      {children}
    </WordWondersContext.Provider>
  );
};

export const useWordWonders = () => {
  const context = useContext(WordWondersContext);
  if (!context) {
    throw new Error('useWordWonders must be used within WordWondersProvider');
  }
  return context;
};
