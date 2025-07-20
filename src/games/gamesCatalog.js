// Game categories for better organization
export const GAME_CATEGORIES = {
  PUZZLE: 'Puzzle',
  STRATEGY: 'Strategy',
  CARD: 'Card',
  BOARD: 'Board',
  WORD: 'Word',
  MATH: 'Math',
  MEMORY: 'Memory',  
  TRIVIA: 'Trivia',
  ARCADE: 'Arcade',
  ADVENTURE: 'Adventure'
};

// Game difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

// Game catalog with metadata for each game
const GAMES_CATALOG = [
  // Memory Game
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards!',
    icon: '🧠',
    color: '#2196F3',
    category: GAME_CATEGORIES.MEMORY,
    difficulty: DIFFICULTY_LEVELS.EASY,
    path: '/memory',
    component: 'MemoryGame',
    tags: ['memory', 'cards', 'matching']
  },
  // Trivia Game
  {
    id: 'trivia',
    title: 'Trivia Challenge',
    description: 'Test your knowledge with fun trivia questions!',
    icon: '🎯',
    color: '#4CAF50',
    category: GAME_CATEGORIES.TRIVIA,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    path: '/trivia',
    component: 'TriviaGame',
    tags: ['trivia', 'knowledge', 'quiz']
  },
  // Word Scramble
  {
    id: 'wordscramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to form words!',
    icon: '🔤',
    color: '#9C27B0',
    category: GAME_CATEGORIES.WORD,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    path: '/wordscramble',
    component: 'WordScramble',
    tags: ['word', 'puzzle', 'vocabulary']
  },
  // Sudoku
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Fill the grid with numbers following Sudoku rules!',
    icon: '🔢',
    color: '#FF9800',
    category: GAME_CATEGORIES.PUZZLE,
    difficulty: DIFFICULTY_LEVELS.HARD,
    path: '/sudoku',
    component: 'SudokuGame',
    tags: ['puzzle', 'numbers', 'logic']
  },
  // Tower of Hanoi
  {
    id: 'hanoi',
    title: 'Tower of Hanoi',
    description: 'Move all disks to the last rod following the rules!',
    icon: '🗼',
    color: '#E91E63',
    category: GAME_CATEGORIES.PUZZLE,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    path: '/hanoi',
    component: 'TowerOfHanoi',
    tags: ['puzzle', 'towers', 'strategy']
  },
  // Nonogram
  {
    id: 'nonogram',
    title: 'Nonogram',
    description: 'Solve picture cross puzzles using number clues!',
    icon: '🖼️',
    color: '#00BCD4',
    category: GAME_CATEGORIES.PUZZLE,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    path: '/nonogram',
    component: 'NonogramGame',
    tags: ['puzzle', 'picture', 'logic'],
    isNew: true
  }
];

export default GAMES_CATALOG;
