import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameMode, FloatingLetter, WordData } from './types';
import { getRandomWord, generateLetters, getWordsByLetters } from './wordData';

interface WordWondersContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (mode: GameMode) => void;
  pauseGame: () => void;
  resetGame: () => void;
  speakText: (text: string) => void;
  playSound: (type: 'correct' | 'wrong' | 'hint' | 'complete') => void;
  placeLetterInBox: (letterId: string, boxIndex: number) => void;
  removeLetterFromBox: (boxIndex: number) => void;
}

type GameAction = 
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'UPDATE_LETTERS'; payload: FloatingLetter[] }
  | { type: 'PLACE_LETTER_IN_BOX'; payload: { letterId: string; boxIndex: number } }
  | { type: 'REMOVE_LETTER_FROM_BOX'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'SHOW_HINT' }
  | { type: 'COMPLETE_WORD' }
  | { type: 'WRONG_ANSWER' }
  | { type: 'RESET_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'START_GAME'; payload: { mode: GameMode; wordData: WordData; letters: FloatingLetter[]; possibleWords?: string[] } }
  | { type: 'ADD_FOUND_WORD'; payload: string }
  | { type: 'UPDATE_INPUT'; payload: string }
  | { type: 'TICK_TIMER' }
  | { type: 'LOSE_LIFE' }
  | { type: 'SET_HINT'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_PLACEMENT' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_TIMER' };

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
  isPaused: false,
  foundWords: [],
  currentInput: '',
  soundEnabled: true
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload as any };
    case 'UPDATE_LETTERS':
      return { ...state, letters: action.payload };
    case 'PLACE_LETTER_IN_BOX':
      const letterToPlace = state.letters.find(l => l.id === action.payload.letterId);
      if (!letterToPlace) return state;
      
      const updatedLettersForPlace = state.letters.map(letter => 
        letter.id === action.payload.letterId 
          ? { ...letter, isPlaced: true } 
          : letter
      );
      
      const newPlacedLetters = [...state.placedLetters];
      newPlacedLetters[action.payload.boxIndex] = letterToPlace.letter;
      
      return { 
        ...state, 
        letters: updatedLettersForPlace,
        placedLetters: newPlacedLetters
      };
    case 'REMOVE_LETTER_FROM_BOX':
      const letterToRemove = state.placedLetters[action.payload];
      if (!letterToRemove) return state;
      
      const updatedLettersForRemove = state.letters.map(letter => 
        letter.letter === letterToRemove && letter.isPlaced
          ? { ...letter, isPlaced: false } 
          : letter
      );
      
      const newPlacedLettersAfterRemove = [...state.placedLetters];
      newPlacedLettersAfterRemove[action.payload] = '';
      
      return {
        ...state,
        letters: updatedLettersForRemove,
        placedLetters: newPlacedLettersAfterRemove
      };
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'SHOW_HINT':
      return { ...state, showHint: true };
    case 'SET_HINT':
      return { ...state, hintText: action.payload };
    case 'COMPLETE_WORD':
      return { 
        ...state, 
        isComplete: true, 
        score: state.score + 100,
        stars: state.stars + 1
      };
    case 'WRONG_ANSWER':
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case 'LOSE_LIFE':
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case 'PAUSE_GAME':
      return { ...state, isPaused: !state.isPaused };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'START_GAME':
      return {
        ...state,
        mode: action.payload.mode,
        targetWord: action.payload.wordData.word,
        riddle: (action.payload.wordData as any).riddle,
        sentence: (action.payload.wordData as any).sentence,
        letters: action.payload.letters,
        possibleWords: action.payload.possibleWords,
        placedLetters: new Array(action.payload.wordData.word.length).fill(''),
        isGameActive: true,
        isPaused: false,
        isComplete: false,
        showHint: false,
        currentInput: '',
        foundWords: [],
        timeLeft: 60,
        lives: 3
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
      if (state.isPaused || state.isComplete) return state;
      const newTimeLeft = Math.max(0, state.timeLeft - 1);
      if (newTimeLeft === 0) {
        return { ...state, timeLeft: 0, isGameActive: false };
      }
      return { ...state, timeLeft: newTimeLeft };
    case 'NEXT_QUESTION':
      // Start a new question automatically
      const wordData = getRandomWord();
      let letterStrings: string[] = [];
      let possibleWords: string[] = [];
      
      if (state.mode === 'make-words') {
        letterStrings = wordData.word.split('').concat(['A', 'E', 'I', 'O', 'U'].slice(0, 3));
        possibleWords = getWordsByLetters(letterStrings);
      } else if (state.mode === 'fix-word') {
        // For fix-word mode, shuffle the letters of the target word
        letterStrings = wordData.word.split('').sort(() => Math.random() - 0.5);
      } else {
        letterStrings = generateLetters(wordData.word, 6);
      }
      
      const letters = letterStrings.map((letter, index) => ({
        id: `letter-${index}`,
        letter,
        x: Math.random() * 300 + 50,
        y: Math.random() * 100 + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        isCorrect: state.mode === 'fix-word' ? true : wordData.word.includes(letter),
        isDragging: false,
        isPlaced: false
      }));
      
      return {
        ...state,
        targetWord: wordData.word,
        riddle: (wordData as any).riddle,
        sentence: (wordData as any).sentence,
        letters,
        possibleWords,
        placedLetters: new Array(wordData.word.length).fill(''),
        isComplete: false,
        showHint: false,
        timeLeft: 60
      };
    case 'RESET_PLACEMENT':
      return {
        ...state,
        placedLetters: new Array(state.targetWord.length).fill(''),
        letters: state.letters.map(letter => ({ ...letter, isPlaced: false }))
      };
    case 'GAME_OVER':
      return { ...state, isGameActive: false, isPaused: false };
    case 'RESET_TIMER':
      return { ...state, timeLeft: 60 };
    case 'RESET_GAME':
      return { ...initialState, theme: state.theme, soundEnabled: state.soundEnabled };
    default:
      return state;
  }
};

