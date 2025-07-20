import React, { useState, useEffect } from 'react';
import '../App.css';
import './WordScramble.css';

const WORDS = [
  { word: 'REACT', hint: 'A JavaScript library for building user interfaces' },
  { word: 'JAVASCRIPT', hint: 'A programming language used for web development' },
  { word: 'DEVELOPER', hint: 'A person who writes computer programs' },
  { word: 'COMPUTER', hint: 'An electronic device for storing and processing data' },
  { word: 'PROGRAMMING', hint: 'The process of creating software applications' },
  { word: 'ALGORITHM', hint: 'A step-by-step procedure for calculations' },
  { word: 'FUNCTION', hint: 'A block of code designed to perform a particular task' },
  { word: 'VARIABLE', hint: 'A container for storing data values' },
];

const WordScramble = ({ onBack, onGameComplete }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [hint, setHint] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Initialize game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setWordsCompleted(0);
    setShowHint(false);
    getNewWord();
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, gameOver]);

  // Check answer
  useEffect(() => {
    if (userInput.toUpperCase() === currentWord) {
      const timeBonus = Math.max(10, Math.floor(timeLeft / 3));
      const wordScore = currentWord.length * 10 + timeBonus;
      
      setScore(prev => prev + wordScore);
      setWordsCompleted(prev => prev + 1);
      setUserInput('');
      setShowHint(false);
      
      // Get a new word after a short delay
      setTimeout(() => {
        getNewWord();
      }, 800);
    }
  }, [userInput, currentWord]);

  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    const { word, hint: newHint } = WORDS[randomIndex];
    
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setHint(newHint);
  };

  const scrambleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;
    
    if (userInput.toUpperCase() === currentWord) {
      // Correct answer handled in useEffect
    } else {
      // Wrong answer feedback
      const inputElement = document.getElementById('wordInput');
      if (inputElement) {
        inputElement.classList.add('shake');
        setTimeout(() => {
          inputElement.classList.remove('shake');
        }, 500);
      }
      setUserInput('');
    }
  };

  const endGame = () => {
    setGameOver(true);
    onGameComplete(score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!gameStarted) {
    return (
      <div className="word-scramble-start">
        <h2>Word Scramble</h2>
        <p>Unscramble the letters to form a word!</p>
        <div className="game-instructions">
          <p>• Type the correct word and press Enter</p>
          <p>• Each correct word gives you points</p>
          <p>• Longer words are worth more points</p>
          <p>• Complete as many as you can in 60 seconds!</p>
        </div>
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="word-scramble-end">
        <h2>Game Over!</h2>
        <div className="final-stats">
          <p>Your Score: <span className="highlight">{score}</span></p>
          <p>Words Completed: <span className="highlight">{wordsCompleted}</span></p>
          <p>Time Remaining: <span className="highlight">{formatTime(timeLeft)}</span></p>
        </div>
        <div className="button-group">
          <button className="action-button" onClick={startGame}>
            Play Again
          </button>
          <button className="action-button secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="word-scramble-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat">Time: {formatTime(timeLeft)}</div>
          <div className="stat">Score: {score}</div>
          <div className="stat">Words: {wordsCompleted}</div>
        </div>
        <button className="hint-button" onClick={() => setShowHint(!showHint)}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      </div>

      <div className="scrambled-word">
        {scrambledWord.split('').map((letter, index) => (
          <span key={index} className="scrambled-letter">
            {letter}
          </span>
        ))}
      </div>

      {showHint && <div className="hint">Hint: {hint}</div>}

      <form onSubmit={handleSubmit} className="word-form">
        <input
          id="wordInput"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type the word..."
          autoComplete="off"
          autoFocus
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      <div className="word-length">
        Word Length: {currentWord.length} letters
      </div>
    </div>
  );
};

export default WordScramble;
