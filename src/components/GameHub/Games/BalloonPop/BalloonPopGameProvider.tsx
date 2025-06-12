
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { BalloonPopGameState, Balloon, Question, LearningCategory, GameTheme } from './types';
import { generateQuestion, generateBalloons, getRandomColor } from './balloonPopUtils';

interface BalloonPopGameContextType {
  state: BalloonPopGameState;
  dispatch: React.Dispatch<any>;
  popBalloon: (balloonId: string) => void;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  changeCategory: (category: LearningCategory) => void;
  changeTheme: (theme: GameTheme) => void;
  toggleSound: () => void;
  toggleVoice: () => void;
}

const BalloonPopGameContext = createContext<BalloonPopGameContextType | undefined>(undefined);

const initialState: BalloonPopGameState = {
  balloons: [],
  currentQuestion: null,
  gameStats: {
    score: 0,
    level: 1,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    timeElapsed: 0
  },
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  showInstructions: true,
  category: 'letters',
  theme: 'rainbow',
  soundEnabled: true,
  voiceEnabled: true,
  multiplayer: false,
  showFeedback: false,
  feedbackMessage: '',
  feedbackType: 'correct'
};

function balloonPopReducer(state: BalloonPopGameState, action: any): BalloonPopGameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        gameOver: false,
        showInstructions: false,
        currentQuestion: generateQuestion(state.category, state.gameStats.level),
        balloons: generateBalloons(state.category, state.gameStats.level)
      };

    case 'PAUSE_GAME':
      return { ...state, isPaused: !state.isPaused };

    case 'RESET_GAME':
      return {
        ...initialState,
        category: state.category,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        voiceEnabled: state.voiceEnabled
      };

    case 'UPDATE_BALLOONS':
      return { ...state, balloons: action.balloons };

    case 'POP_BALLOON':
      const balloon = state.balloons.find(b => b.id === action.balloonId);
      if (!balloon) return state;

      const isCorrect = balloon.type === 'correct';
      const newScore = isCorrect ? state.gameStats.score + 10 : Math.max(0, state.gameStats.score - 5);
      const newStreak = isCorrect ? state.gameStats.streak + 1 : 0;

      return {
        ...state,
        balloons: state.balloons.map(b => 
          b.id === action.balloonId ? { ...b, popped: true, popAnimation: true } : b
        ),
        gameStats: {
          ...state.gameStats,
          score: newScore,
          correctAnswers: isCorrect ? state.gameStats.correctAnswers + 1 : state.gameStats.correctAnswers,
          wrongAnswers: isCorrect ? state.gameStats.wrongAnswers : state.gameStats.wrongAnswers + 1,
          streak: newStreak
        },
        showFeedback: true,
        feedbackMessage: isCorrect ? 'Great job! 🎉' : 'Try again! 💪',
        feedbackType: isCorrect ? 'correct' : 'incorrect'
      };

    case 'NEXT_QUESTION':
      const nextLevel = state.gameStats.correctAnswers > 0 && state.gameStats.correctAnswers % 5 === 0 
        ? state.gameStats.level + 1 : state.gameStats.level;
      
      return {
        ...state,
        currentQuestion: generateQuestion(state.category, nextLevel),
        balloons: generateBalloons(state.category, nextLevel),
        gameStats: { ...state.gameStats, level: nextLevel }
      };

    case 'CHANGE_CATEGORY':
      return { 
        ...state, 
        category: action.category,
        currentQuestion: state.isPlaying ? generateQuestion(action.category, state.gameStats.level) : null
      };

    case 'CHANGE_THEME':
      return { ...state, theme: action.theme };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'TOGGLE_VOICE':
      return { ...state, voiceEnabled: !state.voiceEnabled };

    case 'HIDE_FEEDBACK':
      return { ...state, showFeedback: false };

    case 'UPDATE_TIME':
      return {
        ...state,
        gameStats: { ...state.gameStats, timeElapsed: state.gameStats.timeElapsed + 1 }
      };

    default:
      return state;
  }
}

export const BalloonPopGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(balloonPopReducer, initialState);

  const popBalloon = useCallback((balloonId: string) => {
    dispatch({ type: 'POP_BALLOON', balloonId });
    setTimeout(() => {
      dispatch({ type: 'HIDE_FEEDBACK' });
    }, 1500);
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const changeCategory = useCallback((category: LearningCategory) => {
    dispatch({ type: 'CHANGE_CATEGORY', category });
  }, []);

  const changeTheme = useCallback((theme: GameTheme) => {
    dispatch({ type: 'CHANGE_THEME', theme });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const toggleVoice = useCallback(() => {
    dispatch({ type: 'TOGGLE_VOICE' });
  }, []);

  // Game loop for balloon movement
  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;

    const interval = setInterval(() => {
      dispatch(prevState => ({
        type: 'UPDATE_BALLOONS',
        balloons: prevState.balloons
          .filter(balloon => balloon.y > -100 && !balloon.popped)
          .map(balloon => ({
            ...balloon,
            y: balloon.y - balloon.speed
          }))
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isPaused]);

  // Timer
  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;

    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isPaused]);

  return (
    <BalloonPopGameContext.Provider value={{
      state,
      dispatch,
      popBalloon,
      startGame,
      pauseGame,
      resetGame,
      changeCategory,
      changeTheme,
      toggleSound,
      toggleVoice
    }}>
      {children}
    </BalloonPopGameContext.Provider>
  );
};

export const useBalloonPopGame = () => {
  const context = useContext(BalloonPopGameContext);
  if (!context) {
    throw new Error('useBalloonPopGame must be used within BalloonPopGameProvider');
  }
  return context;
};
