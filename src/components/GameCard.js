import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="game-card-content">
        <div className="game-icon">
          {game.icon || <FaGamepad className="text-3xl text-primary-500" />}
        </div>
        <h3 className="game-title">{game.name}</h3>
        <p className="game-description">{game.description}</p>
        <div className="game-footer">
          <span className="game-category">{game.category}</span>
          <Link to={game.path} className="game-card-play-btn">
            Play Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
