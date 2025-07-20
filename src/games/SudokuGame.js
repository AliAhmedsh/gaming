import React, { useState, useEffect, useCallback } from 'react';
import './SudokuGame.css';

const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const DIFFICULTY_LEVELS = {
  EASY: 0.5,
  MEDIUM: 0.6,
  HARD: 0.7,
};

const SudokuGame = ({ onBack, onGameComplete }) => {
  const emptyBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
  const [board, setBoard] = useState(emptyBoard);
  const [initialBoard, setInitialBoard] = useState(emptyBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hints, setHints] = useState(3);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate a solved Sudoku board
  const generateSolvedBoard = useCallback(() => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    
    // Fill the diagonal boxes
    const fillBox = (row, col) => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // Shuffle array
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      
      // Fill the 3x3 box
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          newBoard[row + i][col + j] = nums.pop();
        }
      }
    };
    
    // Fill diagonal boxes
    for (let i = 0; i < BOARD_SIZE; i += BOX_SIZE) {
      fillBox(i, i);
    }
    
    // Solve the rest of the board
    const solve = (board) => {
      const findEmpty = (board) => {
        for (let i = 0; i < BOARD_SIZE; i++) {
          for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) return [i, j];
          }
        }
        return null;
      };
      
      const isValid = (board, num, pos) => {
        // Check row
        for (let i = 0; i < BOARD_SIZE; i++) {
          if (board[pos[0]][i] === num && pos[1] !== i) return false;
        }
        
        // Check column
        for (let i = 0; i < BOARD_SIZE; i++) {
          if (board[i][pos[1]] === num && pos[0] !== i) return false;
        }
        
        // Check box
        const boxX = Math.floor(pos[1] / BOX_SIZE) * BOX_SIZE;
        const boxY = Math.floor(pos[0] / BOX_SIZE) * BOX_SIZE;
        
        for (let i = boxY; i < boxY + BOX_SIZE; i++) {
          for (let j = boxX; j < boxX + BOX_SIZE; j++) {
            if (board[i][j] === num && i !== pos[0] && j !== pos[1]) return false;
          }
        }
        
        return true;
      };
      
      const empty = findEmpty(board);
      if (!empty) return true;
      
      const [row, col] = empty;
      
      for (let i = 1; i <= 9; i++) {
        if (isValid(board, i, [row, col])) {
          board[row][col] = i;
          
          if (solve(board)) return true;
          
          board[row][col] = 0;
        }
      }
      
      return false;
    };
    
    solve(newBoard);
    return newBoard.map(row => [...row]);
  }, []);
  
  // Remove numbers to create the puzzle
  const createPuzzle = useCallback((solvedBoard, difficulty) => {
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = Math.floor(BOARD_SIZE * BOARD_SIZE * difficulty);
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }
    
    return puzzle;
  }, []);
  
  // Initialize the game
  const startNewGame = useCallback(() => {
    try {
      const solvedBoard = generateSolvedBoard();
      const puzzle = createPuzzle(solvedBoard, difficulty);
      
      setBoard(puzzle);
      setInitialBoard(puzzle.map(row => [...row]));
      setSelectedCell(null);
      setTimer(0);
      setIsPlaying(true);
      setIsComplete(false);
      setHints(3);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing game:', error);
      // Fallback to empty board if there's an error
      setBoard(emptyBoard);
      setInitialBoard(emptyBoard);
    }
  }, [generateSolvedBoard, createPuzzle, difficulty, emptyBoard]);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);
  
  // Check if the board is complete
  const checkCompletion = (board) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 0 || !isValidPlacement(board, board[i][j], [i, j])) {
          return false;
        }
      }
    }
    return true;
  };
  
  // Check if a number can be placed in a cell
  const isValidPlacement = (board, num, pos) => {
    // Check row
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[pos[0]][i] === num && pos[1] !== i) return false;
    }
    
    // Check column
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[i][pos[1]] === num && pos[0] !== i) return false;
    }
    
    // Check box
    const boxX = Math.floor(pos[1] / BOX_SIZE) * BOX_SIZE;
    const boxY = Math.floor(pos[0] / BOX_SIZE) * BOX_SIZE;
    
    for (let i = boxY; i < boxY + BOX_SIZE; i++) {
      for (let j = boxX; j < boxX + BOX_SIZE; j++) {
        if (board[i][j] === num && i !== pos[0] && j !== pos[1]) return false;
      }
    }
    
    return true;
  };
  
  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComplete || initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };
  
  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    
    setBoard(newBoard);
    
    if (checkCompletion(newBoard)) {
      setIsComplete(true);
      setIsPlaying(false);
      onGameComplete({
        time: timer,
        difficulty,
        hintsUsed: 3 - hints
      });
    }
  };
  
  // Handle hint
  const handleHint = () => {
    if (hints <= 0 || !selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;
    
    const solvedBoard = generateSolvedBoard();
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = solvedBoard[row][col];
    
    setBoard(newBoard);
    setHints(prev => prev - 1);
    
    if (checkCompletion(newBoard)) {
      setIsComplete(true);
      setIsPlaying(false);
      onGameComplete({
        time: timer,
        difficulty,
        hintsUsed: 3 - (hints - 1)
      });
    }
  };
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing your Sudoku game...</p>
      </div>
    );
  }

  return (
    <div className="sudoku-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat">Time: {formatTime(timer)}</div>
          <div className="stat">Hints: {hints}</div>
          <div className="stat">
            Difficulty: 
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(parseFloat(e.target.value))}
              disabled={isPlaying && !isComplete}
            >
              <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
              <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
              <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
            </select>
          </div>
        </div>
        <div className="actions">
          <button 
            className="hint-button" 
            onClick={handleHint}
            disabled={hints <= 0 || isComplete}
          >
            Hint ({hints})
          </button>
          <button className="new-game-button" onClick={startNewGame}>
            New Game
          </button>
        </div>
      </div>
      
      <div className="sudoku-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isInitial = initialBoard[rowIndex][colIndex] !== 0;
              const isInvalid = cell !== 0 && !isValidPlacement(board, cell, [rowIndex, colIndex]);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell 
                    ${isSelected ? 'selected' : ''} 
                    ${isInitial ? 'initial' : ''}
                    ${cell !== 0 && isInvalid ? 'invalid' : ''}
                    ${colIndex % 3 === 2 && colIndex < 8 ? 'border-right' : ''}
                    ${rowIndex % 3 === 2 && rowIndex < 8 ? 'border-bottom' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            className="number-button"
            onClick={() => handleNumberInput(num)}
            disabled={isComplete}
          >
            {num}
          </button>
        ))}
        <button 
          className="clear-button"
          onClick={() => selectedCell && handleNumberInput(0)}
          disabled={!selectedCell || isComplete}
        >
          Clear
        </button>
      </div>
      
      {isComplete && (
        <div className="game-complete">
          <h2>🎉 Puzzle Solved! 🎉</h2>
          <p>Time: {formatTime(timer)}</p>
          <p>Difficulty: {
            difficulty === DIFFICULTY_LEVELS.EASY ? 'Easy' :
            difficulty === DIFFICULTY_LEVELS.MEDIUM ? 'Medium' : 'Hard'
          }</p>
          <p>Hints used: {3 - hints}</p>
          <button className="play-again-button" onClick={startNewGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;
