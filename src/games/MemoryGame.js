import React, { useState, useEffect } from 'react';
import '../App.css';
import './MemoryGame.css';

const CARD_SYMBOLS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryGame = ({ onBack, onGameComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isPlaying && !gameComplete) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isPlaying && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameComplete]);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      
      // Check if cards match
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Update solved cards with both card IDs
        const newSolved = [...solved, cards[firstIndex].id, cards[secondIndex].id];
        setSolved(newSolved);
        setFlipped([]);
        
        // Check if game is complete (all pairs found)
        if (newSolved.length === cards.length) {
          setGameComplete(true);
          setIsPlaying(false);
          onGameComplete(calculateScore());
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
      // Increment move counter
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flipped, cards, solved, onGameComplete]);

  const startNewGame = () => {
    // Create pairs of cards
    const cardPairs = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
      .map((symbol, index) => ({
        id: index,
        symbol,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(cardPairs);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setTimer(0);
    setGameComplete(false);
    setIsPlaying(true);
  };

  const handleCardClick = (index) => {
    // Don't allow flipping if:
    // 1. Card is already flipped or matched
    // 2. Two cards are already flipped (waiting for match check)
    // 3. Game is complete
    if (
      flipped.includes(index) || 
      solved.includes(cards[index].id) || 
      flipped.length === 2 ||
      gameComplete
    ) {
      return;
    }

    // Start the game on first move
    if (!isPlaying && flipped.length === 0) {
      setIsPlaying(true);
    }

    // Flip the card
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
  };

  const calculateScore = () => {
    // Higher score is better (more matches with fewer moves and less time)
    const timeBonus = Math.max(0, 100 - timer * 2);
    const movesBonus = Math.max(0, 100 - moves * 5);
    return Math.floor((timeBonus + movesBonus) / 2);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat">Time: {formatTime(timer)}</div>
          <div className="stat">Moves: {moves}</div>
          <div className="stat">Matches: {solved.length / 2} / {CARD_SYMBOLS.length}</div>
        </div>
        <button className="new-game-btn" onClick={startNewGame}>
          New Game
        </button>
      </div>

      {gameComplete ? (
        <div className="game-complete">
          <h2>🎉 Game Complete! 🎉</h2>
          <p>You finished in {moves} moves and {formatTime(timer)}!</p>
          <p>Your score: {calculateScore()}</p>
          <button className="play-again-btn" onClick={startNewGame}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="game-board">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index);
            const isMatched = solved.includes(card.id);
            const isActive = isFlipped || isMatched;
            
            return (
              <div
                key={index}
                className={`memory-card ${isActive ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
                aria-label={isMatched ? `Matched card: ${card.symbol}` : `Card ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleCardClick(index)}
              >
                <div className="card-front">
                  <span className="card-symbol" aria-hidden="true">?</span>
                </div>
                <div className="card-back">
                  <span className="card-symbol" aria-hidden="true">{card.symbol}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
