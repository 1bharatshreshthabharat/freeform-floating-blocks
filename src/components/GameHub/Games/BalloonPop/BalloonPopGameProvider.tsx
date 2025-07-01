import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { BalloonPopGameState, Balloon, Question, LearningCategory, GameTheme, Achievement, PowerUp } from './types';
import { generateQuestion, generateBalloons } from './balloonPopUtils';

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

const initialAchievements: Achievement[] = [
  {
    id: 'first_pop',
    name: 'First Pop!',
    description: 'Pop your first balloon',
    icon: '🎈',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 10
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Pop 20 balloons in 60 seconds',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    target: 20
  }
];

const initialPowerUps: PowerUp[] = [
  { type: 'slowTime', active: false, duration: 10, remaining: 0 },
  { type: 'targetHelper', active: false, duration: 15, remaining: 0 },
  { type: 'popAll', active: false, duration: 0, remaining: 0 },
  { type: 'doublePoints', active: false, duration: 20, remaining: 0 },
  { type: 'magnify', active: false, duration: 12, remaining: 0 },
  { type: 'extraTime', active: false, duration: 0, remaining: 0 },
  { type: 'shield', active: false, duration: 30, remaining: 0 }
];

const initialState: BalloonPopGameState = {
  balloons: [],
  currentQuestion: null,
  gameStats: {
    score: 0,
    level: 1,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    timeElapsed: 0,
    balloonsPoppedTotal: 0,
    powerUpsUsed: 0,
    highScore: 0,
    averageAccuracy: 0
  },
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  showInstructions: true,
  category: 'random',
  theme: 'white',
  gameMode: 'learning',
  soundEnabled: true,
  voiceEnabled: true,
  multiplayer: false,
  showFeedback: false,
  feedbackMessage: '',
  feedbackType: 'correct',
  achievements: initialAchievements,
  showAchievement: false,
  currentAchievement: null,
  difficulty: 'easy',
  timeLimit: 120,
  showHints: true,
  particles: true,
  showSettings: false,
  showAchievements: false,
  showLeaderboard: false,
  powerUps: initialPowerUps
};

