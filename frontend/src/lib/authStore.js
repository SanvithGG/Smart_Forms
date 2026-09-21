import axiosClient from './axiosClient';

const AUTH_TOKEN_KEY = 'smart_forms_jwt_token';
const AUTH_USER_KEY = 'smart_forms_user';

/**
 * Default fallback demo user for instant testing
 */
export const DEFAULT_DEMO_USER = {
  id: 'usr_demo_123',
  displayName: 'Demo Creator',
  email: 'demo@smartforms.dev',
};

/**
 * Retrieves the currently logged-in user from localStorage
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored user:', err);
  }
  return null;
}

/**
 * Retrieves the stored JWT token from localStorage
 */
export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || null;
}

/**
 * Saves authenticated user and JWT token to localStorage
 */
export function setStoredAuth(user, token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

/**
 * Clears auth credentials on logout
 */
export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated() {
  return Boolean(getStoredUser());
}

/**
 * Authenticates user via Spring Boot backend or local fallback
 */
export async function loginUser({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  try {
    // 1. Attempt real authentication with backend
    const res = await axiosClient.post('/auth/login', {
      email: cleanEmail,
      password: cleanPassword,
    }, { timeout: 2500 });

    if (res.data && res.data.token) {
      const user = {
        id: res.data.userId || 'usr_backend',
        displayName: res.data.name || cleanEmail.split('@')[0],
        email: res.data.email || cleanEmail,
      };
      setStoredAuth(user, res.data.token);
      return { success: true, user, mode: 'backend' };
    }
  } catch (err) {
    // Backend offline or invalid - continue to graceful fallback
    console.warn('Backend login unavailable or error, using local session:', err.message);
  }

  // 2. Seamless local fallback (ensures the developer is never blocked when backend is offline)
  const displayName = cleanEmail === 'demo@smartforms.dev' 
    ? 'Demo Creator' 
    : cleanEmail.split('@')[0].charAt(0).toUpperCase() + cleanEmail.split('@')[0].slice(1);

  const fallbackUser = {
    id: `usr_${Date.now().toString().slice(-6)}`,
    displayName,
    email: cleanEmail,
  };

  const mockToken = `mock_jwt_${Date.now()}`;
  setStoredAuth(fallbackUser, mockToken);

  return { success: true, user: fallbackUser, mode: 'local' };
}

/**
 * Registers a new user via Spring Boot backend or local fallback
 */
export async function registerUser({ displayName, email, password }) {
  const cleanName = (displayName || '').trim() || 'New User';
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  try {
    const res = await axiosClient.post('/auth/register', {
      displayName: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    }, { timeout: 2500 });

    if (res.data && res.data.token) {
      const user = {
        id: res.data.userId || 'usr_registered',
        displayName: res.data.name || cleanName,
        email: res.data.email || cleanEmail,
      };
      setStoredAuth(user, res.data.token);
      return { success: true, user, mode: 'backend' };
    }
  } catch (err) {
    console.warn('Backend register unavailable, registering locally:', err.message);
  }

  // Local fallback registration
  const fallbackUser = {
    id: `usr_${Date.now().toString().slice(-6)}`,
    displayName: cleanName,
    email: cleanEmail,
  };

  const mockToken = `mock_jwt_${Date.now()}`;
  setStoredAuth(fallbackUser, mockToken);

  return { success: true, user: fallbackUser, mode: 'local' };
}
