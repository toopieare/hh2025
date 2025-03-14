import React from 'react';

const Button = ({ children, onClick, disabled, className }) => {
  return (
    <button 
      className={`app-button ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;