const WordWondersContext = createContext<WordWondersContextType | null>(null);

export const WordWondersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window && state.soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [state.soundEnabled]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'hint' | 'complete') => {
    if (!state.soundEnabled) return;
    
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
  }, [state.soundEnabled]);

  const placeLetterInBox = useCallback((letterId: string, boxIndex: number) => {
    dispatch({ type: 'PLACE_LETTER_IN_BOX', payload: { letterId, boxIndex } });
  }, []);

  const removeLetterFromBox = useCallback((boxIndex: number) => {
    dispatch({ type: 'REMOVE_LETTER_FROM_BOX', payload: boxIndex });
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    const actualMode = mode === 'random' ? 
      (['complete-verb', 'make-words', 'fix-word', 'word-riddle', 'guess-word', 'hidden-word'] as GameMode[])[Math.floor(Math.random() * 6)] 
      : mode;
    
    const wordData = getRandomWord();
    let letters: FloatingLetter[] = [];
    let possibleWords: string[] = [];
    
    if (actualMode === 'make-words') {
      const letterStrings = wordData.word.split('').concat(['A', 'E', 'I', 'O', 'U'].slice(0, 3));
      possibleWords = getWordsByLetters(letterStrings);
      letters = letterStrings.map((letter, index) => ({
        id: `letter-${index}`,
        letter,
        x: Math.random() * 300 + 50,
        y: Math.random() * 100 + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        isCorrect: true,
        isDragging: false,
        isPlaced: false
      }));
    } else if (actualMode === 'fix-word') {
      // For fix-word mode, use shuffled letters from the target word
      const shuffled = wordData.word.split('').sort(() => Math.random() - 0.5);
      letters = shuffled.map((letter, index) => ({
        id: `letter-${index}`,
        letter,
        x: Math.random() * 300 + 50,
        y: Math.random() * 100 + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        isCorrect: true,
        isDragging: false,
        isPlaced: false
      }));
    } else {
      const letterStrings = generateLetters(wordData.word, 6);
      letters = letterStrings.map((letter, index) => ({
        id: `letter-${index}`,
        letter,
        x: Math.random() * 300 + 50,
        y: Math.random() * 100 + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        isCorrect: wordData.word.includes(letter),
        isDragging: false,
        isPlaced: false
      }));
    }

    dispatch({
      type: 'START_GAME',
      payload: { mode: actualMode, wordData, letters, possibleWords }
    });

    const gameText = `Let's play ${actualMode.replace('-', ' ')}!`;
    speakText(gameText);
  }, [speakText]);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Auto-start game when mode changes (real-time switching)
  useEffect(() => {
    if (state.mode && state.mode !== 'random' && !state.isGameActive) {
      startGame(state.mode);
    }
  }, [state.mode, startGame, state.isGameActive]);

  // Timer effect
  useEffect(() => {
    if (state.isGameActive && state.timeLeft > 0 && !state.isPaused) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.isGameActive, state.timeLeft, state.isPaused]);

  // Game over effect
  useEffect(() => {
    if (state.lives === 0 || state.timeLeft === 0) {
      dispatch({ type: 'GAME_OVER' });
      speakText('Game Over! Try again!');
    }
  }, [state.lives, state.timeLeft, speakText]);

  return (
    <WordWondersContext.Provider value={{
      state,
      dispatch,
      startGame,
      pauseGame,
      resetGame,
      speakText,
      playSound,
      placeLetterInBox,
      removeLetterFromBox
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
