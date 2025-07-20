import React, { useState, Suspense, lazy, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaGamepad, FaHome, FaStar, FaFire, FaSearch, FaDice } from 'react-icons/fa';
import './App.css';
import './styles/theme/colors.css';
import './styles/theme/theme.css';
import './styles/components/navigation.css';
import './styles/components/layout.css';
import './styles/components/game-card.css';
import './styles/components/game-selection.css';
import './styles/components/home.css';
import GAMES_CATALOG from './games/gamesCatalog';
import LoadingSpinner from './components/LoadingSpinner';
import GameCard from './components/GameCard';
import GameSelection from './components/GameSelection';
import MemoryGame from './games/MemoryGame';
import WordScramble from './games/WordScramble';
import SudokuGame from './games/SudokuGame';
import NonogramGame from './games/NonogramGame';
import TowerOfHanoi from './games/TowerOfHanoi';
import TriviaGame from './games/TriviaGame';

// Theme Context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update the theme class on the root element
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add search functionality here
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="nav-container">
      <Link to="/" className="nav-brand">
        <FaGamepad className="nav-brand-icon" />
        <span className="nav-brand-text">GameHub</span>
      </Link>
      
      <nav className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaGamepad />
          <span>Games</span>
        </Link>
        
        <Link 
          to="/home" 
          className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/featured" 
          className={`nav-link ${location.pathname === '/featured' ? 'active' : ''}`}
        >
          <FaStar />
          <span>Featured</span>
        </Link>
        
        <Link 
          to="/trending" 
          className={`nav-link ${location.pathname === '/trending' ? 'active' : ''}`}
        >
          <FaFire />
          <span>Trending</span>
        </Link>
      </nav>
      
      <div className="nav-actions">
        <div className="search-container" ref={searchRef}>
          <button 
            className="search-toggle"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search games"
            type="button"
          >
            <FaSearch />
          </button>
          
          {showSearch && (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit" aria-label="Submit search">
                <FaSearch />
              </button>
            </form>
          )}
        </div>
        
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          type="button"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        <button 
          className="random-game-btn"
          onClick={() => {
            const randomGame = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
            navigate(randomGame.path);
          }}
          type="button"
        >
          <FaDice />
          <span>Random</span>
        </button>
      </div>
    </header>
  );
};

const gameComponents = {
  memory: MemoryGame,
  wordscramble: WordScramble,
  sudoku: SudokuGame,
  nonogram: NonogramGame,
  hanoi: TowerOfHanoi,
  trivia: TriviaGame
};

// Game Wrapper Component
const GameWrapper = ({ gameId }) => {
  const GameComponent = gameComponents[gameId];
  
  if (!GameComponent) {
    return (
      <div className="error-container">
        <p>Game not found. Please select a valid game.</p>
      </div>
    );
  }
  
  return <GameComponent />;
};

// Home Page Component
const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to GameHub</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover and play amazing games in one place. Choose from our collection of fun and challenging games!
        </p>
      </section>
      
      <section className="featured-games py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Games</h2>
          <div className="games-grid">
            {GAMES_CATALOG.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <GameSelection />
                </Suspense>
              } />
              <Route path="/home" element={<HomePage />} />
              {GAMES_CATALOG.map((game) => (
                <Route
                  key={game.path}
                  path={game.path}
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <GameWrapper gameId={game.id} />
                    </Suspense>
                  }
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p> 2023 GameHub. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
