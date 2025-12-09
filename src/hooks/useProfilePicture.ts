import { useState, useEffect } from 'react';
import { getProfilePicture, uploadProfilePicture, deleteProfilePicture, getUserDetails } from '../api/route';

// Global cache to prevent multiple API calls
let cachedPictureUrl: string | null | undefined = undefined; // undefined = not fetched yet, null = no picture
let fetchPromise: Promise<void> | null = null;
const subscribers = new Set<(url: string | null, loading: boolean) => void>();

/**
 * Clear the profile picture cache - MUST be called on logout
 * to prevent old user's picture from showing when a new user logs in
 */
export const clearProfilePictureCache = () => {
  cachedPictureUrl = undefined;
  fetchPromise = null;
  // Notify all subscribers that cache was cleared
  subscribers.forEach(callback => callback(null, false));
};

// Helper to refresh user details in localStorage after profile picture changes
const refreshUserDetails = async () => {
  try {
    const userData = await getUserDetails();
    if (userData) {
      const userObject = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        balance: userData.balance,
        profile_picture_url: userData.profile_picture_url,
        passport_verification_status: userData.passport_verification_status,
        is_passport_uploaded: userData.is_passport_uploaded,
      };
      localStorage.setItem("userDetails", JSON.stringify(userObject));
      // Notify other components that user details have been updated
      window.dispatchEvent(new Event('userDetailsUpdated'));
    }
  } catch (error) {
    console.error('Failed to refresh user details:', error);
  }
};

const fetchPictureFromAPI = async () => {
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await getProfilePicture();
      const url = response.data?.profile_picture_url || null;
      cachedPictureUrl = url;

      // Notify all subscribers
      subscribers.forEach(callback => callback(url, false));
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch profile picture:', err);
      }
      cachedPictureUrl = null;
      subscribers.forEach(callback => callback(null, false));
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const useProfilePicture = () => {
  const [pictureUrl, setPictureUrl] = useState<string | null>(cachedPictureUrl === undefined ? null : cachedPictureUrl);
  const [loading, setLoading] = useState(cachedPictureUrl === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to updates
    const handleUpdate = (url: string | null, isLoading: boolean) => {
      setPictureUrl(url);
      setLoading(isLoading);
    };

    subscribers.add(handleUpdate);

    // Fetch if not cached
    if (cachedPictureUrl === undefined) {
      fetchPictureFromAPI();
    }

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  const fetchPicture = async () => {
    try {
      setLoading(true);
      await fetchPictureFromAPI();
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch profile picture');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadPicture = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const response = await uploadProfilePicture(file);
      // Backend returns: { message: "...", user: { ..., profile_picture_url: "..." } }
      const url = response.data?.user?.profile_picture_url || null;

      // Update cache and notify all subscribers
      cachedPictureUrl = url;
      subscribers.forEach(callback => callback(url, false));

      // Refresh user details in localStorage
      await refreshUserDetails();

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePicture = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteProfilePicture();

      // Update cache and notify all subscribers
      cachedPictureUrl = null;
      subscribers.forEach(callback => callback(null, false));

      // Refresh user details in localStorage
      await refreshUserDetails();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pictureUrl,
    loading,
    error,
    uploadPicture,
    deletePicture,
    refreshPicture: fetchPicture,
  };
};
