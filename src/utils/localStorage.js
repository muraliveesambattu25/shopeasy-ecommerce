/**
 * LocalStorage helper functions
 */

const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  SESSION_EXPIRY: 'sessionExpiry',
  SHOPPING_CART: 'shoppingCart',
  RECENT_SEARCHES: 'recentSearches',
  RESET_TOKEN: 'resetToken',
  FILTER_STATE: 'filterState',
};

export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const getUsers = () => getItem(KEYS.USERS, []);
export const setUsers = (users) => setItem(KEYS.USERS, users);

export const getCurrentUser = () => getItem(KEYS.CURRENT_USER);
export const setCurrentUser = (user) => setItem(KEYS.CURRENT_USER, user);
export const removeCurrentUser = () => removeItem(KEYS.CURRENT_USER);

export const getSessionExpiry = () => getItem(KEYS.SESSION_EXPIRY);
export const setSessionExpiry = (timestamp) => setItem(KEYS.SESSION_EXPIRY, timestamp);
export const removeSessionExpiry = () => removeItem(KEYS.SESSION_EXPIRY);

export const getCart = () => getItem(KEYS.SHOPPING_CART);
export const setCart = (cart) => setItem(KEYS.SHOPPING_CART, cart);

export const getRecentSearches = () => getItem(KEYS.RECENT_SEARCHES, []);
export const addRecentSearch = (query) => {
  const recent = getRecentSearches().filter((q) => q !== query);
  recent.unshift(query);
  setItem(KEYS.RECENT_SEARCHES, recent.slice(0, 10));
};

export const getResetToken = () => getItem(KEYS.RESET_TOKEN);
export const setResetToken = (data) => setItem(KEYS.RESET_TOKEN, data);
export const removeResetToken = () => removeItem(KEYS.RESET_TOKEN);

export const getFilterState = () => getItem(KEYS.FILTER_STATE);
export const setFilterState = (state) => setItem(KEYS.FILTER_STATE, state);

export { KEYS };
