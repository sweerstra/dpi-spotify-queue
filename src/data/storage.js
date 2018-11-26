import { isExpired } from '../utils/token';

export const storage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  },

  get(key) {
    const value = localStorage.getItem(key);

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export const colorStorage = {
  setMainColor: color => storage.set('color:main', color),

  getMainColor: () => storage.get('color:main'),

  setTintColor: color => storage.set('color:tint', color),

  getTintColor: () => storage.get('color:tint')
};

export const preferences = {
  getToken: () => {
    const token = storage.get('prefs:token');
    const expires = storage.get('prefs:expires');

    if (!token || isExpired(expires)) {
      return null;
    }

    return token;
  },

  setToken(token, expires) {
    storage.set('prefs:token', `Bearer ${token}`);
    storage.set('prefs:expires', Date.now() + (expires * 1000));
  },

  removeToken() {
    localStorage.removeItem('prefs:token');
    localStorage.removeItem('prefs:expires');
  },

  setGroup: group => localStorage.setItem('prefs:group', group),

  getGroup: () => localStorage.getItem('prefs:group'),

  setClientId: clientId => localStorage.setItem('prefs:client_id', clientId),

  getClientId: () => localStorage.getItem('prefs:client_id'),
};