function balloonPopReducer(state: BalloonPopGameState, action: any): BalloonPopGameState {
  switch (action.type) {
    case 'START_GAME':
      const newQuestion = generateQuestion(state.category, state.gameStats.level);
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        gameOver: false,
        showInstructions: false,
        currentQuestion: newQuestion,
        balloons: generateBalloons(state.category, state.gameStats.level, newQuestion),
        gameStats: { ...state.gameStats, timeElapsed: 0 }
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        isPaused: !state.isPaused
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        category: state.category,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        voiceEnabled: state.voiceEnabled,
        showInstructions: false
      };

    case 'UPDATE_BALLOONS':
      if (state.isPaused || !state.isPlaying) return state;
      
      const updatedBalloons = state.balloons
        .filter(balloon => balloon.y > -100 && !balloon.popped)
        .map(balloon => {
          const time = Date.now() * 0.001;
          
          return {
            ...balloon,
            y: balloon.y - balloon.speed,
            x: balloon.x + Math.sin(time + balloon.bobOffset) * 0.5,
            rotation: balloon.rotation + 0.5
          };
        });

      // Add new balloons more frequently (increased from 0.015 to 0.035)
      if (Math.random() < 0.035 && updatedBalloons.length < 10 && state.currentQuestion) {
        const newBalloon = generateBalloons(state.category, state.gameStats.level, state.currentQuestion)[0];
        if (newBalloon) {
          newBalloon.id = `balloon-${Date.now()}-${Math.random()}`;
          updatedBalloons.push(newBalloon);
        }
      }

      return { ...state, balloons: updatedBalloons };

    case 'POP_BALLOON':
      const balloon = state.balloons.find(b => b.id === action.balloonId);
      if (!balloon || !state.currentQuestion) return state;

      const isCorrect = state.currentQuestion.correctAnswers.includes(balloon.content);
      const newScore = isCorrect ? state.gameStats.score + 10 : Math.max(0, state.gameStats.score - 5);
      const newStreak = isCorrect ? state.gameStats.streak + 1 : 0;

      // Change mission immediately after popping correct balloon (reduced from 5 to 2)
      const shouldAdvance = isCorrect && (state.gameStats.correctAnswers + 1) % 2 === 0;
      const newLevel = shouldAdvance ? state.gameStats.level + 1 : state.gameStats.level;

      let nextQuestion = state.currentQuestion;
      let newBalloons = state.balloons;

      if (shouldAdvance) {
        nextQuestion = generateQuestion(state.category, newLevel);
        newBalloons = generateBalloons(state.category, newLevel, nextQuestion);
      }

      return {
        ...state,
        balloons: newBalloons.map(b => 
          b.id === action.balloonId ? { ...b, popped: true, popAnimation: true } : b
        ),
        currentQuestion: nextQuestion,
        gameStats: {
          ...state.gameStats,
          score: newScore,
          level: newLevel,
          correctAnswers: isCorrect ? state.gameStats.correctAnswers + 1 : state.gameStats.correctAnswers,
          wrongAnswers: isCorrect ? state.gameStats.wrongAnswers : state.gameStats.wrongAnswers + 1,
          streak: newStreak,
          balloonsPoppedTotal: state.gameStats.balloonsPoppedTotal + 1,
          averageAccuracy: state.gameStats.correctAnswers + state.gameStats.wrongAnswers > 0 
            ? Math.round((state.gameStats.correctAnswers / (state.gameStats.correctAnswers + state.gameStats.wrongAnswers)) * 100)
            : 0
        },
        showFeedback: true,
        feedbackMessage: isCorrect ? 'Great job! 🎉' : 'Try again! 💪',
        feedbackType: isCorrect ? 'correct' : 'incorrect'
      };

    case 'CHANGE_CATEGORY':
      const categoryQuestion = generateQuestion(action.category, state.gameStats.level);
      return { 
        ...state, 
        category: action.category,
        currentQuestion: state.isPlaying ? categoryQuestion : null,
        balloons: state.isPlaying ? generateBalloons(action.category, state.gameStats.level, categoryQuestion) : state.balloons
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
      if (!state.isPlaying || state.isPaused) return state;
      
      const newTimeElapsed = state.gameStats.timeElapsed + 1;
      const timeUp = newTimeElapsed >= state.timeLimit;
      
      return {
        ...state,
        gameStats: { ...state.gameStats, timeElapsed: newTimeElapsed },
        gameOver: timeUp,
        isPlaying: !timeUp
      };

    case 'HIDE_INSTRUCTIONS':
      return { ...state, showInstructions: false };
      
    case 'SHOW_INSTRUCTIONS':
      return { ...state, showInstructions: true };
      
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };
      
    case 'TOGGLE_ACHIEVEMENTS':
      return { ...state, showAchievements: !state.showAchievements };
      
    case 'UPDATE_SETTING':
      return { ...state, [action.payload.key]: action.payload.value };
      
    case 'USE_POWERUP':
      const powerUpType = action.payload;
      const updatedPowerUps = state.powerUps.map(powerUp => 
        powerUp.type === powerUpType && !powerUp.active
          ? { ...powerUp, active: true, remaining: powerUp.duration }
          : powerUp
      );
      
      return {
        ...state,
        powerUps: updatedPowerUps,
        gameStats: {
          ...state.gameStats,
          powerUpsUsed: state.gameStats.powerUpsUsed + 1
        }
      };

    case 'UPDATE_POWERUPS':
      if (state.isPaused || !state.isPlaying) return state;
      
      const decreasedPowerUps = state.powerUps.map(powerUp => {
        if (powerUp.active && powerUp.remaining > 0) {
          const newRemaining = powerUp.remaining - 1;
          return {
            ...powerUp,
            remaining: newRemaining,
            active: newRemaining > 0
          };
        }
        return powerUp;
      });

      return {
        ...state,
        powerUps: decreasedPowerUps
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

  // Enhanced game loop for smoother and faster balloon movement
  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;

    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_BALLOONS' });
    }, 30); // Increased to 33fps for smoother animation

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isPaused, state.category]);

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
