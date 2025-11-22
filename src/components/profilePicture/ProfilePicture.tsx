import React, { useRef, useEffect } from 'react';
import { useProfilePicture } from '../../hooks/useProfilePicture';
import { Button } from '../button/Button';
import './ProfilePicture.scss';

interface ProfilePictureProps {
  onUpdate?: (pictureUrl: string | null) => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ onUpdate }) => {
  const {
    pictureUrl,
    loading,
    error,
    uploadPicture,
    deletePicture,
  } = useProfilePicture();

  // Notify parent component when picture URL changes
  useEffect(() => {
    onUpdate?.(pictureUrl);
  }, [pictureUrl, onUpdate]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      await uploadPicture(file);
      // The hook will update pictureUrl, which triggers useEffect to call onUpdate
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      await deletePicture();
      // The hook will update pictureUrl to null, which triggers useEffect to call onUpdate
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-[1.6rem]">
      <div className="relative">
        {loading ? (
          <div className="w-[12rem] h-[12rem] rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-[1.4rem] text-gray-500">Loading...</span>
          </div>
        ) : pictureUrl ? (
          <img
            src={pictureUrl}
            alt="Profile"
            className="w-[12rem] h-[12rem] rounded-full object-cover border-4 border-gray-200"
            onError={() => {}}
          />
        ) : (
          <div className="w-[12rem] h-[12rem] rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[1.4rem] text-gray-500">No Photo</span>
          </div>
        )}
      </div>

      <div className="flex gap-[1.2rem]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          title={pictureUrl ? 'Change Photo' : 'Upload Photo'}
          type="primary"
          handleClick={triggerFileInput}
          disabled={loading}
        />

        {pictureUrl && (
          <Button
            title="Delete Photo"
            type="secondary"
            handleClick={handleDelete}
            disabled={loading}
          />
        )}
      </div>

      {error && (
        <div className="text-red-500 text-[1.4rem]">{error}</div>
      )}
    </div>
  );
};
