
import React, { useEffect } from 'react';
import { useWordWonders } from './WordWondersProvider';

export const WordWondersGameTimer: React.FC = () => {
  const { state, dispatch } = useWordWonders();

  useEffect(() => {
    if (state.isGameActive && state.timeLeft > 0 && !state.isPaused && !state.isComplete) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.isGameActive, state.timeLeft, state.isPaused, state.isComplete, dispatch]);

  // Handle game over when time runs out
  useEffect(() => {
    if (state.timeLeft === 0 && state.lives > 0) {
      dispatch({ type: 'LOSE_LIFE' });
      if (state.lives <= 1) {
        dispatch({ type: 'GAME_OVER' });
      } else {
        // Reset timer for next life
        dispatch({ type: 'RESET_TIMER' });
      }
    }
  }, [state.timeLeft, state.lives, dispatch]);

  return null;
};
