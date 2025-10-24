// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  FACEBOOK_AUTH: `${API_URL}/auth/facebook`,
  INSTAGRAM_AUTH: `${API_URL}/auth/instagram`,
  GET_USER: `${API_URL}/auth/user`,
  LOGOUT: `${API_URL}/auth/logout`,
  HEALTH: `${API_URL}/health`,
  INSTAGRAM_MEDIA: `${API_URL}/auth/instagram/media`,
  INSTAGRAM_SEARCH_USER: `${API_URL}/api/instagram/search-user`,
  INSTAGRAM_HASHTAG: `${API_URL}/api/instagram/hashtag`,
};

// Fetch options with credentials
export const fetchWithCredentials = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};
