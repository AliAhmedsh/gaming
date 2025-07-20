import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './NonogramGame.css';

// Game constants
const BOARD_SIZES = {
  SMALL: { rows: 5, cols: 5 },
  MEDIUM: { rows: 10, cols: 10 },
  LARGE: { rows: 15, cols: 15 }
};

const NonogramGame = ({ onBack, onGameComplete }) => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [boardSize, setBoardSize] = useState(BOARD_SIZES.MEDIUM);
  const [selectedTool, setSelectedTool] = useState('fill'); // 'fill' or 'mark'
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const navigate = useNavigate();

  // Generate a random nonogram solution
  const generateSolution = useCallback(() => {
    const { rows, cols } = boardSize;
    const newSolution = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        // 60% chance of a cell being filled (adjust for difficulty)
        row.push(Math.random() < 0.6 ? 1 : 0);
      }
      newSolution.push(row);
    }
    
    return newSolution;
  }, [boardSize]);

  // Generate hints for rows and columns
  const generateHints = useCallback((solution) => {
    const { rows, cols } = boardSize;
    const newRowHints = [];
    const newColHints = [];
    
    // Generate row hints
    for (let i = 0; i < rows; i++) {
      const hints = [];
      let count = 0;
      
      for (let j = 0; j < cols; j++) {
        if (solution[i][j] === 1) {
          count++;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      }
      
      if (count > 0 || hints.length === 0) {
        hints.push(count);
      }
      
      newRowHints.push(hints);
    }
    
    // Generate column hints
    for (let j = 0; j < cols; j++) {
      const hints = [];
      let count = 0;
      
      for (let i = 0; i < rows; i++) {
        if (solution[i][j] === 1) {
          count++;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      }
      
      if (count > 0 || hints.length === 0) {
        hints.push(count);
      }
      
      newColHints.push(hints);
    }
    
    return { rowHints: newRowHints, colHints: newColHints };
  }, [boardSize]);

  // Initialize the game board
  const initGame = useCallback(() => {
    const { rows, cols } = boardSize;
    const newSolution = generateSolution();
    const { rowHints, colHints } = generateHints(newSolution);
    
    // Create empty board (0 = empty, 1 = filled, -1 = marked)
    const newBoard = Array(rows).fill().map(() => Array(cols).fill(0));
    
    setBoard(newBoard);
    setSolution(newSolution);
    setRowHints(rowHints);
    setColHints(colHints);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsComplete(false);
    setShowTutorial(false);
  }, [boardSize, generateSolution, generateHints]);

  // Check if the board is complete
  const checkCompletion = useCallback((currentBoard) => {
    if (!solution.length) return false;
    
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution[0].length; j++) {
        // Only check cells that should be filled (1)
        if (solution[i][j] === 1 && currentBoard[i][j] !== 1) {
          return false;
        }
      }
    }
    
    return true;
  }, [solution]);

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComplete || !isPlaying) return;
    
    const newBoard = board.map(r => [...r]);
    
    // Toggle between empty and filled/marked based on selected tool
    if (selectedTool === 'fill') {
      newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1;
    } else {
      // Mark as X (or empty if already marked)
      newBoard[row][col] = newBoard[row][col] === -1 ? 0 : -1;
    }
    
    setBoard(newBoard);
    setMoves(prev => prev + 1);
    
    // Check if the puzzle is complete
    if (checkCompletion(newBoard)) {
      setIsComplete(true);
      setIsPlaying(false);
      onGameComplete({
        moves,
        time: timer,
        size: `${boardSize.rows}x${boardSize.cols}`
      });
    }
  };

  // Change board size
  const changeBoardSize = (size) => {
    setBoardSize(BOARD_SIZES[size]);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  // Initialize game on mount and when board size changes
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render the game board
  const renderBoard = () => {
    return (
      <div className="nonogram-container">
        {/* Column Hints */}
        <div className="hints-column">
          <div className="corner"></div>
          {colHints.map((hints, colIndex) => (
            <div key={`col-${colIndex}`} className="hint-cell col-hint">
              {hints.map((hint, i) => (
                <div key={i} className="hint-number">{hint}</div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="board-section">
          {/* Row Hints */}
          <div className="hints-row">
            {rowHints.map((hints, rowIndex) => (
              <div key={`row-${rowIndex}`} className="hint-cell row-hint">
                {hints.map((hint, i) => (
                  <div key={i} className="hint-number">{hint}</div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Game Board */}
          <div 
            className="nonogram-board" 
            style={{
              '--rows': boardSize.rows,
              '--cols': boardSize.cols
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell 
                    ${cell === 1 ? 'filled' : ''} 
                    ${cell === -1 ? 'marked' : ''}
                    ${(rowIndex + 1) % 5 === 0 ? 'thick-bottom' : ''}
                    ${(colIndex + 1) % 5 === 0 ? 'thick-right' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedTool(selectedTool === 'fill' ? 'mark' : 'fill');
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render the controls
  const renderControls = () => (
    <div className="game-controls">
      <div className="tool-selector">
        <button
          className={`tool-button ${selectedTool === 'fill' ? 'active' : ''}`}
          onClick={() => setSelectedTool('fill')}
          title="Fill cell (Left Click)"
        >
          Fill
        </button>
        <button
          className={`tool-button ${selectedTool === 'mark' ? 'active' : ''}`}
          onClick={() => setSelectedTool('mark')}
          title="Mark cell (Right Click)"
        >
          Mark
        </button>
      </div>
      
      <div className="size-selector">
        <span>Size: </span>
        <button 
          className={`size-button ${boardSize === BOARD_SIZES.SMALL ? 'active' : ''}`}
          onClick={() => changeBoardSize('SMALL')}
        >
          5x5
        </button>
        <button 
          className={`size-button ${boardSize === BOARD_SIZES.MEDIUM ? 'active' : ''}`}
          onClick={() => changeBoardSize('MEDIUM')}
        >
          10x10
        </button>
        <button 
          className={`size-button ${boardSize === BOARD_SIZES.LARGE ? 'active' : ''}`}
          onClick={() => changeBoardSize('LARGE')}
        >
          15x15
        </button>
      </div>
      
      <div className="game-stats">
        <div className="stat">Moves: {moves}</div>
        <div className="stat">Time: {formatTime(timer)}</div>
      </div>
      
      <div className="game-actions">
        <button className="action-button" onClick={initGame}>
          New Game
        </button>
        <button 
          className="action-button" 
          onClick={() => setShowTutorial(true)}
          title="Show Tutorial"
        >
          Help
        </button>
        <button 
          className="action-button back-button" 
          onClick={onBack || (() => navigate('/'))}
        >
          Back to Games
        </button>
      </div>
    </div>
  );

  // Render the tutorial modal
  const renderTutorial = () => (
    <div className="tutorial-modal">
      <div className="tutorial-content">
        <h2>How to Play Nonogram</h2>
        <div className="tutorial-section">
          <h3>Objective</h3>
          <p>Fill in the grid to reveal a hidden picture based on the number clues.</p>
        </div>
        
        <div className="tutorial-section">
          <h3>Rules</h3>
          <ul>
            <li>The numbers on the sides and top indicate groups of consecutive filled squares.</li>
            <li>Each group is separated by at least one empty square.</li>
            <li>Mark empty squares with an X to keep track of them.</li>
          </ul>
        </div>
        
        <div className="tutorial-section">
          <h3>Controls</h3>
          <ul>
            <li><strong>Left Click:</strong> Fill a square</li>
            <li><strong>Right Click:</strong> Mark a square as empty</li>
            <li>Or use the tool buttons at the top</li>
          </ul>
        </div>
        
        <button 
          className="close-tutorial"
          onClick={() => setShowTutorial(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  );

  // Render the completion screen
  const renderCompletion = () => (
    <div className="completion-screen">
      <h2>🎉 Puzzle Complete! 🎉</h2>
      <p>You solved the puzzle in {moves} moves!</p>
      <p>Time: {formatTime(timer)}</p>
      <div className="completion-actions">
        <button className="action-button" onClick={initGame}>
          Play Again
        </button>
        <button 
          className="action-button" 
          onClick={() => setShowTutorial(true)}
        >
          Show Tutorial
        </button>
        <button 
          className="action-button back-button" 
          onClick={onBack || (() => navigate('/'))}
        >
          Back to Games
        </button>
      </div>
    </div>
  );

  return (
    <div className="nonogram-game">
      <h1>Nonogram</h1>
      
      {renderControls()}
      
      <div className="game-area">
        {showTutorial ? renderTutorial() : 
         isComplete ? renderCompletion() : renderBoard()}
      </div>
    </div>
  );
};

export default NonogramGame;
