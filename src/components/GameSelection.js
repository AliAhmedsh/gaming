import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaTimes, 
  FaGamepad, 
  FaStar, 
  FaFire, 
  FaChess, 
  FaDice, 
  FaPuzzlePiece, 
  FaBrain,
  FaRandom
} from 'react-icons/fa';
import GameCard from './GameCard';
import LoadingSpinner from './LoadingSpinner';
import GAMES_CATALOG from '../games/gamesCatalog';
import '../styles/components/game-selection.css';

// Game categories with icons
const GAME_CATEGORIES = [
  { id: 'all', name: 'All Games', icon: <FaGamepad /> },
  { id: 'featured', name: 'Featured', icon: <FaStar /> },
  { id: 'popular', name: 'Popular', icon: <FaFire /> },
  { id: 'strategy', name: 'Strategy', icon: <FaChess /> },
  { id: 'puzzle', name: 'Puzzle', icon: <FaPuzzlePiece /> },
  { id: 'card', name: 'Card', icon: <FaDice /> },
  { id: 'brain', name: 'Brain Games', icon: <FaBrain /> },
];

const GameSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Set initial category from URL or default to 'all'
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Filter games based on selected category and search query
  const filteredGames = GAMES_CATALOG.filter(game => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      game.categories?.includes(selectedCategory) ||
      (selectedCategory === 'featured' && game.isFeatured) ||
      (selectedCategory === 'popular' && game.isPopular);
      
    const matchesSearch = 
      !searchQuery || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchParams({ category: categoryId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled reactively via state
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const playRandomGame = () => {
    const randomGame = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
    navigate(randomGame.path);
  };

  if (isLoading) {
    return (
      <div className="game-selection-loading">
        <LoadingSpinner />
        <p>Loading games...</p>
      </div>
    );
  }

  return (
    <div className="game-selection">
      <header className="game-selection-header">
        <h1>Game Library</h1>
        <p className="subtitle">Choose from our collection of fun and challenging games</p>
        
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search games"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="clear-search"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </form>
          
          <button 
            onClick={playRandomGame}
            className="random-game-button"
            aria-label="Play a random game"
          >
            <FaRandom />
            <span>Random Game</span>
          </button>
        </div>
      </header>
      
      <div className="category-filters">
        {GAME_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(category.id)}
            aria-current={selectedCategory === category.id ? 'true' : 'false'}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      
      <div className="game-results">
        <div className="results-header">
          <h2>
            {selectedCategory === 'all' 
              ? 'All Games' 
              : GAME_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Games'}
            {searchQuery && ` matching "${searchQuery}"`}
          </h2>
          <p className="results-count">{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found</p>
        </div>
        
        {filteredGames.length > 0 ? (
          <div className="game-grid">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <FaGamepad className="no-results-icon" />
            <h3>No games found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className="reset-filters"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSelection;
