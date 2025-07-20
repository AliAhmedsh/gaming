import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#3498db' }) => {
  const sizeMap = {
    small: '1.5rem',
    medium: '2.5rem',
    large: '4rem'
  };

  return (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner" 
        style={{
          width: sizeMap[size] || sizeMap.medium,
          height: sizeMap[size] || sizeMap.medium,
          borderColor: `${color} transparent transparent transparent`
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
