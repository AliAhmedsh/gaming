import React from 'react';
import { FaGamepad, FaTrophy, FaHome, FaCog, FaMoon, FaSun, FaStar, FaFire, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Enhanced Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus:ring-primary-500/50',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500/30 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-200 dark:text-gray-200 dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {iconPosition === 'left' && Icon && <Icon className="mr-2" />}
      {children}
      {iconPosition === 'right' && Icon && <Icon className="ml-2" />}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', hoverEffect = true, ...props }) => (
  <motion.div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
      hoverEffect ? 'hover:shadow-lg dark:hover:shadow-gray-700/50' : ''
    } ${className}`}
    whileHover={hoverEffect ? { y: -4 } : {}}
    {...props}
  >
    {children}
  </motion.div>
);

// Badge Component
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`animate-spin ${sizes[size]} ${className}`}>
      <svg
        className="text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Game Card Component
export const GameCard = ({ game, isFavorite, onFavoriteToggle, className = '' }) => {
  const difficultyColors = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger',
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden group ${className}`}>
      <div className="relative h-40 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        {/* Game Image or Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {game.icon || '🎮'}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle?.(game.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-yellow-400 hover:bg-white transition-all duration-200 z-10"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaStar className={isFavorite ? 'fill-current' : 'text-gray-300 hover:text-yellow-400'} />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant={difficultyColors[game.difficulty] || 'default'}>
            {game.difficulty}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="primary">
            {game.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {game.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {game.description}
        </p>
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-auto group-hover:scale-105 transition-transform"
          as="a"
          href={game.path}
        >
          Play Now
          <FaChevronRight className="ml-1.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

// Section Header Component
export const SectionHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 ${className}`}>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {action && <div className="mt-4 md:mt-0">{action}</div>}
  </div>
);

export default {
  Button,
  Card,
  Badge,
  LoadingSpinner,
  GameCard,
  SectionHeader,
};
