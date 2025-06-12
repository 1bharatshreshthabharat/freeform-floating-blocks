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
  },
  {
    id: 'perfect_level',
    name: 'Perfect Level',
    description: 'Complete a level with 100% accuracy',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'powerup_master',
    name: 'Power-up Master',
    description: 'Use 25 power-ups',
    icon: '💪',
    unlocked: false,
    progress: 0,
    target: 25
  },
  {
    id: 'time_champion',
    name: 'Time Champion',
    description: 'Win 5 time challenge games',
    icon: '⏰',
    unlocked: false,
    progress: 0,
    target: 5
  },
  {
    id: 'category_expert',
    name: 'Category Expert',
    description: 'Master all learning categories',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    target: 9
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Play 10 multiplayer games',
    icon: '👥',
    unlocked: false,
    progress: 0,
    target: 10
  },
  {
    id: 'explorer',
    name: 'World Explorer',
    description: 'Play in all 8 themes',
    icon: '🗺️',
    unlocked: false,
    progress: 0,
    target: 8
  },
  {
    id: 'persistent',
    name: 'Never Give Up',
    description: 'Play for 100 total minutes',
    icon: '💎',
    unlocked: false,
    progress: 0,
    target: 6000
  }
];

const initialPowerUps: PowerUp[] = [
  { type: 'slowTime', active: false, duration: 10, remaining: 0 },
  { type: 'targetHelper', active: false, duration: 15, remaining: 0 },
  { type: 'popAll', active: false, duration: 0, remaining: 0 },
  { type: 'doublePoints', active: false, duration: 30, remaining: 0 },
  { type: 'magnify', active: false, duration: 20, remaining: 0 },
  { type: 'extraTime', active: false, duration: 0, remaining: 0 },
  { type: 'shield', active: false, duration: 45, remaining: 0 }
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
  category: 'letters',
  theme: 'rainbow',
  gameMode: 'learning',
  soundEnabled: true,
  voiceEnabled: true,
  multiplayer: false,
  showFeedback: false,
  feedbackMessage: '',
  feedbackType: 'correct',
  powerUps: initialPowerUps,
  achievements: initialAchievements,
  showAchievement: false,
  currentAchievement: null,
  difficulty: 'easy',
  timeLimit: 120,
  showHints: true,
  particles: true,
  showSettings: false,
  showAchievements: false,
  showLeaderboard: false
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
        balloons: generateBalloons(state.category, state.gameStats.level)
      };

    case 'UPDATE_BALLOONS':
      const updatedBalloons = state.balloons
        .filter(balloon => balloon.y > -100 && !balloon.popped)
        .map(balloon => {
          const time = Date.now() * 0.003;
          const slowTimeMultiplier = state.powerUps.find(p => p.type === 'slowTime' && p.active) ? 0.3 : 1;
          const magnifyMultiplier = state.powerUps.find(p => p.type === 'magnify' && p.active) ? 1.5 : 1;
          
          return {
            ...balloon,
            y: balloon.y - (balloon.speed * slowTimeMultiplier),
            x: balloon.x + Math.sin(time + balloon.bobOffset) * 0.8,
            rotation: balloon.rotation + 1,
            size: balloon.size * magnifyMultiplier
          };
        });

      // Add new balloons periodically
      if (Math.random() < 0.02 && updatedBalloons.length < 8) {
        const newBalloon = generateBalloons(state.category, state.gameStats.level)[0];
        if (newBalloon) {
          newBalloon.id = `balloon-${Date.now()}-${Math.random()}`;
          updatedBalloons.push(newBalloon);
        }
      }

      return { ...state, balloons: updatedBalloons };

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
          streak: newStreak,
          balloonsPoppedTotal: state.gameStats.balloonsPoppedTotal + 1
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
      const categoryQuestion = generateQuestion(action.category, state.gameStats.level);
      return { 
        ...state, 
        category: action.category,
        currentQuestion: state.isPlaying ? categoryQuestion : null,
        balloons: state.isPlaying ? generateBalloons(action.category, state.gameStats.level) : state.balloons
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

    case 'HIDE_INSTRUCTIONS':
      return { ...state, showInstructions: false };
      
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };
      
    case 'TOGGLE_ACHIEVEMENTS':
      return { ...state, showAchievements: !state.showAchievements };
      
    case 'UPDATE_SETTING':
      return { ...state, [action.payload.key]: action.payload.value };
      
    case 'USE_POWERUP':
      return {
        ...state,
        powerUps: state.powerUps.map(powerUp =>
          powerUp.type === action.payload && !powerUp.active
            ? { ...powerUp, active: true, remaining: powerUp.duration }
            : powerUp
        ),
        gameStats: {
          ...state.gameStats,
          powerUpsUsed: state.gameStats.powerUpsUsed + 1
        }
      };
      
    case 'UPDATE_POWERUPS':
      return {
        ...state,
        powerUps: state.powerUps.map(powerUp =>
          powerUp.active
            ? {
                ...powerUp,
                remaining: Math.max(0, powerUp.remaining - 1),
                active: powerUp.remaining > 1
              }
            : powerUp
        )
      };
      
    case 'CHECK_ACHIEVEMENTS':
      const updatedAchievements = state.achievements.map(achievement => {
        let newProgress = achievement.progress;
        
        switch (achievement.id) {
          case 'first_pop':
            newProgress = state.gameStats.balloonsPoppedTotal > 0 ? 1 : 0;
            break;
          case 'streak_master':
            newProgress = Math.max(newProgress, state.gameStats.streak);
            break;
          case 'powerup_master':
            newProgress = state.gameStats.powerUpsUsed;
            break;
          // Add more achievement logic here
        }
        
        return {
          ...achievement,
          progress: Math.min(newProgress, achievement.target),
          unlocked: newProgress >= achievement.target
        };
      });
      
      return { ...state, achievements: updatedAchievements };
      
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

  // Enhanced game loop for smooth balloon movement
  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;

    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_BALLOONS' });
    }, 32); // ~60fps for smooth animation

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isPaused, state.category, state.powerUps]);

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
