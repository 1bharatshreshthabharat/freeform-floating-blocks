import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import ConnectTheDots from './ConnectTheDots/ConnectTheDots';

import SupermarketSort from './SupermarketSort/SupermarketSort';
import SortItRight from './SortItRight/SortItRight';

import BallSort from './BallSort/BallSort';
import BallSortBicolor from './BallSort/BallSortBicolor';

import BlocksFusion from './BlocksFusion/BlocksFusion';
import TrainSwitch from './TrainSwitch/TrainSwitch';

const GameRouter: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const renderGame = () => {
    switch (gameId) {
      case 'connect-dots':
        return <ConnectTheDots />;
      
      // Office Sorting Collection Routes
      case 'office-sorting':
        return <SortItRight />;
      case 'supermarket-sort':
        return <SupermarketSort />;
        
      
      // Ball Sorting Collection Routes
      case 'ball-sort':
        return <BallSort />;
      case 'bicolor-ball-sort':
        return <BallSortBicolor />;
      
      case 'blocks-fusion':
        return <BlocksFusion />;
      case 'train-switch':
        return <TrainSwitch />;
      
      default:
        return <Navigate to="/games" replace />;
    }
  };

  return renderGame();
};

export default GameRouter;
