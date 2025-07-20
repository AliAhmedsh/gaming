import React, { useState, useEffect, useCallback } from 'react';
import './TowerOfHanoi.css';

const TowerOfHanoi = ({ onBack, onGameComplete }) => {
  const [disks, setDisks] = useState([]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [level, setLevel] = useState(3); // 3 to 8 disks
  const [isAnimating, setIsAnimating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Initialize the game
  const initGame = useCallback(() => {
    // Create initial disks on the first rod
    const initialDisks = Array(3).fill().map((_, i) => ({
      size: i + 1,
      rod: 0,
      order: level - i,
      isMoving: false,
      color: getDiskColor(i, level)
    }));
    
    setDisks(initialDisks);
    setSelectedDisk(null);
    setMoves(0);
    setIsComplete(false);
    setTimer(0);
    setIsPlaying(false);
  }, [level]);
  
  // Initialize game on mount and when level changes
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);
  
  // Check for win condition
  useEffect(() => {
    if (disks.length === 0) return;
    
    // Check if all disks are on the last rod and in correct order
    const lastRod = 2; // 0-indexed, so rod 3 is index 2
    const disksOnLastRod = disks
      .filter(disk => disk.rod === lastRod)
      .sort((a, b) => a.order - b.order);
    
    if (disksOnLastRod.length === level && !isComplete) {
      // Verify the order is correct (decreasing size)
      const isInOrder = disksOnLastRod.every((disk, index, arr) => 
        index === 0 || disk.size < arr[index - 1].size
      );
      
      if (isInOrder) {
        setIsComplete(true);
        setIsPlaying(false);
        onGameComplete({
          moves,
          time: timer,
          level
        });
      }
    }
  }, [disks, level, isComplete, moves, timer, onGameComplete]);
  
  // Generate a color for the disk based on its size
  const getDiskColor = (index, total) => {
    const hue = (index * 360 / total) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  // Handle disk or rod click
  const handleDiskClick = (disk, diskIndex) => {
    if (isComplete || isAnimating) return;
    
    // If no disk is selected, select this one
    if (selectedDisk === null) {
      setSelectedDisk(diskIndex);
      return;
    }
    
    // If clicking the same disk, deselect it
    if (selectedDisk === diskIndex) {
      setSelectedDisk(null);
      return;
    }
    
    // If clicking another disk or rod
    const sourceDisk = disks[selectedDisk];
    const targetDisk = disk;
    
    // If clicking a disk on the same rod, select the new disk
    if (sourceDisk.rod === targetDisk.rod) {
      setSelectedDisk(diskIndex);
      return;
    }
    
    // Move the disk
    moveDisk(selectedDisk, targetDisk.rod);
  };
  
  // Handle rod click (empty space on a rod)
  const handleRodClick = (rodIndex) => {
    if (selectedDisk === null || isAnimating) return;
    
    const sourceDisk = disks[selectedDisk];
    
    // Can't place on the same rod
    if (sourceDisk.rod === rodIndex) {
      setSelectedDisk(null);
      return;
    }
    
    moveDisk(selectedDisk, rodIndex);
  };
  
  // Move a disk to a new rod
  const moveDisk = (diskIndex, targetRod) => {
    if (isAnimating) return;
    
    const disk = disks[diskIndex];
    const targetRodDisks = disks.filter(d => d.rod === targetRod);
    
    // Check if the move is valid
    if (targetRodDisks.length > 0) {
      const topDiskOnTarget = targetRodDisks.reduce((smallest, current) => 
        current.order < smallest.order ? current : smallest
      );
      
      if (disk.size > topDiskOnTarget.size) {
        // Invalid move - can't place a larger disk on a smaller one
        setSelectedDisk(null);
        return;
      }
    }
    
    // Start animation
    setIsAnimating(true);
    
    // Update disk position with animation
    setDisks(prevDisks => {
      const newDisks = [...prevDisks];
      const diskToMove = { ...newDisks[diskIndex] };
      
      // Find the highest order (visually lowest) available position on the target rod
      const maxOrder = Math.max(
        ...newDisks
          .filter(d => d.rod === targetRod)
          .map(d => d.order),
        -1 // Default if no disks on the rod
      );
      
      diskToMove.rod = targetRod;
      diskToMove.order = maxOrder + 1;
      diskToMove.isMoving = true;
      
      newDisks[diskIndex] = diskToMove;
      return newDisks;
    });
    
    // Complete the move after animation
    setTimeout(() => {
      setDisks(prevDisks => {
        const newDisks = [...prevDisks];
        newDisks[diskIndex].isMoving = false;
        return newDisks;
      });
      
      // Update moves and reset selection
      setMoves(prev => prev + 1);
      setSelectedDisk(null);
      
      // Start the game on first move
      if (!isPlaying) {
        setIsPlaying(true);
      }
      
      // Reset animation flag
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };
  
  // Change the number of disks
  const changeLevel = (newLevel) => {
    if (isAnimating) return;
    
    setLevel(prevLevel => {
      const updatedLevel = Math.max(3, Math.min(8, newLevel));
      if (updatedLevel !== prevLevel) {
        // Reset game with new level
        setTimeout(() => {
          setLevel(updatedLevel);
          initGame();
        }, 0);
      }
      return updatedLevel;
    });
  };
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get the minimum number of moves required to solve
  const getMinimumMoves = () => Math.pow(2, level) - 1;
  
  return (
    <div className="tower-of-hanoi">
      <div className="game-header">
        <div className="stats">
          <div className="stat">Moves: {moves} (Min: {getMinimumMoves()})</div>
          <div className="stat">Time: {formatTime(timer)}</div>
          <div className="stat">
            Disks: 
            <button 
              onClick={() => changeLevel(level - 1)}
              disabled={level <= 3 || isAnimating}
              className="level-button"
            >
              -
            </button>
            <span className="level-display">{level}</span>
            <button 
              onClick={() => changeLevel(level + 1)}
              disabled={level >= 8 || isAnimating}
              className="level-button"
            >
              +
            </button>
          </div>
        </div>
        <button 
          className="new-game-button" 
          onClick={initGame}
          disabled={isAnimating}
        >
          New Game
        </button>
      </div>
      
      <div className="game-board">
        {[0, 1, 2].map(rodIndex => {
          const rodDisks = disks
            .filter(disk => disk.rod === rodIndex)
            .sort((a, b) => b.order - a.order); // Sort by order (top to bottom)
          
          return (
            <div 
              key={rodIndex} 
              className="rod-container"
              onClick={() => handleRodClick(rodIndex)}
            >
              <div className="rod">
                {rodDisks.map((disk, index) => (
                  <div
                    key={disk.size}
                    className={`disk ${disk.isMoving ? 'moving' : ''} ${selectedDisk === disks.findIndex(d => d.size === disk.size && d.rod === disk.rod) ? 'selected' : ''}`}
                    style={{
                      width: `${(disk.size / level) * 80 + 20}%`,
                      backgroundColor: disk.color,
                      zIndex: disk.order,
                      transform: `translateY(${index * 20}px)`,
                      transition: disk.isMoving ? 'all 0.3s ease-in-out' : 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiskClick(disk, disks.findIndex(d => d.size === disk.size && d.rod === disk.rod));
                    }}
                  >
                    <span className="disk-size">{disk.size}</span>
                  </div>
                ))}
                <div className="rod-base"></div>
              </div>
              <div className="rod-label">Rod {rodIndex + 1}</div>
            </div>
          );
        })}
      </div>
      
      {isComplete && (
        <div className="game-complete">
          <div className="completion-message">
            <h2>🎉 Puzzle Solved! 🎉</h2>
            <p>Moves: {moves} (Minimum: {getMinimumMoves()})</p>
            <p>Time: {formatTime(timer)}</p>
            <p>Disks: {level}</p>
            <button 
              className="play-again-button"
              onClick={initGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TowerOfHanoi;
