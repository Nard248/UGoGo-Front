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
    console.error('Failed to decode JWT:', error);
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
  try {
    const { getUserDetails } = await import('../api/route');
    const userDetails = await getUserDetails();
    
    if (userDetails) {
      console.log('✅ Storing user details:', userDetails);
      
      // Store user ID
      if (userDetails.id) {
        localStorage.setItem('user_id', userDetails.id.toString());
        console.log('✅ Stored user_id:', userDetails.id);
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
      console.error('❌ No user details returned from backend');
    }
  } catch (error) {
    console.error('Failed to store user details:', error);
    
    // Fallback: try to extract user ID from JWT token
    const token = localStorage.getItem('access');
    if (token) {
      console.log('🔄 Trying fallback: extracting user ID from JWT');
      const userId = setUserIdFromToken(token);
      if (userId) {
        console.log('✅ Fallback success: user_id =', userId);
      }
    }
  }
  
  return null;
};

/**
 * Clear all user data from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('user_email');
  localStorage.removeItem('userDetails');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('jwt_token'); // Support backend specification
};

/**
 * Get JWT token from storage (supporting both jwt_token and access keys)
 */
export const getJWTToken = (): string | null => {
  return localStorage.getItem('jwt_token') || localStorage.getItem('access');
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