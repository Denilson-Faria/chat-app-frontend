
import React from 'react';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  online = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border-2 border-gray-300 dark:border-gray-600`}
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`;
        }}
      />
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
      )}
    </div>
  );
};

export default Avatar;
