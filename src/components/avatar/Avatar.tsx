import React from 'react';
import './Avatar.scss';

interface AvatarProps {
  firstName: string;
  lastName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Map letters to colors for consistent avatar colors
const getColorFromLetter = (letter: string): string => {
  const colors: { [key: string]: string } = {
    'A': '#FF6B6B', 'B': '#4ECDC4', 'C': '#45B7D1', 'D': '#FFA07A',
    'E': '#98D8C8', 'F': '#F7DC6F', 'G': '#BB8FCE', 'H': '#85C1E2',
    'I': '#F8B739', 'J': '#52BE80', 'K': '#EC7063', 'L': '#AF7AC5',
    'M': '#5DADE2', 'N': '#48C9B0', 'O': '#F4D03F', 'P': '#EB984E',
    'Q': '#DC7633', 'R': '#A569BD', 'S': '#5499C7', 'T': '#45B39D',
    'U': '#F39C12', 'V': '#E74C3C', 'W': '#9B59B6', 'X': '#3498DB',
    'Y': '#1ABC9C', 'Z': '#F1C40F'
  };

  const upperLetter = letter.toUpperCase();
  return colors[upperLetter] || '#95A5A6';
};

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  size = 'medium',
  className = ''
}) => {
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName ? lastName.charAt(0).toUpperCase() : ''}`;
  const backgroundColor = getColorFromLetter(firstName.charAt(0));

  return (
    <div
      className={`avatar avatar--${size} ${className}`}
      style={{ backgroundColor }}
    >
      <span className="avatar__initials">{initials}</span>
    </div>
  );
};
