import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  setUsers,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  getSessionExpiry,
  setSessionExpiry,
  removeSessionExpiry,
} from '../utils/localStorage';
import { testUsers } from '../mockData/users';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const REMEMBER_ME_DAYS = 30;
const SESSION_KEY = 'currentUser';
const EXPIRY_KEY = 'sessionExpiry';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    setLoading(true);
    let users = getUsers();
    if (!users?.length) {
      setUsers(testUsers);
      users = testUsers;
    }

    const sessionExpiry = getSessionExpiry();
    if (sessionExpiry && Date.now() > sessionExpiry) {
      removeCurrentUser();
      removeSessionExpiry();
      setUserState(null);
      setLoading(false);
      return;
    }

    const current = getCurrentUser();
    if (current?.user) {
      const updated = users.find((u) => u.id === current.user.id);
      setUserState(updated || current.user);
    } else {
      setUserState(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData, rememberMe = false) => {
    setUserState(userData);
    const payload = { user: userData, isAuthenticated: true, loginTime: Date.now(), rememberMe };
    setCurrentUser(payload);
    if (rememberMe) {
      const expiry = Date.now() + REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000;
      setSessionExpiry(expiry);
    } else {
      removeSessionExpiry();
    }
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    removeCurrentUser();
    removeSessionExpiry();
  }, []);

  const register = useCallback((userData) => {
    let users = getUsers();
    if (!users?.length) {
      setUsers(testUsers);
      users = testUsers;
    }
    const newUser = { ...userData, id: 'user_' + Date.now(), addresses: [], orders: [], wishlist: [] };
    users.push(newUser);
    setUsers(users);
  }, []);

  const updateProfile = useCallback((updates) => {
    let users = getUsers();
    const idx = users.findIndex((u) => u.id === user?.id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updates };
    setUsers(users);
    setUserState(users[idx]);

    const current = getCurrentUser();
    if (current?.user?.id === user?.id) {
      setCurrentUser({ ...current, user: users[idx] });
    }
  }, [user?.id]);

  const findUserByEmail = useCallback((email) => {
    const users = getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    checkAuth,
    findUserByEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
