/**
 * Authentication utilities for handling JWT tokens and user data
 */

interface JWTPayload {
  user_id?: number;
  id?: number;
  username?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token to extract user information
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Failed to decode JWT
    return null;
  }
};

/**
 * Extract and store user ID from JWT token
 */
export const setUserIdFromToken = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (payload) {
    // Try different possible field names for user ID
    const userId = payload.user_id || payload.id || payload.sub;
    if (userId) {
      localStorage.setItem('user_id', userId.toString());
      return userId;
    }
  }
  return null;
};

/**
 * Get current user ID from localStorage
 */
export const getCurrentUserId = (): number => {
  const userId = localStorage.getItem('user_id');
  return userId ? parseInt(userId, 10) : 0;
};

/**
 * Store user details after login
 */
export const storeUserDetails = async () => {
  // Always derive user_id from the access token first. This guarantees
  // getCurrentUserId() works even if the /users/me request is slow or fails
  // (e.g. cold backend), instead of depending on the network round-trip.
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    setUserIdFromToken(accessToken);
  }

  try {
    const { getUserDetails } = await import('../api/route');
    const userDetails = await getUserDetails();

    if (userDetails) {
      // Store user ID
      if (userDetails.id) {
        localStorage.setItem('user_id', userDetails.id.toString());
      }
      
      // Store username if available
      if (userDetails.username) {
        localStorage.setItem('username', userDetails.username);
      }
      
      // Store email if available
      if (userDetails.email) {
        localStorage.setItem('user_email', userDetails.email);
      }
      
      // Store full user details
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      
      return userDetails;
    } else {
      // No user details returned from backend
    }
  } catch (error) {
    // Failed to store user details - try fallback
    const token = localStorage.getItem('access');
    if (token) {
      setUserIdFromToken(token);
    }
  }
  
  return null;
};

const AUTH_PERSIST_KEY = 'auth_persist';

/**
 * Store auth tokens honoring the "Remember me" choice.
 * - remember=true  → localStorage (persists across browser restarts)
 * - remember=false → sessionStorage (cleared when the tab/browser closes)
 * The other store is cleared to avoid stale tokens lingering.
 */
export const setAuthTokens = (access: string, refresh: string, remember: boolean) => {
  const primary = remember ? localStorage : sessionStorage;
  const secondary = remember ? sessionStorage : localStorage;
  secondary.removeItem('access');
  secondary.removeItem('refresh');
  primary.setItem('access', access);
  primary.setItem('refresh', refresh);
  localStorage.setItem(AUTH_PERSIST_KEY, remember ? '1' : '0');
};

/** Read the access token from whichever store currently holds it. */
export const getAccessToken = (): string | null =>
  localStorage.getItem('access') || sessionStorage.getItem('access');

/** Read the refresh token from whichever store currently holds it. */
export const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh') || sessionStorage.getItem('refresh');

/** Whether the current session was started with "Remember me" enabled. */
export const isAuthPersistent = (): boolean => localStorage.getItem(AUTH_PERSIST_KEY) !== '0';

/**
 * Clear all user data from storage and caches
 * MUST be called on logout to prevent data leaking between user sessions
 */
export const clearUserData = async () => {
  // Clear localStorage
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('user_email');
  localStorage.removeItem('email');
  localStorage.removeItem('userDetails');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('jwt_token'); // Support backend specification
  localStorage.removeItem(AUTH_PERSIST_KEY);
  // Also clear session-scoped tokens (used when "Remember me" is off)
  sessionStorage.removeItem('access');
  sessionStorage.removeItem('refresh');

  // Clear profile picture cache to prevent old user's picture from showing
  const { clearProfilePictureCache } = await import('../hooks/useProfilePicture');
  clearProfilePictureCache();

  // Dispatch logout event so components can react (e.g., ChatContext can clear state)
  window.dispatchEvent(new Event('userLoggedOut'));
};

/**
 * Get JWT token from storage (supporting both jwt_token and access keys)
 */
export const getJWTToken = (): string | null => {
  return localStorage.getItem('jwt_token') || getAccessToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getJWTToken();
  if (!token) return false;
  
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false;
  
  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
};