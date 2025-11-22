import React, { useRef } from 'react';
import './Avatar.scss';

interface AvatarProps {
  firstName: string;
  lastName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  profilePictureUrl?: string | null;
  editable?: boolean;
  onImageUpload?: (file: File) => void;
  loading?: boolean;
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
  className = '',
  profilePictureUrl = null,
  editable = false,
  onImageUpload,
  loading = false
}) => {
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName ? lastName.charAt(0).toUpperCase() : ''}`;
  const backgroundColor = getColorFromLetter(firstName.charAt(0));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    onImageUpload?.(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`avatar avatar--${size} ${className} ${editable ? 'avatar--editable' : ''} ${loading ? 'avatar--loading' : ''}`}
      style={!profilePictureUrl ? { backgroundColor } : undefined}
      onClick={handleClick}
    >
      {loading ? (
        <div className="avatar__loading" />
      ) : profilePictureUrl ? (
        <>
          <img
            src={profilePictureUrl}
            alt={`${firstName} ${lastName || ''}`}
            className="avatar__image"
          />
          {editable && (
            <div className="avatar__overlay">
              <span className="avatar__edit-icon">📷</span>
            </div>
          )}
        </>
      ) : (
        <>
          <span className="avatar__initials">{initials}</span>
          {editable && (
            <div className="avatar__overlay">
              <span className="avatar__edit-icon">📷</span>
            </div>
          )}
        </>
      )}

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="avatar__file-input"
        />
      )}
    </div>
  );
};
