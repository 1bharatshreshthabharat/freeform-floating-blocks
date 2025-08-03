import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface Word {
  word: string;
  phonics: string[];
  category: string;
  difficulty: number;
  definition: string;
  example: string;
  image?: string;
  rhymes?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface GameState {
  currentWord: Word | null;
  userInput: string;
  score: number;
  streak: number;
  lives: number;
  gameMode: 'spelling' | 'phonics' | 'listening';
  difficulty: number;
  feedback: string;
  showHint: boolean;
  totalWordsAttempted: number;
  correctWords: number;
  soundEnabled: boolean;
  achievements: Achievement[];
  wordStartTime: number;
  gameLevel: number;
  experiencePoints: number;
  selectedPhonics: string[];
  availableLetters: string[];
}

const wordDatabase: Word[] = [
  {
    word: 'cat',
    phonics: ['k', 'ae', 't'],
    category: 'animals',
    difficulty: 1,
    definition: 'A small domesticated carnivorous mammal with soft fur.',
    example: 'The cat sat on the mat.',
    image: 'cat.jpg',
    rhymes: ['bat', 'hat', 'mat']
  },
  {
    word: 'dog',
    phonics: ['d', 'ao', 'g'],
    category: 'animals',
    difficulty: 1,
    definition: 'A domesticated carnivorous mammal that typically has a long snout and keen sense of smell.',
    example: 'The dog barked loudly.',
    image: 'dog.jpg',
    rhymes: ['log', 'hog', 'cog']
  },
  {
    word: 'sun',
    phonics: ['s', 'uh', 'n'],
    category: 'nature',
    difficulty: 1,
    definition: 'The star that provides light and warmth to Earth.',
    example: 'The sun is shining brightly.',
    image: 'sun.jpg',
    rhymes: ['fun', 'run', 'bun']
  },
  {
    word: 'book',
    phonics: ['b', 'uh', 'k'],
    category: 'objects',
    difficulty: 1,
    definition: 'A written or printed work consisting of pages glued or sewn together along one side and bound in covers.',
    example: 'I am reading a book.',
    image: 'book.jpg',
    rhymes: ['cook', 'look', 'nook']
  },
  {
    word: 'tree',
    phonics: ['t', 'r', 'ee'],
    category: 'nature',
    difficulty: 2,
    definition: 'A perennial woody plant with a trunk and branches.',
    example: 'The tree provides shade.',
    image: 'tree.jpg',
    rhymes: ['free', 'bee', 'see']
  },
  {
    word: 'house',
    phonics: ['h', 'ou', 's'],
    category: 'places',
    difficulty: 2,
    definition: 'A building for human habitation.',
    example: 'We live in a small house.',
    image: 'house.jpg',
    rhymes: ['mouse', 'blouse', 'spouse']
  },
  {
    word: 'flower',
    phonics: ['f', 'l', 'ou', 'er'],
    category: 'nature',
    difficulty: 2,
    definition: 'The seed-bearing part of a plant, consisting of reproductive organs surrounded by brightly colored petals.',
    example: 'The flower smells sweet.',
    image: 'flower.jpg',
    rhymes: ['power', 'sour', 'hour']
  },
  {
    word: 'computer',
    phonics: ['k', 'uh', 'm', 'p', 'y', 'oo', 'ter'],
    category: 'technology',
    difficulty: 3,
    definition: 'An electronic device for storing and processing data.',
    example: 'I use a computer for work.',
    image: 'computer.jpg',
    rhymes: ['commuter', 'disputer', 'recruiter']
  },
  {
    word: 'elephant',
    phonics: ['e', 'l', 'e', 'f', 'uh', 'nt'],
    category: 'animals',
    difficulty: 3,
    definition: 'A large mammal with a trunk, tusks, and thick skin.',
    example: 'The elephant is in the zoo.',
    image: 'elephant.jpg',
    rhymes: ['relevant', 'irrelevant', 'prevalent']
  },
  {
    word: 'adventure',
    phonics: ['ad', 'ven', 'ch', 'er'],
    category: 'activities',
    difficulty: 3,
    definition: 'An unusual and exciting experience or activity.',
    example: 'We went on an adventure.',
    image: 'adventure.jpg',
    rhymes: ['venture', 'denture', 'censure']
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'first-word',
    name: 'First Word',
    description: 'Successfully spell your first word.',
    icon: '⭐️',
    unlocked: false,
  },
  {
    id: 'ten-words',
    name: 'Ten Words',
    description: 'Successfully spell ten words.',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'perfect-streak',
    name: 'Perfect Streak',
    description: 'Achieve a streak of 5 correct words in a row.',
    icon: '🔥',
    unlocked: false,
  },
];

const SpellingPhonicGameContext = createContext<any>(null);

export const useSpellingPhonicGame = () => {
  const context = useContext(SpellingPhonicGameContext);
  if (!context) throw new Error('useSpellingPhonicGame must be used within SpellingPhonicGameProvider');
  return context;
};

export const SpellingPhonicGameProvider: React.FC<{ children: React.ReactNode; onStatsUpdate: (stats: any) => void }> = ({ children, onStatsUpdate }) => {
  const initialState: GameState = {
    currentWord: null,
    userInput: '',
    score: 0,
    streak: 0,
    lives: 5,
    gameMode: 'spelling',
    difficulty: 1,
    feedback: '',
    showHint: false,
    totalWordsAttempted: 0,
    correctWords: 0,
    soundEnabled: true,
    achievements: initialAchievements,
    wordStartTime: 0,
    gameLevel: 1,
    experiencePoints: 0,
    selectedPhonics: [],
    availableLetters: [],
  };

  const gameReducer = (state: GameState, action: { type: string; payload?: any }): GameState => {
    switch (action.type) {
      case 'SET_CURRENT_WORD':
        return { ...state, currentWord: action.payload };
      case 'SET_USER_INPUT':
        return { ...state, userInput: action.payload };
      case 'CHECK_SPELLING':
        return { ...state, ...action.payload };
      case 'RESET_GAME':
        return { ...state, ...action.payload };
      case 'TOGGLE_SOUND':
        return { ...state, soundEnabled: !state.soundEnabled };
      case 'SET_GAME_MODE':
        return { ...state, gameMode: action.payload, userInput: '', feedback: '' };
      case 'SET_DIFFICULTY':
        return { ...state, difficulty: action.payload, userInput: '', feedback: '' };
      case 'SHOW_HINT':
        return { ...state, showHint: !state.showHint };
      case 'UNLOCK_ACHIEVEMENT':
        return {
          ...state,
          achievements: state.achievements.map((achievement) =>
            achievement.id === action.payload ? { ...achievement, unlocked: true } : achievement
          ),
        };
      case 'UPDATE_SELECTED_PHONICS':
        return { ...state, selectedPhonics: action.payload };
      case 'SET_AVAILABLE_LETTERS':
        return { ...state, availableLetters: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const getRandomWord = useCallback((difficulty: number) => {
    const filteredWords = wordDatabase.filter((word) => word.difficulty === difficulty);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
  }, []);

  const startNewWord = useCallback(() => {
    const newWord = getRandomWord(state.difficulty);
    if (newWord) {
      dispatch({ type: 'SET_CURRENT_WORD', payload: newWord });
      dispatch({ type: 'SET_USER_INPUT', payload: '' });
      dispatch({ type: 'SHOW_HINT', payload: false });
    }
  }, [getRandomWord, state.difficulty]);

  useEffect(() => {
    startNewWord();
  }, [startNewWord]);

  const checkSpelling = useCallback(() => {
    if (!state.currentWord) return;

    const isCorrect = state.userInput.toLowerCase() === state.currentWord.word.toLowerCase();
    let newScore = state.score;
    let newStreak = state.streak;
    let newLives = state.lives;
    let newExperiencePoints = state.experiencePoints;
    let feedbackMessage = '';

    if (isCorrect) {
      newScore += 10 * state.difficulty;
      newStreak += 1;
      newExperiencePoints += 50 * state.difficulty;
      feedbackMessage = `Excellent! That's correct! +${10 * state.difficulty} points`;

      // Check for streak achievement
      if (newStreak >= 5 && !state.achievements.find((a) => a.id === 'perfect-streak')?.unlocked) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'perfect-streak' });
        toast.success('Achievement Unlocked: Perfect Streak!');
      }

      // Level up if enough experience points
      const pointsNeededForNextLevel = state.gameLevel * 100;
      if (newExperiencePoints >= pointsNeededForNextLevel) {
        newExperiencePoints -= pointsNeededForNextLevel;
        dispatch({ type: 'SET_GAME_LEVEL', payload: state.gameLevel + 1 });
        toast.success(`Level Up! You are now level ${state.gameLevel + 1}`);
      }

    } else {
      newLives -= 1;
      newStreak = 0;
      feedbackMessage = `Oops! That's incorrect. The correct spelling is ${state.currentWord.word}.`;
      if (newLives <= 0) {
        feedbackMessage = 'Game Over! No lives left.';
      }
    }

    const updatedTotalWordsAttempted = state.totalWordsAttempted + 1;
    const updatedCorrectWords = isCorrect ? state.correctWords + 1 : state.correctWords;

    dispatch({
      type: 'CHECK_SPELLING',
      payload: {
        score: newScore,
        streak: newStreak,
        lives: newLives,
        feedback: feedbackMessage,
        totalWordsAttempted: updatedTotalWordsAttempted,
        correctWords: updatedCorrectWords,
        experiencePoints: newExperiencePoints,
      },
    });

    if (isCorrect) {
      // Check for 'first-word' achievement
      if (updatedCorrectWords === 1 && !state.achievements.find((a) => a.id === 'first-word')?.unlocked) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first-word' });
        toast.success('Achievement Unlocked: First Word!');
      }

      // Check for 'ten-words' achievement
      if (updatedCorrectWords === 10 && !state.achievements.find((a) => a.id === 'ten-words')?.unlocked) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'ten-words' });
        toast.success('Achievement Unlocked: Ten Words!');
      }
    }

    if (newLives > 0) {
      startNewWord();
    }
  }, [state, startNewWord]);

  const resetGame = useCallback(() => {
    dispatch({
      type: 'RESET_GAME',
      payload: {
        score: 0,
        streak: 0,
        lives: 5,
        feedback: '',
        totalWordsAttempted: 0,
        correctWords: 0,
      },
    });
    startNewWord();
  }, [startNewWord]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        checkSpelling();
      }
    },
    [checkSpelling]
  );

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const setGameMode = useCallback((mode: 'spelling' | 'phonics' | 'listening') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    startNewWord();
  }, [startNewWord]);

  const setDifficulty = useCallback((difficulty: number) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    startNewWord();
  }, [startNewWord]);

  useEffect(() => {
    onStatsUpdate({
      score: state.score,
      streak: state.streak,
      lives: state.lives,
      gameMode: state.gameMode,
      difficulty: state.difficulty,
      totalWordsAttempted: state.totalWordsAttempted,
      correctWords: state.correctWords,
    });
  }, [state, onStatsUpdate]);

  const speak = (text: string) => {
    if (state.soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const contextValue = {
    state,
    dispatch,
    checkSpelling,
    resetGame,
    handleKeyPress,
    toggleSound,
    setGameMode,
    setDifficulty,
    speak,
  };
  
  return (
    <SpellingPhonicGameContext.Provider value={contextValue}>
      {children}
    </SpellingPhonicGameContext.Provider>
  );
};
